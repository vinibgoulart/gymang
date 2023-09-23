import { Box, Heading } from '@chakra-ui/react';
import { useMutationCallbacks } from '@gymang/relay';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import type { ReactElement} from 'react';
import { useEffect } from 'react';
import type { PreloadedQuery, UseMutationConfig } from 'react-relay';

import type { UserLogoutMutation } from '../../__generated__/UserLogoutMutation.graphql';
import type {
  UserMeQuery,
} from '../../__generated__/UserMeQuery.graphql';
import UserMePreloadedQuery from '../../__generated__/UserMeQuery.graphql';
import { UserLogout } from '../components/user/mutations/UserLogoutMutation';
import { RootLayout } from '../layouts/RootLayout';
import { getPreloadedQuery } from '../relay/network';

type LogoutProps = {
  preloadedQueries: {
    me: PreloadedQuery<UserMeQuery>;
  };
};

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
      <Heading as="h2" size="xl">
        Saindo...
      </Heading>
    </Box>
  );
};

Logout.getLayout = function getLayout(page: ReactElement, props: LogoutProps) {
  return <RootLayout query={props.preloadedQueries.me}>{page}</RootLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      preloadedQueries: {
        me: await getPreloadedQuery(UserMePreloadedQuery, {}, context),
      },
    },
  };
};

export default Logout;
