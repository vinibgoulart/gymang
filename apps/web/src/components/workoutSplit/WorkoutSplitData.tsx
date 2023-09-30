import { SimpleGrid } from '@chakra-ui/react';
import { graphql, usePaginationFragment } from 'react-relay';

import { WorkoutSplitCard } from './WorkoutSplitCard';
import type { WorkoutSplitData_query$key } from '../../../__generated__/WorkoutSplitData_query.graphql';
import type { WorkoutSplitDataPaginationQuery } from '../../../__generated__/WorkoutSplitDataPaginationQuery.graphql';

type WorkoutSplitDataProps = {
  query: WorkoutSplitData_query$key;
};

export const WorkoutSplitData = (props: WorkoutSplitDataProps) => {
  const { data } = usePaginationFragment<
    WorkoutSplitDataPaginationQuery,
    WorkoutSplitData_query$key
  >(
    graphql`
      fragment WorkoutSplitData_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 7 }
        after: { type: String }
        filters: { type: WorkoutSplitFilter }
      )
      @refetchable(queryName: "WorkoutSplitDataPaginationQuery") {
        workoutSplits(first: $first, after: $after, filters: $filters)
          @connection(key: "WorkoutSplitData_workoutSplits") {
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
        <WorkoutSplitCard key={node.id} workoutSplit={node} />
      ))}
    </SimpleGrid>
  );
};
