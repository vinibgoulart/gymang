import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    neutral: {
      light: '#F7FAFC',
      semiLight: '#EDF2F7',
      main: '#E2E8F0',
    },
    primary: {
      light: "#B276D5",
      main: "#954FC9",
      dark: "#7536B0",
    },
    text: {
      light: "#718096",
      main: "#1A202C",
    },
  },
});
