import type { GraphQLContext } from '@gymang/core';
import { Exercise } from '@gymang/exercise';
import type { Types } from 'mongoose';

import WorkoutSplitModel from '../WorkoutSplitModel';

type GetSessionsFromRecordArgs = {
  recordId: Types.ObjectId;
  context: GraphQLContext;
};

export const getSessionsFromRecord = async ({
  recordId,
  context,
}: GetSessionsFromRecordArgs) => {
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

  if (workoutSplit.records.length === 0) {
    return {
      workoutSplit: null,
      error: t('Workout split has no records'),
    };
  }

  const exercises = await Exercise.find({
    workoutSplitId: workoutSplit._id,
    'sessions.record': recordId,
  });

  const sessions = exercises.map((exercise) => {
    return exercise.sessions?.find((session) =>
      session.record._id.equals(recordId),
    );
  });

  return {
    sessions,
    error: null,
  };
};
