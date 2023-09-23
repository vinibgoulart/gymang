import {
  assertAndResolveMostRecentOperation,
  assertText,
  fieldInput,
  waitForOperation,
} from '@gymang/testutils';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMockEnvironment } from 'relay-test-utils';

import type { UserAddMutation } from '../../../__generated__/UserAddMutation.graphql';
import { WithProvider } from '../../../test/withProviders';
import Register from '../register';

it('should render register page with form', async () => {
  render(
    <WithProvider>
      <Register />
    </WithProvider>,
  );

  assertText('Entre nessa jornada');
  assertText('Cadastre-se');
  assertText('Já tenho uma conta');

  expect(screen.getByText('Já tenho uma conta')).toHaveAttribute(
    'href',
    '/login',
  );
});

it('should render register page with form and call mutation', async () => {
  const environment = createMockEnvironment();

  render(
    <WithProvider relayEnvironment={environment}>
      <Register />
    </WithProvider>,
  );

  const firstName = 'Vinicius';
  const email = 'vinicius@gymang.com';
  const password = '123456';

  const customMockResolvers = {
    UserRegisterPayload: () => ({
      me: {
        firstName,
        email,
      },
      success: 'Success',
      error: null,
    }),
  };

  fieldInput('firstName', firstName);
  fieldInput('email', email);
  fieldInput('password', password);
  fieldInput('confirm', password);

  const sendButton = screen.getByText('Cadastre-se');

  expect(sendButton).toBeEnabled();

  fireEvent.click(sendButton);

  await waitForOperation(environment);

  assertAndResolveMostRecentOperation<UserAddMutation>(
    environment,
    {
      name: 'UserAddMutation',
      variables: {
        input: {
          firstName,
          email,
          password,
        },
      },
    },
    customMockResolvers,
  );
});
