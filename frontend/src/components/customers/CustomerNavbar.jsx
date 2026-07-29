import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function CustomerNavbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">

      <div className="container-fluid">

        <div>
          <h4 className="mb-0 fw-bold">
            My Subscription Portal
          </h4>

          <small className="text-muted">
            Welcome back, {user?.name}
          </small>
        </div>

        <div className="d-flex align-items-center">

          <button
            type="button"
            className="btn btn-link text-dark me-3 p-0"
          >
            <i className="bi bi-bell fs-5"></i>
          </button>

          <div className="dropdown">

            <button
              className="btn btn-light dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-person-circle me-2"></i>

              {user?.name}
            </button>

            <ul className="dropdown-menu dropdown-menu-end">

              <li>
                <h6 className="dropdown-header">
                  {user?.email}
                </h6>
              </li>

              <li>
                <span className="dropdown-item-text text-muted">
                  Customer
                </span>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <button className="dropdown-item">
                  <i className="bi bi-person me-2"></i>
                  My Profile
                </button>
              </li>

              <li>
                <button className="dropdown-item">
                  <i className="bi bi-key me-2"></i>
                  Change Password
                </button>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>

            </ul>

          </div>

        </div>

      </div>

    </nav>
  );
}

export default CustomerNavbar;