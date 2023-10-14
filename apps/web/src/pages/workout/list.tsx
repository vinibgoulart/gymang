import { Stack } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type {
  listWorkoutQuery,
} from '../../../__generated__/listWorkoutQuery.graphql';
import listWorkoutPreloadedQuery from '../../../__generated__/listWorkoutQuery.graphql';
import { PageHeader } from '../../components/PageHeader';
import { WorkoutList } from '../../components/workout/WorkoutList';
import { RootLayout } from '../../layouts/RootLayout';
import { getPreloadedQuery } from '../../relay/network';

type ListWorkoutProps = {
  preloadedQueries: {
    listWorkout: PreloadedQuery<listWorkoutQuery>;
  };
};

const ListWorkout = (props: ListWorkoutProps) => {
  const query = usePreloadedQuery<listWorkoutQuery>(
    graphql`
      query listWorkoutQuery($workoutFilters: WorkoutFilter) @preloadable {
        ...WorkoutList_query @arguments(first: 20, filters: $workoutFilters)
      }
    `,
    props.preloadedQueries.listWorkout,
  );

  return (
    <RootLayout>
      <PageHeader title={'Treinos'} />
      <Stack spacing={4}>
        <WorkoutList query={query} />
      </Stack>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      preloadedQueries: {
        listWorkout: await getPreloadedQuery(
          listWorkoutPreloadedQuery,
          {},
          context,
        ),
      },
    },
  };
};

export default ListWorkout;
