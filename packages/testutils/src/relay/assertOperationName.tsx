import type { RelayMockEnvironment } from 'relay-test-utils/lib/RelayModernMockEnvironment';

import { getOperationName } from './getOperationName';

const isDebug = process.env.DEBUG === 'true';

export const assertOperationName = (
  environment: RelayMockEnvironment,
  name: string,
  debug = isDebug,
) => {
  const queryOperation = environment.mock.getMostRecentOperation();

  const operationName = getOperationName(queryOperation);

  // prefer DEBUG=true
  if (debug) {
    // eslint-disable-next-line
    console.log(operationName);
  }

  expect(operationName).toBe(name);
};
