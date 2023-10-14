import { SimpleGrid } from '@gymang/ui';
import { graphql, usePaginationFragment } from 'react-relay';

import { WorkoutCard } from './WorkoutCard';
import type { WorkoutGridList_query$key } from '../../../__generated__/WorkoutGridList_query.graphql';
import type { WorkoutGridListPaginationQuery } from '../../../__generated__/WorkoutGridListPaginationQuery.graphql';

type WorkoutGridListProps = {
  query: WorkoutGridList_query$key;
};

export const WorkoutGridList = (props: WorkoutGridListProps) => {
  const { data } = usePaginationFragment<
    WorkoutGridListPaginationQuery,
    WorkoutGridList_query$key
  >(
    graphql`
      fragment WorkoutGridList_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 20 }
        after: { type: String }
        filters: { type: WorkoutFilter }
      )
      @refetchable(queryName: "WorkoutGridListPaginationQuery") {
        workouts(first: $first, after: $after, filters: $filters)
          @connection(key: "WorkoutGridList_workouts", filters: []) {
          edges {
            node {
              ...WorkoutCard_workout
            }
          }
        }
      }
    `,
    props.query,
  );

  const { workouts } = data;

  if (!workouts.edges.length) {
    return null;
  }

  return (
    <SimpleGrid>
      {workouts.edges.map(({ node }) => (
        <WorkoutCard key={node.id} workout={node} />
      ))}
    </SimpleGrid>
  );
};
