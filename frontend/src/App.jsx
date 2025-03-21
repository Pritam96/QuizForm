import React from "react";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import EditQuestion from "./components/EditQuestion";
import CreateQuestionForm from "./components/CreateQuestionForm";

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

      {/* edit a question */}
      <Route
        path="/question/:questionSetId/:questionId/edit"
        element={!user ? <Auth /> : <CreateQuestionForm />}
      />

      {/* add new question to a question set */}

      <Route
        path="/question/:questionSetId/new"
        element={!user ? <Auth /> : <CreateQuestionForm />}
      />

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default App;
