import { useDisclosure } from '@chakra-ui/react';
import { ActionButton } from '@gymang/ui';
import { graphql, useFragment } from 'react-relay';

import { WorkoutRemoveModal } from './WorkoutRemoveModal';
import type { WorkoutRemoveButton_workout$key } from '../../../../__generated__/WorkoutRemoveButton_workout.graphql';

type WorkoutRemoveButtonProps = {
  workout: WorkoutRemoveButton_workout$key;
};

export const WorkoutRemoveButton = (props: WorkoutRemoveButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const workout = useFragment<WorkoutRemoveButton_workout$key>(
    graphql`
      fragment WorkoutRemoveButton_workout on Workout {
        ...WorkoutRemoveModal_workout
      }
    `,
    props.workout,
  );

  return (
    <>
      <ActionButton bg={'error.main'} width={'min-content'} onClick={onOpen}>
        Remover treino
      </ActionButton>
      {isOpen && (
        <WorkoutRemoveModal
          workout={workout}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};
