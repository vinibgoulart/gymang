import { Box, Text } from '@chakra-ui/react';
import { graphql, useFragment } from 'react-relay';

import type { WorkoutDetail_workout$key } from '../../../__generated__/WorkoutDetail_workout.graphql';

type WorkoutDetailProps = {
  workout: WorkoutDetail_workout$key;
};

export const WorkoutDetail = (props: WorkoutDetailProps) => {
  const workout = useFragment<WorkoutDetail_workout$key>(
    graphql`
      fragment WorkoutDetail_workout on Workout {
        name
        description
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

  return (
    <Box>
      <Text>Criado por: {workout.createdBy?.firstName}</Text>
    </Box>
  );
};
