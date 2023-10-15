import { useDisclosure } from '@chakra-ui/react';
import { ActionButton } from '@gymang/ui';
import { graphql, useFragment } from 'react-relay';

import { WorkoutSplitRemoveModal } from './WorkoutSplitRemoveModal';
import type { WorkoutSplitRemoveButton_workoutSplit$key } from '../../../../../__generated__/WorkoutSplitRemoveButton_workoutSplit.graphql';

type WorkoutSplitRemoveButtonProps = {
  workoutSplit: WorkoutSplitRemoveButton_workoutSplit$key;
};

export const WorkoutSplitRemoveButton = (
  props: WorkoutSplitRemoveButtonProps,
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const workoutSplit = useFragment<WorkoutSplitRemoveButton_workoutSplit$key>(
    graphql`
      fragment WorkoutSplitRemoveButton_workoutSplit on WorkoutSplit {
        ...WorkoutSplitRemoveModal_workoutSplit
      }
    `,
    props.workoutSplit,
  );

  return (
    <>
      <ActionButton bg={'error.main'} width={'min-content'} onClick={onOpen}>
        Remover divisão
      </ActionButton>
      {isOpen && (
        <WorkoutSplitRemoveModal
          workoutSplit={workoutSplit}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};
