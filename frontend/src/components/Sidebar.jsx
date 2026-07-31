import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {

    const { user } = useAuth();

    const menuItems = [

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

    ];

    return (

        <aside className="sidebar">

            {/* Logo */}

            <div className="sidebar-logo">

                <div className="logo-circle">

                    <i className="bi bi-layers-fill"></i>

                </div>

                <div>

                    <h4>

                        BillingPro

                    </h4>

                    <span>

                        Subscription Platform

                    </span>

                </div>

            </div>

            {/* Navigation */}

            <nav className="sidebar-menu">

                {menuItems.map((item) => (

                    <NavLink

                        key={item.path}

                        to={item.path}

                        className={({ isActive }) =>

                            isActive

                                ? "sidebar-link active"

                                : "sidebar-link"

                        }

                    >

                        <i className={`bi ${item.icon}`}></i>

                        <span>

                            {item.label}

                        </span>

                    </NavLink>

                ))}

            </nav>

            {/* Bottom Profile */}

            <div className="sidebar-profile">

                <div className="profile-avatar">

                    {user?.name?.charAt(0).toUpperCase() || "A"}

                </div>

                <div>

                    <h6>

                        {user?.name || "Administrator"}

                    </h6>

                    <span>

                        {user?.role || "Admin"}

                    </span>

                </div>

            </div>

        </aside>

    );

}

export default Sidebar;