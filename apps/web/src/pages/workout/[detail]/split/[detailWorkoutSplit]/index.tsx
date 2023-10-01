import { Stack } from '@chakra-ui/react';
import { ActionButton } from '@gymang/ui';
import type { GetServerSideProps } from 'next';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type {
  DetailWorkoutSplitQuery,
} from '../../../../../../__generated__/DetailWorkoutSplitQuery.graphql';
import DetailWorkoutSplitPreloadedQuery from '../../../../../../__generated__/DetailWorkoutSplitQuery.graphql';
import { PageHeader } from '../../../../../components/PageHeader';
import { WorkoutSplitDetail } from '../../../../../components/workoutSplit/WorkoutSplitDetail';
import { RootLayout } from '../../../../../layouts/RootLayout';
import { getPreloadedQuery } from '../../../../../relay/network';

type DetailWorkoutSplitProps = {
  preloadedQueries: {
    detailWorkout: PreloadedQuery<DetailWorkoutSplitQuery>;
  };
};

const DetailWorkoutSplit = (props: DetailWorkoutSplitProps) => {
  const query = usePreloadedQuery<DetailWorkoutSplitQuery>(
    graphql`
      query DetailWorkoutSplitQuery($id: ID!) @preloadable {
        workoutSplit: node(id: $id) {
          ... on WorkoutSplit {
            id
            name
            workout {
              name
            }
            ...WorkoutSplitDetail_workoutSplit
          }
        }
      }
    `,
    props.preloadedQueries.detailWorkout,
  );

  if (!query.workoutSplit) {
    return <RootLayout>Divisão não encontrada</RootLayout>;
  }

  const { workoutSplit } = query;

  const actions = (
    <>
      <ActionButton variant={'outline'} size={{ base: 'sm', md: 'md' }}>
        Adicionar exercicio
      </ActionButton>
      <ActionButton size={{ base: 'sm', md: 'md' }}>
        Iniciar treino
      </ActionButton>
    </>
  );

  return (
    <RootLayout>
      <PageHeader
        title={workoutSplit.workout.name}
        subtitle={workoutSplit.name}
        actions={actions}
      />
      <Stack spacing={4}>
        <WorkoutSplitDetail workoutSplit={query.workoutSplit} />
      </Stack>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { detailWorkoutSplit } = context.query;

  return {
    props: {
      preloadedQueries: {
        detailWorkout: await getPreloadedQuery(
          DetailWorkoutSplitPreloadedQuery,
          {
            id: detailWorkoutSplit,
          },
          context,
        ),
      },
    },
  };
};

export default DetailWorkoutSplit;
