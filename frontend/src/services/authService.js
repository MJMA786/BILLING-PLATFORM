import api from "./api";

/**
 * ==========================================
 * Authentication Service
 * ==========================================
 */


/**
 * Register User
 */
export const register = async (userData) => {
    const { data } = await api.post(
        "/auth/register",
        userData,
    );

    return data;
};


/**
 * Email & Password Login
 */
export const login = async (credentials) => {
    const { data } = await api.post(
        "/auth/login",
        credentials,
    );

    return data;
};


/**
 * Google Login
 */
export const googleLogin = async (
    idToken,
) => {
    const { data } = await api.post(
        "/auth/google",
        {
            id_token: idToken,
        },
    );

    return data;
};


/**
 * Refresh Tokens
 */
export const refreshTokens = async (
    refreshToken,
) => {
    const { data } = await api.post(
        "/auth/refresh",
        {
            refresh_token: refreshToken,
        },
    );

    return data;
};


/**
 * Current User
 */
export const getCurrentUser = async () => {
    const { data } = await api.get(
        "/auth/me",
    );

    return data;
};


/**
 * Change Password
 */
export const changePassword = async (
    passwordData,
) => {
    const { data } = await api.post(
        "/auth/change-password",
        passwordData,
    );

    return data;
};


/**
 * Forgot Password
 */
export const forgotPassword = async (
    email,
) => {
    const { data } = await api.post(
        "/auth/forgot-password",
        {
            email,
        },
    );

    return data;
};


/**
 * Verify Reset Code
 */
export const verifyResetCode = async (
    email,
    code,
) => {
    const { data } = await api.post(
        "/auth/verify-reset-code",
        {
            email,
            code,
        },
    );

    return data;
};


/**
 * Reset Password
 */
export const resetPassword = async (
    resetData,
) => {
    const { data } = await api.post(
        "/auth/reset-password",
        resetData,
    );

    return data;
};


/**
 * Logout
 */
export const logout = async () => {

    try {

        await api.post(
            "/auth/logout",
        );

    } catch (error) {

        console.warn(
            "Logout request failed:",
            error,
        );

    }
};


/**
 * Default Export
 */
const AuthService = {
    register,
    login,
    googleLogin,
    refreshTokens,
    getCurrentUser,
    changePassword,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    logout,
};

export default AuthService;