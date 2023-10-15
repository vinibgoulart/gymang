import { HStack, Text } from '@chakra-ui/react';
import { useMutationCallbacks } from '@gymang/relay';
import { ActionButton, Modal, TextGradient } from '@gymang/ui';
import { useRouter } from 'next/router';
import { useFragment } from 'react-relay';
import { ConnectionHandler, ROOT_ID, graphql } from 'relay-runtime';

import type { WorkoutSplitRemoveModal_workoutSplit$key } from '../../../../../__generated__/WorkoutSplitRemoveModal_workoutSplit.graphql';
import type { WorkoutSplitRemoveMutation } from '../../../../../__generated__/WorkoutSplitRemoveMutation.graphql';
import { WorkoutSplitRemove } from '../../mutations/WorkoutSplitRemoveMutation';

type WorkoutSplitRemoveModalProps = {
  workoutSplit: WorkoutSplitRemoveModal_workoutSplit$key;
  isOpen: boolean;
  onClose: () => void;
};

export const WorkoutSplitRemoveModal = (
  props: WorkoutSplitRemoveModalProps,
) => {
  const router = useRouter();

  const workoutSplit = useFragment<WorkoutSplitRemoveModal_workoutSplit$key>(
    graphql`
      fragment WorkoutSplitRemoveModal_workoutSplit on WorkoutSplit {
        id
        name
      }
    `,
    props.workoutSplit,
  );

  const [workoutSplitRemove, isPending] =
    useMutationCallbacks<WorkoutSplitRemoveMutation>({
      name: 'WorkoutSplitRemove',
      mutation: WorkoutSplitRemove,
      afterCompleted: () => {
        props.onClose();

        router.push('/');
      },
    });

  if (!workoutSplit) {
    return null;
  }

  const onSubmit = () => {
    const connectionID = ConnectionHandler.getConnectionID(
      ROOT_ID,
      'WorkoutSplitGridList_workoutSplits',
    );

    const config = {
      variables: {
        connections: [connectionID],
        input: {
          id: workoutSplit.id,
        },
      },
    };

    workoutSplitRemove(config);
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
      title="Remover divisão"
      actions={actions}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <Text>
        Você tem certeza que deseja remover a divisão{' '}
        <TextGradient>{workoutSplit.name}</TextGradient>?
      </Text>
      <Text>
        Você não poderá desfazer essa ação e não terá mais acesso a essa divisão
        e seus dados, incluindo relatórios.
      </Text>
    </Modal>
  );
};
