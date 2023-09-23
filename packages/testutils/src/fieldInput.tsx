import { fireEvent, screen } from '@testing-library/react';

export const fieldInput = (name: string, value: string) => {
  try {
    const input = screen.getByTestId(name);

    fireEvent.change(input, { target: { value } });
    fireEvent.blur(input);
  } catch (error) {
    Error.captureStackTrace(error as Error, fieldInput);

    throw error;
  }
};
