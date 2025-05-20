import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setToastMessage('Item removed from cart');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('Nu ', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const buyNow = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('user');
    
    if (!isLoggedIn) {
      setToastMessage('Please login to continue with purchase');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      router.push('/login');
      return;
    }

    // If logged in, show payment methods
    setShowPaymentModal(true);
  };

  const handlePaymentMethod = (method) => {
    // Handle payment method selection
    console.log(`Processing payment with ${method} for cart items:`, cartItems);
    // Here you would typically integrate with your payment gateway
    setShowPaymentModal(false);
    setToastMessage(`Processing payment with ${method}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <Head>
        <title>Shopping Cart - Eco-Friendly Finder</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
        <style jsx>{`
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

      <div className="container py-5 mt-5">
        <h2 className="mb-4">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <p>Your cart is empty</p>
            <button
              className="btn btn-success"
              onClick={() => router.push('/products')}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="me-3"
                          />
                          {item.name}
                        </div>
                      </td>
                      <td>{item.price}</td>
                      <td>
                        <div className="input-group" style={{ width: '120px' }}>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            min="1"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        Nu {(parseFloat(item.price.replace('Nu ', '')) * item.quantity).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                <h4>Total: Nu {calculateTotal().toFixed(2)}</h4>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success"
                  onClick={() => router.push('/products')}
                >
                  Continue Shopping
                </button>
                <button
                  className="btn btn-primary"
                  onClick={buyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </>
        )}
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