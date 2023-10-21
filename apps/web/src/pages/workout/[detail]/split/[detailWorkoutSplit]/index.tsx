import { Stack, useDisclosure } from '@chakra-ui/react';
import { ActionButton } from '@gymang/ui';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type { DetailWorkoutSplitQuery } from '../../../../../../__generated__/DetailWorkoutSplitQuery.graphql';
import DetailWorkoutSplitPreloadedQuery from '../../../../../../__generated__/DetailWorkoutSplitQuery.graphql';
import { ExerciseAddModalForm } from '../../../../../components/exercise/ExerciseAddModalForm';
import { ExerciseTable } from '../../../../../components/exercise/ExerciseTable';
import { PageHeader } from '../../../../../components/PageHeader';
import { WorkoutDuplicateButton } from '../../../../../components/workout/duplicate/WorkoutDuplicateButton';
import { WorkoutSplitDetail } from '../../../../../components/workoutSplit/WorkoutSplitDetail';
import { WorkoutSplitInProgressTime } from '../../../../../components/workoutSplit/WorkoutSplitInProgressTime';
import { RootLayout } from '../../../../../layouts/RootLayout';
import { getPreloadedQuery } from '../../../../../relay/network';

type DetailWorkoutSplitProps = {
  preloadedQueries: {
    detailWorkout: PreloadedQuery<DetailWorkoutSplitQuery>;
  };
};

const DetailWorkoutSplit = (props: DetailWorkoutSplitProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const query = usePreloadedQuery<DetailWorkoutSplitQuery>(
    graphql`
      query DetailWorkoutSplitQuery($id: ID!, $exerciseFilters: ExerciseFilter)
      @preloadable {
        workoutSplit: node(id: $id) {
          ... on WorkoutSplit {
            id
            name
            workout {
              id
              name
              user {
                id
              }
              ...WorkoutDuplicateButton_workout
            }
            ...WorkoutSplitInProgressTime_workoutSplit
            ...WorkoutSplitDetail_workoutSplit
            ...ExerciseAddModalForm_workoutSplit
          }
        }
        me {
          id
          ...WorkoutSplitDetail_user
          ...WorkoutSplitInProgressTime_user
        }
        ...ExerciseTable_query @arguments(filters: $exerciseFilters)
      }
    `,
    props.preloadedQueries.detailWorkout,
  );

  if (!query.workoutSplit) {
    return <RootLayout>Divisão não encontrada</RootLayout>;
  }

  const { workoutSplit } = query;

  const isMine = workoutSplit.workout.user.id === query.me.id;

  const getActions = () => {
    if (!isMine) {
      return <WorkoutDuplicateButton workout={workoutSplit.workout} />;
    }

    return (
      <>
        <ActionButton onClick={onOpen}>Adicionar exercicio</ActionButton>
        {isOpen && (
          <ExerciseAddModalForm
            isOpen={isOpen}
            onClose={onClose}
            workoutSplit={workoutSplit}
          />
        )}
      </>
    );
  };

  const tabs = [
    {
      label: 'Exercícios',
      link: `/workout/${workoutSplit.workout.id}/split/${workoutSplit.id}`,
    },
    {
      label: 'Ajustes',
      link: `/workout/${workoutSplit.workout.id}/split/${workoutSplit.id}/settings`,
      hidden: workoutSplit.workout.user.id !== query.me.id,
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
      label: workoutSplit.workout.name,
      onClick: () => {
        router.push(`/workout/${workoutSplit.workout.id}`);
      },
    },
    {
      label: workoutSplit.name,
      onClick: () => {
        router.push(
          `/workout/${workoutSplit.workout.id}/split/${workoutSplit.id}`,
        );
      },
    },
  ];

  return (
    <RootLayout>
      <PageHeader
        title={workoutSplit.name}
        actions={getActions()}
        tabs={tabs}
        breadcrumbs={breadcrumbs}
      />
      <Stack spacing={4}>
        <WorkoutSplitDetail workoutSplit={query.workoutSplit} user={query.me} />
        <WorkoutSplitInProgressTime
          workoutSplit={query.workoutSplit}
          user={query.me}
        />
        <ExerciseTable query={query} />
      </Stack>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { detailWorkoutSplit } = context.query;

  return {
    props: {
      preloadedQueries: {
        detailWorkout: await getPreloadedQuery(
          DetailWorkoutSplitPreloadedQuery,
          {
            id: detailWorkoutSplit,
            exerciseFilters: {
              workoutSplit: detailWorkoutSplit,
            },
          },
          context,
        ),
      },
    },
  };
};

export default DetailWorkoutSplit;
