import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import "../styles/admin.css";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navCategories = [
    {
      title: "Overview",
      items: [
        {
          path: "/dashboard",
          icon: "bi-grid-1x2-fill",
          label: "Dashboard",
        },
        {
          path: "/customers",
          icon: "bi-people-fill",
          label: "Customers",
        },
      ],
    },
    {
      title: "Billing & Operations",
      items: [
        {
          path: "/plans",
          icon: "bi-box-seam-fill",
          label: "Plans",
        },
        {
          path: "/subscriptions",
          icon: "bi-arrow-repeat",
          label: "Subscriptions",
        },
        {
          path: "/invoices",
          icon: "bi-receipt-cutoff",
          label: "Invoices",
        },
        {
          path: "/payments",
          icon: "bi-credit-card-2-front-fill",
          label: "Payments",
        },
      ],
    },
    {
      title: "Analytics & Settings",
      items: [
        {
          path: "/reports",
          icon: "bi-bar-chart-fill",
          label: "Reports",
        },
        {
          path: "/settings",
          icon: "bi-gear-fill",
          label: "Settings",
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const userInitial = (user?.name || "A").charAt(0).toUpperCase();

  return (
    <aside className="sidebar d-flex flex-column h-100">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-circle shadow-sm">
          <i className="bi bi-layers-fill text-white"></i>
        </div>
        <div>
          <h4 className="fw-bold mb-0 text-white font-display">Subly</h4>
          <span className="small text-slate-300">Subscription Platform</span>
        </div>
      </div>

      {/* Categorized Navigation */}
      <nav className="sidebar-menu flex-grow-1 overflow-y-auto">
        {navCategories.map((cat, idx) => (
          <div key={idx} className="sidebar-category mb-3">
            <div className="sidebar-category-title text-uppercase font-display fw-bold">
              {cat.title}
            </div>
            <div className="d-flex flex-column gap-1">
              {cat.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "sidebar-link active" : "sidebar-link"
                  }
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Ultra-Glossy Glassmorphic Admin User Profile Footer */}
      <div className="admin-sidebar-footer-glossy p-3 mx-2.5 mb-3.5">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2.5 overflow-hidden me-2">
            <div className="position-relative flex-shrink-0">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user?.name || "Avatar"}
                  className="rounded-circle border border-white border-opacity-30 shadow-sm"
                  style={{ width: 42, height: 42, objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="profile-avatar text-white bg-primary fw-bold d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                  style={{ width: 42, height: 42, fontSize: "1.1rem" }}
                >
                  {userInitial}
                </div>
              )}
              {/* Online Green Indicator Dot */}
              <span
                className="position-absolute rounded-circle border border-2 border-slate-900 bg-success"
                style={{
                  width: 10,
                  height: 10,
                  bottom: 1,
                  right: 1,
                  boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)",
                }}
                title="Online Admin"
              ></span>
            </div>

            <div className="overflow-hidden">
              <h6 className="mb-0 text-white small font-display fw-bold text-truncate" style={{ fontSize: "0.93rem" }}>
                {user?.name || "Administrator"}
              </h6>
              <span className="micro-text text-slate-300 text-capitalize d-block text-truncate fw-medium" style={{ fontSize: "0.78rem" }}>
                {user?.role || "System Admin"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="admin-footer-logout-btn flex-shrink-0"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;