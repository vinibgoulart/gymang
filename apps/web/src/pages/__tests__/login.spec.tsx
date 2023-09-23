import {
  assertAndResolveMostRecentOperation,
  assertText,
  fieldInput,
  waitForOperation,
} from '@gymang/testutils';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMockEnvironment } from 'relay-test-utils';

import type { UserLoginMutation } from '../../../__generated__/UserLoginMutation.graphql';
import { WithProvider } from '../../../test/withProviders';
import Login from '../login';

it('should render login page with form', async () => {
  render(
    <WithProvider>
      <Login />
    </WithProvider>,
  );

  assertText('Entre nessa jornada');
  assertText('Entrar');
  assertText('Não tenho uma conta');

  expect(screen.getByText('Não tenho uma conta')).toHaveAttribute(
    'href',
    '/register',
  );
});

it('should render login page with form and call mutation', async () => {
  const environment = createMockEnvironment();

  render(
    <WithProvider relayEnvironment={environment}>
      <Login />
    </WithProvider>,
  );

  const firstName = 'Vinicius';
  const email = 'vinicius@gymang.com';
  const password = '123456';

  const customMockResolvers = {
    UserLoginPayload: () => ({
      me: {
        firstName,
        email,
      },
      success: 'Success',
      error: null,
    }),
  };

  fieldInput('email', email);
  fieldInput('password', password);

  const sendButton = screen.getByText('Entrar');

  expect(sendButton).toBeEnabled();

  fireEvent.click(sendButton);

  await waitForOperation(environment);

  assertAndResolveMostRecentOperation<UserLoginMutation>(
    environment,
    {
      name: 'UserLoginMutation',
      variables: {
        input: {
          email,
          password,
        },
      },
    },
    customMockResolvers,
  );
});
