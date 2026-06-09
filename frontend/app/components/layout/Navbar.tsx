import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to control the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
    } else {
      logout();
    }
  };

  // Helper function to close the menu when a user clicks a link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav>
      {/* Mobile Hamburger Icon */}
      <button 
        className="hamburger" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation"
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      <Link to="/" className="nav-logo" onClick={closeMenu} style={{ textDecoration: 'none' }}>
        VALUE VILLAGE
        <span className="nav-logo-tag">Thrift & Resale</span>
      </Link>
      
      {/* Dynamic class added based on state */}
      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/shop" className="nav-link" onClick={closeMenu}>Shop</Link>
        <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
      </div>
      
      <div className="nav-icons">
        <Link to="/shop" className="nav-icon" title="Search" onClick={closeMenu} style={{ textDecoration: 'none' }}>🔍</Link>
<Link to="/wishlist" className="nav-icon" title="Wishlist" onClick={closeMenu} style={{ textDecoration: 'none' }}>🤍</Link>        <Link to="/cart" className="nav-icon" title="Cart" onClick={closeMenu} style={{ position: 'relative', textDecoration: 'none' }}>
          🛍️<span className="cart-badge">2</span>
        </Link>
        <div className="nav-icon" title="Account" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          {isAuthenticated ? '🟢' : '👤'} 
        </div>
      </div>
    </nav>
  );
}