import { Input } from "@chakra-ui/react";

type Props = {
  name: string;
  label?: string;
  placeholder: string;
  type?: string;
};

export const TextForm = ({
  name,
  label,
  placeholder,
  type = "text",
}: Props) => {
  return (
    <Input
      bg={"neutral.semiLight"}
      color={"text.main"}
      _placeholder={{
        color: "text.light",
      }}
      name={name}
      placeholder={placeholder}
      type={type}
    />
  );
};
