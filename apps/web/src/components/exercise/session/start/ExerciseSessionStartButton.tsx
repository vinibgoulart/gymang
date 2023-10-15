import { Icon, useDisclosure } from '@chakra-ui/react';
import { FaPlay } from 'react-icons/fa6';
import { graphql, useFragment } from 'react-relay';

import { ExerciseSessionStartModal } from './ExerciseSessionStartModal';
import type { ExerciseSessionStartButton_exercise$key } from '../../../../../__generated__/ExerciseSessionStartButton_exercise.graphql';

type ExerciseSessionStartButtonProps = {
  exercise: ExerciseSessionStartButton_exercise$key;
};

export const ExerciseSessionStartButton = (
  props: ExerciseSessionStartButtonProps,
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const exercise = useFragment<ExerciseSessionStartButton_exercise$key>(
    graphql`
      fragment ExerciseSessionStartButton_exercise on Exercise {
        ...ExerciseSessionStartModal_exercise
      }
    `,
    props.exercise,
  );

  return (
    <>
      <Icon
        as={FaPlay}
        color={'primary.main'}
        onClick={onOpen}
        cursor={'pointer'}
      />
      {isOpen && (
        <ExerciseSessionStartModal
          exercise={exercise}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};
