import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PRODUCTS = [
  {
    id: 1,
    name: "Eco-Friendly Shampoo Bar",
    category: "hygiene",
    description: "A zero-waste shampoo bar that's gentle on your hair and the environment.",
    price: "Nu 8.99",
    image: "/products/shampoo.jpg"
  },
  {
    id: 2,
    name: "Reusable Shopping Bag",
    category: "accessories",
    description: "A sturdy, foldable bag perfect for groceries or shopping trips.",
    price: "Nu 12.99",
    image: "/products/rebag.png"
  },
  {
    id: 3,
    name: "Bamboo Toothbrush",
    category: "hygiene",
    description: "An eco-friendly alternative to plastic toothbrushes, made from sustainable bamboo.",
    price: "Nu 4.99",
    image: "/products/bam.jpg"
  },
  {
    id: 4,
    name: "Reusable Water Bottle",
    category: "accessories",
    description: "Stay hydrated with this stainless steel reusable water bottle, perfect for reducing plastic waste.",
    price: "Nu 12.99",
    image: "/products/water.png"
  },
  {
    id: 5,
    name: "Organic Cotton Tote Bag",
    category: "household",
    description: "A stylish, durable tote bag made from organic cotton to reduce single-use plastic bags.",
    price: "Nu 7.99",
    image: "/products/bag.jpg"
  },
  {
    id: 6,
    name: "Reusable Coffee Cup",
    category: "technology",
    description: "Take your coffee on the go with this reusable coffee cup, reducing waste from disposable cups.",
    price: "Nu 10.99",
    image: "/products/coffee.jpg"
  },
  {
    id: 7,
    name: "Solar Powered Lantern",
    category: "accessories",
    description: "A solar-powered lantern, perfect for outdoor adventures without the need for disposable batteries.",
    price: "Nu 18.99",
    image: "/products/solar.jpg"
  },
  {
    id: 8,
    name: "Compostable Trash Bags",
    category: "household",
    description: "These compostable trash bags break down quickly, helping reduce landfill waste.",
    price: "Nu 11.99",
    image: "/products/trash.jpg"
  },
  {
    id: 9,
    name: "Recycled Paper Notebook",
    category: "stationery",
    description: "A notebook made from 100% recycled paper, helping reduce waste.",
    price: "Nu 3.99",
    image: "/products/note.jpg"
  }
];

