import { Link, useLocation } from "react-router"; // 1. Added useLocation

export default function Footer() {
  const location = useLocation(); // 2. Grab the current URL

  // 3. The Magic Trick: If the URL starts with /admin, render absolutely nothing!
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // Otherwise, render the footer normally
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo-f">VALUE VILLAGE</div>
          <div className="footer-tagline">
            Kerala's favourite thrift and resale destination. Pre-loved fashion at prices you'll love.
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Shop</div>
          <div className="footer-links">
            <Link to="/shop" className="footer-link" style={{ textDecoration: 'none' }}>Women's</Link>
            <Link to="/shop" className="footer-link" style={{ textDecoration: 'none' }}>Men's</Link>
            <Link to="/shop" className="footer-link" style={{ textDecoration: 'none' }}>Vintage</Link>
            <Link to="/shop" className="footer-link" style={{ textDecoration: 'none' }}>Shoes</Link>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Orders</div>
          <div className="footer-links">
            <Link to="/tracking" className="footer-link" style={{ textDecoration: 'none' }}>Track Order</Link>
            <Link to="/returns" className="footer-link" style={{ textDecoration: 'none' }}>Returns</Link>
            <span className="footer-link">Size Guide</span>
            <span className="footer-link">Help Centre</span>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Company</div>
          <div className="footer-links">
            <Link to="/about" className="footer-link" style={{ textDecoration: 'none' }}>About Us</Link>
            <span className="footer-link">Sell With Us</span>
            <span className="footer-link">Careers</span>
            <span className="footer-link">Press</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <div className="footer-copy">© 2026 Value Village Thrift & Resale. All rights reserved.</div>
        
        {/* Right Side: Socials and Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          
          {/* Social Media Icons */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="footer-link" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                <path d="m16.9 15.4-3.1-1.3-1.4 1.7a10.6 10.6 0 0 1-5.6-5.6l1.7-1.4-1.3-3.1A1 1 0 0 0 6 5.4c-1.3.4-2.2 1.9-2 3.4a13.3 13.3 0 0 0 11.2 11.2c1.5.2 3-.7 3.4-2a1 1 0 0 0-1.7-2.6z"></path>
              </svg>
            </a>
          </div>
       </div>
      </div>
    </footer>
  );
}