import { Box, Text } from '@chakra-ui/react';
import { graphql, useFragment } from 'react-relay';

import type { WorkoutDetail_user$key } from '../../../__generated__/WorkoutDetail_user.graphql';
import type { WorkoutDetail_workout$key } from '../../../__generated__/WorkoutDetail_workout.graphql';

type WorkoutDetailProps = {
  workout: WorkoutDetail_workout$key;
  user: WorkoutDetail_user$key;
};

export const WorkoutDetail = (props: WorkoutDetailProps) => {
  const me = useFragment<WorkoutDetail_user$key>(
    graphql`
      fragment WorkoutDetail_user on User {
        id
      }
    `,
    props.user,
  );

  const workout = useFragment<WorkoutDetail_workout$key>(
    graphql`
      fragment WorkoutDetail_workout on Workout {
        name
        createdBy {
          id
          firstName
        }
      }
    `,
    props.workout,
  );

  if (!workout) {
    return null;
  }

  if (workout.createdBy?.id !== me.id) {
    return null;
  }

  return (
    <Box>
      <Text>Criado por: {workout.createdBy?.firstName}</Text>
    </Box>
  );
};
