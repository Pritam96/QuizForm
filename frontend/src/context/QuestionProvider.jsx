import axios from "axios";
import React from "react";

const QuestionContext = React.createContext();

const QuestionProvider = ({ children }) => {
  const [questionSetList, setQuestionSetList] = React.useState([]);
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const adminCreateQuestionSet = async (formData, token) => {
    try {
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
      console.log(data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed create question set. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const adminGetAllQuestionSet = async (token) => {
    try {
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
      setQuestionSetList(data.questionSets);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed fetch question sets. Please try again.";
      throw new Error(errorMessage);
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        adminCreateQuestionSet,
        adminGetAllQuestionSet,
        questionSetList,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestion = () => React.useContext(QuestionContext);

export default QuestionProvider;
