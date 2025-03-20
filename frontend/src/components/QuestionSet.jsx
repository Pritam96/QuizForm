import { Box, Button, Card, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CreateQuestionForm from "./CreateQuestionForm";

const QuestionSet = ({ questionSet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Card.Root
      onClick={(e) => {
        setIsOpen(!isOpen);
        e.stopPropagation();
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
              {questionSet.questions.length ? (
                <Box listStyleType="inside" fontWeight="semibold" px={6}>
                  {questionSet.questions.map((question, index) => (
                    <Box key={question._id} pb={4} _hover={{ color: "blue" }}>
                      <Link
                        to={`/question/${questionSet._id}/${question._id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Box display="flex" alignItems="center">
                          <Text fontSize="xl">{index + 1}.</Text>
                          <Text fontSize="lg" ml={2}>
                            {question.questionText}
                          </Text>
                        </Box>
                        {question.questionType === "mcq" ||
                          (question.questionType === "boolean" && (
                            <Box as="ol" listStyleType="circle" mt={2} ml={8}>
                              {question.options.map((option) => (
                                <Box as="li" key={option} my={1}>
                                  {option}
                                </Box>
                              ))}
                            </Box>
                          ))}
                      </Link>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Text fontSize={"sm"} textAlign={"center"}>
                  No questions found. please add questions.
                </Text>
              )}
            </Box>
            <Box textAlign={"right"}>
              <Link to={`/question/${questionSet._id}/new`}>
                Add a question
              </Link>
            </Box>
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default QuestionSet;
