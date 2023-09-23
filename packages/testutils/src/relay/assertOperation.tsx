import type { RelayMockEnvironment } from 'relay-test-utils/lib/RelayModernMockEnvironment';

import { getOperationName } from './getOperationName';
import { getOperationVariables } from './getOperationVariables';

export type OperationType = {
  variables: Record<string, unknown>;
};

const isDebug = process.env.DEBUG === 'true';

export const assertOperation = <T extends OperationType>(
  environment: RelayMockEnvironment,
  name: string,
  variables: T['variables'] = {},
  debug = isDebug,
) => {
  const queryOperation = environment.mock.getMostRecentOperation();

  const operationName = getOperationName(queryOperation);
  const operationVariables = getOperationVariables(queryOperation);

  // prefer DEBUG=true
  if (debug) {
    // eslint-disable-next-line
    console.log(operationName);
  }

  try {
    expect(operationName).toBe(name);
    expect(operationVariables).toEqual(variables);
  } catch (error) {
    Error.captureStackTrace(error as Error, assertOperation);

    throw error;
  }
};
