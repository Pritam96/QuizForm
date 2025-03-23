import { Box, Button, Input, RadioGroup, Stack, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toaster } from "../components/ui/toaster";
import { useAnswer } from "../context/AnswerProvider";

const Question = ({ questionSet, question, index }) => {
  const { user } = useAuth();
  const [answerText, setAnswerText] = React.useState("");
  const [answer, setAnswer] = React.useState(null);
  const navigate = useNavigate();
  const { isLoading, submitAnswer, answerSetList } = useAnswer();

  useEffect(() => {
    if (user.role === "user" && !isLoading && questionSet && question) {
      const answerSet = answerSetList.find(
        (answerSet) => answerSet.questionSetId._id === questionSet._id
      );

      if (answerSet) {
        const specificAnswer = answerSet.answers.find(
          (item) => String(item.questionId) === String(question._id)
        );

        if (specificAnswer) {
          setAnswer(specificAnswer);
          setAnswerText(specificAnswer.answerText);
        }
      }
    }
  }, [isLoading, questionSet, question, answerSetList]);

  const submitHandler = async () => {
    try {
      await submitAnswer(
        questionSet._id,
        question._id,
        answerText.trim(),
        user.token
      );
      toaster.create({
        title: "Success",
        description: "Answer submitted successfully!",
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

  const clickHandlerQuestionEdit = () => {
    if (user.role === "admin") {
      navigate(`/question/${questionSet._id}/${question._id}/edit`);
    }
  };

  return (
    <Box
      key={question._id}
      pb={4}
      _hover={{ color: user.role === "admin" && "blue" }}
      onClick={clickHandlerQuestionEdit}
    >
      <Box display="flex" alignItems="center">
        <Text fontSize="xl">{index + 1}.</Text>
        <Text fontSize="lg" ml={2}>
          {question.questionText}
        </Text>
        <Text fontSize="sm" ml={2} color="gray.500">
          ({question.questionType})
        </Text>
      </Box>

      {question.questionType === "mcq" &&
        question.options &&
        question.options.length > 0 && (
          <Box
            mt={2}
            ml={8}
            display={"flex"}
            gap={2}
            justifyContent={"space-between"}
          >
            <RadioGroup.Root
              value={answerText}
              onValueChange={(e) => setAnswerText(e.value)}
              disabled={answer !== null}
            >
              <Stack gap={3}>
                {question.options.map((item, itemIndex) => (
                  <RadioGroup.Item key={itemIndex} value={item}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>{item}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </Stack>
            </RadioGroup.Root>
            {user.role !== "admin" && (
              <Button
                variant="outline"
                colorPalette={"green"}
                onClick={submitHandler}
                disabled={answer !== null}
              >
                {answer !== null ? "Submitted" : "Submit"}
              </Button>
            )}
          </Box>
        )}
      {user.role === "user" && question.questionType === "text" && (
        <Box display={"flex"} mt={2} gap={2} justifyContent={"space-between"}>
          <Input
            placeholder="Enter your answer"
            value={answerText}
            name={question._id}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={answer !== null}
          />
          <Button
            variant="outline"
            colorPalette={"green"}
            onClick={submitHandler}
            disabled={answer !== null}
          >
            {answer !== null ? "Submitted" : "Submit"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Question;
