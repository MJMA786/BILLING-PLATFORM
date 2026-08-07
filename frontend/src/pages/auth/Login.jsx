import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  login,
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

import "../../styles/Login.css";
import SocialLogin from "./SocialLogin";
import AuthFooter from "./AuthFooter";

function Login() {
  const navigate = useNavigate();

  const { login: saveLogin } = useAuth();

  const emailRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log(
        "Login Response:",
        response
      );

      const {
        access_token,
        refresh_token,
        user,
      } = response;

      if (!user.is_active) {
        throw new Error(
          "Your account has been disabled. Please contact the administrator."
        );
      }

      await saveLogin(
        access_token,
        refresh_token,
        user,
        rememberMe
      );

      switch (user.role) {

        case "admin":
          navigate(
            "/dashboard",
            {
              replace: true,
            },
          );
          break;

        case "customer":
          navigate(
            "/customer/dashboard",
            {
              replace: true,
            },
          );
          break;

        default:
          navigate("/");
      }

    } catch (err) {

      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Unable to sign in. Please try again.";

      setError(message);

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

        <h1>Subly</h1>

        <p>
          Subscription Management
          <br />
          & Automated Billing Platform
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
            Automated Invoice Generation
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

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Sign in to access your dashboard,
          subscriptions, invoices and payments.
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control auth-input"
                placeholder="Enter your email"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control auth-input"
                placeholder="Enter your password"
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
                  className={
                    showPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                ></i>
              </button>

            </div>

          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div className="form-check">

              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() =>
                  setRememberMe(!rememberMe)
                }
              />

              <label
                htmlFor="remember"
                className="form-check-label"
              >
                Remember Me
              </label>

            </div>

            <button
              type="button"
              className="btn btn-link forgot-link"
              onClick={() =>
                navigate("/forgot-password")
              }
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
                <span className="spinner-border spinner-border-sm me-2"></span>
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

            <div className="my-4">

            <SocialLogin
              rememberMe={rememberMe}
            />

          </div>

          <div className="security-note">

            <i className="bi bi-shield-check me-2"></i>

            Your credentials are encrypted and securely
            protected.

          </div>

          <AuthFooter />

      </div>

    </div>

  </div>

  );
}

export default Login;