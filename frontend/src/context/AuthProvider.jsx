import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("profile")) || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const checkAuth = () => {
      const profile = JSON.parse(localStorage.getItem("profile"));
      if (profile && profile.token) {
        const decodedToken = jwtDecode(profile.token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser(profile);
          setIsAuthenticated(true);
        } else {
          logoutAction();
        }
      }
      setIsLoading(false); // Set loading to false after checking auth
    };

    checkAuth();
  }, [navigate]);

  // Login existing user
  const loginAction = async (formData) => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/auth/login`, formData);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("profile", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to log in. Please try again.";
      throw new Error(errorMessage);
    }
  };

  // Register a new user
  const registerAction = async (formData) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/auth/register`,
        formData
      );
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("profile", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to register. Please try again.";
      throw new Error(errorMessage);
    }
  };

  // Logout a user
  const logoutAction = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("profile");
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading, // Expose loading state
        loginAction,
        registerAction,
        logoutAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
