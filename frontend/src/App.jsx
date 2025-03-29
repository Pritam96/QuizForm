import React from "react";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import CreateQuestionForm from "./components/CreateQuestionForm";
import LoadingSpinner from "./components/LoadingSpinner";
import Layout from "./components/Layout";
import SubmittedAnswerSetList from "./pages/SubmittedAnswerSetList";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate replace to="/auth" />}
        />
        <Route
          path="/auth"
          element={!isAuthenticated ? <Auth /> : <Navigate replace to="/" />}
        />

        {/* Edit a question */}
        <Route
          path="/question/:questionSetId/:questionId/edit"
          element={!isAuthenticated ? <Auth /> : <CreateQuestionForm />}
        />

        {/* Add new question to a question set */}
        <Route
          path="/question/:questionSetId/new"
          element={!isAuthenticated ? <Auth /> : <CreateQuestionForm />}
        />

        {/* Add new question to a question set */}
        <Route
          path="/answers"
          element={!isAuthenticated ? <Auth /> : <SubmittedAnswerSetList />}
        />

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Layout>
  );
};

export default App;
