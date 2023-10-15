import { Stack, useDisclosure } from '@chakra-ui/react';
import { ActionButton } from '@gymang/ui';
import type { GetServerSideProps } from 'next';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type { DetailWorkoutSplitQuery } from '../../../../../../__generated__/DetailWorkoutSplitQuery.graphql';
import DetailWorkoutSplitPreloadedQuery from '../../../../../../__generated__/DetailWorkoutSplitQuery.graphql';
import { ExerciseAddModalForm } from '../../../../../components/exercise/ExerciseAddModalForm';
import { ExerciseTable } from '../../../../../components/exercise/ExerciseTable';
import { PageHeader } from '../../../../../components/PageHeader';
import { WorkoutSplitDetail } from '../../../../../components/workoutSplit/WorkoutSplitDetail';
import { RootLayout } from '../../../../../layouts/RootLayout';
import { getPreloadedQuery } from '../../../../../relay/network';

type DetailWorkoutSplitProps = {
  preloadedQueries: {
    detailWorkout: PreloadedQuery<DetailWorkoutSplitQuery>;
  };
};

const DetailWorkoutSplit = (props: DetailWorkoutSplitProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            }
            ...WorkoutSplitDetail_workoutSplit
            ...ExerciseAddModalForm_workoutSplit
          }
        }
        me {
          ...WorkoutSplitDetail_user
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

  const actions = (
    <>
      <ActionButton variant={'outline'} onClick={onOpen}>
        Adicionar exercicio
      </ActionButton>
      <ActionButton>Iniciar treino</ActionButton>
      {isOpen && (
        <ExerciseAddModalForm
          isOpen={isOpen}
          onClose={onClose}
          workoutSplit={workoutSplit}
        />
      )}
    </>
  );

  const tabs = [
    {
      label: 'Exercícios',
      link: `/workout/${workoutSplit.workout.id}/split/${workoutSplit.id}`,
    },
    {
      label: 'Ajustes',
      link: `/workout/${workoutSplit.workout.id}/split/${workoutSplit.id}/settings`,
    },
  ];

  return (
    <RootLayout>
      <PageHeader
        title={workoutSplit.workout.name}
        subtitle={workoutSplit.name}
        actions={actions}
        tabs={tabs}
      />
      <Stack spacing={4}>
        <WorkoutSplitDetail workoutSplit={query.workoutSplit} user={query.me} />
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
