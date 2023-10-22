import { Icon, useDisclosure } from '@chakra-ui/react';
import { BsFillTrashFill } from 'react-icons/bs';
import { graphql, useFragment } from 'react-relay';

import { ExerciseRemoveModal } from './ExerciseRemoveModal';
import type { ExerciseRemoveButton_exercise$key } from '../../../../__generated__/ExerciseRemoveButton_exercise.graphql';

type ExerciseRemoveButtonProps = {
  exercise: ExerciseRemoveButton_exercise$key;
};

export const ExerciseRemoveButton = (props: ExerciseRemoveButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const exercise = useFragment<ExerciseRemoveButton_exercise$key>(
    graphql`
      fragment ExerciseRemoveButton_exercise on Exercise {
        workoutSplit {
          recordInProgress {
            id
          }
        }
        ...ExerciseRemoveModal_exercise
      }
    `,
    props.exercise,
  );

  const getProps = () => {
    if (exercise?.workoutSplit?.recordInProgress) {
      return {
        color: 'neutral.main',
      };
    }

    return {
      color: 'error.main',
      onClick: onOpen,
      cursor: 'pointer',
    };
  };

  return (
    <>
      <Icon as={BsFillTrashFill} {...getProps()} />
      {isOpen && (
        <ExerciseRemoveModal
          exercise={exercise}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};
