import {
  Box,
  Button,
  Input,
  NativeSelect,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuestion } from "../context/QuestionProvider";
import { toaster } from "../components/ui/toaster";
import { Link, useNavigate, useParams } from "react-router-dom";

const CreateQuestionForm = () => {
  let { questionSetId, questionId } = useParams();

  const [formData, setFormData] = useState({
    questionType: "text",
    questionText: "",
    options: [],
  });
  const [newOption, setNewOption] = useState("");
  const [isEditing, setIsEditing] = useState(!!questionId);

  const { user } = useAuth();
  const {
    getQuestionSet,
    questionSetList,
    isLoading,
    adminAddQuestion,
    adminUpdateQuestion,
  } = useQuestion();

  const [questionSet, setQuestionSet] = useState(
    questionSetList?.find((ql) => ql._id === questionSetId) || null
  );
  const navigate = useNavigate();

  // Fetch question set if not available
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
  }, [questionSetId, user.token, questionSet, getQuestionSet]);

  // Populate form data when editing a question
  useEffect(() => {
    if (questionId && questionSet) {
      const question = questionSet.questions?.find((q) => q._id === questionId);

      if (question) {
        setFormData({
          questionType: question.questionType || "text",
          questionText: question.questionText || "",
          options: question.options || [],
        });
        setIsEditing(true);
      }
    }
  }, [questionId, questionSet]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addOption = () => {
    if (newOption.trim() !== "") {
      setFormData({
        ...formData,
        options: [...formData.options, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const removeOption = (indexToRemove) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, index) => index !== indexToRemove),
    });
  };

  const resetForm = () => {
    setFormData({
      questionType: "text",
      questionText: "",
      options: [],
    });
    setNewOption("");
    setIsEditing(false);
    navigate(`/question/${questionSetId}/new`);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.questionText.trim()) {
      toaster.create({
        title: "Error",
        description: "Question text is required",
        type: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // If question type requires options, validate them
    if (formData.questionType === "mcq" && formData.options.length < 2) {
      toaster.create({
        title: "Error",
        description: "At least two options are required for this question type",
        type: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (isEditing) {
        await adminUpdateQuestion(
          questionSetId,
          questionId,
          formData,
          user.token
        );
        toaster.create({
          title: "Success",
          description: "Question updated successfully!",
          type: "success",
          duration: 3000,
          isClosable: true,
        });
        resetForm();
      } else {
        await adminAddQuestion(questionSetId, formData, user.token);
        toaster.create({
          title: "Success",
          description: "Question created successfully!",
          type: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Refresh question set data
      const updatedQuestionSet = await getQuestionSet(
        questionSetId,
        user.token
      );
      setQuestionSet(updatedQuestionSet);

      resetForm();
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Something went wrong",
        type: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={10}>
      <Box display="flex" justifyContent="center">
        <Box px={4} py={6} shadow="md" rounded="md" w={"50%"}>
          <Text fontSize="2xl" fontWeight="bold" textAlign={"center"} mb={4}>
            {isEditing ? "Update Question" : "Add New Question"}
          </Text>
          <form onSubmit={submitHandler}>
            <Stack gap="4">
              {/* Question Text Input */}
              <Input
                placeholder="Enter a Question"
                value={formData.questionText}
                name="questionText"
                onChange={changeHandler}
              />

              {/* Native Select for Question Type */}
              <NativeSelect.Root size="md">
                <NativeSelect.Field
                  placeholder="Select question type"
                  value={formData.questionType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      questionType: e.currentTarget.value,
                    })
                  }
                >
                  <option value="text">Normal question</option>
                  <option value="mcq">MCQ question</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>

              {/* Option inputs for MCQ type questions */}
              {formData.questionType === "mcq" && (
                <>
                  {/* Display existing options */}
                  {formData.options.map((option, index) => (
                    <Box key={index} display="flex" gap={2}>
                      <Input
                        value={option}
                        onChange={() => {}}
                        readOnly
                        size="sm"
                      />
                      <Button
                        colorPalette="red"
                        onClick={() => removeOption(index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}

                  {/* Add new option */}
                  <Box display="flex" gap={2}>
                    <Input
                      placeholder={`Enter Option ${
                        formData.options.length + 1
                      }`}
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      size="sm"
                    />
                    <Button onClick={addOption}>Add Option</Button>
                  </Box>
                </>
              )}

              <Button type="submit" colorPalette="blue">
                {isEditing ? "Update Question" : "Create Question"}
              </Button>

              {isEditing && (
                <Button colorPalette="gray" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </Stack>
          </form>
        </Box>
      </Box>

      {/* Questions list */}
      {!isLoading && questionSet && (
        <Box mt={10}>
          <Box p={5}>
            {questionSet.questions && questionSet.questions.length > 0 && (
              <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.400">
                Questions in {questionSet.title}
              </Text>
            )}
            {questionSet.questions && questionSet.questions.length > 0 ? (
              <Box listStyleType="inside" fontWeight="semibold" px={6}>
                {questionSet.questions.map((question, index) => (
                  <Box key={question._id} pb={4} _hover={{ color: "blue" }}>
                    <Link
                      to={`/question/${questionSetId}/${question._id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Box display="flex" alignItems="center">
                        <Text fontSize="xl">{index + 1}.</Text>
                        <Text fontSize="lg" ml={2}>
                          {question.questionText}
                        </Text>
                        <Text fontSize="sm" ml={2} color="gray.600">
                          ({question.questionType})
                        </Text>
                      </Box>
                      {question.questionType === "mcq" &&
                        question.options &&
                        question.options.length > 0 && (
                          <Box as="ol" listStyleType="circle" mt={2} ml={8}>
                            {question.options.map((option, optIndex) => (
                              <Box as="li" key={optIndex} my={1}>
                                {option}
                              </Box>
                            ))}
                          </Box>
                        )}
                    </Link>
                  </Box>
                ))}
              </Box>
            ) : (
              <Text fontSize={"sm"} textAlign={"center"}>
                No questions found. Please add some questions.
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CreateQuestionForm;
