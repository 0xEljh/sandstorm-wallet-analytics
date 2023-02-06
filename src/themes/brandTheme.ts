import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      0: "#000000",
      100: "#37E6AF",
      200: "#3B7080",
      300: "#A23B50",
      400: "#FFFFFF",
    },
  },
  styles: {
    global: {
      body: {
        bg: "brand.0",
        color: "brand.100",
        lineHeight: "tall",
      },
      a: {
        color: "teal.500",
      },
    },
  },
});
