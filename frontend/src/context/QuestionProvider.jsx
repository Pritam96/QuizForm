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
      setQuestionSetList((prev) => [data.questionSet, ...prev]);
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
    console.log("Question Set Fetched!");
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

  const adminAddQuestion = async (questionSetId, formData, token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/admin/question/${questionSetId}`,
        { question: formData },
        config
      );
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          "Failed to add a question in a question set."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const adminUpdateQuestion = async (
    questionSetId,
    questionId,
    formData,
    token
  ) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseUrl}/api/admin/question/${questionSetId}`,
        { questionId, question: formData },
        config
      );
      console.log(data);
      // return data.questionSet;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          "Failed to update a question from a question set."
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
        adminAddQuestion,
        adminUpdateQuestion,
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
