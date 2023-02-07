import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  tab: {
    fontWeight: "semibold", // change the font weight
  },
  tabpanel: {
    fontFamily: "mono", // change the font family
  },
});

// define custom sizes
const sizes = {
  xl: definePartsStyle({
    // define the parts that will change for each size
    tab: {
      fontSize: "xl",
      py: "4",
      px: "6",
    },
    tabpanel: {
      py: "4",
      px: "6",
    },
  }),
};

// define custom variants
const colorfulVariant = definePartsStyle((props) => {
  const { colorScheme: c } = props; // add colorScheme as a prop

  return {
    tab: {
      border: "2px solid",
      borderColor: "transparent",
      bg: "brand.0",
      borderTopRadius: "lg",
      borderBottom: "none",
      _selected: {
        bg: "brand.0",
        color: "brand.100",
        borderColor: "inherit",
        borderBottom: "none",
        mb: "-2px",
      },
    },
    tablist: {
      borderBottom: "2x solid",
      borderColor: "inherit",
      color: "brand.200",
    },
    tabpanel: {
      border: "2px solid",
      borderColor: "inherit",
      borderBottomRadius: "lg",
      borderTopRightRadius: "lg",
    },
  };
});

const variants = {
  colorful: colorfulVariant,
};

// define which sizes, variants, and color schemes are applied by default
const defaultProps = {
  size: "xl",
  variant: "colorful",
};

// export the component theme
export const tabsTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  // @ts-expect-error
  defaultProps,
});
