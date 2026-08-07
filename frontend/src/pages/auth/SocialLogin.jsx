import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, RefreshCw } from "lucide-react";

function SocialLogin({ rememberMe = false }) {
  const navigate = useNavigate();
  const { login: saveLogin } = useAuth();
  const googleButtonRef = useRef(null);

  const [error, setError] = useState("");
  const [originNotice, setOriginNotice] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const currentOrigin = window.location.origin;

  const handleGoogleLogin = async (googleResponse) => {
    try {
      setError("");
      const response = await googleLogin(googleResponse.credential);

      const { access_token, refresh_token, user } = response;

      if (!user.is_active) {
        throw new Error("Your account has been disabled.");
      }

      await saveLogin(access_token, refresh_token, user, rememberMe);

      if (user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/customer/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Google Sign-In failed.";
      setError(message);
    }
  };

  useEffect(() => {
    if (!clientId) {
      setError("Google Client ID is missing. Please configure VITE_GOOGLE_CLIENT_ID.");
      return;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      try {
        // Prevent duplicate initialize() calls across React Strict Mode re-renders
        if (!window.__subly_gsi_initialized__) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleLogin,
            auto_select: false,
            cancel_on_tap_outside: true,
            error_callback: (err) => {
              if (err?.type === "origin_mismatch" || err?.status === 403 || err?.error === "idpiframe_initialization_failed") {
                setOriginNotice(true);
              }
            },
          });
          window.__subly_gsi_initialized__ = true;
        }

        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 320,
          });
        }
      } catch (err) {
        console.warn("Google GIS initialization error:", err);
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      const existingScript = document.getElementById("google-gis");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-gis";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogle;
        script.onerror = () => {
          setError("Failed to load Google Identity Services.");
        };
        document.body.appendChild(script);
      } else {
        existingScript.onload = initializeGoogle;
      }
    }
  }, [clientId]);

  return (
    <>
      <div className="social-divider my-4">
        <span>OR</span>
      </div>

      {error && (
        <div className="alert alert-danger small py-2.5 px-3 rounded-3 mb-3 d-flex align-items-center">
          <AlertCircle size={16} className="me-2 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {originNotice && (
        <div className="alert alert-warning small py-3 px-3 rounded-4 mb-3 border border-warning border-opacity-50 bg-warning-subtle text-dark">
          <div className="d-flex align-items-start gap-2">
            <AlertCircle size={18} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <strong className="d-block mb-1">Google OAuth Origin Setup:</strong>
              <p className="mb-1.5 micro-text text-secondary">
                Google Cloud Console origin updates take <strong>5 to 15 minutes</strong> to sync across Google servers.
              </p>
              <ul className="mb-2 ps-3 micro-text text-secondary">
                <li>Verify <code>{currentOrigin}</code> is added in <em>Authorized JavaScript Origins</em> in Google Cloud Console.</li>
                <li>Try an <strong>Incognito Window</strong> (<code>Ctrl + Shift + N</code>) to clear stale Google CDN cookies.</li>
              </ul>
              <button
                className="btn btn-sm btn-outline-dark rounded-pill px-3 py-1 micro-text fw-bold d-inline-flex align-items-center gap-1"
                onClick={() => {
                  window.__subly_gsi_initialized__ = false;
                  setOriginNotice(false);
                  window.location.reload();
                }}
              >
                <RefreshCw size={12} /> Reload & Retry Google Sign-In
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={googleButtonRef} className="d-flex justify-content-center" />
    </>
  );
}

export default SocialLogin;