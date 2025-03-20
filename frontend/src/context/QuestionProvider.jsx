import axios from "axios";
import React, { useState, createContext, useContext } from "react";

const QuestionContext = createContext();

const QuestionProvider = ({ children }) => {
  const [questionSetList, setQuestionSetList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const adminCreateQuestionSet = async (formData, token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/admin/questions`,
        formData,
        config
      );
      setQuestionSetList((prev) => [data.questionSet, ...prev]); // ✅ Fixed state update issue
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to create question set."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const adminGetAllQuestionSet = async (token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/admin/questions`,
        config
      );
      setQuestionSetList(data.questionSets || []);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch question sets."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const userGetAvailableQuestionSet = async (token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseUrl}/api/user/questions`, config);
      setQuestionSetList(data.questionSets || []);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch question sets."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionSet = async (questionSetId, token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/admin/questions/${questionSetId}`,
        config
      );
      return data.questionSet;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch question set."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        adminCreateQuestionSet,
        adminGetAllQuestionSet,
        userGetAvailableQuestionSet,
        getQuestionSet,
        questionSetList,
        isLoading,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestion = () => useContext(QuestionContext);

export default QuestionProvider;
