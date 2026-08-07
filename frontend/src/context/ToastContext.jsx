import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, variant = "success", title = "") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant, title }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 9999, pointerEvents: "none" }}
      >
        {toasts.map((t) => {
          let bgClass = "bg-success text-white";
          let iconClass = "bi-check-circle-fill";

          if (t.variant === "danger" || t.variant === "error") {
            bgClass = "bg-danger text-white";
            iconClass = "bi-exclamation-triangle-fill";
          } else if (t.variant === "warning") {
            bgClass = "bg-warning text-dark";
            iconClass = "bi-exclamation-circle-fill";
          } else if (t.variant === "info") {
            bgClass = "bg-info text-white";
            iconClass = "bi-info-circle-fill";
          }

          return (
            <div
              key={t.id}
              className={`toast show align-items-center border-0 shadow-lg mb-2 rounded-3 ${bgClass}`}
              role="alert"
              style={{ pointerEvents: "auto", minWidth: "280px" }}
            >
              <div className="d-flex">
                <div className="toast-body d-flex align-items-center gap-2 py-2.5 px-3">
                  <i className={`bi ${iconClass} fs-5`}></i>
                  <div>
                    {t.title && <strong className="d-block small">{t.title}</strong>}
                    <span className="small">{t.message}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => removeToast(t.id)}
                ></button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside ToastProvider
    return {
      showToast: (msg, variant = "info") => alert(`[${variant.toUpperCase()}] ${msg}`),
    };
  }
  return context;
}
