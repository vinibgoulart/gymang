import {
  assertAndResolveMostRecentOperation,
  assertText,
  waitForOperation,
} from '@gymang/testutils';
import { render } from '@testing-library/react';
import { createMockEnvironment } from 'relay-test-utils';

import type { UserLogoutMutation } from '../../../__generated__/UserLogoutMutation.graphql';
import { WithProvider } from '../../../test/withProviders';
import Logout from '../logout';

it('should render logout page and call mutation', async () => {
  const environment = createMockEnvironment();

  render(
    <WithProvider relayEnvironment={environment}>
      <Logout />
    </WithProvider>,
  );

  const customMockResolvers = {
    UserLogoutPayload: () => ({
      success: 'Logout',
      error: null,
    }),
  };

  assertText('Saindo...');

  await waitForOperation(environment);

  assertAndResolveMostRecentOperation<UserLogoutMutation>(
    environment,
    {
      name: 'UserLogoutMutation',
      variables: {
        input: {},
      },
    },
    customMockResolvers,
  );
});
