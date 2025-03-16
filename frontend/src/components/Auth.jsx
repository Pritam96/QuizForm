import {
  Box,
  Button,
  Field,
  Input,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../components/ui/toaster";
import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: {
      firstName: "",
      lastName: "",
    },
    email: "",
    password: "",
    role: "user",
  });

  const auth = useAuth();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(
      name === "firstName" || name === "lastName"
        ? { ...formData, name: { ...formData.name, [name]: value } }
        : { ...formData, [name]: value }
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await auth.registerAction(formData);
        toaster.create({
          title: "Success",
          description: "Account created successfully!",
          type: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await auth.loginAction(formData);
        toaster.create({
          title: "Success",
          description: "Logged in successfully!",
          type: "success",
          duration: 3000,
          isClosable: true,
        });
      }
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

  const resetFormHandler = () => {
    setFormData({
      name: {
        firstName: "",
        lastName: "",
      },
      email: "",
      password: "",
      role: "user",
    });
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      my={10}
      shadow="lg"
      borderRadius="md"
      px={6}
      py={10}
    >
      <Toaster />
      <Stack gap={4}>
        <Box fontSize="2xl" fontWeight="bold" textAlign="center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Box>
        <Text textAlign="center" fontSize="lg">
          Please provide your {isSignUp ? "details" : "credentials"} below
        </Text>

        <form onSubmit={submitHandler}>
          <Stack gap={4} my={4} width="full">
            {isSignUp && (
              <>
                <Field.Root required>
                  <Field.Label>First Name</Field.Label>
                  <Input
                    placeholder="John"
                    name="firstName"
                    value={formData.name.firstName}
                    onChange={changeHandler}
                  />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>Last Name</Field.Label>
                  <Input
                    placeholder="Miller"
                    name="lastName"
                    value={formData.name.lastName}
                    onChange={changeHandler}
                  />
                </Field.Root>
              </>
            )}

            <Field.Root required>
              <Field.Label>Email</Field.Label>
              <Input
                placeholder="me@example.com"
                name="email"
                value={formData.email}
                onChange={changeHandler}
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label>Password</Field.Label>
              <Input
                placeholder="Your password"
                name="password"
                type="password"
                value={formData.password}
                onChange={changeHandler}
              />
            </Field.Root>

            {isSignUp && (
              <Switch.Root
                checked={formData.role === "admin"}
                onCheckedChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.checked ? "admin" : "user",
                  })
                }
              >
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>{formData.role.toUpperCase()}</Switch.Label>
              </Switch.Root>
            )}

            <Button type="submit" mt="4">
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </Stack>
        </form>

        <Button
          variant="link"
          onClick={() => {
            setIsSignUp(!isSignUp);
            resetFormHandler();
          }}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </Stack>
    </Box>
  );
};

export default Auth;
