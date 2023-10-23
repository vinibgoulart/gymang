import type { GraphQLContext } from '@gymang/core';
import { WorkoutSplit } from '@gymang/workout-split';
import type { Types } from 'mongoose';

import WorkoutModel from '../WorkoutModel';

type WorkoutRemoveArgs = {
  workoutId: Types.ObjectId;
  context: GraphQLContext;
};

export const workoutRemove = async ({
  workoutId,
  context,
}: WorkoutRemoveArgs) => {
  const { t } = context;

  const workout = await WorkoutModel.findOne({
    _id: workoutId,
    removedAt: null,
  });

  if (!workout) {
    return {
      workout: null,
      error: t('Workout not found'),
    };
  }

  const workoutUpdated = await WorkoutModel.findOneAndUpdate(
    {
      _id: workoutId,
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

  const workoutSplits = await WorkoutSplit.find({
    workout: workoutId,
    removedAt: null,
  });

  await Promise.all(
    workoutSplits.map(async (workoutSplit) => {
      await WorkoutSplit.findOneAndUpdate(
        {
          _id: workoutSplit._id,
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
    }),
  );

  return {
    workout: workoutUpdated,
    error: null,
  };
};
