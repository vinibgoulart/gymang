import { getObjectId } from '@gymang/graphql';

import type { RecordCreateArgs } from './recordCreate';
import WorkoutSplitModel from '../../WorkoutSplitModel';
import { getRecordInProgress } from '../getRecordInProgress';

type ValidateRecordCreateArgs = RecordCreateArgs;

export const validateRecordCreate = async ({
  payload,
  context,
}: ValidateRecordCreateArgs) => {
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
      error: t('Workout split not found'),
    };
  }

  const inProgressSession = getRecordInProgress({ workoutSplit });

  if (inProgressSession) {
    return {
      ...emptyPayload,
      error: t('You already have a record in progress, finish it first'),
    };
  }

  return {
    id: workoutSplitId,
    error: null,
  };
};
