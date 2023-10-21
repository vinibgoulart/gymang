import { HStack } from '@chakra-ui/react';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton, Modal, TextGradient } from '@gymang/ui';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import type { ExerciseSessionFinishModal_exercise$key } from '../../../../../__generated__/ExerciseSessionFinishModal_exercise.graphql';
import type { ExerciseSessionFinishMutation } from '../../../../../__generated__/ExerciseSessionFinishMutation.graphql';
import { ExerciseSessionFinish } from '../../mutations/ExerciseSessionFinishMutation';

type ExerciseSessionFinishModalProps = {
  exercise: ExerciseSessionFinishModal_exercise$key;
  isOpen: boolean;
  onClose: () => void;
};

export const ExerciseSessionFinishModal = (
  props: ExerciseSessionFinishModalProps,
) => {
  const exercise = useFragment<ExerciseSessionFinishModal_exercise$key>(
    graphql`
      fragment ExerciseSessionFinishModal_exercise on Exercise {
        id
        name
        sessionInProgress {
          id
        }
      }
    `,
    props.exercise,
  );

  const [exerciseSessionFinish, isPending] =
    useMutationCallbacks<ExerciseSessionFinishMutation>({
      name: 'ExerciseSessionFinish',
      mutation: ExerciseSessionFinish,
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
          exerciseId: exercise.id,
          sessionId: exercise.sessionInProgress.id,
        },
      },
    };

    exerciseSessionFinish(config);
  };

  const disabled = isPending;

  const actions = (
    <HStack>
      <ActionButton onClick={onSubmit} isDisabled={disabled}>
        Finalizar
      </ActionButton>
      <ActionButton onClick={props.onClose} bg={'error.main'}>
        Cancelar
      </ActionButton>
    </HStack>
  );

  return (
    <Modal
      title="Finalizar exercício"
      actions={actions}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      Você tem certeza que deseja finalizar o exercício{' '}
      <TextGradient>{exercise.name}</TextGradient>?
    </Modal>
  );
};
