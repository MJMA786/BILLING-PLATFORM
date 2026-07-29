import api from "./api";

const customerService = {

    getAllCustomers: async () => {
        const response = await api.get("/customers/");
        return response.data;
    },

    updateCustomer: async (id, customer) => {
        const response = await api.put(
            `/customers/${id}`,
            customer
        );

        return response.data;
    },

    deleteCustomer: async (id) => {
        const response = await api.delete(
            `/customers/${id}`
        );

        return response.data;
    }

};

export default customerService;