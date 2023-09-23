import { act } from '@testing-library/react';
import { MockPayloadGenerator } from 'relay-test-utils';
import type { MockResolvers } from 'relay-test-utils/lib/RelayMockPayloadGenerator';
import type { RelayMockEnvironment } from 'relay-test-utils/lib/RelayModernMockEnvironment';

import { getOperationName } from './relay/getOperationName';

const isDebug = process.env.DEBUG === 'true';

export const resolveMostRecentOperation = (
  environment: RelayMockEnvironment,
  customMockResolvers: MockResolvers,
  debug = isDebug,
) => {
  try {
    act(() => {
      environment.mock.resolveMostRecentOperation((operation) => {
        if (debug) {
          // eslint-disable-next-line
          console.log(getOperationName(operation));
        }

        return MockPayloadGenerator.generate(operation, customMockResolvers);
      });
    });
  } catch (error) {
    Error.captureStackTrace(error as Error, resolveMostRecentOperation);

    throw error;
  }
};
