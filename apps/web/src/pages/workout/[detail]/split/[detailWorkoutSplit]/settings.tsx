import { Divider, Stack } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type {
  settingsWorkoutSplitQuery,
} from '../../../../../../__generated__/settingsWorkoutSplitQuery.graphql';
import settingsWorkoutSplitPreloadedQuery from '../../../../../../__generated__/settingsWorkoutSplitQuery.graphql';
import { PageHeader } from '../../../../../components/PageHeader';
import { WorkoutSplitDangerZoneSection } from '../../../../../components/workoutSplit/settings/WorkoutSplitDangerZoneSection';
import { WorkoutSplitShareSection } from '../../../../../components/workoutSplit/settings/WorkoutSplitShareSection';
import { RootLayout } from '../../../../../layouts/RootLayout';
import { getPreloadedQuery } from '../../../../../relay/network';

type SettingsWorkoutSplitProps = {
  preloadedQueries: {
    detailWorkoutSplit: PreloadedQuery<settingsWorkoutSplitQuery>;
  };
};

const SettingsWorkoutSplit = (props: SettingsWorkoutSplitProps) => {
  const query = usePreloadedQuery<settingsWorkoutSplitQuery>(
    graphql`
      query settingsWorkoutSplitQuery($id: ID!) @preloadable {
        workoutSplit: node(id: $id) {
          ... on WorkoutSplit {
            id
            name
            workout {
              id
              name
            }
            ...WorkoutSplitDangerZoneSection_workoutSplit
            ...WorkoutSplitShareSection_workoutSplit
          }
        }
      }
    `,
    props.preloadedQueries.detailWorkoutSplit,
  );

  if (!query.workoutSplit) {
    return <RootLayout>Divisão não encontrada</RootLayout>;
  }

  const { workoutSplit } = query;

  const getTabs = () => {
    return [
      {
        label: 'Exercícios',
        link: `/workout/${workoutSplit.workout.id}/split/${workoutSplit.id}`,
      },
      {
        label: 'Ajustes',
        link: `/workout/${workoutSplit.workout.id}/split/${workoutSplit.id}/settings`,
      },
    ];
  };

  return (
    <RootLayout>
      <PageHeader title={'Ajustes'} tabs={getTabs()} />
      <Stack spacing={8}>
        <WorkoutSplitShareSection workoutSplit={workoutSplit} />
        <Divider />
        <WorkoutSplitDangerZoneSection workoutSplit={workoutSplit} />
      </Stack>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { detailWorkoutSplit } = context.query;

  return {
    props: {
      preloadedQueries: {
        detailWorkoutSplit: await getPreloadedQuery(
          settingsWorkoutSplitPreloadedQuery,
          {
            id: detailWorkoutSplit,
          },
          context,
        ),
      },
    },
  };
};

export default SettingsWorkoutSplit;
