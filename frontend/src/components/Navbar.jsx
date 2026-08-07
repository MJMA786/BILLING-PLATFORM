import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase().trim();
    if (query.includes("customer")) navigate("/customers");
    else if (query.includes("plan")) navigate("/plans");
    else if (query.includes("sub")) navigate("/subscriptions");
    else if (query.includes("inv")) navigate("/invoices");
    else if (query.includes("pay")) navigate("/payments");
    else if (query.includes("report")) navigate("/reports");
    else if (query.includes("setting")) navigate("/settings");
    else navigate("/dashboard");
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <h4 className="page-title">Subly</h4>

        <form onSubmit={handleSearchSubmit} className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers, invoices, plans..."
          />
        </form>
      </div>

      <div className="navbar-right">
        <div className="position-relative">
          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <i className="bi bi-bell"></i>
          </button>

          {showNotifications && (
            <div className="dropdown-menu dropdown-menu-end show border-0 shadow-lg rounded-4 p-0 mt-2 position-absolute end-0" style={{ width: 300, zIndex: 1050 }}>
              <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light rounded-top-4">
                <h6 className="fw-bold mb-0 text-dark small">Notifications</h6>
                <span className="badge bg-primary rounded-pill">Active</span>
              </div>
              <div className="p-3">
                <small className="text-muted d-block mb-1">✓ Starter Plan purchase confirmed</small>
                <small className="text-muted d-block mb-1">✓ Invoice INV-000004 issued</small>
                <small className="text-muted d-block">✓ System online and operational</small>
              </div>
              <div className="p-2 text-center bg-light rounded-bottom-4 border-top">
                <small className="text-primary fw-semibold cursor-pointer" onClick={() => setShowNotifications(false)}>Close</small>
              </div>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="profile-btn" data-bs-toggle="dropdown" aria-expanded="false">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="profile-info">
              <strong>{user?.name || "Administrator"}</strong>
              <small>{user?.role || "Admin"}</small>
            </div>
            <i className="bi bi-chevron-down profile-arrow"></i>
          </button>

          <ul className="dropdown-menu dropdown-menu-end admin-dropdown">
            <li className="dropdown-user">
              <div className="dropdown-avatar">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="dropdown-user-info">
                <h6>{user?.name || "Administrator"}</h6>
                <p>{user?.email}</p>
                <span>{user?.role || "Administrator"}</span>
              </div>
            </li>

            <li><hr className="dropdown-divider" /></li>


            <li>
              <Link to="/settings" className="dropdown-item admin-item">
                <i className="bi bi-gear"></i>
                <span>Settings</span>
              </Link>
            </li>

            <li>
              <Link to="/reports" className="dropdown-item admin-item">
                <i className="bi bi-bar-chart"></i>
                <span>Reports</span>
              </Link>
            </li>

            <li><hr className="dropdown-divider" /></li>

            <li>
              <button className="dropdown-item admin-logout" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;