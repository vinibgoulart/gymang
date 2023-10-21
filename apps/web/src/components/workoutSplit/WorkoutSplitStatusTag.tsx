import { HStack, Tag } from '@chakra-ui/react';
import { WORKOUT_SPLIT_RECORD_STATUS_LABEL } from '@gymang/enums';
import { useElapsedTime } from '@gymang/hooks';
import { graphql, useFragment } from 'react-relay';

import type { WorkoutSplitStatusTag_workoutSplit$key } from '../../../__generated__/WorkoutSplitStatusTag_workoutSplit.graphql';

type WorkoutSplitStatusTagProps = {
  workoutSplit: WorkoutSplitStatusTag_workoutSplit$key;
};

const WorkoutSplitStatusTagColorProps = {
  [WORKOUT_SPLIT_RECORD_STATUS_LABEL.IN_PROGRESS]: {
    bg: 'success.main',
    color: 'white',
  },
  [WORKOUT_SPLIT_RECORD_STATUS_LABEL.WAITING_TO_START]: {
    bg: 'primary.main',
    color: 'white',
  },
};

export const WorkoutSplitStatusTag = (props: WorkoutSplitStatusTagProps) => {
  const workoutSplit = useFragment<WorkoutSplitStatusTag_workoutSplit$key>(
    graphql`
      fragment WorkoutSplitStatusTag_workoutSplit on WorkoutSplit {
        recordInProgress {
          id
          createdAt
        }
      }
    `,
    props.workoutSplit,
  );

  const status = workoutSplit?.recordInProgress
    ? WORKOUT_SPLIT_RECORD_STATUS_LABEL.IN_PROGRESS
    : WORKOUT_SPLIT_RECORD_STATUS_LABEL.WAITING_TO_START;

  const elapsedTime = useElapsedTime(workoutSplit?.recordInProgress?.createdAt);

  return (
    <HStack justifyContent={'space-between'}>
      <Tag {...WorkoutSplitStatusTagColorProps[status]}>{status}</Tag>
      <Tag {...WorkoutSplitStatusTagColorProps[status]}>{elapsedTime}</Tag>
    </HStack>
  );
};
