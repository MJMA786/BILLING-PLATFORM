import api from "./api";

const subscriptionService = {
  getAllSubscriptions: async () => {
    const response = await api.get("/subscriptions");
    return response.data;
  },

  getSubscriptionById: async (id) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },

  createSubscription: async (data) => {
    const response = await api.post("/subscriptions", data);
    return response.data;
  },

  getMySubscription: async () => {
    const response = await api.get("/subscriptions/me");
    return response.data;
  },

  cancelSubscription: async (id) => {
    const response = await api.put(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  resumeSubscription: async (id) => {
    const response = await api.put(`/subscriptions/${id}/resume`);
    return response.data;
  },

  deleteSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },

  // Aliases for clean calls
  create: async (data) => {
    const response = await api.post("/subscriptions", data);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.put(`/subscriptions/${id}/cancel`);
    return response.data;
  },
  resume: async (id) => {
    const response = await api.put(`/subscriptions/${id}/resume`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },
};

export default subscriptionService;