import { Stack } from '@chakra-ui/react';
import { ActionButton } from '@gymang/ui';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type { DetailWorkoutQuery } from '../../../../__generated__/DetailWorkoutQuery.graphql';
import DetailWorkoutPreloadedQuery from '../../../../__generated__/DetailWorkoutQuery.graphql';
import { PageHeader } from '../../../components/PageHeader';
import { WorkoutDuplicateButton } from '../../../components/workout/duplicate/WorkoutDuplicateButton';
import { WorkoutDetail } from '../../../components/workout/WorkoutDetail';
import { WorkoutSplitGridList } from '../../../components/workoutSplit/WorkoutSplitGridList';
import { RootLayout } from '../../../layouts/RootLayout';
import { getPreloadedQuery } from '../../../relay/network';

type DetailWorkoutProps = {
  preloadedQueries: {
    detailWorkout: PreloadedQuery<DetailWorkoutQuery>;
  };
};

const DetailWorkout = (props: DetailWorkoutProps) => {
  const router = useRouter();

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
            user {
              id
            }
            ...WorkoutDuplicateButton_workout
            ...WorkoutDetail_workout
            ...WorkoutSplitGridList_workout
          }
        }
        me {
          id
          ...WorkoutDetail_user
        }
        ...WorkoutSplitGridList_query @arguments(filters: $workoutSplitFilters)
      }
    `,
    props.preloadedQueries.detailWorkout,
  );

  if (!query.workout) {
    return <RootLayout>Treino não encontrado</RootLayout>;
  }

  const { workout } = query;

  const getActions = () => {
    if (workout.user.id !== query.me.id) {
      return <WorkoutDuplicateButton workout={workout} />;
    }

    return (
      <ActionButton link={`/workout/${workout.id}/split/create`}>
        Adicionar divisão
      </ActionButton>
    );
  };

  const tabs = [
    {
      label: 'Divisões',
      link: `/workout/${workout.id}`,
    },
    {
      label: 'Ajustes',
      link: `/workout/${workout.id}/settings`,
    },
  ];

  const breadcrumbs = [
    {
      label: 'Treinos',
      onClick: () => {
        router.push('/workout/list');
      },
    },
    {
      label: workout.name,
      onClick: () => {
        router.push(`/workout/${workout.id}`);
      },
    },
  ];

  return (
    <RootLayout>
      <PageHeader
        title={workout.name}
        actions={getActions()}
        tabs={tabs}
        breadcrumbs={breadcrumbs}
      />
      <Stack spacing={4}>
        <WorkoutDetail workout={query.workout} user={query.me} />
        <WorkoutSplitGridList query={query} workout={workout} />
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
