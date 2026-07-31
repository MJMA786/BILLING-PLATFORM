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

        <header className="customer-navbar">

            <div className="customer-navbar-left">

                <div>

                    <h4 className="customer-page-title">

                        Customer Portal

                    </h4>

                    <p>

                        Welcome back, {user?.name || "Customer"}

                    </p>

                </div>

            </div>

            <div className="customer-navbar-right">

                <button className="customer-icon-btn">

                    <i className="bi bi-bell"></i>

                </button>

                <div className="dropdown">

                    <button

                        className="customer-profile-btn dropdown-toggle"

                        data-bs-toggle="dropdown"

                    >

                        <div className="customer-nav-avatar">

                            {user?.name?.charAt(0).toUpperCase() || "C"}

                        </div>

                        <div className="customer-nav-info">

                            <strong>

                                {user?.name}

                            </strong>

                            <small>

                                Customer

                            </small>

                        </div>

                    </button>

                    <ul className="dropdown-menu dropdown-menu-end customer-dropdown">

                        <li>

                            <h6 className="dropdown-header">

                                {user?.email}

                            </h6>

                        </li>

                        <li>

                            <span className="dropdown-item-text text-muted">

                                Customer Account

                            </span>

                        </li>

                        <li>

                            <hr className="dropdown-divider"/>

                        </li>

                        <li>

                            <button className="dropdown-item customer-dropdown-item">

                                <i className="bi bi-person"></i>

                                My Profile

                            </button>

                        </li>

                        <li>

                            <button className="dropdown-item customer-dropdown-item">

                                <i className="bi bi-key"></i>

                                Change Password

                            </button>

                        </li>

                        <li>

                            <button className="dropdown-item customer-dropdown-item">

                                <i className="bi bi-headset"></i>

                                Help & Support

                            </button>

                        </li>

                        <li>

                            <hr className="dropdown-divider"/>

                        </li>

                        <li>

                            <button

                                className="dropdown-item customer-logout-item"

                                onClick={handleLogout}

                            >

                                <i className="bi bi-box-arrow-right"></i>

                                Logout

                            </button>

                        </li>

                    </ul>

                </div>

            </div>

        </header>

    );

}

export default CustomerNavbar;