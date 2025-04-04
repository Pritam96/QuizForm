import React from "react";
import { Box, Stack, Link as ChakraLink, Button, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toaster } from "../components/ui/toaster";

const NavBar = () => {
  const { user, isAuthenticated, logoutAction } = useAuth();

  const logoutHandler = () => {
    logoutAction();
    toaster.create({
      title: "Success",
      description: "Question created successfully!",
      type: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={4}
      h={"70px"}
      w="100%"
      bgColor={"gray.100"}
      position={"fixed"}
      top={0}
      left={0}
      zIndex={100}
    >
      {isAuthenticated && (
        <Stack direction="row" gap={5}>
          <ChakraLink as={RouterLink} to="/">
            Home
          </ChakraLink>
          <ChakraLink as={RouterLink} to="/answers">
            Submitted Answer Sets
          </ChakraLink>
        </Stack>
      )}

      <Stack
        direction="row"
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={5}
      >
        <Text fontWeight={"bold"} fontSize={"xl"}>
          {user?.name?.firstName} {user?.name?.lastName}{" "}
          {user && `(${user?.role})`}
        </Text>
        {isAuthenticated && <Button onClick={logoutHandler}>Logout</Button>}
      </Stack>
    </Box>
  );
};

export default NavBar;
