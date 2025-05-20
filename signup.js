import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Show congratulation message
      setShowCongrats(true);
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Signup - Eco-Friendly Product Finder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-30px);
            }
            60% {
              transform: translateY(-15px);
            }
          }

          .congrats-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(40, 167, 69, 0.9);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
            animation: fadeIn 0.5s ease-out, bounce 1s ease-in-out;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }

          .congrats-message h2 {
            margin-bottom: 1rem;
            font-size: 2rem;
          }

          .congrats-message p {
            margin: 0;
            font-size: 1.2rem;
          }

          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
        `}</style>
      </Head>

      <Navbar />

      <main className="container" style={{ maxWidth: '400px', minHeight: '70vh', marginTop: '50px' }}>
        <h2 className="mb-4 text-center">Signup</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Signup</button>
        </form>
      </main>

      {showCongrats && (
        <>
          <div className="modal-backdrop"></div>
          <div className="congrats-message">
            <h2>Welcome to Eco Family :)</h2>
            <p>Redirecting to home page...</p>
          </div>
        </>
      )}

      <Footer />
    </>
  );
} 