import { Box, Button, Card, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAnswer } from "../context/AnswerProvider";
import { useAuth } from "../context/AuthProvider";
import QuestionSet from "../components/QuestionSet";
import Question from "../components/Question";
import { toaster } from "../components/ui/toaster";

const SubmittedAnswerSetList = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  const {
    userGetAnswerSetList,
    answerSetList,
    isLoading: answerSetListLoading,
    adminGetAnswerSetList,
  } = useAnswer();

  const [submittedQuestionSetList, setSubmittedQuestionSetList] = useState();

  console.log(answerSetList);

  useEffect(() => {
    const fetchAnswerSet = async () => {
      try {
        user.role === "admin"
          ? await adminGetAnswerSetList(user.token)
          : await userGetAnswerSetList(user.token);
        toaster.create({
          title: "Success",
          description: "Answer sets fetched successfully!",
          type: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        console.error("Error fetching answer sets:", err);
        toaster.create({
          title: "Error",
          description: err.message,
          type: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchAnswerSet();
  }, []);

  return (
    <Box p={10}>
      <Box mt={10}>
        {!answerSetListLoading && answerSetList?.length > 0 ? (
          <Stack gap={4}>
            {answerSetList.map((answerSet) => (
              <div key={answerSet._id}>
                <pre>{JSON.stringify(answerSet, null, 2)}</pre>
              </div>
            ))}
          </Stack>
        ) : (
          <p>No submitted answer sets found.</p>
        )}
      </Box>

      <Box mt={10}>
        {!answerSetListLoading && answerSetList?.length > 0 ? (
          <Stack gap={4}>
            {answerSetList.map((answerSet) => (
              <Card.Root key={answerSet._id}>
                <Card.Body>
                  <Card.Title
                    fontWeight="bold"
                    fontSize="xl"
                    textAlign={"center"}
                  >
                    {answerSet.questionSetId.title}
                  </Card.Title>

                  {answerSet.questionSetId.description && (
                    <Card.Description fontSize="md" textAlign={"center"}>
                      {answerSet.questionSetId.description}
                    </Card.Description>
                  )}

                  {isOpen && (
                    <Box>
                      <Box p={5}>
                        {answerSet.questionSetId.questions.length > 0 && (
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            mb={4}
                            color="gray.400"
                          >
                            Questions in {answerSet.questionSetId.title}
                          </Text>
                        )}
                        {answerSet.questionSetId.questions &&
                        answerSet.questionSetId.questions.length > 0 ? (
                          <Box
                            listStyleType="inside"
                            fontWeight="semibold"
                            px={6}
                          >
                            {answerSet.questionSetId.questions.map(
                              (question, index) => (
                                <Question
                                  key={index}
                                  questionSet={answerSet.questionSetId}
                                  question={question}
                                  index={index}
                                  submittedAnswerText={
                                    answerSet &&
                                    answerSet.answers.find(
                                      (answer) =>
                                        answer.questionId === question._id
                                    )?.answerText
                                  }
                                />
                              )
                            )}
                          </Box>
                        ) : (
                          <Text fontSize={"sm"} textAlign={"center"}>
                            No questions found. Please add some questions.
                          </Text>
                        )}
                      </Box>
                      <Box textAlign={"right"}>
                        <Button
                          variant="outline"
                          colorPalette={"red"}
                          onClick={() => {}}
                          disabled={
                            user.role === "user" &&
                            answerSet?.status === "Modified"
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
                    </Box>
                  )}
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        ) : (
          <p>No submitted answer sets found.</p>
        )}
      </Box>
    </Box>
  );
};

export default SubmittedAnswerSetList;
