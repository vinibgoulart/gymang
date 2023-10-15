import { HStack } from '@chakra-ui/react';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton, Modal, TextGradient } from '@gymang/ui';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import type { ExerciseSessionStartModal_exercise$key } from '../../../../../__generated__/ExerciseSessionStartModal_exercise.graphql';
import type { ExerciseSessionStartMutation } from '../../../../../__generated__/ExerciseSessionStartMutation.graphql';
import { ExerciseSessionStart } from '../../mutations/ExerciseSessionStartMutation';

type ExerciseSessionStartModalProps = {
  exercise: ExerciseSessionStartModal_exercise$key;
  isOpen: boolean;
  onClose: () => void;
};

export const ExerciseSessionStartModal = (
  props: ExerciseSessionStartModalProps,
) => {
  const exercise = useFragment<ExerciseSessionStartModal_exercise$key>(
    graphql`
      fragment ExerciseSessionStartModal_exercise on Exercise {
        id
        name
      }
    `,
    props.exercise,
  );

  const [exerciseSessionStart, isPending] =
    useMutationCallbacks<ExerciseSessionStartMutation>({
      name: 'ExerciseSessionStart',
      mutation: ExerciseSessionStart,
      afterCompleted: () => {
        props.onClose();
      },
    });

  if (!exercise) {
    return null;
  }

  const onSubmit = () => {
    const config = {
      variables: {
        input: {
          id: exercise.id,
        },
      },
    };

    exerciseSessionStart(config);
  };

  const disabled = isPending;

  const actions = (
    <HStack>
      <ActionButton onClick={onSubmit} isDisabled={disabled}>
        Iniciar
      </ActionButton>
      <ActionButton onClick={props.onClose} bg={'error.main'}>
        Cancelar
      </ActionButton>
    </HStack>
  );

  return (
    <Modal
      title="Iniciar exercício"
      actions={actions}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      Você tem certeza que deseja iniciar o exercício{' '}
      <TextGradient>{exercise.name}</TextGradient>?
    </Modal>
  );
};
