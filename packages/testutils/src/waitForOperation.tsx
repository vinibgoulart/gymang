import { waitFor } from '@testing-library/react';
import type { RelayMockEnvironment } from 'relay-test-utils/lib/RelayModernMockEnvironment';

export const waitForOperation = async (environment: RelayMockEnvironment) => {
  try {
    await waitFor(() => environment.mock.getMostRecentOperation());
  } catch (error) {
    Error.captureStackTrace(error as Error, waitForOperation);

    throw error;
  }
};
