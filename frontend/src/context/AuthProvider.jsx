import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("profile")) || null
  );
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  console.log("User:", user);

  // Login existing user
  const loginAction = async (formData) => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/auth/login`, formData);
      setUser(data.user);
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
    localStorage.removeItem("profile");
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loginAction, registerAction, logoutAction }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
