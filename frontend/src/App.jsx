import React from "react";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import EditQuestion from "./components/EditQuestion";
import CreateQuestionForm from "./components/CreateQuestionForm";

const App = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate replace to="/auth" />}
      />
      <Route
        path="/auth"
        element={!isAuthenticated ? <Auth /> : <Navigate replace to="/" />}
      />

      {/* edit a question */}
      <Route
        path="/question/:questionSetId/:questionId/edit"
        element={!isAuthenticated ? <Auth /> : <CreateQuestionForm />}
      />

      {/* add new question to a question set */}
      <Route
        path="/question/:questionSetId/new"
        element={!isAuthenticated ? <Auth /> : <CreateQuestionForm />}
      />

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default App;
