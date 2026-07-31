import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const handleLogout = () => {

        logout();

        navigate("/login", { replace: true });

    };

    return (

        <header className="top-navbar">

            <div className="navbar-left">

                <h4 className="page-title">

                    Billing Platform

                </h4>

                <div className="search-box">

                    <i className="bi bi-search"></i>

                    <input

                        type="text"

                        placeholder="Search customers, invoices, plans..."

                    />

                </div>

            </div>

            <div className="navbar-right">

                <button className="icon-btn">

                    <i className="bi bi-bell"></i>

                </button>

                <div className="dropdown">

                    <button

                        className="profile-btn"

                        data-bs-toggle="dropdown"

                    >

                        <div className="avatar">

                            {user?.name?.charAt(0).toUpperCase() || "A"}

                        </div>

                        <div className="profile-info">

                            <strong>

                                {user?.name || "Administrator"}

                            </strong>

                            <small>

                                {user?.role || "Admin"}

                            </small>

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

        <button className="dropdown-item admin-item">

            <i className="bi bi-person"></i>

            <span>Profile</span>

        </button>

    </li>

    <li>

        <button className="dropdown-item admin-item">

            <i className="bi bi-gear"></i>

            <span>Settings</span>

        </button>

    </li>

    <li>

        <button className="dropdown-item admin-item">

            <i className="bi bi-bell"></i>

            <span>Notifications</span>

        </button>

    </li>

    <li><hr className="dropdown-divider" /></li>

    <li>

        <button

            className="dropdown-item admin-logout"

            onClick={handleLogout}

        >

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