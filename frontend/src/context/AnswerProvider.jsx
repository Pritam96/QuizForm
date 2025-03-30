import axios from "axios";
import React, { useState, createContext, useContext } from "react";

const AnswerContext = createContext();

const AnswerProvider = ({ children }) => {
  const [answerSetList, setAnswerSetList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const submitAnswer = async (questionSetId, questionId, answer, token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/user/answer/${questionSetId}`,
        { questionId, answer },
        config
      );
      console.log(data);

      setAnswerSetList((prevAnswerSetList) =>
        prevAnswerSetList.map((answerSet) =>
          answerSet._id === data.answerSet._id
            ? { ...answerSet, answers: data.answerSet.answers }
            : answerSet
        )
      );
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to submit the answer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswerSet = async (answerSetId, token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/user/submit/${answerSetId}`,
        config
      );
      console.log(data);
      setAnswerSetList((prevAnswerSetList) =>
        prevAnswerSetList.map((answerSet) =>
          answerSet._id === answerSetId
            ? {
                ...answerSet,
                status: data.answerSet.status,
                answers: data.answerSet.answers,
              }
            : answerSet
        )
      );
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to submit the answer set."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const userGetAnswerSetList = async (token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/user/answers`,
        {},
        config
      );
      console.log(data);
      setAnswerSetList(data.answerSets || []);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch answer sets."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const adminGetAnswerSetList = async (token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/admin/answers`,
        {},
        config
      );
      setAnswerSetList(data.answerSets || []);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch answer sets."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const adminUpdateAnswer = async (answerSetId, answerId, answer, token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/admin/answer/${answerSetId}`,
        { answerId, answer },
        config
      );

      setAnswerSetList((prevAnswerSetList) =>
        prevAnswerSetList.map((answerSet) =>
          answerSet._id === answerSetId
            ? { ...answerSet, answers: data.answerSet.answers }
            : answerSet
        )
      );
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to update the answer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const adminApproveAnswerSet = async (answerSetId, token) => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/admin/approve/${answerSetId}`,
        config
      );

      setAnswerSetList((prevAnswerSetList) =>
        prevAnswerSetList.map((answerSet) =>
          answerSet._id === answerSetId
            ? { ...answerSet, status: data.answerSet.status }
            : answerSet
        )
      );
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to approve the answer set."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnswerContext.Provider
      value={{
        submitAnswer,
        submitAnswerSet,
        userGetAnswerSetList,
        adminUpdateAnswer,
        adminGetAnswerSetList,
        adminApproveAnswerSet,
        answerSetList,
        isLoading,
      }}
    >
      {children}
    </AnswerContext.Provider>
  );
};

export const useAnswer = () => useContext(AnswerContext);

export default AnswerProvider;
