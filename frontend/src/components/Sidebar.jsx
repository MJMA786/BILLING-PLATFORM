import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      path: "/dashboard",
      icon: "bi-speedometer2",
      label: "Dashboard",
    },
    {
      path: "/customers",
      icon: "bi-people",
      label: "Customers",
    },
    {
      path: "/plans",
      icon: "bi-box-seam",
      label: "Plans",
    },
    {
      path: "/subscriptions",
      icon: "bi-arrow-repeat",
      label: "Subscriptions",
    },
    {
      path: "/invoices",
      icon: "bi-receipt",
      label: "Invoices",
    },
    {
      path: "/payments",
      icon: "bi-credit-card",
      label: "Payments",
    },
  ];

  return (
    <div
      className="bg-dark text-white d-flex flex-column shadow"
      style={{ width: "260px", minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="text-center py-4 border-bottom">
        <h4 className="fw-bold mb-1">
          <i className="bi bi-layers-fill me-2"></i>
          BillingPro
        </h4>
        <small className="text-secondary">
          Subscription Platform
        </small>
      </div>

      {/* Navigation */}
      <div className="flex-grow-1 mt-3 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center px-3 py-2 mb-2 rounded ${
                isActive
                  ? "bg-primary text-white"
                  : "text-light"
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

export default Sidebar;