import type { GraphQLContext } from '@gymang/core';
import type { Types } from 'mongoose';

import ExerciseModel from '../ExerciseModel';
import { getSessionInProgress } from '../session/getSessionInProgress';

type ExerciseRemoveArgs = {
  exerciseId: Types.ObjectId;
  context: GraphQLContext;
};

export const exerciseRemove = async ({
  exerciseId,
  context,
}: ExerciseRemoveArgs) => {
  const { t } = context;

  const exercise = await ExerciseModel.findOne({
    _id: exerciseId,
    removedAt: null,
  });

  if (!exercise) {
    return {
      exercise: null,
      error: t('Exercise not found'),
    };
  }

  const sessionInProgress = getSessionInProgress({
    exercise,
  });

  if (sessionInProgress) {
    return {
      exercise: null,
      error: t('You cannot remove an exercise with a session in progress'),
    };
  }

  const exerciseUpdated = await ExerciseModel.findOneAndUpdate(
    {
      _id: exerciseId,
      removedAt: null,
    },
    {
      $set: {
        removedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );

  return {
    exercise: exerciseUpdated,
    error: null,
  };
};
