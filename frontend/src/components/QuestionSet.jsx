import { Box, Button, Card, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";
import Question from "./Question";
import { useAuth } from "../context/AuthProvider";
import { useAnswer } from "../context/AnswerProvider";

const QuestionSet = ({ questionSet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [answerSet, setAnswerSet] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { submitAnswerSet, isLoading, answerSetList } = useAnswer();

  const addQuestionOrSubmitAnswerSet = async () => {
    if (user.role === "admin") navigate(`/question/${questionSet._id}/new`);
    else {
      try {
        await submitAnswerSet(answerSet._id, user.token);
        toaster.create({
          title: "Success",
          description: "Answer Set submitted successfully!",
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
    }
  };

  useEffect(() => {
    if (!isLoading && questionSet) {
      const answerSet = answerSetList.find(
        (answerSet) => answerSet.questionSetId._id === questionSet._id
      );
      setAnswerSet(answerSet);
    }
  }, [isLoading, questionSet, answerSetList]);

  return (
    <Card.Root
      onClick={() => {
        setIsOpen(true);
      }}
    >
      <Card.Body>
        <Card.Title fontWeight="bold" fontSize="xl" textAlign={"center"}>
          {questionSet.title}
        </Card.Title>
        {questionSet.description && (
          <Card.Description fontSize="md" textAlign={"center"}>
            {questionSet.description}
          </Card.Description>
        )}

        {isOpen && (
          <Box>
            <Box p={5}>
              {questionSet.questions.length > 0 && (
                <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.400">
                  Questions in {questionSet.title}
                </Text>
              )}
              {questionSet.questions && questionSet.questions.length > 0 ? (
                <Box listStyleType="inside" fontWeight="semibold" px={6}>
                  {questionSet.questions.map((question, index) => (
                    <Question
                      key={index}
                      questionSet={questionSet}
                      question={question}
                      index={index}
                    />
                  ))}
                </Box>
              ) : (
                <Text fontSize={"lg"} textAlign={"center"}>
                  No questions found. Please add some questions.
                </Text>
              )}
            </Box>
            {answerSet ||
              (user.role === "admin" && (
                <Box textAlign={"right"}>
                  <Button
                    variant="outline"
                    colorPalette={"red"}
                    onClick={addQuestionOrSubmitAnswerSet}
                    disabled={
                      user.role === "user" && answerSet?.status === "Modified"
                    }
                  >
                    {user.role === "admin" && "Add a question"}
                    {user.role === "user" &&
                      answerSet?.status === "Pending" &&
                      "Submit your paper"}
                    {user.role === "user" &&
                      answerSet?.status === "Modified" &&
                      "Paper is submitted"}
                  </Button>
                </Box>
              ))}
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default QuestionSet;
