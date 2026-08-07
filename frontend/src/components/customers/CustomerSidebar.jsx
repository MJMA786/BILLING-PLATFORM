import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";
import "../../styles/customers.css";

function CustomerSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const categories = [
    {
      title: "Overview",
      items: [
        {
          path: "/customer/dashboard",
          icon: "bi-speedometer2",
          label: "Dashboard",
        },
      ],
    },
    {
      title: "Billing & Subscriptions",
      items: [
        {
          path: "/customer/plans",
          icon: "bi-grid-fill",
          label: "Available Plans",
        },
        {
          path: "/customer/subscription",
          icon: "bi-box-seam-fill",
          label: "My Subscription",
        },
        {
          path: "/customer/invoices",
          icon: "bi-receipt-cutoff",
          label: "My Invoices",
        },
        {
          path: "/customer/payments",
          icon: "bi-credit-card-2-front-fill",
          label: "My Payments",
        },
      ],
    },
    {
      title: "Account & Support",
      items: [
        {
          path: "/customer/profile",
          icon: "bi-person-badge-fill",
          label: "My Profile",
        },
        {
          path: "/customer/support",
          icon: "bi-headset",
          label: "Support",
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const userInitial = (user?.name || "C").charAt(0).toUpperCase();

  return (
    <aside className="customer-sidebar">
      {/* Logo */}
      <div className="customer-sidebar-logo">
        <div className="customer-logo-circle shadow-sm">
          <i className="bi bi-person-workspace text-white"></i>
        </div>
        <div>
          <h4 className="fw-bold mb-0 text-white font-display">Subly</h4>
          <span className="small fw-semibold text-slate-200">Customer Portal</span>
        </div>
      </div>

      {/* Categorized Menu */}
      <div className="customer-sidebar-menu flex-grow-1 overflow-y-auto">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="mb-3">
            <div className="sidebar-category-title text-slate-300 text-uppercase micro-text fw-bold tracking-wider px-2 mb-1">
              {cat.title}
            </div>

            <div className="d-flex flex-column gap-1">
              {cat.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `customer-sidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ultra-Glossy Glassmorphic User Info Footer */}
      <div className="customer-sidebar-footer-glossy p-3 mx-2.5 mb-3.5">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2.5 overflow-hidden me-2">
            <div className="position-relative flex-shrink-0">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user?.name || "Avatar"}
                  className="rounded-circle border border-white border-opacity-40 shadow-sm"
                  style={{ width: 42, height: 42, objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="customer-avatar text-white bg-teal-500 fw-bold d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                  style={{ width: 42, height: 42, fontSize: "1.1rem" }}
                >
                  {userInitial}
                </div>
              )}
              {/* Online Green Indicator Dot */}
              <span
                className="position-absolute rounded-circle border border-2 border-teal-700 bg-success"
                style={{
                  width: 10,
                  height: 10,
                  bottom: 1,
                  right: 1,
                  boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)",
                }}
                title="Online Account"
              ></span>
            </div>

            <div className="customer-profile-info text-truncate">
              <h6 className="mb-0 text-white small font-display fw-bold text-truncate" style={{ fontSize: "0.93rem" }}>
                {user?.name || "Customer Account"}
              </h6>
              <span className="micro-text text-white opacity-90 text-truncate d-block fw-medium" style={{ fontSize: "0.78rem" }}>
                {user?.email || "customer@subly.com"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="customer-footer-logout-btn flex-shrink-0"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default CustomerSidebar;