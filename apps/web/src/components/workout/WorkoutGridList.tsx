import { Text } from '@chakra-ui/react';
import { SimpleGrid, TextWithIcon, Card } from '@gymang/ui';
import { useRouter } from 'next/router';
import { CgAddR } from 'react-icons/cg';
import { graphql, usePaginationFragment } from 'react-relay';

import { WorkoutCard } from './WorkoutCard';
import type { WorkoutGridList_query$key } from '../../../__generated__/WorkoutGridList_query.graphql';
import type { WorkoutGridListPaginationQuery } from '../../../__generated__/WorkoutGridListPaginationQuery.graphql';

type WorkoutGridListProps = {
  query: WorkoutGridList_query$key;
};

export const WorkoutGridList = (props: WorkoutGridListProps) => {
  const router = useRouter();

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
    const onClick = () => {
      router.push('/workout/create');
    };

    return (
      <SimpleGrid>
        <Card onClick={onClick} backgroundColor={'white'}>
          <TextWithIcon iconLeft={CgAddR}>
            <Text>Adicione seu primeiro treino</Text>
          </TextWithIcon>
        </Card>
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid>
      {workouts.edges.map(({ node }) => (
        <WorkoutCard key={node.id} workout={node} />
      ))}
    </SimpleGrid>
  );
};
