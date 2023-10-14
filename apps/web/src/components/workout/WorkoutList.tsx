import { graphql, usePaginationFragment } from 'react-relay';

import { WorkoutCard } from './WorkoutCard';
import type { WorkoutList_query$key } from '../../../__generated__/WorkoutList_query.graphql';
import type { WorkoutListPaginationQuery } from '../../../__generated__/WorkoutListPaginationQuery.graphql';

type WorkoutListProps = {
  query: WorkoutList_query$key;
};

export const WorkoutList = (props: WorkoutListProps) => {
  const { data } = usePaginationFragment<
    WorkoutListPaginationQuery,
    WorkoutList_query$key
  >(
    graphql`
      fragment WorkoutList_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 20 }
        after: { type: String }
        filters: { type: WorkoutFilter }
      )
      @refetchable(queryName: "WorkoutListPaginationQuery") {
        workouts(first: $first, after: $after, filters: $filters)
          @connection(key: "WorkoutList_workouts", filters: []) {
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

  return workouts.edges.map(({ node }) => (
    <WorkoutCard key={node.id} workout={node} />
  ));
};
