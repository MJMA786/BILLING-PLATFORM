import api from "./api";

const paymentService = {
  async getAll() {
    const response = await api.get("/payments/");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  async getMyPayments() {
    const response = await api.get("/payments/me");
    return response.data;
  },

  async markSuccess(id) {
    const response = await api.patch(
      `/payments/${id}/success`
    );
    return response.data;
  },

  async markFailed(id) {
    const response = await api.patch(
      `/payments/${id}/failed`
    );
    return response.data;
  },

  async refund(id) {
    const response = await api.patch(
      `/payments/${id}/refund`
    );
    return response.data;
  },

  async processCheckout(checkoutData) {
    const response = await api.post("/payments/checkout", checkoutData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(
      `/payments/${id}`
    );
    return response.data;
  },
};

export default paymentService;