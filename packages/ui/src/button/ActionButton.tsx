import { Button, ButtonProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
} & ButtonProps;

export const ActionButton = ({ children, ...props }: Props) => {
  return (
    <Button
      bgGradient="linear(to-r, primary.light, primary.dark)"
      color={"white"}
      _hover={{
        boxShadow: "xl",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
