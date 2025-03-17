import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuestion } from "../context/QuestionProvider";
import { Toaster, toaster } from "../components/ui/toaster";

const CreateQuestionSetForm = () => {
  const [formData, setFormData] = useState({
    title: "Question Set #1",
    description: "",
  });
  const { user } = useAuth();
  const { adminCreateQuestionSet } = useQuestion();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ title: "", description: "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await adminCreateQuestionSet(formData, user.token);
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

  return (
    <Box maxW="md" px={4} py={6} shadow="md" rounded="md">
      <Text fontSize="2xl" fontWeight="bold" textAlign={"center"} mb={4}>
        Create Question Set
      </Text>
      <form onSubmit={submitHandler}>
        <Stack gap="4">
          <Input
            placeholder="Enter a Title"
            value={formData.title}
            name="title"
            onChange={changeHandler}
          />
          <Input
            placeholder="Enter a Description"
            value={formData.description}
            name="description"
            onChange={changeHandler}
          />
          <Button type="submit">Create Question Set</Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateQuestionSetForm;
