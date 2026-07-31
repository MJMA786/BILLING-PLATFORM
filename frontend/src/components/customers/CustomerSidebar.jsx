import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/customers.css";

function CustomerSidebar() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

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

        navigate("/login", {

            replace: true,

        });

    };

    return (

        <aside className="customer-sidebar">

            {/* Logo */}

            <div className="customer-sidebar-logo">

                <div className="customer-logo-circle">

                    <i className="bi bi-person-workspace"></i>

                </div>

                <div>

                    <h4>

                        My Portal

                    </h4>

                    <span>

                        Customer Portal

                    </span>

                </div>

            </div>

            {/* Navigation */}

            <div className="customer-sidebar-menu">

                {

                    menuItems.map((item) => (

                        <NavLink

                            key={item.path}

                            to={item.path}

                            className={({ isActive }) =>

                                `customer-sidebar-link ${

                                    isActive ? "active" : ""

                                }`

                            }

                        >

                            <i className={`bi ${item.icon}`}></i>

                            <span>

                                {item.label}

                            </span>

                        </NavLink>

                    ))

                }

            </div>

            {/* Profile */}

            <div className="customer-sidebar-profile">

                <div className="customer-avatar">

                    {user?.name?.charAt(0).toUpperCase() || "C"}

                </div>

                <div className="customer-profile-info">

                    <h6>

                        {user?.name || "Customer"}

                    </h6>

                    <span>

                        {user?.email || "customer@email.com"}

                    </span>

                </div>

            </div>
            

        </aside>

    );

}

export default CustomerSidebar;