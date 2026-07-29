import api from "./api";

// Login user
export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// Register new user
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

// Get currently logged-in user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// Change password
export const changePassword = async (data) => {
  const response = await api.post("/auth/change-password", data);

  return response.data;
};