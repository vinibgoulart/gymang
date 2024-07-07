import { Stack, useDisclosure } from '@chakra-ui/react';
import { useRefetchTransition } from '@gymang/hooks';
import { ActionButton, Section, TableInfiniteScroll } from '@gymang/ui';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
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
          <UserMetricsAddModalForm
            isOpen={isOpen}
            onClose={onClose}
            user={data}
          />
        )}
      </>
    );
  };

  const charts = useMemo(
    () => [
      {
        label: 'IMC',
        data: metrics.edges.map((edge) => ({
          date: moment(edge?.node?.createdAt).format('DD/MM/YYYY HH:mm'),
          imc: edge?.node?.imc,
        })),
      },
    ],
    [metrics],
  );

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum) => datum.date,
      elementType: 'line',
    }),
    [],
  );

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum) => datum.imc,
        elementType: 'line',
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
