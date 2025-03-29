import React, { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuestion } from "../context/QuestionProvider";
import { toaster } from "../components/ui/toaster";
import { Box, Stack, Text } from "@chakra-ui/react";
import QuestionSet from "../components/QuestionSet";
import CreateQuestionSetForm from "../components/CreateQuestionSetForm";
import { useAnswer } from "../context/AnswerProvider";

const Home = () => {
  const { user } = useAuth();
  const {
    adminGetAllQuestionSet,
    userGetAvailableQuestionSet,
    questionSetList,
    isLoading: questionSetListLoading,
  } = useQuestion();

  useEffect(() => {
    getAllQuestionSet(user.token);
  }, []);

  const getAllQuestionSet = async (token) => {
    try {
      user.role === "admin"
        ? await adminGetAllQuestionSet(token)
        : await userGetAvailableQuestionSet(token);
      toaster.create({
        title: "Success",
        description: "Question sets fetched successfully!",
        type: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={10}>
      <Box display="flex" justifyContent="center">
        {user.role === "admin" && <CreateQuestionSetForm />}
      </Box>
      <Box mt={10}>
        {!questionSetListLoading && questionSetList.length && (
          <Stack gap={4}>
            {questionSetList.map((questionSet) => (
              <QuestionSet key={questionSet._id} questionSet={questionSet} />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Home;