export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [modalProduct, setModalProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let filtered = PRODUCTS;

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, category]);

  function openModal(product) {
    setModalProduct(product);
    const modal = new window.bootstrap.Modal(
      document.getElementById('productDetailsModal')
    );
    modal.show();
  }

  function addToCart(product) {
    // Get existing cart items from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Update quantity if product exists
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push({
        ...product,
        quantity: 1
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show success message
    setToastMessage('Item added to cart');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function buyNow(product) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('user'); // Assuming you store user data in localStorage
    
    if (!isLoggedIn) {
      setToastMessage('Please login to continue with purchase');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      router.push('/login'); // Redirect to login page
      return;
    }

    // If logged in, show payment methods
    setSelectedProduct(product);
    setShowPaymentModal(true);
  }

  function handlePaymentMethod(method) {
    // Handle payment method selection
    console.log(`Processing payment with ${method} for product:`, selectedProduct);
    // Here you would typically integrate with your payment gateway
    setShowPaymentModal(false);
    setToastMessage(`Processing payment with ${method}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  return (
    <>
      <Head>
        <title>Products - Eco-Friendly Finder</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
        <style jsx>{`
          .product-card {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          .product-image {
            transition: transform 0.5s ease;
          }
          .product-card:hover .product-image {
            transform: scale(1.05);
          }
          .product-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .product-card:hover .product-overlay {
            opacity: 1;
          }
          .view-details-btn {
            background: #198754;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          .view-details-btn:hover {
            background: #146c43;
          }
          .payment-method-card {
            transition: all 0.3s ease;
          }
          .payment-method-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-color: #198754 !important;
          }
        `}</style>
      </Head>

      <Navbar />

      <section className="products py-5 mt-5">
        <div className="container">
          <h2 className="text-center mb-4">Eco-Friendly Products</h2>

          <div className="row mb-4">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search for a product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-2">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="hygiene">Hygiene</option>
                <option value="accessories">Accessories</option>
                <option value="household">Household</option>
                <option value="technology">Technology</option>
                <option value="stationery">Stationery</option>
              </select>
            </div>
          </div>

          <div className="row" id="productList">
            {filteredProducts.length === 0 && (
              <p className="text-center">No products found.</p>
            )}
            {filteredProducts.map((product) => (
              <div className="col-md-4 mb-4" key={product.id}>
                <div className="card h-100 shadow-sm product-card">
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={product.image}
                      className="card-img-top product-image"
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="product-overlay">
                      <button 
                        className="view-details-btn"
                        onClick={() => openModal(product)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted">{product.category}</p>
                    <p className="card-text fw-bold">{product.price}</p>
                    <div className="d-flex gap-2 mt-auto">
                      <button
                        className="btn btn-success flex-grow-1"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-primary flex-grow-1"
                        onClick={() => buyNow(product)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      <div
        className="modal fade"
        id="productDetailsModal"
        tabIndex="-1"
        aria-labelledby="productDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {modalProduct && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title" id="productDetailsModalLabel">
                    {modalProduct.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src={modalProduct.image}
                    alt={modalProduct.name}
                    className="img-fluid mb-3"
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                  />
                  <p className="text-muted mb-2">{modalProduct.category}</p>
                  <p className="mb-3">{modalProduct.description}</p>
                  <p className="fw-bold mb-4">{modalProduct.price}</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        addToCart(modalProduct);
                        const modal = window.bootstrap.Modal.getInstance(document.getElementById('productDetailsModal'));
                        modal.hide();
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        buyNow(modalProduct);
                        const modal = window.bootstrap.Modal.getInstance(document.getElementById('productDetailsModal'));
                        modal.hide();
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Methods Modal */}
      <div
        className="modal fade"
        id="paymentMethodsModal"
        tabIndex="-1"
        aria-labelledby="paymentMethodsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="paymentMethodsModalLabel">
                Select Payment Method
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowPaymentModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-6">
                  <div 
                    className="payment-method-card p-3 border rounded text-center cursor-pointer"
                    onClick={() => handlePaymentMethod('Visa')}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src="/payment/visa.png" 
                      alt="Visa" 
                      className="img-fluid mb-2"
                      style={{ height: '40px' }}
                    />
                    <p className="mb-0">Visa Card</p>
                  </div>
                </div>
                <div className="col-6">
                  <div 
                    className="payment-method-card p-3 border rounded text-center cursor-pointer"
                    onClick={() => handlePaymentMethod('MBOB')}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src="/payment/mbob.png" 
                      alt="MBOB" 
                      className="img-fluid mb-2"
                      style={{ height: '40px' }}
                    />
                    <p className="mb-0">MBOB</p>
                  </div>
                </div>
                <div className="col-6">
                  <div 
                    className="payment-method-card p-3 border rounded text-center cursor-pointer"
                    onClick={() => handlePaymentMethod('MPAY')}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src="/payment/mpay.png" 
                      alt="MPAY" 
                      className="img-fluid mb-2"
                      style={{ height: '40px' }}
                    />
                    <p className="mb-0">MPAY</p>
                  </div>
                </div>
                <div className="col-6">
                  <div 
                    className="payment-method-card p-3 border rounded text-center cursor-pointer"
                    onClick={() => handlePaymentMethod('BNB')}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src="/payment/bnb.png" 
                      alt="BNB" 
                      className="img-fluid mb-2"
                      style={{ height: '40px' }}
                    />
                    <p className="mb-0">BNB</p>
                  </div>
                </div>
                <div className="col-6">
                  <div 
                    className="payment-method-card p-3 border rounded text-center cursor-pointer"
                    onClick={() => handlePaymentMethod('DK')}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src="/payment/dk.png" 
                      alt="DK" 
                      className="img-fluid mb-2"
                      style={{ height: '40px' }}
                    />
                    <p className="mb-0">DK</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div
        className={`toast-container position-fixed bottom-0 end-0 p-3 ${
          showToast ? 'd-block' : 'd-none'
        }`}
      >
        <div
          className="toast align-items-center text-bg-success show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
