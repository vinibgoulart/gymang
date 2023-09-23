import { waitFor, screen } from '@testing-library/react';

export const waitForText = async (text: string) => {
  await waitFor(() => {
    expect(screen.getByText(text)).toBeInTheDocument();
  });
};
