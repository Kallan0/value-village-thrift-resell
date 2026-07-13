import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router"; // Fixed react-router-dom import if needed
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../UI/SearchBar";
import { ShoppingBag, User } from "lucide-react";
import UserProfileSidebar from "../UI/UserProfileSidebar";

export default function Navbar() {
  // 1. Pull the REAL user data and functions from your global context
  const { user, logout, updateProfile } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. The Traffic Cop Logic
  const handleProfileClick = () => {
    if (user) {
      setIsSidebarOpen(true);
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  const handleSaveProfile = async (updatedData: any) => {
    // Updates the frontend context instantly so the UI feels fast
    if (updateProfile) updateProfile(updatedData);
    console.log("Sending to backend to save:", updatedData);
    // TODO: Await fetch('/api/user/update', ...)
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsSidebarOpen(false); // Close the drawer
    logout(); // Clear the auth state
    navigate("/"); // Send them back to the home page
  };

  if (location.pathname.startsWith("/admin")) {
    return null; // Don't render the navbar on admin pages
  }

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
      
      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/shop" className="nav-link" onClick={closeMenu}>Shop</Link>
        <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
      </div>
      
      <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <SearchBar/>
        <Link to="/wishlist" className="nav-icon" title="Wishlist" onClick={closeMenu} style={{ textDecoration: 'none' }}>🤍</Link>        
        <Link to="/cart" className="nav-icon" title="Cart" onClick={closeMenu} style={{ position: 'relative', textDecoration: 'none' }}>
          <ShoppingBag/><span className="cart-badge">2</span>
        </Link>
        
        {/* 3. Wire the User Icon to the Traffic Cop function! */}
        <div className="nav-icon" title="Account" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          {user ? <User fill="currentColor"/> : <User/>} 
        </div>
      </div>
      
      {/* 4. Only render the Sidebar if the user actually exists */}
      {user && (
        <UserProfileSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          user={user}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogout}
        />
      )}
    </nav>
  );
}