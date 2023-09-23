import type { MockResolvers } from 'relay-test-utils/lib/RelayMockPayloadGenerator';
import type { RelayMockEnvironment } from 'relay-test-utils/lib/RelayModernMockEnvironment';

import type { OperationType } from './assertOperation';
import { assertOperation } from './assertOperation';
import { resolveMostRecentOperation } from '../resolveMostRecentOperation';

const isDebug = process.env.DEBUG === 'true';

export const assertAndResolveMostRecentOperation = <T extends OperationType>(
  environment: RelayMockEnvironment,
  operation: { name: string; variables?: T['variables'] },
  customMockResolvers: MockResolvers,
  debug = isDebug,
) => {
  try {
    assertOperation<T>(environment, operation.name, operation.variables, debug);

    resolveMostRecentOperation(environment, customMockResolvers, debug);
  } catch (error) {
    Error.captureStackTrace(error as Error, assertAndResolveMostRecentOperation);

    throw error;
  }
};
