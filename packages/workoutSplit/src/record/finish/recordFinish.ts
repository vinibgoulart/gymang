import type { GraphQLContext } from '@gymang/core';
import type { Types } from 'mongoose';

import WorkoutSplitModel from '../../WorkoutSplitModel';
import { getRecordExercisesIsFinished } from '../getRecordExercisesIsFinished';

type RecordFinishArgs = {
  recordId: Types.ObjectId;
  context: GraphQLContext;
};

export const recordFinish = async ({ recordId, context }: RecordFinishArgs) => {
  const { error } = await getRecordExercisesIsFinished({
    recordId,
    context,
  });

  if (error) {
    return {
      workoutSplit: null,
      error,
    };
  }

  const workoutSplitUpdated = await WorkoutSplitModel.findOneAndUpdate(
    {
      'records._id': recordId,
      removedAt: null,
    },
    {
      $set: {
        'records.$.finishedAt': new Date(),
      },
    },
    {
      new: true,
    },
  );

  return {
    workoutSplit: workoutSplitUpdated,
    error: null,
  };
};
