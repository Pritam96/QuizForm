import React, { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuestion } from "../context/QuestionProvider";
import { Toaster, toaster } from "../components/ui/toaster";
import { Box, Stack, Text } from "@chakra-ui/react";
import QuestionSet from "../components/QuestionSet";

const Home = () => {
  const { user } = useAuth();
  const { adminCreateQuestionSet, adminGetAllQuestionSet, questionSetList } =
    useQuestion();

  useEffect(() => {
    if (user.role === "admin") {
      getAllQuestionSet(user.token);
    }
  }, []);

  const createQuestionSet = async (formData, token) => {
    try {
      await adminCreateQuestionSet(formData, token);
      toaster.create({
        title: "Success",
        description: "Question set created successfully!",
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

  const getAllQuestionSet = async (token) => {
    try {
      await adminGetAllQuestionSet(token);
      toaster.create({
        title: "Success",
        description: "Question set created successfully!",
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
    <Box h="100vh" w="100vw" p={10}>
      <Toaster />
      {questionSetList.length && (
        <Stack gap={4}>
          {questionSetList.map((questionSet) => (
            <QuestionSet key={questionSet._id} questionSet={questionSet} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Home;
