import { Input, Stack, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  label?: string;
  placeholder: string;
  type?: string;
}

export function TextForm({ name, placeholder, type = 'text' }: Props) {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const error = errors[name]?.message;

  const getErrorProps = () => {
    if (!error) {
      return {};
    }

    if (typeof error === 'string') {
      return {
        error: Boolean(error),
        isInvalid: true,
        errorBorderColor: 'red.500',
      };
    }

    return {};
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setValue(name, value);
  };

  const dataTestIdInputProps = {
    'data-testid': `${name}`,
  };

  const textInputProps = {
    ...dataTestIdInputProps,
    ...getErrorProps(),
  };

  return (
    <Stack spacing={1}>
      <Input
        _placeholder={{
          color: 'text.light',
        }}
        bg="neutral.semiLight"
        color="text.main"
        id={name}
        placeholder={placeholder}
        type={type}
        {...register(name)}
        onChange={handleChange}
        {...textInputProps}
      />
      {error ? (
        <Text color="error.main" fontSize="sm">
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}
