import { Theme } from '@gymang/ui';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import React from 'react';
import type { Environment as RelayEnvironment } from 'react-relay';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';

import { createMockRouter } from './createMockRouter';

const Environment = createMockEnvironment();

interface Props {
  children: React.ReactElement;
  relayEnvironment?: RelayEnvironment;
  router?: Record<string, unknown>;
}

export const WithProvider = ({
  children,
  relayEnvironment = Environment,
  router = {},
}: Props) => {
  const routerValue = createMockRouter(router);

  return (
    <RouterContext.Provider value={routerValue}>
      <RelayEnvironmentProvider environment={relayEnvironment}>
        <Theme>{children}</Theme>
      </RelayEnvironmentProvider>
    </RouterContext.Provider>
  );
};
