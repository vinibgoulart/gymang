import { HStack, Icon, Text } from '@chakra-ui/react';
import { MUSCLE_GROUP_LABEL } from '@gymang/enums';
import { useRefetchTransition } from '@gymang/hooks';
import { TableInfiniteScroll } from '@gymang/ui';
import { useMemo } from 'react';
import { FaStop } from 'react-icons/fa6';
import { graphql, usePaginationFragment } from 'react-relay';

import { ExerciseSessionStartButton } from './session/start/ExerciseSessionStartButton';
import type { ExerciseTable_query$key } from '../../../__generated__/ExerciseTable_query.graphql';
import type { ExerciseTablePaginationQuery } from '../../../__generated__/ExerciseTablePaginationQuery.graphql';

type ExerciseTableProps = {
  query: ExerciseTable_query$key;
};

export const ExerciseTable = (props: ExerciseTableProps) => {
  const {
    data: { exercises },
    loadNext,
    hasNext,
    refetch: refetchFn,
    isLoadingNext,
  } = usePaginationFragment<
    ExerciseTablePaginationQuery,
    ExerciseTable_query$key
  >(
    graphql`
      fragment ExerciseTable_query on Query
      @argumentDefinitions(
        first: { type: Int, defaultValue: 20 }
        after: { type: String }
        filters: { type: ExerciseFilter }
      )
      @refetchable(queryName: "ExerciseTablePaginationQuery") {
        exercises(first: $first, after: $after, filters: $filters)
          @connection(key: "ExerciseTable_exercises", filters: []) {
          endCursorOffset
          startCursorOffset

          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }

          edges {
            cursor
            node {
              id
              name
              series
              repetitions
              weight
              breakTime
              muscleGroup
              hasSessionInProgress
              ...ExerciseSessionStartButton_exercise
            }
          }
        }
      }
    `,
    props.query,
  );

  const [isTransitionPending] = useRefetchTransition(refetchFn);

  const columns = useMemo(
    () => [
      {
        name: 'Nome',
        property: 'name',
      },
      {
        name: 'Series',
        property: 'series',
      },
      {
        name: 'Repetições',
        property: 'repetitions',
      },
      {
        name: 'Peso',
        property: 'weight',
      },
      {
        name: 'Tempo de descanso',
        property: 'breakTime',
      },
      {
        name: 'Grupo muscular',
        property: 'muscleGroup',
        renderCell: (muscleGroup: keyof typeof MUSCLE_GROUP_LABEL) => {
          return <Text>{MUSCLE_GROUP_LABEL[muscleGroup]}</Text>;
        },
      },
      {
        name: 'Ações',
        property: 'hasSessionInProgress',
        renderCell: (hasSessionInProgress: boolean, row) => (
          <HStack>
            {hasSessionInProgress ? (
              <Icon as={FaStop} color={'error.main'} />
            ) : (
              <ExerciseSessionStartButton exercise={row} />
            )}
          </HStack>
        ),
      },
    ],
    [],
  );

  return (
    <TableInfiniteScroll
      columns={columns}
      connection={exercises}
      pagination={{
        hasNext,
        loadNext: () => loadNext(10),
      }}
      isLoadingNext={isLoadingNext}
      isRefetching={isTransitionPending}
    />
  );
};
