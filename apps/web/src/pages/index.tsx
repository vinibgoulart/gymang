import { Stack, Text } from '@chakra-ui/react';
import { ActionButton, Section } from '@gymang/ui';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type { pagesQuery } from '../../__generated__/pagesQuery.graphql';
import pagesPreloadedQuery from '../../__generated__/pagesQuery.graphql';
import { PageHeader } from '../components/PageHeader';
import { WorkoutGridList } from '../components/workout/WorkoutGridList';
import { RootLayout } from '../layouts/RootLayout';
import { getPreloadedQuery } from '../relay/network';

type HomeProps = {
  preloadedQueries: {
    home: PreloadedQuery<pagesQuery>;
  };
};

const Home = (props: HomeProps) => {
  const router = useRouter();

  const query = usePreloadedQuery<pagesQuery>(
    graphql`
      query pagesQuery($workoutFilters: WorkoutFilter) @preloadable {
        ...WorkoutGridList_query @arguments(first: 6, filters: $workoutFilters)
      }
    `,
    props.preloadedQueries.home,
  );

  const actions = (
    <>
      <ActionButton link="/workout/create">Adicionar treino</ActionButton>
    </>
  );

  const breadcrumbs = [
    {
      label: 'Home',
      onClick: () => {
        router.push('/');
      },
    },
  ];

  return (
    <RootLayout>
      <PageHeader
        title="Bem vindo!"
        actions={actions}
        breadcrumbs={breadcrumbs}
      />
      <Stack spacing={8}>
        <Text>O que iremos treinar hoje?</Text>

        <Section title="Meus treinos">
          <WorkoutGridList query={query} />
        </Section>
      </Stack>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      preloadedQueries: {
        home: await getPreloadedQuery(
          pagesPreloadedQuery,
          {
            workoutFilters: {
              fromLoggedUser: true,
              isPublic: null,
            },
          },
          context,
        ),
      },
    },
  };
};

export default Home;
