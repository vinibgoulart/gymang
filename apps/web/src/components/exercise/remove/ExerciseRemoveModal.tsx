import { HStack } from '@chakra-ui/react';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton, Modal, TextGradient } from '@gymang/ui';
import { useFragment } from 'react-relay';
import { ConnectionHandler, ROOT_ID, graphql } from 'relay-runtime';

import type { ExerciseRemoveModal_exercise$key } from '../../../../__generated__/ExerciseRemoveModal_exercise.graphql';
import type { ExerciseRemoveMutation } from '../../../../__generated__/ExerciseRemoveMutation.graphql';
import { ExerciseRemove } from '../mutations/ExerciseRemoveMutation';

type ExerciseRemoveModalProps = {
  exercise: ExerciseRemoveModal_exercise$key;
  isOpen: boolean;
  onClose: () => void;
};

export const ExerciseRemoveModal = (props: ExerciseRemoveModalProps) => {
  const exercise = useFragment<ExerciseRemoveModal_exercise$key>(
    graphql`
      fragment ExerciseRemoveModal_exercise on Exercise {
        id
        name
      }
    `,
    props.exercise,
  );

  const [exerciseRemove, isPending] =
    useMutationCallbacks<ExerciseRemoveMutation>({
      name: 'ExerciseRemove',
      mutation: ExerciseRemove,
      afterCompleted: () => {
        props.onClose();
      },
    });

  if (!exercise) {
    return null;
  }

  const onSubmit = () => {
    const connectionID = ConnectionHandler.getConnectionID(
      ROOT_ID,
      'ExerciseTable_exercises',
    );

    const config = {
      variables: {
        input: {
          exerciseId: exercise.id,
        },
        connections: [connectionID],
      },
    };

    exerciseRemove(config);
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
      title="Remover exercício"
      actions={actions}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      Você tem certeza que deseja remover o exercício{' '}
      <TextGradient>{exercise.name}</TextGradient>?
    </Modal>
  );
};
