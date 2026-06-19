import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  // 1. Tell React to remember what the user types
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // If they were redirected here from a protected page, send them back there after login
  const from = location.state?.from || "/";

  // 2. The function that runs when they click "Sign In"
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from refreshing
    
    // Pass the actual email and password to our context!
    const success = await login(email, password);
    
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="page-content auth-wrap">
      <div className="auth-toggle">
        <div className="auth-toggle-btn active">Sign In</div>
        <Link to="/register" className="auth-toggle-btn inactive">Create Account</Link>
      </div>

      <h1 className="auth-h1">WELCOME BACK</h1>
      <div className="auth-sub">Sign in to access your closet and saved finds.</div>

      {/* 3. Wire the form to our handleLogin function */}
      <form onSubmit={handleLogin}>
        <div className="form-sec" style={{ marginBottom: '24px' }}>
          
          <div className="form-row full" style={{ marginBottom: '20px' }}>
            <div className="form-field">
              <label className="form-label">Email Address</label>
              {/* 4. Bind the input to the email state */}
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

          <div className="form-row full">
            <div className="form-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--brown-muted)', textDecoration: 'underline' }}>Forgot?</Link>
              </div>
              <div className="input-wrap">
                {/* 5. Bind the input to the password state */}
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-input" 
                  required 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '14px', padding: '16px' }}>
          SIGN IN →
        </button>
      </form>

      <div className="auth-divider" style={{ marginTop: '32px' }}><span>Or continue with</span></div>

      <div className="social-row" style={{ marginTop: '24px' }}>
        <button type="button" className="btn-social">🍎 Apple</button>
        <button type="button" className="btn-social">🔵 Google</button>
      </div>
    </div>
  );
}