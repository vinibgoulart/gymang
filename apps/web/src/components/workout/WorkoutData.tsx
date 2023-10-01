import { SimpleGrid } from '@chakra-ui/react';
import { graphql, useFragment, usePaginationFragment } from 'react-relay';

import type { WorkoutData_query$key } from '../../../__generated__/WorkoutData_query.graphql';
import type { WorkoutData_workout$key } from '../../../__generated__/WorkoutData_workout.graphql';
import type { WorkoutDataPaginationQuery } from '../../../__generated__/WorkoutDataPaginationQuery.graphql';
import { WorkoutSplitCard } from '../workoutSplit/WorkoutSplitCard';

type WorkoutDataProps = {
  workout: WorkoutData_workout$key;
  query: WorkoutData_query$key;
};

export const WorkoutData = (props: WorkoutDataProps) => {
  const workout = useFragment(
    graphql`
      fragment WorkoutData_workout on Workout {
        ...WorkoutSplitCard_workout
      }
    `,
    props.workout,
  );

  const { data } = usePaginationFragment<
    WorkoutDataPaginationQuery,
    WorkoutData_query$key
  >(
    graphql`
      fragment WorkoutData_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 7 }
        after: { type: String }
        filters: { type: WorkoutSplitFilter }
      )
      @refetchable(queryName: "WorkoutDataPaginationQuery") {
        workoutSplits(first: $first, after: $after, filters: $filters)
          @connection(key: "WorkoutData_workoutSplits", filters: []) {
          edges {
            node {
              ...WorkoutSplitCard_workoutSplit
            }
          }
        }
      }
    `,
    props.query,
  );

  const { workoutSplits } = data;

  if (!workoutSplits.edges.length) {
    return null;
  }

  return (
    <SimpleGrid minChildWidth={300} spacing={4}>
      {workoutSplits.edges.map(({ node }) => (
        <WorkoutSplitCard key={node.id} workoutSplit={node} workout={workout} />
      ))}
    </SimpleGrid>
  );
};
