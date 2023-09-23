import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    neutral: {
      light: '#F7FAFC',
      semiLight: '#EDF2F7',
      main: '#E2E8F0',
    },
    primary: {
      light: "#a2a2ff",
      main: "#8c82fc",
      dark: "#755ef6",
    },
    text: {
      light: "#718096",
      main: "#1A202C",
    },
    error: {
      main: "#F56565",
    },
  },
});
