import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };


  return (
    <div className="page-content auth-wrap">
      {/* Top Toggle */}
      <div className="auth-toggle">
        <div className="auth-toggle-btn active">Sign In</div>
        <Link to="/register" className="auth-toggle-btn inactive">Create Account</Link>
      </div>

      <h1 className="auth-h1">WELCOME BACK</h1>
      <div className="auth-sub">Sign in to your Value Village account</div>

      {/* Social Logins */}
      <div className="social-row">
        <button className="btn-social">🍎 Apple</button>
        <button className="btn-social">🔵 Google</button>
        <button className="btn-social">📘 Facebook</button>
      </div>

      <div className="auth-divider"><span>Or continue with email</span></div>

      <form onSubmit={handleLogin}>
        <div className="form-sec" style={{ marginBottom: '16px' }}>
          <div className="form-row full">
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <input type="email" className="form-input" required placeholder="jane@example.com" />
              </div>
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
                  placeholder="••••••••••••" 
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '8px' }}>
          <Link to="/forgot-password" className="auth-link">Forgot your password?</Link>
        </div>

        <div className="auth-check-row" onClick={() => setKeepSignedIn(!keepSignedIn)}>
          <div className={`auth-check-box ${keepSignedIn ? 'checked' : ''}`}>
            {keepSignedIn && '✓'}
          </div>
          <div className="auth-check-label">Keep me signed in</div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '14px', padding: '16px' }}>
          SIGN IN →
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: 'var(--brown-muted)' }}>
        New to Value Village? <Link to="/register" className="auth-link">Create a free account</Link>
      </div>
    </div>
  );
}