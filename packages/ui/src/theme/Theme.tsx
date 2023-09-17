import { ReactNode } from "react";
import { theme } from "../theme";
import { ChakraProvider } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
};

export const Theme = ({ children }: Props) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
