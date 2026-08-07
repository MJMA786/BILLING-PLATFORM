import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ProtectedRoute({
    children,
    role,
}) {

    const {
        loading,
        isAuthenticated,
        user,
    } = useAuth();


    // ==========================================
    // Wait until session is restored
    // ==========================================

    if (loading) {

        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh" }}
            >
                <div className="spinner-border text-primary" />
            </div>
        );

    }


    // ==========================================
    // Not Logged In
    // ==========================================

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // Role Authorization
    // ==========================================

    if (

        role &&
        user?.role !== role

    ) {

        if (user?.role === "admin") {

            return (
                <Navigate
                    to="/dashboard"
                    replace
                />
            );

        }

        return (
            <Navigate
                to="/customer/dashboard"
                replace
            />
        );

    }


    return children;

}


export default ProtectedRoute;