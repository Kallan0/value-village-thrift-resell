import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  // 1. Added state variables to track what the user types
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const {register} = useAuth();
  const from = location.state?.from || "/";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return alert("Please agree to the Terms of Service.");
    
    // Call the new register function with all 4 fields!
    const success = await register(firstName, lastName, email, password); 
    
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="page-content auth-wrap">
      <div className="auth-toggle">
        <Link to="/login" className="auth-toggle-btn inactive">Sign In</Link>
        <div className="auth-toggle-btn active">Create Account</div>
      </div>

      <h1 className="auth-h1">JOIN THE VILLAGE</h1>
      <div className="auth-sub">Create your free account in 30 seconds</div>

      <div className="social-row">
        <button type="button" className="btn-social">🍎 Apple</button>
        <button type="button" className="btn-social">🔵 Google</button>
        <button type="button" className="btn-social">📘 Facebook</button>
      </div>

      <div className="auth-divider"><span>Or sign up with email</span></div>

      <form onSubmit={handleRegister}>
        <div className="form-sec" style={{ marginBottom: '8px' }}>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">First Name</label>
              {/* 3. Wired up the inputs to update state */}
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="Jane" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Last Name</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-row full" style={{ marginTop: '20px' }}>
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                required 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pw-strength-bar"><div className="pw-fill" style={{ width: password.length >= 8 ? '100%' : '30%' }}></div></div>
        <div className="pw-text">Strength: {password.length >= 8 ? 'Good' : 'Weak'}</div>

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