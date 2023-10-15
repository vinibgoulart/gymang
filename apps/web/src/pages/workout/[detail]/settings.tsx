import { Stack } from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import type { PreloadedQuery } from 'react-relay';
import { graphql, usePreloadedQuery } from 'react-relay';

import type {
  settingsWorkoutQuery,
} from '../../../../__generated__/settingsWorkoutQuery.graphql';
import settingsWorkoutPreloadedQuery from '../../../../__generated__/settingsWorkoutQuery.graphql';
import { PageHeader } from '../../../components/PageHeader';
import { WorkoutShareSection } from '../../../components/workout/settings/WorkoutShareSection';
import { RootLayout } from '../../../layouts/RootLayout';
import { getPreloadedQuery } from '../../../relay/network';

type SettingsWorkoutProps = {
  preloadedQueries: {
    detailWorkout: PreloadedQuery<settingsWorkoutQuery>;
  };
};

const SettingsWorkout = (props: SettingsWorkoutProps) => {
  const query = usePreloadedQuery<settingsWorkoutQuery>(
    graphql`
      query settingsWorkoutQuery($id: ID!) @preloadable {
        workout: node(id: $id) {
          ... on Workout {
            id
            name
            ...WorkoutShareSection_workout
          }
        }
      }
    `,
    props.preloadedQueries.detailWorkout,
  );

  if (!query.workout) {
    return <RootLayout>Treino não encontrado</RootLayout>;
  }

  const { workout } = query;

  const getTabs = () => {
    return [
      {
        label: 'Divisões',
        link: `/workout/${workout.id}`,
      },
      {
        label: 'Ajustes',
        link: `/workout/${workout.id}/settings`,
      },
    ];
  };

  return (
    <RootLayout>
      <PageHeader title={'Ajustes'} tabs={getTabs()} />
      <Stack spacing={8}>
        <WorkoutShareSection workout={workout} />
      </Stack>
    </RootLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { detail } = context.query;

  return {
    props: {
      preloadedQueries: {
        detailWorkout: await getPreloadedQuery(
          settingsWorkoutPreloadedQuery,
          {
            id: detail,
          },
          context,
        ),
      },
    },
  };
};

export default SettingsWorkout;
