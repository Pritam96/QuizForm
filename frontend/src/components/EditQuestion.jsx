import React from "react";
import { useParams } from "react-router-dom";

const EditQuestion = () => {
  let { questionSetId, questionId } = useParams();

  // TODO: Fetch question by questionSetId and questionId
  // TODO: Show a form to edit the question
  return (
    <div>
      <h1>QuestionSet ID: {questionSetId}</h1>
      <h2>Question ID: {questionId}</h2>
    </div>
  );
};

export default EditQuestion;
