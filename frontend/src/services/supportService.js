import api from "./api";

const supportService = {
  submitTicket: async (ticketData) => {
    const response = await api.post("/support/ticket", ticketData);
    return response.data;
  },
};

export default supportService;
