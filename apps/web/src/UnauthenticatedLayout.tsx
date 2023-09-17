import { Theme } from "@gymang/ui";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const UnauthenticatedLayout = ({ children }: Props) => {
  return <Theme>{children}</Theme>;
};
