import { screen, waitForElementToBeRemoved } from '@testing-library/react';

export const waitLoading = async (queryName = 'queryByTestId') => {
  await waitForElementToBeRemoved(screen[queryName]('loading'), {
    timeout: 20000,
  });
}