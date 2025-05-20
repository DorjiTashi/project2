import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'tashi',
    password: 'meto143#'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      localStorage.setItem('adminSession', 'true');
      loadData();
    } else {
      setError('Invalid username or password');
    }
  };

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      // Load products from DB
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      // Load local products (drafts)
      const localProducts = JSON.parse(localStorage.getItem('localProducts') || '[]');
      setProducts([...localProducts, ...productsData]);
      // Load users
      const usersResponse = await fetch('/api/users');
      const usersData = await usersResponse.json();
      setUsers(usersData.users || usersData); // handle both {users:[]} and []
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Error loading data', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.onerror = () => {
        showToast('Error reading image file', 'error');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category || !newProduct.image) {
        throw new Error('All fields are required');
      }

      // Validate price is a positive number
      const priceValue = parseFloat(newProduct.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Price must be a positive number');
      }

      // Save to localStorage for instant feedback
      const localProducts = JSON.parse(localStorage.getItem('localProducts') || '[]');
      const localProduct = { ...newProduct, price: priceValue, id: `local-${Date.now()}` };
      localProducts.unshift(localProduct);
      localStorage.setItem('localProducts', JSON.stringify(localProducts));
      setProducts([localProduct, ...products]);

      // Push to DB
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: priceValue,
          category: newProduct.category,
          image: newProduct.image
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product to database');
      }

      // Remove from localProducts after successful DB push
      const addedProduct = await response.json();
      const updatedLocalProducts = localProducts.filter(p => p.id !== localProduct.id);
      localStorage.setItem('localProducts', JSON.stringify(updatedLocalProducts));

      // Replace local draft with DB product in UI
      setProducts([addedProduct, ...products.filter(p => p.id !== localProduct.id)]);
      setShowAddProductModal(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null
      });
      showToast('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      showToast(error.message || 'Failed to add product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        setProducts(products.filter(product => product.id !== productId));
        showToast('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        setUsers(users.filter(user => user.id !== userId));
        showToast('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        showToast('Failed to delete user', 'error');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
    setShowLoginModal(true);
    router.push('/');
  };

  // User stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.active || u.isActive).length;

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - Eco-Friendly Finder</title>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
            rel="stylesheet"
          />
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
            defer
          ></script>
          <style jsx>{`
            .login-container {
              max-width: 400px;
              margin: 50px auto;
              padding: 2rem;
              background-color: white;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }

            .login-title {
              text-align: center;
              color: #28a745;
              margin-bottom: 2rem;
            }

            .form-label {
              color: #333;
              font-weight: 500;
            }

            .form-control {
              border-radius: 5px;
              border: 1px solid #ddd;
              padding: 0.75rem;
            }

            .form-control:focus {
              border-color: #28a745;
              box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
            }

            .btn-login {
              background-color: #28a745;
              border: none;
              padding: 0.75rem;
              font-weight: 500;
              transition: all 0.3s ease;
            }

            .btn-login:hover {
              background-color: #218838;
              transform: translateY(-1px);
            }

            .alert {
              border-radius: 5px;
              margin-bottom: 1rem;
            }
          `}</style>
        </Head>

        <Navbar />

        <main className="container">
          <div className="login-container">
            <h2 className="login-title">Admin Login</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-login btn-success">
                  Login
                </button>
              </div>
            </form>
          </div>
        </main>

        <div className="mt-5">
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Eco-Friendly Finder</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
      </Head>

      <Navbar />

      <div className="container py-5 mt-5">
        {/* Toast Notification */}
        {toast.show && (
          <div className={`toast align-items-center text-white bg-${toast.type === 'error' ? 'danger' : 'success'} border-0 position-fixed top-0 end-0 m-3`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">
                {toast.message}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ show: false, message: '', type: '' })}></button>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Admin Dashboard</h2>
          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users ({totalUsers})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </li>
        </ul>

        {/* Products Section */}
        {activeTab === 'products' && (
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Products</h5>
              <button
                className="btn btn-success"
                onClick={() => setShowAddProductModal(true)}
              >
                Add New Product
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Section */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Users</h5>
              <span className="badge bg-success">Active: {activeUsers}</span>
              <span className="badge bg-primary">Total: {totalUsers}</span>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.active || user.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {user.active || user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        {activeTab === 'orders' && (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Orders</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Products</th>
                      <th>Total</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.userName}</td>
                        <td>
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                className="me-2"
                              />
                              {item.name} (Qty: {item.quantity})
                            </div>
                          ))}
                        </td>
                        <td>{order.total}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Product</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddProductModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddProduct}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Price (Nu)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="category" className="form-label">Category</label>
                      <select
                        className="form-select"
                        id="category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="hygiene">Hygiene</option>
                        <option value="accessories">Accessories</option>
                        <option value="household">Household</option>
                        <option value="technology">Technology</option>
                        <option value="stationery">Stationery</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">Product Image</label>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                      {newProduct.image && (
                        <div className="mt-2">
                          <img
                            src={newProduct.image}
                            alt="Preview"
                            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Adding Product...' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}

        <div className="mt-5">
          <Footer />
        </div>
      </div>
    </>
  );
} 