import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import AuthProvider from "./context/AuthProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import QuestionProvider from "./context/QuestionProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <AuthProvider>
          <QuestionProvider>
            <App />
          </QuestionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
