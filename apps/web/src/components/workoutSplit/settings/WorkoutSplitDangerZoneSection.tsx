import { Section } from '@gymang/ui';
import { graphql, useFragment } from 'react-relay';

import { WorkoutSplitRemoveButton } from './remove/WorkoutSplitRemoveButton';
import type { WorkoutSplitDangerZoneSection_workoutSplit$key } from '../../../../__generated__/WorkoutSplitDangerZoneSection_workoutSplit.graphql';

type WorkoutSplitDangerZoneSectionProps = {
  workoutSplit: WorkoutSplitDangerZoneSection_workoutSplit$key;
};

export const WorkoutSplitDangerZoneSection = (
  props: WorkoutSplitDangerZoneSectionProps,
) => {
  const workoutSplit = useFragment<WorkoutSplitDangerZoneSection_workoutSplit$key>(
    graphql`
      fragment WorkoutSplitDangerZoneSection_workoutSplit on WorkoutSplit {
        ...WorkoutSplitRemoveButton_workoutSplit
      }
    `,
    props.workoutSplit,
  );

  return (
    <Section title="Zona de Perigo" headingProps={{ color: 'error.main' }}>
      <WorkoutSplitRemoveButton workoutSplit={workoutSplit} />
    </Section>
  );
};
