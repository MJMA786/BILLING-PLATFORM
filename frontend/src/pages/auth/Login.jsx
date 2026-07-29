import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  login,
  getCurrentUser,
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

import "../../styles/Login.css";
import SocialLogin from "./SocialLogin";
import AuthFooter from "./AuthFooter";

function Login() {
  const navigate = useNavigate();
  const { login: saveToken } = useAuth();

  const emailRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(
        formData.email,
        formData.password
      );

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      const currentUser = await getCurrentUser();

      saveToken(
        response.access_token,
        currentUser
      );

      if (currentUser.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/customer/dashboard");
      }

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>

        <div className="brand">

          <h1>Billing Platform</h1>

          <p>
            Subscription Management &
            <br />
            Automated Billing Platform
          </p>

          <ul>
            <li>
                  <i className="bi bi-shield-lock me-2"></i>
                   Secure Authentication
                  </li>

                  <li>
                  <i className="bi bi-credit-card me-2"></i>
                    Subscription Management
                  </li>

                  <li>
                  <i className="bi bi-receipt me-2"></i>
                    Invoice Automation
                  </li>

                  <li>
                <i className="bi bi-wallet2 me-2"></i>
              Payment Tracking
            </li>
          </ul>

        </div>

      </div>

      <div className="login-right">

        <div className="login-card">

  <div className="login-badge">
    <i className="bi bi-shield-lock me-2"></i>
      Secure Login
  </div>

  <h2>Welcome Back </h2>

  <p className="login-subtitle">
    Sign in to manage your subscriptions,
    customers, invoices and payments.
  </p>

  {error && (
    <div className="alert alert-danger">
      {error}
    </div>
  )}

  <form onSubmit={handleSubmit}>

    <div className="mb-3">

      <label className="form-label">
        Email Address
      </label>

      <div className="input-group">

        <span className="input-group-text auth-icon">
          <i className="bi bi-envelope"></i>
        </span>

        <input
          ref={emailRef}
          type="email"
          className="form-control auth-input"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

      </div>

    </div>

    <div className="mb-3">

      <label className="form-label">
        Password
      </label>

      <div className="input-group">

        <span className="input-group-text auth-icon">
          <i className="bi bi-lock"></i>
        </span>

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          className="form-control auth-input"
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <button
          type="button"
          className="btn btn-outline-secondary password-btn"
          onClick={() =>
            setShowPassword(!showPassword)
          }
        >
          <i
            className={showPassword? "bi bi-eye-slash": "bi bi-eye"}
          />
        </button>

      </div>

    </div>

    <div className="d-flex justify-content-between align-items-center mb-4">

      <div className="form-check">

        <input
          className="form-check-input"
          type="checkbox"
          checked={rememberMe}
          onChange={() =>
            setRememberMe(!rememberMe)
          }
          id="remember"
        />

        <label
          className="form-check-label"
          htmlFor="remember"
        >
          Remember Me
        </label>

      </div>

      <button
        type="button"
        className="btn btn-link forgot-link"
      >
        Forgot Password?
      </button>

    </div>

    <button
      type="submit"
      className="btn btn-primary w-100 login-btn"
      disabled={loading}
    >

      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
          ></span>

          Signing In...
        </>
      ) : (
        <>
    Sign In
    <i className="bi bi-arrow-right ms-2"></i>
</>
      )}

    </button>

  </form>

  <SocialLogin />

  <div className="security-note">

   <i className="bi bi-shield-check me-2"></i>
Your credentials are encrypted and securely protected.

  </div>

  <AuthFooter />

</div>

      </div>

    </div>
  );
}

export default Login;