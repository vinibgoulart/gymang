import { graphql, useFragment } from 'react-relay';

import { WorkoutSplitStatusTag } from './WorkoutSplitStatusTag';
import type { WorkoutSplitInProgressTime_user$key } from '../../../__generated__/WorkoutSplitInProgressTime_user.graphql';
import type { WorkoutSplitInProgressTime_workoutSplit$key } from '../../../__generated__/WorkoutSplitInProgressTime_workoutSplit.graphql';

type WorkoutSplitInProgressTimeProps = {
  workoutSplit: WorkoutSplitInProgressTime_workoutSplit$key;
  user: WorkoutSplitInProgressTime_user$key;
};

export const WorkoutSplitInProgressTime = (
  props: WorkoutSplitInProgressTimeProps,
) => {
  const me = useFragment<WorkoutSplitInProgressTime_user$key>(
    graphql`
      fragment WorkoutSplitInProgressTime_user on User {
        id
      }
    `,
    props.user,
  );

  const workoutSplit = useFragment<WorkoutSplitInProgressTime_workoutSplit$key>(
    graphql`
      fragment WorkoutSplitInProgressTime_workoutSplit on WorkoutSplit {
        user {
          id
        }
        ...WorkoutSplitStatusTag_workoutSplit
      }
    `,
    props.workoutSplit,
  );

  if (!workoutSplit) {
    return null;
  }

  if (workoutSplit.user?.id !== me.id) {
    return null;
  }

  return <WorkoutSplitStatusTag workoutSplit={workoutSplit} />;
};
