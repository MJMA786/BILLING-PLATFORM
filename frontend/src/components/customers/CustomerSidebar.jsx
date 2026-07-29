import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function CustomerSidebar() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const menuItems = [
    {
      path: "/customer/dashboard",
      icon: "bi-speedometer2",
      label: "Dashboard",
    },
    {
      path: "/customer/customerplans",
      icon: "bi-grid",
      label: "Available Plans",
    },
    {
      path: "/customer/subscription",
      icon: "bi-box-seam",
      label: "My Subscription",
    },
    {
      path: "/customer/invoices",
      icon: "bi-receipt",
      label: "My Invoices",
    },
    {
      path: "/customer/payments",
      icon: "bi-credit-card",
      label: "My Payments",
    },
    {
      path: "/customer/profile",
      icon: "bi-person",
      label: "My Profile",
    },
    {
      path: "/customer/support",
      icon: "bi-headset",
      label: "Support",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      className="d-flex flex-column shadow"
      style={{ width: "260px", minHeight: "100vh", backgroundColor: "#06b6d4" }}
    >
      {/* High-visibility typography system with custom slide animations */}
      <style>{`
        .cyan-sidebar-link {
          text-decoration: none !important;
          color: #f8f9fc !important;
          font-weight: 500 !important; /* Increased text weight for better readability */
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease, color 0.15s ease;
        }
        .cyan-sidebar-link i {
          color: #f4f7f6 !important; /* Deep dark teal for icons to anchor attention */
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s ease;
          display: inline-block;
        }
        .cyan-sidebar-link:hover {
          color: #042f2e !important; /* Maximum dark teal contrast on hover */
          background-color: #ccfbf1 !important; /* Premium ice-teal highlighting background */
          transform: translateX(6px); /* Noticeable micro-slide transition */
        }
        .cyan-sidebar-link:hover i {
          color: #042f2e !important;
          transform: scale(1.18) translateX(2px);
        }
        .cyan-sidebar-link.active-link {
          background-color: #ffffff !important;
          color: #06b6d4 !important;
          font-weight: 700 !important; /* Punchy bold setting for current page selection */
        }
        .cyan-sidebar-link.active-link i {
          color: #06b6d4 !important;
        }
        .cyan-sidebar-link.active-link:hover {
          color: #06b6d4 !important;
          background-color: #ffffff !important;
          transform: none;
        }
        .cyan-sidebar-link.active-link:hover i {
          color: #06b6d4 !important;
          transform: none;
        }
      `}</style>

      {/* Logo Container */}
      <div className="text-center py-4 border-bottom" style={{ borderColor: "rgba(255,255,255,0.2)" }}>

        <h4 className="fw-bold mb-1" style={{ color: "#ffffff" }}>
          <i className="bi bi-person-workspace me-2"></i>
          My Portal
        </h4>

        <small style={{ color: "#e0f2fe", fontWeight: "500" }}>
          Customer Portal
        </small>

      </div>

      {/* Navigation Container */}
      <div className="flex-grow-1 mt-3 px-2">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `cyan-sidebar-link d-flex align-items-center px-3 py-2 mb-2 rounded ${
                isActive ? "active-link shadow-sm" : ""
              }`
            }
          >
            <i className={`bi ${item.icon} me-3`}></i>

            {item.label}
          </NavLink>
        ))}

      </div>

    </div>
  );
}

export default CustomerSidebar;
