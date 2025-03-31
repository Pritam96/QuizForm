import { Box, Button, Card, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useAnswer } from "../context/AnswerProvider";
import { useAuth } from "../context/AuthProvider";
import Question from "../components/Question";
import { toaster } from "../components/ui/toaster";
import { FaFilePdf } from "react-icons/fa6";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Document,
  Page,
  Text as PDFText,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  questionSet: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    borderBottom: "1 solid #cccccc",
    paddingBottom: 8,
  },
  question: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: "0.5 solid #eeeeee",
  },
  questionText: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionTypeLabel: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333333",
  },
  answerText: {
    fontSize: 12,
    marginLeft: 20,
    marginTop: 3,
    color: "#0066cc",
  },
  mcqOption: {
    fontSize: 11,
    marginLeft: 20,
    marginTop: 2,
    marginBottom: 2,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 9,
    textAlign: "center",
    color: "#666666",
    borderTop: "0.5 solid #cccccc",
    paddingTop: 10,
  },
});

const AnswerSetPDF = ({ answerSet }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.title}>
          <PDFText>{answerSet.questionSetId.title}</PDFText>
        </View>

        {answerSet.questionSetId.description && (
          <View style={{ marginBottom: 20 }}>
            <PDFText>{answerSet.questionSetId.description}</PDFText>
          </View>
        )}

        <View style={styles.questionSet}>
          <PDFText>Questions in {answerSet.questionSetId.title}</PDFText>
        </View>

        {answerSet.questionSetId.questions &&
          answerSet.questionSetId.questions.map((question, index) => {
            const answer = answerSet.answers.find(
              (a) => a.questionId === question._id
            );

            return (
              <View key={question._id} style={styles.question}>
                <PDFText style={styles.questionTypeLabel}>
                  Question Type: {question.questionType.toUpperCase()}
                </PDFText>

                <PDFText style={styles.questionText}>
                  {index + 1}. {question.questionText}
                </PDFText>

                {/* Display MCQ options if available */}
                {question.questionType === "mcq" &&
                  question.options &&
                  question.options.length > 0 && (
                    <View
                      style={{ marginLeft: 20, marginTop: 5, marginBottom: 10 }}
                    >
                      {question.options.map((option, optIndex) => (
                        <PDFText key={optIndex} style={styles.mcqOption}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </PDFText>
                      ))}
                    </View>
                  )}

                {answer && (
                  <View>
                    <PDFText style={styles.answerLabel}>Answer:</PDFText>
                    <PDFText style={styles.answerText}>
                      {answer.answerText}
                    </PDFText>
                  </View>
                )}
              </View>
            );
          })}

        <View style={styles.footer}>
          <PDFText>Generated on {new Date().toLocaleDateString()}</PDFText>
        </View>
      </Page>
    </Document>
  );
};

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

  const pdfRefs = useRef({});

  useEffect(() => {
    const fetchAnswerSet = async () => {
      try {
        user.role === "admin"
          ? await adminGetAnswerSetList(user.token)
          : await userGetAnswerSetList(user.token);
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
        {!isLoading && (
          <>
            {answerSetList?.length > 0 ? (
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
                          <Box
                            p={5}
                            id={`content-${answerSet._id}`}
                            ref={(el) => (pdfRefs.current[answerSet._id] = el)}
                          >
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
                                      key={question._id}
                                      questionSet={answerSet.questionSetId}
                                      question={question}
                                      index={index}
                                    />
                                  )
                                )}
                              </Box>
                            ) : (
                              <Text fontSize={"lg"} textAlign={"center"}>
                                No questions found. Please add some questions.
                              </Text>
                            )}
                          </Box>
                          <Box
                            display={"flex"}
                            gap={5}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Box>
                              {user.role === "admin" && (
                                <Text fontSize={"sm"}>
                                  Submitted By:{" "}
                                  {answerSet.userId.name.firstName}{" "}
                                  {answerSet.userId.name.LastName}
                                </Text>
                              )}
                            </Box>
                            <Box
                              display={"flex"}
                              gap={5}
                              justifyContent={"end"}
                              alignItems={"center"}
                            >
                              {user.role === "user" &&
                                answerSet.status === "Approved" && (
                                  <PDFDownloadLink
                                    document={
                                      <AnswerSetPDF answerSet={answerSet} />
                                    }
                                    fileName={`${answerSet.questionSetId.title.replace(
                                      /\s+/g,
                                      "-"
                                    )}-answers.pdf`}
                                  >
                                    {({ blob, url, loading, error }) => (
                                      <Button
                                        variant="outline"
                                        colorPalette={"yellow"}
                                        isLoading={loading}
                                        isDisabled={loading}
                                      >
                                        <FaFilePdf />
                                      </Button>
                                    )}
                                  </PDFDownloadLink>
                                )}

                              {user.role === "user" && (
                                <Button
                                  variant="outline"
                                  colorPalette={"red"}
                                  onClick={() =>
                                    userOrAdminSubmitAnswerSet(answerSet._id)
                                  }
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
                                  onClick={() =>
                                    userOrAdminSubmitAnswerSet(answerSet._id)
                                  }
                                  disabled={answerSet?.status === "Approved"}
                                >
                                  {answerSet?.status !== "Approved"
                                    ? "Approve"
                                    : "Approved"}
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Card.Body>
                  </Card.Root>
                ))}
              </Stack>
            ) : (
              <Text textAlign="center" fontSize="lg">
                No submitted answer sets found.
              </Text>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SubmittedAnswerSetList;
