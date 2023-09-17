import { Header, Theme } from "@gymang/ui";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const RootLayout = ({ children }: Props) => {
  return (
    <Theme>
      <Header>{children}</Header>
    </Theme>
  );
};
