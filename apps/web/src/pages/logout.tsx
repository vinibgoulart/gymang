import { Box, Heading } from '@chakra-ui/react';
import { useMutationCallbacks } from '@gymang/relay';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { type UseMutationConfig } from 'react-relay';

import type { UserLogoutMutation } from '../../__generated__/UserLogoutMutation.graphql';
import { UserLogout } from '../components/user/mutations/UserLogoutMutation';

const Logout = () => {
  const router = useRouter();

  const [logout, isPending] = useMutationCallbacks<UserLogoutMutation>({
    name: 'UserLogout',
    mutation: UserLogout,
    afterCompleted: ({ UserLogout }) => {
      if (UserLogout?.success) {
        router.push('/login');
      }
    },
  });

  const onMount = () => {
    if (isPending) {
      return;
    }

    const config: UseMutationConfig<UserLogoutMutation> = {
      variables: {
        input: {},
      },
    };

    logout(config);
  };

  useEffect(onMount, []);

  return (
    <Box textAlign="center" p={10}>
      <Heading size="xl">Saindo...</Heading>
    </Box>
  );
};

export default Logout;
