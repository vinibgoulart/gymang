import { useDisclosure } from '@chakra-ui/react';
import { ActionButton } from '@gymang/ui';
import { graphql, useFragment } from 'react-relay';

import { WorkoutDuplicateModal } from './WorkoutDuplicateModal';
import type { WorkoutDuplicateButton_workout$key } from '../../../../__generated__/WorkoutDuplicateButton_workout.graphql';

type WorkoutDuplicateButtonProps = {
  workout: WorkoutDuplicateButton_workout$key;
};

export const WorkoutDuplicateButton = (props: WorkoutDuplicateButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const workout = useFragment<WorkoutDuplicateButton_workout$key>(
    graphql`
      fragment WorkoutDuplicateButton_workout on Workout {
        ...WorkoutDuplicateModal_workout
      }
    `,
    props.workout,
  );

  return (
    <>
      <ActionButton onClick={onOpen}>Duplicar treino</ActionButton>
      {isOpen && (
        <WorkoutDuplicateModal
          workout={workout}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};
