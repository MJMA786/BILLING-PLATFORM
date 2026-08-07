import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { forgotPassword, verifyResetCode, resetPassword } from "../../services/authService";
import AuthFooter from "./AuthFooter";
import "../../styles/Login.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-fill email from query param if available
  const emailQuery = searchParams.get("email") || "";
  const codeQuery = searchParams.get("code") || "";

  // Step state: 1 = Enter Email, 2 = Enter Code & Reset Password, 3 = Reset Complete
  const [step, setStep] = useState(codeQuery && emailQuery ? 2 : 1);

  const [email, setEmail] = useState(emailQuery);
  const [code, setCode] = useState(codeQuery);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Resend timer state
  const [resendCooldown, setResendCooldown] = useState(0);

  const emailInputRef = useRef(null);
  const codeInputRef = useRef(null);

  useEffect(() => {
    if (step === 1) {
      emailInputRef.current?.focus();
    } else if (step === 2) {
      codeInputRef.current?.focus();
    }
  }, [step]);

  // Resend cooldown timer effect
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1 Handler: Request OTP Verification Code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(trimmedEmail);
      setSuccessMsg(res.message || "Verification code sent to your email!");
      setResendCooldown(60); // 60 seconds cooldown for resend
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to send reset code.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (resendCooldown > 0 || loading) return;

    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await forgotPassword(email.trim());
      setSuccessMsg("A new verification code has been sent to your email!");
      setResendCooldown(60);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to resend code.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Handler: Verify Code and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanCode = code.trim();
    if (!cleanCode || cleanCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    try {
      // First verify code
      await verifyResetCode(email.trim(), cleanCode);

      // Perform actual reset
      const res = await resetPassword({
        email: email.trim(),
        code: cleanCode,
        new_password: newPassword,
      });

      setSuccessMsg(res.message || "Password reset successful!");
      setStep(3);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to reset password. Please check your verification code.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Brand Panel */}
      <div className="login-left">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>

        <div className="brand">
          <h1>Subly</h1>
          <p>
            Subscription Management
            <br />
            & Automated Billing Platform
          </p>

          <ul>
            <li>
              <i className="bi bi-shield-lock me-2"></i>
              Account Security & Recovery
            </li>
            <li>
              <i className="bi bi-envelope-check me-2"></i>
              Instant Email Verification Code
            </li>
            <li>
              <i className="bi bi-key me-2"></i>
              Secure Password Reset
            </li>
            <li>
              <i className="bi bi-shield-check me-2"></i>
              Encrypted Credentials Protection
            </li>
          </ul>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-badge">
            <i className="bi bi-key me-2"></i>
            Password Recovery
          </div>

          {step === 1 && (
            <>
              <h2>Forgot Password?</h2>
              <p className="login-subtitle">
                Don't worry! Enter your registered account email and we'll send you a 6-digit verification code.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Verify Code & Reset</h2>
              <p className="login-subtitle">
                Enter the 6-digit code sent to <strong>{email}</strong> along with your new password.
              </p>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-2">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "3.5rem" }}></i>
              </div>
              <h2 className="mb-2">Password Reset Complete!</h2>
              <p className="login-subtitle">
                Your password has been successfully updated. You can now log in using your new credentials.
              </p>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}

          {successMsg && step !== 3 && (
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              <div>{successMsg}</div>
            </div>
          )}

          {/* Step 1: Send Code Form */}
          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <div className="mb-4">
                <label className="form-label">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text auth-icon">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    ref={emailInputRef}
                    type="email"
                    className="form-control auth-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Sending Verification Code...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <i className="bi bi-send ms-2"></i>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Code Verification & New Password Form */}
          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="form-label">Verification Code (OTP)</label>
                <div className="input-group">
                  <span className="input-group-text auth-icon">
                    <i className="bi bi-shield-check"></i>
                  </span>
                  <input
                    ref={codeInputRef}
                    type="text"
                    maxLength={6}
                    className="form-control auth-input text-center fw-bold letter-spacing-2"
                    style={{ fontSize: "1.25rem", letterSpacing: "4px" }}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2 px-1">
                  <small className="text-muted">Code expires in 15 minutes</small>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none"
                    style={{ fontSize: "0.85rem" }}
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || loading}
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>
                <div className="input-group">
                  <span className="input-group-text auth-icon">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control auth-input"
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Confirm New Password</label>
                <div className="input-group">
                  <span className="input-group-text auth-icon">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control auth-input"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <i className="bi bi-arrow-right ms-2"></i>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 3: Success Action */}
          {step === 3 && (
            <button
              type="button"
              className="btn btn-primary w-100 login-btn mt-3"
              onClick={() => navigate("/login")}
            >
              Sign In to Your Account
              <i className="bi bi-box-arrow-in-right ms-2"></i>
            </button>
          )}

          {/* Bottom Nav Links */}
          <div className="text-center mt-4">
            {step === 2 && (
              <button
                type="button"
                className="btn btn-link text-secondary text-decoration-none me-3"
                onClick={() => setStep(1)}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Change Email
              </button>
            )}

            {step !== 3 && (
              <button
                type="button"
                className="btn btn-link text-decoration-none forgot-link"
                onClick={() => navigate("/login")}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back to Sign In
              </button>
            )}
          </div>

          <div className="security-note mt-4">
            <i className="bi bi-shield-check me-2"></i>
            Your password reset request is secure and encrypted.
          </div>

          <AuthFooter />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;