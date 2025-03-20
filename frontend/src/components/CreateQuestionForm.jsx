import {
  Box,
  Button,
  createListCollection,
  Input,
  Portal,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuestion } from "../context/QuestionProvider";
import { Toaster, toaster } from "../components/ui/toaster";
import { Link, useParams } from "react-router-dom";

const CreateQuestionForm = () => {
  // TODO: Show a form to edit the question
  // TODO: Correct the form validation

  let { questionSetId } = useParams();

  const [formData, setFormData] = useState({
    questionType: "text",
    questionText: "",
    options: [],
  });
  const [selectValue, setSelectValue] = useState([]);

  const { user } = useAuth();
  const { adminCreateQuestionSet, getQuestionSet, questionSetList, isLoading } =
    useQuestion();

  const [questionSet, setQuestionSet] = useState(
    questionSetList?.find((ql) => ql._id === questionSetId) || null
  );

  useEffect(() => {
    if (!questionSet) {
      const fetchQuestionSet = async () => {
        try {
          const data = await getQuestionSet(questionSetId, user.token);
          setQuestionSet(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchQuestionSet();
    }
  }, [questionSet, questionSetId, getQuestionSet, user.token]);

  const questionTypes = createListCollection({
    items: [
      { label: "Normal", value: "text" },
      { label: "MCQ Questions", value: "mcq" },
      { label: "Yes / No", value: "boolean" },
    ],
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ title: "", description: "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log(formData);

    try {
      // await (formData, user.token);
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
    } finally {
      resetForm();
    }
  };

  const editHandler = () => {};

  return (
    <Box h="100vh" w="100vw" p={10}>
      <Box display="flex" justifyContent="center">
        <Box px={4} py={6} shadow="md" rounded="md" w={"50%"}>
          <Text fontSize="2xl" fontWeight="bold" textAlign={"center"} mb={4}>
            Add Questions Here
          </Text>
          <form onSubmit={submitHandler}>
            <Stack gap="4">
              <Input
                placeholder="Enter a Question"
                value={formData.questionText}
                name="questionText"
                onChange={changeHandler}
              />

              <Select.Root
                collection={questionTypes}
                value={selectValue}
                onValueChange={(e) => setSelectValue(e.value)}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select Question Type" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {questionTypes.items.map((type) => (
                        <Select.Item item={type} key={type.value}>
                          {type.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>

              <Input
                placeholder="Enter Option 1"
                value={formData.description}
                name="description"
                onChange={changeHandler}
              />
              <Button type="submit">Create Question</Button>
            </Stack>
          </form>
        </Box>
      </Box>

      {/* Questions list */}

      {!isLoading && questionSet && (
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
            <Link to={`/question/${questionSet._id}/new`}>Add a question</Link>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CreateQuestionForm;
