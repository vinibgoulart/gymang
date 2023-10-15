import { HStack } from '@chakra-ui/react';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton, Modal, TextGradient } from '@gymang/ui';
import { useFragment } from 'react-relay';
import { ConnectionHandler, ROOT_ID, graphql } from 'relay-runtime';

import type { WorkoutAddMutation } from '../../../../__generated__/WorkoutAddMutation.graphql';
import type { WorkoutDuplicateModal_workout$key } from '../../../../__generated__/WorkoutDuplicateModal_workout.graphql';
import { WorkoutAdd } from '../mutations/WorkoutAddMutation';

type WorkoutDuplicateModalProps = {
  workout: WorkoutDuplicateModal_workout$key;
  isOpen: boolean;
  onClose: () => void;
};

export const WorkoutDuplicateModal = (props: WorkoutDuplicateModalProps) => {
  const workout = useFragment<WorkoutDuplicateModal_workout$key>(
    graphql`
      fragment WorkoutDuplicateModal_workout on Workout {
        id
        name
        user {
          firstName
        }
      }
    `,
    props.workout,
  );

  const [workoutAdd, isPending] = useMutationCallbacks<WorkoutAddMutation>({
    name: 'WorkoutAdd',
    mutation: WorkoutAdd,
    afterCompleted: () => {
      props.onClose();
    },
  });

  if (!workout) {
    return null;
  }

  const onSubmit = () => {
    const connectionIDMeWorkouts = ConnectionHandler.getConnectionID(
      ROOT_ID,
      'WorkoutList_meWorkouts',
    );

    const connectionIDWorkouts = ConnectionHandler.getConnectionID(
      ROOT_ID,
      'WorkoutList_workouts',
    );

    const config = {
      variables: {
        connections: [connectionIDMeWorkouts, connectionIDWorkouts],
        input: {
          originalWorkout: workout.id,
          isPublic: true,
          name: workout.name,
        },
      },
    };

    workoutAdd(config);
  };

  const disabled = isPending;

  const actions = (
    <HStack>
      <ActionButton onClick={onSubmit} isDisabled={disabled}>
        Duplicar
      </ActionButton>
      <ActionButton onClick={props.onClose} bg={'error.main'}>
        Cancelar
      </ActionButton>
    </HStack>
  );

  return (
    <Modal
      title="Duplicar treino"
      actions={actions}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      Você tem certeza que deseja duplicar o treino{' '}
      <TextGradient>{workout.name}</TextGradient> de{' '}
      <TextGradient>{workout.user.firstName}</TextGradient>?
    </Modal>
  );
};
