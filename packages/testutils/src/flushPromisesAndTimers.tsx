import { act } from '@testing-library/react';

export const flushPromisesAndTimers = (): Promise<void> => {
  return act(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, 100);
        jest.runAllTimers();
      }),
  );
};
