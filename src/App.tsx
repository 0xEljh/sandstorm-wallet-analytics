import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./themes/brandTheme";
import AppRouter from "./pages/router";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AppRouter />
    </ChakraProvider>
  );
}

export default App;
