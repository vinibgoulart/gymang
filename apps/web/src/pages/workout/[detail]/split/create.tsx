import type { GetServerSideProps } from 'next';
import type { ReactNode } from 'react';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type { createWorkoutSplitQuery } from '../../../../../__generated__/createWorkoutSplitQuery.graphql';
import createWorkoutSplitPreloadedQuery from '../../../../../__generated__/createWorkoutSplitQuery.graphql';
import { PageHeader } from '../../../../components/PageHeader';
import { WorkoutSplitAddForm } from '../../../../components/workoutSplit/WorkoutSplitAddForm';
import { RootLayout } from '../../../../layouts/RootLayout';
import { getPreloadedQuery } from '../../../../relay/network';

type CreateWorkoutSplitProps = {
  children: ReactNode;
  preloadedQueries: {
    detailWorkout: PreloadedQuery<createWorkoutSplitQuery>;
  };
};

const CreateWorkoutSplit = ({ ...props }: CreateWorkoutSplitProps) => {
  const query = usePreloadedQuery<createWorkoutSplitQuery>(
    graphql`
      query createWorkoutSplitQuery($id: ID!) @preloadable {
        workout: node(id: $id) {
          ... on Workout {
            id
            name
            ...WorkoutSplitAddForm_workout
          }
        }
      }
    `,
    props.preloadedQueries.detailWorkout,
  );

  if (!query.workout) {
    return <RootLayout>Treino não encontrado</RootLayout>;
  }

  const { workout } = query;

  return (
    <RootLayout>
      <PageHeader title={workout.name} subtitle={'Adicionar divisão'} />
      <WorkoutSplitAddForm workout={query.workout} />
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { detail } = context.query;

  return {
    props: {
      preloadedQueries: {
        detailWorkout: await getPreloadedQuery(
          createWorkoutSplitPreloadedQuery,
          {
            id: detail,
          },
          context,
        ),
      },
    },
  };
};

export default CreateWorkoutSplit;
