import { Stack, StackProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
} & StackProps;

export const Card = ({ children, ...props }: Props) => {
  return (
    <Stack
      bg={"neutral.light"}
      rounded={"xl"}
      p={6}
      {...props}
    >
      {children}
    </Stack>
  );
};
