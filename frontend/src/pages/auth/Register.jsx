import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../../services/authService";

import "../../styles/Login.css";

import SocialLogin from "./SocialLogin";
import AuthFooter from "./AuthFooter";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [passwordStrength, setPasswordStrength] = useState("");

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {

      const checks = {

        length: value.length >= 8,

        upper: /[A-Z]/.test(value),

        lower: /[a-z]/.test(value),

        number: /\d/.test(value),

        special: /[^A-Za-z0-9]/.test(value),

      };

      setPasswordChecks(checks);

      const score = Object.values(checks)
        .filter(Boolean)
        .length;

      if (score <= 2) {

        setPasswordStrength("Weak");

      }

      else if (score <= 4) {

        setPasswordStrength("Medium");

      }

      else {

        setPasswordStrength("Strong");

      }

    }

  };

  const passwordsMatch =
    formData.confirm_password.length > 0 &&
    formData.password === formData.confirm_password;

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirm_password) {

      setError("Passwords do not match.");

      return;

    }

    try {

      setLoading(true);

      await register({

        name: formData.name,

        email: formData.email,

        password: formData.password,

      });

      setSuccess(
        "Registration successful! Redirecting..."
      );

      setTimeout(() => {

        navigate("/login");

      }, 1500);

    }

    catch (err) {

      if (Array.isArray(err.response?.data?.detail)) {

        setError(
          err.response.data.detail[0].msg
        );

      }

      else {

        setError(
          err.response?.data?.detail ||
          "Registration failed."
        );

      }

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-page">

      {/* ===========================
          LEFT PANEL
      ============================ */}

      <div className="login-left">

        <div className="floating-circle circle-1"></div>

        <div className="floating-circle circle-2"></div>

        <div className="floating-circle circle-3"></div>

        <div className="brand">

          <h1>
            Subly
          </h1>

          <p>

            Create your account and start managing
            subscriptions, invoices, customers
            and payments in one place.

          </p>

          <ul>

            <li>

              <i className="bi bi-person-plus me-2"></i>

              Easy Registration

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

              Secure Payments

            </li>

          </ul>

        </div>

      </div>
            {/* ===========================
          RIGHT PANEL
      ============================ */}

      <div className="login-right">

        <div className="login-card">

          <div className="login-badge">

            <i className="bi bi-person-plus me-2"></i>

            Create Account

          </div>

          <h2>
            Get Started 
          </h2>

          <p className="login-subtitle">

            Create your account to access the
            Billing Platform.

          </p>

          {error && (

            <div className="alert alert-danger">

              <i className="bi bi-exclamation-circle-fill me-2"></i>

              {error}

            </div>

          )}

          {success && (

            <div className="alert alert-success">

              <i className="bi bi-check-circle-fill me-2"></i>

              {success}

            </div>

          )}

          <form onSubmit={handleSubmit}>

            {/* ======================
                FULL NAME
            ======================= */}

            <div className="mb-3">

              <label className="form-label">

                Full Name

              </label>

              <div className="input-group">

                <span className="input-group-text auth-icon">

                  <i className="bi bi-person"></i>

                </span>

                <input

                  className="form-control auth-input"

                  placeholder="Enter your full name"

                  name="name"

                  value={formData.name}

                  onChange={handleChange}

                  required

                />

              </div>

            </div>

            {/* ======================
                EMAIL
            ======================= */}

            <div className="mb-3">

              <label className="form-label">

                Email Address

              </label>

              <div className="input-group">

                <span className="input-group-text auth-icon">

                  <i className="bi bi-envelope"></i>

                </span>

                <input

                  type="email"

                  className="form-control auth-input"

                  placeholder="Enter your email"

                  name="email"

                  value={formData.email}

                  onChange={handleChange}

                  required

                />

              </div>

            </div>

            {/* ======================
                PASSWORD
            ======================= */}

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

                  placeholder="Create a strong password"

                  name="password"

                  value={formData.password}

                  onChange={handleChange}

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

              {formData.password && (

                <div className="password-strength">

                  <div className="strength-header">

                    <span>

                      Password Strength

                    </span>

                    <span

                      className={`strength-text ${passwordStrength.toLowerCase()}`}

                    >

                      {passwordStrength}

                    </span>

                  </div>

                  <div className="strength-bar">

                    <div

                      className={`strength-fill ${passwordStrength.toLowerCase()}`}

                    ></div>

                  </div>

                  <div className="password-checklist">

                    <div className={passwordChecks.length ? "valid" : ""}>

                      <i className={`bi ${passwordChecks.length ? "bi-check-circle-fill" : "bi-circle"}`}></i>

                      At least 8 characters

                    </div>

                    <div className={passwordChecks.upper ? "valid" : ""}>

                      <i className={`bi ${passwordChecks.upper ? "bi-check-circle-fill" : "bi-circle"}`}></i>

                      One uppercase letter

                    </div>

                    <div className={passwordChecks.lower ? "valid" : ""}>

                      <i className={`bi ${passwordChecks.lower ? "bi-check-circle-fill" : "bi-circle"}`}></i>

                      One lowercase letter

                    </div>

                    <div className={passwordChecks.number ? "valid" : ""}>

                      <i className={`bi ${passwordChecks.number ? "bi-check-circle-fill" : "bi-circle"}`}></i>

                      One number

                    </div>

                    <div className={passwordChecks.special ? "valid" : ""}>

                      <i className={`bi ${passwordChecks.special ? "bi-check-circle-fill" : "bi-circle"}`}></i>

                      One special character

                    </div>

                  </div>

                </div>

              )}

            </div>
                        {/* ======================
                CONFIRM PASSWORD
            ======================= */}

            <div className="mb-3">

              <label className="form-label">
                Confirm Password
              </label>

              <div className="input-group">

                <span className="input-group-text auth-icon">
                  <i className="bi bi-shield-lock"></i>
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="form-control auth-input"
                  placeholder="Confirm your password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary password-btn"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  <i
                    className={
                      showConfirmPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                    }
                  ></i>
                </button>

              </div>

              {formData.confirm_password && (

                <div
                  className={
                    passwordsMatch
                      ? "password-match success"
                      : "password-match error"
                  }
                >

                  <i
                    className={`bi ${
                      passwordsMatch
                        ? "bi-check-circle-fill"
                        : "bi-x-circle-fill"
                    } me-2`}
                  ></i>

                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}

                </div>

              )}

            </div>

            {/* ======================
                TERMS
            ======================= */}

            <div className="form-check mb-4">

              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                required
              />

              <label
                className="form-check-label"
                htmlFor="terms"
              >

                I agree to the

                <a
                  href="#"
                  className="ms-1 me-1 text-decoration-none"
                >
                  Terms
                </a>

                &

                <a
                  href="#"
                  className="ms-1 text-decoration-none"
                >
                  Privacy Policy
                </a>

              </label>

            </div>

            {/* ======================
                REGISTER BUTTON
            ======================= */}

            <button
              className="btn btn-primary login-btn w-100"
              disabled={
                loading ||
                !passwordsMatch
              }
            >

              {loading ? (

                <>

                  <span className="spinner-border spinner-border-sm me-2"></span>

                  Creating Account...

                </>

              ) : (

                <>

                  Create Account

                  <i className="bi bi-arrow-right ms-2"></i>

                </>

              )}

            </button>

          </form>

          <SocialLogin />

          <div className="security-note">

            <i className="bi bi-shield-check me-2"></i>

            Your information is securely encrypted and protected.

          </div>

          <AuthFooter loginPage={false} />

        </div>

      </div>

    </div>

  );

}

export default Register;