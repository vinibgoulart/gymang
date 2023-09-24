import type { GetServerSideProps } from 'next';
import type { PreloadedQuery} from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type {
  DetailWorkoutQuery,
} from '../../../__generated__/DetailWorkoutQuery.graphql';
import DetailWorkoutPreloadedQuery from '../../../__generated__/DetailWorkoutQuery.graphql';
import { PageHeader } from '../../components/PageHeader';
import { WorkoutDetail } from '../../components/workout/WorkoutDetail';
import { RootLayout } from '../../layouts/RootLayout';
import { getPreloadedQuery } from '../../relay/network';

type DetailWorkoutProps = {
  preloadedQueries: {
    detailWorkout: PreloadedQuery<DetailWorkoutQuery>;
  };
};

const DetailWorkout = (props: DetailWorkoutProps) => {
  const query = usePreloadedQuery<DetailWorkoutQuery>(
    graphql`
      query DetailWorkoutQuery($id: ID!) @preloadable {
        workout: node(id: $id) {
          ... on Workout {
            name
            description
            ...WorkoutDetail_workout
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
      <PageHeader title={workout.name} subtitle={workout.description} />
      <WorkoutDetail workout={query.workout} />
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
          },
          context,
        ),
      },
    },
  };
};

export default DetailWorkout;
