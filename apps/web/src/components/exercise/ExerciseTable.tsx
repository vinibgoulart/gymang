import { useRefetchTransition } from '@gymang/hooks';
import { TableInfiniteScroll } from '@gymang/ui';
import { useMemo } from 'react';
import { graphql, usePaginationFragment } from 'react-relay';

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
