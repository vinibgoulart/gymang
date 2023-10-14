import { Heading, Text } from '@chakra-ui/react';
import { Card } from '@gymang/ui';
import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';

import type { WorkoutCard_workout$key } from '../../../__generated__/WorkoutCard_workout.graphql';

type WorkoutCardProps = {
  workout: WorkoutCard_workout$key;
};

export const WorkoutCard = (props: WorkoutCardProps) => {
  const router = useRouter();

  const workout = useFragment<WorkoutCard_workout$key>(
    graphql`
      fragment WorkoutCard_workout on Workout {
        id
        name
        user {
          firstName
        }
      }
    `,
    props.workout,
  );

  const handleClick = () => {
    router.push(`/workout/${workout.id}`);
  };

  return (
    <Card backgroundColor={'white'} onClick={handleClick}>
      <Heading size={'md'} as={'h5'}>
        {workout.name}
      </Heading>
      <Text>Treino de: {workout.user.firstName}</Text>
    </Card>
  );
};
