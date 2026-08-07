import axios from "axios";

const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },

    timeout: 15000,
});


// ======================================================
// Token Helpers
// ======================================================

const getAccessToken = () =>
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

const getRefreshToken = () =>
    localStorage.getItem("refresh_token") ||
    sessionStorage.getItem("refresh_token");

const usingLocalStorage = () =>
    !!localStorage.getItem("refresh_token");


// ======================================================
// Request Interceptor
// ======================================================

api.interceptors.request.use(

    (config) => {

        const token = getAccessToken();

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error),

);


// ======================================================
// Response Interceptor
// ======================================================

api.interceptors.response.use(

    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || "";

        const isAuthEndpoint =
            url.includes("/auth/login") ||
            url.includes("/auth/register") ||
            url.includes("/auth/forgot-password") ||
            url.includes("/auth/verify-reset-code") ||
            url.includes("/auth/reset-password") ||
            url.includes("/auth/refresh") ||
            url.includes("/auth/google");

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    throw new Error(
                        "No refresh token found.",
                    );
                }

                const { data } = await axios.post(

                    `${BASE_URL}/auth/refresh`,

                    {
                        refresh_token:
                            refreshToken,
                    },

                );

                const {

                    access_token,
                    refresh_token,

                } = data;

                if (usingLocalStorage()) {

                    localStorage.setItem(
                        "access_token",
                        access_token,
                    );

                    localStorage.setItem(
                        "refresh_token",
                        refresh_token,
                    );

                } else {

                    sessionStorage.setItem(
                        "access_token",
                        access_token,
                    );

                    sessionStorage.setItem(
                        "refresh_token",
                        refresh_token,
                    );

                }

                originalRequest.headers.Authorization =
                    `Bearer ${access_token}`;

                return api(
                    originalRequest,
                );

            } catch (refreshError) {

                localStorage.clear();
                sessionStorage.clear();

                if (
                    window.location.pathname !==
                    "/login"
                ) {

                    window.location.href =
                        "/login";

                }

                return Promise.reject(
                    refreshError,
                );

            }

        }

        return Promise.reject(error);

    },

);


export default api;