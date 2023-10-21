import { Exercise } from '@gymang/exercise';
import { getObjectId } from '@gymang/graphql';

import type { SessionCreateArgs } from './recordCreate';
import WorkoutSplitModel from '../../WorkoutSplitModel';

type ValidateSessionCreateArgs = SessionCreateArgs;

export const validateSessionCreate = async ({
  payload,
  context,
}: ValidateSessionCreateArgs) => {
  const { t } = context;

  const { workoutSplitId } = payload;

  const emptyPayload = {
    id: null,
    exercises: null,
  };

  const workoutSplit = await WorkoutSplitModel.findOne({
    _id: getObjectId(workoutSplitId),
    removedAt: null,
  });

  if (!workoutSplit) {
    return {
      ...emptyPayload,
      error: t('Workout Split not found'),
    };
  }

  const inProgressRecord = workoutSplit.records.some(
    (record) => !record.finishedAt || record.finishedAt === null,
  );

  if (inProgressRecord) {
    return {
      ...emptyPayload,
      error: t('You already have a record in progress, finish it first'),
    };
  }

  const exercises = Exercise.find({
    workoutSplit: workoutSplitId,
    removedAt: null,
  });

  return {
    id: workoutSplitId,
    exercises,
    error: null,
  };
};
