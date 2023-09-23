import { screen } from '@testing-library/react';

export const assertText = (text: string) => {
  try {
    expect(screen.getByText(text)).toBeTruthy();
  } catch (error) {
    Error.captureStackTrace(error as Error, assertText)

    throw error
  }
};
