import { Box, Button, Card, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAnswer } from "../context/AnswerProvider";
import { useAuth } from "../context/AuthProvider";
import Question from "../components/Question";
import { toaster } from "../components/ui/toaster";

const SubmittedAnswerSetList = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  const {
    userGetAnswerSetList,
    answerSetList,
    isLoading,
    adminGetAnswerSetList,
    adminApproveAnswerSet,
    submitAnswerSet,
  } = useAnswer();

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
  }, [user.role, user.token]);

  const userOrAdminSubmitAnswerSet = async (answerSetId) => {
    try {
      user.role === "admin"
        ? await adminApproveAnswerSet(answerSetId, user.token)
        : await submitAnswerSet(answerSetId, user.token);
      toaster.create({
        title: "Success",
        description:
          user.role === "admin"
            ? "Answer set approved successfully!"
            : "Answer set submitted successfully!",
        type: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error approving answer set:", err);
      toaster.create({
        title: "Error",
        description: err.message,
        type: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Box p={10}>
      <Box mt={10}>
        {!isLoading && answerSetList?.length > 0 ? (
          <Stack gap={4}>
            {answerSetList.map((answerSet) => (
              <Card.Root key={answerSet._id}>
                <Card.Body>
                  <Card.Title
                    fontWeight="bold"
                    fontSize="xl"
                    textAlign={"center"}
                    cursor="pointer"
                    onClick={toggleOpen}
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
                        {answerSet.questionSetId.questions &&
                          answerSet.questionSetId.questions.length > 0 && (
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
                                  key={question._id} // Fixed: Use question._id instead of index
                                  questionSet={answerSet.questionSetId}
                                  question={question}
                                  index={index}
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
                        {user.role === "user" && (
                          <Button
                            variant="outline"
                            colorPalette={"red"}
                            onClick={() => userOrAdminSubmitAnswerSet(answerSet._id)}
                            disabled={answerSet?.status !== "Pending"}
                          >
                            {answerSet?.status === "Pending" &&
                              "Submit your paper"}
                            {answerSet?.status !== "Pending" &&
                              "Paper is submitted"}
                          </Button>
                        )}

                        {user.role === "admin" && (
                          <Button
                            variant="outline"
                            colorPalette={"red"}
                            onClick={() => userOrAdminSubmitAnswerSet(answerSet._id)}
                            disabled={answerSet?.status === "Approved"}
                          >
                            {answerSet?.status !== "Approved"
                              ? "Approve"
                              : "Approved"}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  )}
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        ) : (
          <Text textAlign="center" fontSize="lg">
            {" "}
            No submitted answer sets found.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default SubmittedAnswerSetList;
