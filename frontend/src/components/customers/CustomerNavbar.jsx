import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Headset, LogOut, ShieldCheck } from "lucide-react";

function CustomerNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const userInitial = (user?.name || "C").charAt(0).toUpperCase();

  return (
    <header className="customer-navbar bg-white border-bottom px-4">
      <div className="customer-navbar-left">
        <div>
          <h4 className="customer-page-title text-dark font-display fw-bold mb-0">
            Customer Portal
          </h4>
          <p className="text-secondary small fw-medium mb-0">
            Welcome back, <strong className="text-dark">{user?.name || "Customer"}</strong>
          </p>
        </div>
      </div>

      <div className="customer-navbar-right d-flex align-items-center gap-3">
        <button className="btn btn-light rounded-circle border border-slate-200 p-2 text-secondary" title="Notifications">
          <Bell size={18} />
        </button>

        <div className="dropdown">
          <button
            className="customer-profile-btn dropdown-toggle border border-slate-200 bg-white rounded-pill px-3 py-1.5 d-flex align-items-center gap-2"
            data-bs-toggle="dropdown"
            type="button"
          >
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={user?.name || "User"}
                className="rounded-circle border border-slate-200"
                style={{ width: 34, height: 34, objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="customer-nav-avatar bg-primary text-white fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
                {userInitial}
              </div>
            )}

            <div className="customer-nav-info text-start d-none d-sm-block">
              <strong className="text-dark small fw-bold text-truncate d-block" style={{ maxWidth: 140 }}>
                {user?.name || "Customer"}
              </strong>
              <small className="text-secondary micro-text fw-medium d-block">
                Customer Account
              </small>
            </div>
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow-sm border border-slate-200 rounded-4 p-2 customer-dropdown">
            <li className="px-3 py-2 border-bottom">
              <h6 className="dropdown-header text-dark fw-bold p-0 mb-0">{user?.name || "Customer Account"}</h6>
              <span className="micro-text text-muted d-block text-truncate">{user?.email}</span>
            </li>

            <li className="mt-1">
              <button
                className="dropdown-item rounded-3 py-2 text-dark small fw-medium d-flex align-items-center gap-2"
                onClick={() => navigate("/customer/profile")}
              >
                <User size={15} className="text-primary" />
                <span>My Profile</span>
              </button>
            </li>

            <li>
              <button
                className="dropdown-item rounded-3 py-2 text-dark small fw-medium d-flex align-items-center gap-2"
                onClick={() => navigate("/customer/support")}
              >
                <Headset size={15} className="text-success" />
                <span>Help & Support</span>
              </button>
            </li>

            <li>
              <hr className="dropdown-divider my-1" />
            </li>

            <li>
              <button
                className="dropdown-item rounded-3 py-2 text-danger small fw-bold d-flex align-items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default CustomerNavbar;