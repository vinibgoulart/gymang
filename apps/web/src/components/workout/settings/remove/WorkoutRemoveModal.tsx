import { HStack, Text } from '@chakra-ui/react';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton, Modal, TextGradient } from '@gymang/ui';
import { useRouter } from 'next/router';
import { useFragment } from 'react-relay';
import { ConnectionHandler, ROOT_ID, graphql } from 'relay-runtime';

import type { WorkoutRemoveModal_workout$key } from '../../../../../__generated__/WorkoutRemoveModal_workout.graphql';
import type { WorkoutRemoveMutation } from '../../../../../__generated__/WorkoutRemoveMutation.graphql';
import { WorkoutRemove } from '../../mutations/WorkoutRemoveMutation';

type WorkoutRemoveModalProps = {
  workout: WorkoutRemoveModal_workout$key;
  isOpen: boolean;
  onClose: () => void;
};

export const WorkoutRemoveModal = (props: WorkoutRemoveModalProps) => {
  const router = useRouter();

  const workout = useFragment<WorkoutRemoveModal_workout$key>(
    graphql`
      fragment WorkoutRemoveModal_workout on Workout {
        id
        name
      }
    `,
    props.workout,
  );

  const [workoutRemove, isPending] =
    useMutationCallbacks<WorkoutRemoveMutation>({
      name: 'WorkoutRemove',
      mutation: WorkoutRemove,
      afterCompleted: () => {
        props.onClose();

        router.push('/');
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
          id: workout.id,
        },
      },
    };

    workoutRemove(config);
  };

  const disabled = isPending;

  const actions = (
    <HStack>
      <ActionButton onClick={onSubmit} bg={'error.main'} isDisabled={disabled}>
        Remover
      </ActionButton>
      <ActionButton onClick={props.onClose}>Cancelar</ActionButton>
    </HStack>
  );

  return (
    <Modal
      title="Remover treino"
      actions={actions}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <Text>
        Você tem certeza que deseja remover o treino{' '}
        <TextGradient>{workout.name}</TextGradient>?
      </Text>
      <Text>
        Você não poderá desfazer essa ação e não terá mais acesso a esse treino
        e seus dados, incluindo relatórios.
      </Text>
    </Modal>
  );
};
