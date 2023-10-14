import { Box, Text } from '@chakra-ui/react';
import { graphql, useFragment } from 'react-relay';

import type { WorkoutSplitDetail_user$key } from '../../../__generated__/WorkoutSplitDetail_user.graphql';
import type { WorkoutSplitDetail_workoutSplit$key } from '../../../__generated__/WorkoutSplitDetail_workoutSplit.graphql';

type WorkoutSplitDetailProps = {
  workoutSplit: WorkoutSplitDetail_workoutSplit$key;
  user: WorkoutSplitDetail_user$key;
};

export const WorkoutSplitDetail = (props: WorkoutSplitDetailProps) => {
  const me = useFragment<WorkoutSplitDetail_user$key>(
    graphql`
      fragment WorkoutSplitDetail_user on User {
        id
      }
    `,
    props.user,
  );

  const workoutSplit = useFragment<WorkoutSplitDetail_workoutSplit$key>(
    graphql`
      fragment WorkoutSplitDetail_workoutSplit on WorkoutSplit {
        name
        workout {
          createdBy {
            id
            firstName
          }
        }
      }
    `,
    props.workoutSplit,
  );

  if (!workoutSplit) {
    return null;
  }

  if (workoutSplit.workout.createdBy?.id !== me.id) {
    return null;
  }

  return (
    <Box>
      <Text>Criado por: {workoutSplit.workout.createdBy.firstName}</Text>
    </Box>
  );
};
