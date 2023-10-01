import { Stack } from '@chakra-ui/react';
import { ActionButton } from '@gymang/ui';
import type { GetServerSideProps } from 'next';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type { DetailWorkoutQuery } from '../../../../__generated__/DetailWorkoutQuery.graphql';
import DetailWorkoutPreloadedQuery from '../../../../__generated__/DetailWorkoutQuery.graphql';
import { PageHeader } from '../../../components/PageHeader';
import { WorkoutData } from '../../../components/workout/WorkoutData';
import { WorkoutDetail } from '../../../components/workout/WorkoutDetail';
import { RootLayout } from '../../../layouts/RootLayout';
import { getPreloadedQuery } from '../../../relay/network';

type DetailWorkoutProps = {
  preloadedQueries: {
    detailWorkout: PreloadedQuery<DetailWorkoutQuery>;
  };
};

const DetailWorkout = (props: DetailWorkoutProps) => {
  const query = usePreloadedQuery<DetailWorkoutQuery>(
    graphql`
      query DetailWorkoutQuery(
        $id: ID!
        $workoutSplitFilters: WorkoutSplitFilter
      ) @preloadable {
        workout: node(id: $id) {
          ... on Workout {
            id
            name
            ...WorkoutDetail_workout
            ...WorkoutData_workout
          }
        }
        ...WorkoutData_query @arguments(filters: $workoutSplitFilters)
      }
    `,
    props.preloadedQueries.detailWorkout,
  );

  if (!query.workout) {
    return <RootLayout>Treino não encontrado</RootLayout>;
  }

  const { workout } = query;

  const actions = (
    <>
      <ActionButton link={`/workout/${workout.id}/split/create`}>
        Adicionar divisão
      </ActionButton>
    </>
  );

  return (
    <RootLayout>
      <PageHeader title={workout.name} actions={actions} />
      <Stack spacing={4}>
        <WorkoutDetail workout={query.workout} />
        <WorkoutData query={query} workout={workout} />
      </Stack>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { detail } = context.query;

  return {
    props: {
      preloadedQueries: {
        detailWorkout: await getPreloadedQuery(
          DetailWorkoutPreloadedQuery,
          {
            id: detail,
            workoutSplitFilters: {
              workout: detail,
            },
          },
          context,
        ),
      },
    },
  };
};

export default DetailWorkout;
