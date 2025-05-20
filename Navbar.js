import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
      <div className="container">
        <Link href="/" className="navbar-brand text-white d-flex align-items-center fw-bold">
          <img src="/kk.png" alt="Logo" style={{ width: 40, marginRight: 10 }} />
          Eco-Friendly Product Finder
        </Link>

        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span><i className="fas fa-bars"></i></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link text-white">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/login" className="nav-link text-white">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/signup" className="nav-link text-white">
                Signup
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin" className="nav-link text-white">
                Admin
              </Link>
              </li>
            <li className="nav-item">
              <Link href="/products" className="nav-link text-white">
                Products
              </Link>
              </li>
            <li className="nav-item">
              <Link href="/cart" className="nav-link text-white">
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
