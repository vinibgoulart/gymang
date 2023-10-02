import { HStack, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  options: Option[];
};

export const RadioForm = ({ name, options }: Props) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
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

  const handleChange = (value: string) => {
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
      <RadioGroup
        onChange={handleChange}
        {...getErrorProps()}
        {...textInputProps}
        value={getValues(name)}
      >
        <HStack>
          {options.map((option) => (
            <Radio
              value={option.value}
              colorScheme={'purple'}
              {...register(name)}
            >
              {option.label}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>
      {error ? (
        <Text color="error.main" fontSize="sm">
          {error}
        </Text>
      ) : null}
    </Stack>
  );
};
