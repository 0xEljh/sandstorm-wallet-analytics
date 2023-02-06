import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    fontFamily: "mono", // change the font family
    color: "brand.400", // change the input text color
    _placeholder: { color: "brand.200" }, // change the placeholder text color
  },
});

export const inputTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    // @ts-expect-error - focusBorderColor not on defaultProps
    focusBorderColor: "brand.100",
  },
});
