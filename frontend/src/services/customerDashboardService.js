import api from "./api";

const customerDashboardService = {

    getDashboard: async () => {

        const response = await api.get(
            "/customer/dashboard/"
        );

        return response.data;

    },

};

export default customerDashboardService;