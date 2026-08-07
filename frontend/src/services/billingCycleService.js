import api from "./api";

const billingCycleService = {

  getAll: async () => {
    const response = await api.get("/billing-cycles/");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/billing-cycles/${id}`
    );

    return response.data;
  },

  create: async (data) => {
    const response = await api.post(
      "/billing-cycles/",
      data
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/billing-cycles/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/billing-cycles/${id}`
    );

    return response.data;
  },

};

export default billingCycleService;