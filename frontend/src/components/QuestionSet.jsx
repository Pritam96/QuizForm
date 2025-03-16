import { Box, Card, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

const QuestionSet = ({ questionSet }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card.Root onClick={() => setIsOpen(!isOpen)}>
      <Card.Body>
        <Card.Title fontWeight="bold" fontSize="xl">
          {questionSet.title}
        </Card.Title>
        {questionSet.description && (
          <Card.Description fontSize="md">
            {questionSet.description}
          </Card.Description>
        )}

        {isOpen && (
          <Box p={5}>
            {questionSet.questions.length && (
              <Box
                as="ol"
                listStyleType="inside"
                fontSize="sm"
                fontWeight="semibold"
                px={6}
              >
                {questionSet.questions.map((question) => (
                  <Box
                    key={question._id}
                    pb={4}
                    as="li"
                    _hover={{ color: "blue" }}
                  >
                    <Link to={`/question/${questionSet._id}/${question._id}`}>
                      <Text>{question.questionText}</Text>
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
            )}
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default QuestionSet;
