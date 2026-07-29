import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getCurrentUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token")
  );

  const [loading, setLoading] = useState(true);

  // Login
  const login = (jwtToken, currentUser) => {
    localStorage.setItem("access_token", jwtToken);

    setToken(jwtToken);
    setUser(currentUser);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("access_token");

    setToken(null);
    setUser(null);
  };

  // Restore session on page refresh
  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,

      isAuthenticated: !!token,

      login,
      logout,

      setUser,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}