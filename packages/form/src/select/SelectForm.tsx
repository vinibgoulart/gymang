import { Select, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  placeholder: string;
  options: Option[];
};

export const SelectForm = ({ name, placeholder, options }: Props) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();
  const [currentValue, setCurrentValue] = useState<string>(getValues(name));

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

  const handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    setValue(name, value);
    setCurrentValue(value);
  };

  const dataTestIdInputProps = {
    'data-testid': `${name}`,
  };

  const textInputProps = {
    ...dataTestIdInputProps,
    ...getErrorProps(),
  };

  const getColor = () => {
    if (currentValue) {
      return { color: 'text.main' };
    }

    return { color: 'text.light' };
  };

  return (
    <Stack spacing={1}>
      <Select
        bg={'white'}
        id={name}
        placeholder={placeholder}
        {...getColor()}
        {...register(name)}
        onChange={handleChange}
        {...textInputProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error ? (
        <Text color="error.main" fontSize="sm">
          {error}
        </Text>
      ) : null}
    </Stack>
  );
};
