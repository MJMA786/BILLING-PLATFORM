import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);


export function AuthProvider({
    children,
}) {

    const [user, setUser] = useState(null);

    const [accessToken, setAccessToken] = useState(
        () =>
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token"),
    );

    const [refreshToken, setRefreshToken] = useState(
        () =>
            localStorage.getItem("refresh_token") ||
            sessionStorage.getItem("refresh_token"),
    );

    const [loading, setLoading] = useState(true);


    // =====================================================
    // Login
    // =====================================================

    const login = (
        access,
        refresh,
        currentUser,
        rememberMe = false,
    ) => {

        if (rememberMe) {

            localStorage.setItem(
                "access_token",
                access,
            );

            localStorage.setItem(
                "refresh_token",
                refresh,
            );

            sessionStorage.removeItem(
                "access_token",
            );

            sessionStorage.removeItem(
                "refresh_token",
            );

        } else {

            sessionStorage.setItem(
                "access_token",
                access,
            );

            sessionStorage.setItem(
                "refresh_token",
                refresh,
            );

            localStorage.removeItem(
                "access_token",
            );

            localStorage.removeItem(
                "refresh_token",
            );

        }

        setAccessToken(access);
        setRefreshToken(refresh);
        setUser(currentUser);
    };


    // =====================================================
    // Logout
    // =====================================================

    const logout = () => {

        localStorage.clear();
        sessionStorage.clear();

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };


    // =====================================================
    // Restore Session
    // =====================================================

    useEffect(() => {

        const restoreSession = async () => {

            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {

                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

            } catch (error) {

                console.error(
                    "Session restore failed:",
                    error,
                );

                logout();

            } finally {

                setLoading(false);

            }

        };

        restoreSession();

    }, [accessToken]);


    // =====================================================
    // Role Helpers
    // =====================================================

    const isAdmin =
        user?.role === "admin";

    const isCustomer =
        user?.role === "customer";


    // =====================================================
    // Context Value
    // =====================================================

    const value = useMemo(
        () => ({

            user,

            accessToken,

            refreshToken,

            loading,

            isAuthenticated: !!accessToken,

            isAdmin,

            isCustomer,

            login,

            logout,

            setUser,

        }),
        [
            user,
            accessToken,
            refreshToken,
            loading,
            isAdmin,
            isCustomer,
        ],
    );


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}


export function useAuth() {

    const context = useContext(
        AuthContext,
    );

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider",
        );

    }

    return context;

}