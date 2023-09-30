import { Text } from '@chakra-ui/react';
import { Card } from '@gymang/ui';
import { graphql, useFragment } from 'react-relay';

import type { WorkoutSplitCard_workoutSplit$key } from '../../../__generated__/WorkoutSplitCard_workoutSplit.graphql';

type WorkoutSplitCardProps = {
  workoutSplit: WorkoutSplitCard_workoutSplit$key;
};

export const WorkoutSplitCard = (props: WorkoutSplitCardProps) => {
  const workoutSplit = useFragment<WorkoutSplitCard_workoutSplit$key>(
    graphql`
      fragment WorkoutSplitCard_workoutSplit on WorkoutSplit {
        id
        name
        modality
      }
    `,
    props.workoutSplit,
  );

  return (
    <Card>
      <Text>{workoutSplit.name}</Text>
    </Card>
  );
};
