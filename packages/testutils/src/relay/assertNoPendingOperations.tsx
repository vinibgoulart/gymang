import type { RelayMockEnvironment } from 'relay-test-utils/lib/RelayModernMockEnvironment';

export const assertNoPendingOperations = (
  environment: RelayMockEnvironment,
) => {
  const operations = environment.mock.getAllOperations();

  expect(operations.length).toBe(0);
};
