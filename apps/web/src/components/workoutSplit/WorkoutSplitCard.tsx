import { Heading, Text } from '@chakra-ui/react';
import { WORKOUT_SPLIT_MODALITY_LABEL } from '@gymang/enums';
import { Card } from '@gymang/ui';
import { useRouter } from 'next/router';
import { graphql, useFragment } from 'react-relay';

import type { WorkoutSplitCard_workoutSplit$key } from '../../../__generated__/WorkoutSplitCard_workoutSplit.graphql';

type WorkoutSplitCardProps = {
  workoutSplit: WorkoutSplitCard_workoutSplit$key;
};

export const WorkoutSplitCard = (props: WorkoutSplitCardProps) => {
  const router = useRouter();

  const workoutSplit = useFragment<WorkoutSplitCard_workoutSplit$key>(
    graphql`
      fragment WorkoutSplitCard_workoutSplit on WorkoutSplit {
        id
        name
        modality
        workout {
          id
        }
      }
    `,
    props.workoutSplit,
  );

  if (!workoutSplit) {
    return null;
  }

  const handleClick = () => {
    router.push(`/workout/${workoutSplit.workout.id}/split/${workoutSplit.id}`);
  };

  return (
    <Card backgroundColor={'white'} onClick={handleClick}>
      <Heading size={'md'} as={'h4'}>
        {workoutSplit.name}
      </Heading>
      <Text>{WORKOUT_SPLIT_MODALITY_LABEL[workoutSplit.modality]}</Text>
    </Card>
  );
};
