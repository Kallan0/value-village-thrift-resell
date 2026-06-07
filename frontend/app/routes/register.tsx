import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || "/";

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return alert("Please agree to the Terms of Service.");
    
    login(); // Log them in immediately after creating the account
    navigate(from, { replace: true });
  };

  return (
    <div className="page-content auth-wrap">
      {/* Top Toggle */}
      <div className="auth-toggle">
        <Link to="/login" className="auth-toggle-btn inactive">Sign In</Link>
        <div className="auth-toggle-btn active">Create Account</div>
      </div>

      <h1 className="auth-h1">JOIN THE VILLAGE</h1>
      <div className="auth-sub">Create your free account in 30 seconds</div>

      {/* Social Logins */}
      <div className="social-row">
        <button className="btn-social">🍎 Apple</button>
        <button className="btn-social">🔵 Google</button>
        <button className="btn-social">📘 Facebook</button>
      </div>

      <div className="auth-divider"><span>Or sign up with email</span></div>

      <form onSubmit={handleRegister}>
        <div className="form-sec" style={{ marginBottom: '8px' }}>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">First Name</label>
              <input type="text" className="form-input" required placeholder="Jane" />
            </div>
            <div className="form-field">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-input" required placeholder="Doe" />
            </div>
          </div>
          
          <div className="form-row full" style={{ marginTop: '20px' }}>
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" required placeholder="you@example.com" />
            </div>
          </div>

          <div className="form-row full" style={{ marginTop: '20px' }}>
            <div className="form-field">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-input" 
                  required 
                  placeholder="Min. 8 characters" 
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Password Strength Indicator */}
        <div className="pw-strength-bar"><div className="pw-fill"></div></div>
        <div className="pw-text">Strength: Good</div>

        <div className="auth-check-row" onClick={() => setAgreed(!agreed)}>
          <div className={`auth-check-box ${agreed ? 'checked' : ''}`}>
            {agreed && '✓'}
          </div>
          <div className="auth-check-label" style={{ fontSize: '12px' }}>
            I agree to the <Link to="/terms" className="auth-link" style={{ fontWeight: 400 }}>Terms of Service</Link> and <Link to="/privacy" className="auth-link" style={{ fontWeight: 400 }}>Privacy Policy</Link>. I'm happy to receive deals, new arrivals, and promo emails from Value Village.
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '14px', padding: '16px' }}>
          CREATE ACCOUNT →
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: 'var(--brown-muted)' }}>
        Already a member? <Link to="/login" className="auth-link">Sign in here</Link>
      </div>
    </div>
  );
}