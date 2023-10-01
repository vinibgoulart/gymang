import { Box, Text } from '@chakra-ui/react';
import { graphql, useFragment } from 'react-relay';

import type { WorkoutSplitDetail_workoutSplit$key } from '../../../__generated__/WorkoutSplitDetail_workoutSplit.graphql';

type WorkoutSplitDetailProps = {
  workoutSplit: WorkoutSplitDetail_workoutSplit$key;
};

export const WorkoutSplitDetail = (props: WorkoutSplitDetailProps) => {
  const workoutSplit = useFragment<WorkoutSplitDetail_workoutSplit$key>(
    graphql`
      fragment WorkoutSplitDetail_workoutSplit on WorkoutSplit {
        name
        workout {
          name
        }
      }
    `,
    props.workoutSplit,
  );

  if (!workoutSplit) {
    return null;
  }

  return (
    <Box>
      <Text>Treino: {workoutSplit.workout.name}</Text>
    </Box>
  );
};
