import type { GraphQLContext } from '@gymang/core';
import { Exercise } from '@gymang/exercise';
import type { Types } from 'mongoose';

import WorkoutSplitModel from '../../WorkoutSplitModel';

type RecordFinishArgs = {
  recordId: Types.ObjectId;
  context: GraphQLContext;
};

export const recordFinish = async ({ recordId, context }: RecordFinishArgs) => {
  const { t } = context;

  const workoutSplit = await WorkoutSplitModel.findOne({
    'records._id': recordId,
    removedAt: null,
  });

  if (!workoutSplit) {
    return {
      workoutSplit: null,
      error: t('Workout split not found'),
    };
  }

  const exercises = await Exercise.find({
    workoutSplit: workoutSplit._id,
  });

  const exercisesWithSessionRecord = exercises.filter(
    (exercise) =>
      exercise.sessions?.find(
        (session) => session.record._id.toString() === recordId.toString(),
      ),
  );

  if (exercisesWithSessionRecord.length !== exercises.length) {
    return {
      workoutSplit: null,
      error: t('Some exercises has no session record'),
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
