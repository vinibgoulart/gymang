import { Icon, useDisclosure } from '@chakra-ui/react';
import { FaStop } from 'react-icons/fa6';
import { graphql, useFragment } from 'react-relay';

import { ExerciseSessionFinishModal } from './ExerciseSessionFinishModal';
import type { ExerciseSessionFinishButton_exercise$key } from '../../../../../__generated__/ExerciseSessionFinishButton_exercise.graphql';

type ExerciseSessionFinishButtonProps = {
  exercise: ExerciseSessionFinishButton_exercise$key;
};

export const ExerciseSessionFinishButton = (
  props: ExerciseSessionFinishButtonProps,
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const exercise = useFragment<ExerciseSessionFinishButton_exercise$key>(
    graphql`
      fragment ExerciseSessionFinishButton_exercise on Exercise {
        ...ExerciseSessionFinishModal_exercise
      }
    `,
    props.exercise,
  );

  return (
    <>
      <Icon
        as={FaStop}
        color={'error.main'}
        onClick={onOpen}
        cursor={'pointer'}
      />
      {isOpen && (
        <ExerciseSessionFinishModal
          exercise={exercise}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};
