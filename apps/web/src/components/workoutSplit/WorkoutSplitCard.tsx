import { Heading, Text } from '@chakra-ui/react';
import { WORKOUT_SPLIT_MODALITY_LABEL } from '@gymang/enums';
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

  if (!workoutSplit) {
    return null;
  }

  return (
    <Card align="center" backgroundColor={'white'}>
      <Heading size={'md'} as={'h4'}>
        {workoutSplit.name}
      </Heading>
      <Text>{WORKOUT_SPLIT_MODALITY_LABEL[workoutSplit.modality]}</Text>
    </Card>
  );
};
