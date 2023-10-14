import { SimpleGrid } from '@chakra-ui/react';
import { graphql, useFragment, usePaginationFragment } from 'react-relay';

import { WorkoutSplitCard } from './WorkoutSplitCard';
import type { WorkoutSplitGridList_query$key } from '../../../__generated__/WorkoutSplitGridList_query.graphql';
import type { WorkoutSplitGridList_workout$key } from '../../../__generated__/WorkoutSplitGridList_workout.graphql';
import type { WorkoutSplitGridListPaginationQuery } from '../../../__generated__/WorkoutSplitGridListPaginationQuery.graphql';

type WorkoutSplitGridListProps = {
  query: WorkoutSplitGridList_query$key;
  workout: WorkoutSplitGridList_workout$key;
};

export const WorkoutSplitGridList = (props: WorkoutSplitGridListProps) => {
  const workout = useFragment<WorkoutSplitGridList_workout$key>(
    graphql`
      fragment WorkoutSplitGridList_workout on Workout {
        ...WorkoutSplitCard_workout
      }
    `,
    props.workout,
  );

  const { data } = usePaginationFragment<
    WorkoutSplitGridListPaginationQuery,
    WorkoutSplitGridList_query$key
  >(
    graphql`
      fragment WorkoutSplitGridList_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 7 }
        after: { type: String }
        filters: { type: WorkoutSplitFilter }
      )
      @refetchable(queryName: "WorkoutSplitGridListPaginationQuery") {
        workoutSplits(first: $first, after: $after, filters: $filters)
          @connection(key: "WorkoutSplitGridList_workoutSplits", filters: []) {
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
