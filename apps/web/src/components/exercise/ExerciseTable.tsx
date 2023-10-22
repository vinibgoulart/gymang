import { Icon, Text } from '@chakra-ui/react';
import { MUSCLE_GROUP_LABEL } from '@gymang/enums';
import { useRefetchTransition } from '@gymang/hooks';
import { TableInfiniteScroll } from '@gymang/ui';
import moment from 'moment';
import { useMemo } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { graphql, usePaginationFragment } from 'react-relay';

import { ExerciseSessionFinishButton } from './session/finish/ExerciseSessionFinishButton';
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
              workoutSplit {
                recordInProgress {
                  id
                  createdAt
                }
              }
              sessionInProgress {
                id
              }
              lastSession {
                finishedAt
                record
              }
              ...ExerciseSessionStartButton_exercise
              ...ExerciseSessionFinishButton_exercise
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
        name: 'Último treino',
        property: 'lastSession',
        renderCell: (lastSession: { finishedAt?: Date }) => {
          return (
            <Text>
              {lastSession?.finishedAt
                ? moment(lastSession.finishedAt).format('DD/MM HH:mm')
                : '-'}
            </Text>
          );
        },
      },
      {
        name: 'Ações',
        property: 'sessionInProgress',
        renderCell: (sessionInProgress, row) => {
          if (sessionInProgress) {
            return <ExerciseSessionFinishButton exercise={row} />;
          }

          if (row?.workoutSplit?.recordInProgress && row?.lastSession?.record) {
            const isCompleted =
              row?.lastSession?.record ===
              row?.workoutSplit?.recordInProgress?.id;

            if (isCompleted) {
              return <Icon as={BsFillCheckCircleFill} color={'success.main'} />;
            }
          }

          return <ExerciseSessionStartButton exercise={row} />;
        },
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
