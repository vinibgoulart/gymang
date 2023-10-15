import { Section } from '@gymang/ui';
import { graphql, useFragment } from 'react-relay';

import { WorkoutRemoveButton } from './remove/WorkoutRemoveButton';
import type { WorkoutDangerZoneSection_workout$key } from '../../../../__generated__/WorkoutDangerZoneSection_workout.graphql';

type WorkoutDangerZoneSectionProps = {
  workout: WorkoutDangerZoneSection_workout$key;
};

export const WorkoutDangerZoneSection = (
  props: WorkoutDangerZoneSectionProps,
) => {
  const workout = useFragment<WorkoutDangerZoneSection_workout$key>(
    graphql`
      fragment WorkoutDangerZoneSection_workout on Workout {
        ...WorkoutRemoveButton_workout
      }
    `,
    props.workout,
  );

  return (
    <Section title="Zona de Perigo" headingProps={{ color: 'error.main' }}>
      <WorkoutRemoveButton workout={workout} />
    </Section>
  );
};
