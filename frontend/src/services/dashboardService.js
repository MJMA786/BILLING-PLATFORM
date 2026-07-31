import api from "./api";

const dashboardService = {

    // ==========================================
    // Dashboard Overview
    // ==========================================

    getDashboard: async () => {

        const response = await api.get("/dashboard/");

        return response.data;

    },

    // ==========================================
    // Dashboard Analytics
    // ==========================================

    getDashboardAnalytics: async () => {

        const response = await api.get("/dashboard/analytics");

        return response.data;

    },

};

export default dashboardService;