import { fireEvent, screen } from '@testing-library/react';
export const checkboxCheck = (name: string) => {
  const checkbox = screen.getByTestId(name);

  fireEvent.click(checkbox);
};
