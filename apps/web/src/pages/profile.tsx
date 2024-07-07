import { Stack } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type { profileQuery } from '../../__generated__/profileQuery.graphql';
import profilePreloadedQuery from '../../__generated__/profileQuery.graphql';
import { PageHeader } from '../components/PageHeader';
import { UserProfile } from '../components/user/UserProfile';
import { RootLayout } from '../layouts/RootLayout';
import { getPreloadedQuery } from '../relay/network';

type ProfileProps = {
  preloadedQueries: {
    profile: PreloadedQuery<profileQuery>;
  };
};

const Profile = (props: ProfileProps) => {
  const router = useRouter();

  const query = usePreloadedQuery<profileQuery>(
    graphql`
      query profileQuery @preloadable {
        me {
          ...UserProfile_user
        }
      }
    `,
    props.preloadedQueries.profile,
  );

  const breadcrumbs = [
    {
      label: 'Perfil',
      onClick: () => {
        router.push('/profile');
      },
    },
  ];

  if (!query.me) {
    return null;
  }

  return (
    <RootLayout>
      <PageHeader title={'Perfil'} breadcrumbs={breadcrumbs} />
      <Stack spacing={4}>
        <UserProfile user={query.me} />
      </Stack>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      preloadedQueries: {
        profile: await getPreloadedQuery(profilePreloadedQuery, {}, context),
      },
    },
  };
};

export default Profile;
