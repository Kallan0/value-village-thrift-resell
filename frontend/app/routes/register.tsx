import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";


export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { requestOtp, verifyOtp } = useAuth();
  const from = location.state?.from || "/";

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000; // Fires for 2 seconds
    const colors = ['var(--color-secondary)', "#8b5cf6", "#fbbf24"]; // Pink, Purple, Yellow

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    const result = await requestOtp(firstName, lastName, email, password);
    setIsSubmitting(false);

    if (result.success) {
      setOtpStage(true);
      setSuccessMessage(result.message);
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    const result = await verifyOtp(email, otp);
    setIsSubmitting(false);

    if (result.success) {
      triggerConfetti();

      setTimeout(() => {
           // window.location.href = "/login"; or navigate("/login");
        }, 2500);

      navigate(from, { replace: true });
    } else {
      setError(result.message);
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

      <form onSubmit={otpStage ? handleVerifyOtp : handleRegister}>
        <div className="form-sec" style={{ marginBottom: '8px' }}>
          {!otpStage && (
            <>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">First Name</label>
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

              <div className="form-row full" style={{ marginTop: '20px' }}>
                <div className="form-field">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {otpStage && (
            <div className="form-row full" style={{ marginTop: '10px' }}>
              <div className="form-field">
                <label className="form-label">Enter OTP</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
            </div>
          )}
        </div>

        {!otpStage && (
          <>
            <div className="pw-strength-bar"><div className="pw-fill" style={{ width: password.length >= 8 ? '100%' : '30%' }}></div></div>
            <div className="pw-text">Strength: {password.length >= 8 ? 'Good' : 'Weak'}</div>
          </>
        )}

        {error && <div style={{ color: '#b91c1c', marginTop: '12px', fontSize: '13px' }}>{error}</div>}
        {successMessage && <div style={{ color: '#166534', marginTop: '12px', fontSize: '13px' }}>{successMessage}</div>}

        {!otpStage && (
          <div className="auth-check-row" onClick={() => setAgreed(!agreed)}>
            <div className={`auth-check-box ${agreed ? 'checked' : ''}`}>
              {agreed && '✓'}
            </div>
            <div className="auth-check-label" style={{ fontSize: '12px' }}>
              I agree to the <Link to="/terms" className="auth-link" style={{ fontWeight: 400 }}>Terms of Service</Link> and <Link to="/privacy" className="auth-link" style={{ fontWeight: 400 }}>Privacy Policy</Link>. I'm happy to receive deals, new arrivals, and promo emails from Value Village.
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '14px', padding: '16px' }} disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : otpStage ? 'VERIFY OTP →' : 'CREATE ACCOUNT →'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: 'var(--brown-muted)' }}>
        Already a member? <Link to="/login" className="auth-link">Sign in here</Link>
      </div>
    </div>
  );
}