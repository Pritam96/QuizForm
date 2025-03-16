import React from "react";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";

const App = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Home /> : <Navigate replace to="/auth" />}
      />
      <Route
        path="/auth"
        element={!user ? <Auth /> : <Navigate replace to="/" />}
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default App;
