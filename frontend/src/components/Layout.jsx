import React from "react";
import NavBar from "./NavBar";
import { Box } from "@chakra-ui/react";
import { Toaster } from "../components/ui/toaster";

const Layout = ({ children }) => {
  return (
    <Box
      minH="100vh"
      w="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <NavBar />
      <Toaster />
      <Box flex="1" mt="60px" overflowY="auto">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
