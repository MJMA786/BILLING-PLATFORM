import api from "./api";

const invoiceService = {
  async getAll() {
    const response = await api.get("/invoices/");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  // Customer
  async getMyInvoices() {
    const response = await api.get("/invoices/me");
    return response.data;
  },

  // Admin
  async create(data) {
    const response = await api.post("/invoices/", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  },

  async downloadPDF(id) {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async emailInvoice(id) {
    const response = await api.post(`/invoices/${id}/send-email`);
    return response.data;
  },

  async markPaid(id) {
    const response = await api.patch(`/invoices/${id}/mark-paid`);
    return response.data;
  },

  async voidInvoice(id) {
    const response = await api.patch(`/invoices/${id}/void`);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },
};

export default invoiceService;