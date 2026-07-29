import api from "./api";

const planService = {

    getAllPlans: async () => {
        const response = await api.get("/plans/all");
        return response.data;
    },

    getAvailablePlans: async () => {
        const response = await api.get("/plans/");
        return response.data;
    },

    createPlan: async (plan) => {
        const response = await api.post("/plans/", plan);
        return response.data;
    },

    updatePlan: async (id, plan) => {
        const response = await api.put(`/plans/${id}`, plan);
        return response.data;
    },

    deactivatePlan: async (id) => {
        const response = await api.patch(
            `/plans/${id}/deactivate`
        );
        return response.data;
    }

};

export default planService;