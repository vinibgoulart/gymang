import { Text } from '@chakra-ui/react';
import { Card, SimpleGrid, TextWithIcon } from '@gymang/ui';
import { useRouter } from 'next/router';
import { CgAddR } from 'react-icons/cg';
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
  const router = useRouter();

  const workout = useFragment<WorkoutSplitGridList_workout$key>(
    graphql`
      fragment WorkoutSplitGridList_workout on Workout {
        id
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

  if (workout && !workoutSplits.edges.length) {
    const onClick = () => {
      router.push(`/workout/${workout.id}/split/create`);
    };

    return (
      <Card align="center" onClick={onClick} backgroundColor={'white'}>
        <TextWithIcon iconLeft={CgAddR}>
          <Text>Adicione sua primeira divisão</Text>
        </TextWithIcon>
      </Card>
    );
  }

  return (
    <SimpleGrid>
      {workoutSplits.edges.map(({ node }) => (
        <WorkoutSplitCard key={node.id} workoutSplit={node} />
      ))}
    </SimpleGrid>
  );
};
