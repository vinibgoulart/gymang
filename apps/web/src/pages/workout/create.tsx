import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay';

import type { createWorkoutQuery } from '../../../__generated__/createWorkoutQuery.graphql';
import createWorkoutPreloadedQuery from '../../../__generated__/createWorkoutQuery.graphql';
import { PageHeader } from '../../components/PageHeader';
import { WorkoutAddForm } from '../../components/workout/WorkoutAddForm';
import { RootLayout } from '../../layouts/RootLayout';
import { getPreloadedQuery } from '../../relay/network';

type CreateWorkoutProps = {
  preloadedQueries: {
    createWorkout: PreloadedQuery<createWorkoutQuery>;
  };
};

const CreateWorkout = () => {
  return <WorkoutAddForm />;
};

CreateWorkout.getLayout = function useGetLayout(
  page: ReactElement,
  props: CreateWorkoutProps,
) {
  const query = usePreloadedQuery<createWorkoutQuery>(
    graphql`
      query createWorkoutQuery @preloadable {
        ...RootLayoutWorkouts_query
        me {
          ...RootLayout_me
        }
      }
    `,
    props.preloadedQueries.createWorkout,
  );

  return (
    <RootLayout me={query.me} workouts={query}>
      <PageHeader title="Adicionar treino" />
      {page}
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      preloadedQueries: {
        createWorkout: await getPreloadedQuery(
          createWorkoutPreloadedQuery,
          {},
          context,
        ),
      },
    },
  };
};

export default CreateWorkout;
