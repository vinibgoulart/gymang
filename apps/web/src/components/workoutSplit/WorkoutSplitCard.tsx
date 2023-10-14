import { Heading, Text } from '@chakra-ui/react';
import { WORKOUT_SPLIT_MODALITY_LABEL } from '@gymang/enums';
import { Card } from '@gymang/ui';
import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';

import type { WorkoutSplitCard_workout$key } from '../../../__generated__/WorkoutSplitCard_workout.graphql';
import type { WorkoutSplitCard_workoutSplit$key } from '../../../__generated__/WorkoutSplitCard_workoutSplit.graphql';

type WorkoutSplitCardProps = {
  workout: WorkoutSplitCard_workout$key;
  workoutSplit: WorkoutSplitCard_workoutSplit$key;
};

export const WorkoutSplitCard = (props: WorkoutSplitCardProps) => {
  const router = useRouter();

  const workout = useFragment<WorkoutSplitCard_workout$key>(
    graphql`
      fragment WorkoutSplitCard_workout on Workout {
        id
      }
    `,
    props.workout,
  );

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

  const handleClick = () => {
    router.push(`/workout/${workout.id}/split/${workoutSplit.id}`);
  };

  return (
    <Card align="center" backgroundColor={'white'} onClick={handleClick}>
      <Heading size={'md'} as={'h4'}>
        {workoutSplit.name}
      </Heading>
      <Text>{WORKOUT_SPLIT_MODALITY_LABEL[workoutSplit.modality]}</Text>
    </Card>
  );
};
