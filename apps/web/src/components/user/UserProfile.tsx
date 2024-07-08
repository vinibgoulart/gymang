import { Stack, useDisclosure } from '@chakra-ui/react';
import { useRefetchTransition } from '@gymang/hooks';
import { ActionButton, Section, TableInfiniteScroll } from '@gymang/ui';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { AxisOptions } from 'react-charts';
import { graphql, usePaginationFragment } from 'react-relay';

import { UserMetricsAddModalForm } from './UserMetricsAddModalForm';
import type { UserProfile_user$key } from '../../../__generated__/UserProfile_user.graphql';
import type { UserProfilePaginationUser } from '../../../__generated__/UserProfilePaginationUser.graphql';

type UserProfileProps = {
  user: UserProfile_user$key;
};

const Chart = dynamic(() => import('react-charts').then((mod) => mod.Chart), {
  ssr: false,
});

export const UserProfile = (props: UserProfileProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    data,
    loadNext,
    hasNext,
    refetch: refetchFn,
    isLoadingNext,
  } = usePaginationFragment<UserProfilePaginationUser, UserProfile_user$key>(
    graphql`
      fragment UserProfile_user on User
      @argumentDefinitions(
        first: { type: Int, defaultValue: 20 }
        after: { type: String }
      )
      @refetchable(queryName: "UserProfilePaginationUser") {
        metrics(first: $first, after: $after)
          @connection(key: "UserProfile_metrics", filters: []) {
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
              weight
              height
              age
              fat
              imc
              createdAt
            }
          }
        }
      }
    `,
    props.user,
  );

  const { metrics } = data;

  const [isTransitionPending] = useRefetchTransition(refetchFn);

  const columns = useMemo(
    () => [
      {
        name: 'Peso',
        property: 'weight',
        renderCell: (weight) => {
          return `${weight / 1000} kg`;
        },
      },
      {
        name: 'Altura',
        property: 'height',
        renderCell: (height) => {
          return `${height} cm`;
        },
      },
      {
        name: 'Idade',
        property: 'age',
      },
      {
        name: 'Gordura',
        property: 'fat',
      },
      {
        name: 'IMC',
        property: 'imc',
      },
      {
        name: 'Criado em',
        property: 'createdAt',
        renderCell: (createdAt) => {
          return moment(createdAt).format('DD/MM/YYYY');
        },
      },
    ],
    [],
  );

  const getActions = () => {
    return (
      <>
        <ActionButton onClick={onOpen}>Adicionar métrica</ActionButton>
        {isOpen && (
          <UserMetricsAddModalForm isOpen={isOpen} onClose={onClose} />
        )}
      </>
    );
  };

  const metricsOrderedByDate = useMemo(() => {
    return metrics.edges
      .map((edge) => edge?.node)
      .sort((a, b) => {
        return moment(a?.createdAt).isBefore(moment(b?.createdAt)) ? -1 : 1;
      });
  }, [metrics]);

  const charts = useMemo(
    () => [
      {
        label: 'IMC',
        data: metricsOrderedByDate.map((node) => ({
          date: moment(node?.createdAt).format('DD/MM/YYYY HH:mm'),
          imc: node?.imc,
        })),
      },
    ],
    [metricsOrderedByDate],
  );

  const primaryAxis = useMemo<AxisOptions<unknown>>(
    () => ({
      getValue: (datum) => {
        console.log({ date: datum.date });
        return moment(datum.date, 'DD/MM/YYYY HH:mm').toDate();
      },
      radius: undefined,
    }),
    [],
  );

  const secondaryAxes = useMemo<AxisOptions<unknown>[]>(
    () => [
      {
        getValue: (datum) => datum.imc,
        radius: undefined,
      },
    ],
    [],
  );

  return (
    <Section title="Métricas corporais" action={getActions()}>
      <Stack height={200}>
        <Chart
          options={{
            data: charts,
            primaryAxis,
            secondaryAxes,
            tooltip: true,
            defaultColors: ['#a2a2ff'],
          }}
        />
      </Stack>
      <TableInfiniteScroll
        columns={columns}
        connection={metrics}
        pagination={{
          hasNext,
          loadNext: () => loadNext(10),
        }}
        isLoadingNext={isLoadingNext}
        isRefetching={isTransitionPending}
      />
    </Section>
  );
};
