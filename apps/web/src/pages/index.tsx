import { Stack, Text } from '@chakra-ui/react';
import { DIRECTION, WORKOUT_SPLIT_SORT } from '@gymang/enums';
import { ActionButton, Section } from '@gymang/ui';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type { pagesQuery } from '../../__generated__/pagesQuery.graphql';
import pagesPreloadedQuery from '../../__generated__/pagesQuery.graphql';
import { PageHeader } from '../components/PageHeader';
import { WorkoutGridList } from '../components/workout/WorkoutGridList';
import { WorkoutSplitGridList } from '../components/workoutSplit/WorkoutSplitGridList';
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
      query pagesQuery(
        $workoutFilters: WorkoutFilter
        $workoutSplitFilters: WorkoutSplitFilter
      ) @preloadable {
        ...WorkoutGridList_query @arguments(first: 6, filters: $workoutFilters)
        ...WorkoutSplitGridList_query
          @arguments(first: 6, filters: $workoutSplitFilters)
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

        <Section title="Ultimas execuções">
          <WorkoutSplitGridList query={query} />
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
            workoutSplitFilters: {
              orderBy: [
                {
                  direction: DIRECTION.DESC,
                  sort: WORKOUT_SPLIT_SORT.executedAt,
                },

                {
                  direction: DIRECTION.DESC,
                  sort: WORKOUT_SPLIT_SORT.createdAt,
                },
              ],
            },
          },
          context,
        ),
      },
    },
  };
};

export default Home;
