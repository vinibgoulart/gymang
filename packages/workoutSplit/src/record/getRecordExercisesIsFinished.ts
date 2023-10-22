import type { GraphQLContext } from '@gymang/core';
import { Exercise } from '@gymang/exercise';
import type { Types } from 'mongoose';

import WorkoutSplitModel from '../WorkoutSplitModel';

type GetRecordExercisesIsFinishedArgs = {
  recordId: Types.ObjectId;
  context: GraphQLContext;
};

export const getRecordExercisesIsFinished = async ({
  recordId,
  context,
}: GetRecordExercisesIsFinishedArgs) => {
  const { t } = context;

  const workoutSplit = await WorkoutSplitModel.findOne({
    'records._id': recordId,
    removedAt: null,
  });

  if (!workoutSplit) {
    return {
      recordIsFinished: false,
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
      recordIsFinished: false,
      error: t('Some exercises has no session record'),
    };
  }

  return {
    recordIsFinished: true,
    error: null,
  };
};
