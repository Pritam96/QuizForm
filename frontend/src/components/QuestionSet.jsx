import { Box, Card, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

const QuestionSet = ({ questionSet }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card.Root onClick={() => setIsOpen(!isOpen)}>
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
          <Box p={5}>
            {questionSet.questions.length ? (
              <Box listStyleType="inside" fontWeight="semibold" px={6}>
                {questionSet.questions.map((question, index) => (
                  <Box key={question._id} pb={4} _hover={{ color: "blue" }}>
                    <Link to={`/question/${questionSet._id}/${question._id}`}>
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
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default QuestionSet;
