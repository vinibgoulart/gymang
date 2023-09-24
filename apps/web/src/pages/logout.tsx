import { Box, Heading } from '@chakra-ui/react';
import { useMutationCallbacks } from '@gymang/relay';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import {
  usePreloadedQuery,
  type PreloadedQuery,
  type UseMutationConfig,
  graphql,
} from 'react-relay';

import type {
  logoutQuery,
} from '../../__generated__/logoutQuery.graphql';
import logoutPreloadedQuery from '../../__generated__/logoutQuery.graphql';
import type { UserLogoutMutation } from '../../__generated__/UserLogoutMutation.graphql';
import { UserLogout } from '../components/user/mutations/UserLogoutMutation';
import { RootLayout } from '../layouts/RootLayout';
import { getPreloadedQuery } from '../relay/network';

type LogoutProps = {
  preloadedQueries: {
    logout: PreloadedQuery<logoutQuery>;
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
      <Heading size="xl">
        Saindo...
      </Heading>
    </Box>
  );
};

Logout.getLayout = function useGetLayout(
  page: ReactElement,
  props: LogoutProps,
) {
  const query = usePreloadedQuery<logoutQuery>(
    graphql`
      query logoutQuery @preloadable {
        ...RootLayoutWorkouts_query
        me {
          ...RootLayout_me
        }
      }
    `,
    props.preloadedQueries.logout,
  );

  return (
    <RootLayout me={query.me} workouts={query}>
      {page}
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      preloadedQueries: {
        logout: await getPreloadedQuery(logoutPreloadedQuery, {}, context),
      },
    },
  };
};

export default Logout;
