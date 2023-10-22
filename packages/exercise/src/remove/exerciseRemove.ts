import type { GraphQLContext } from '@gymang/core';
import type { Types } from 'mongoose';

import ExerciseModel from '../ExerciseModel';

type ExerciseRemoveArgs = {
  exerciseId: Types.ObjectId;
  context: GraphQLContext;
};

export const exerciseRemove = async ({
  exerciseId,
  context,
}: ExerciseRemoveArgs) => {
  const { t } = context;

  const exercise = await ExerciseModel.findOneAndUpdate(
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

  if (!exercise) {
    return {
      exercise: null,
      error: t('Exercise not found'),
    };
  }

  return {
    exercise,
    error: null,
  };
};
