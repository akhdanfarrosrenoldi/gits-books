import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/auth/me");
        setIsAuthenticated(true);
        if (window.location.pathname === "/") {
          navigate("/books");
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const login = async (email, password) => {
    try {
      await axiosInstance.post("/auth/login", { email, password });
      setIsAuthenticated(true);
      navigate("/books"); // Redirect ke halaman books
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setIsAuthenticated(false);
      navigate("/login", { replace: true }); // Redirect ke login dengan replace
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
