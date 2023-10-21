import type { GraphQLContext } from '@gymang/core';
import { getObjectId } from '@gymang/graphql';
import {
  WorkoutSplit,
  getRecordInProgress,
  recordCreate,
} from '@gymang/workout-split';
import type { Types } from 'mongoose';

import { validateSessionCreate } from './validateSessionCreate';
import ExerciseModel from '../../ExerciseModel';

type SessionCreatePayload = {
  id: Types.ObjectId;
};

export type SessionCreateArgs = {
  payload: SessionCreatePayload;
  context: GraphQLContext;
};

export const sessionCreate = async ({
  payload,
  context,
}: SessionCreateArgs) => {
  const {
    id,
    breakTime,
    repetitions,
    series,
    weight,
    error: errorValidateSessionCreate,
  } = await validateSessionCreate({
    payload,
    context,
  });

  if (errorValidateSessionCreate) {
    return {
      exercise: null,
      error: errorValidateSessionCreate,
    };
  }

  const exerciseExistent = await ExerciseModel.findOne({
    _id: getObjectId(id),
    removedAt: null,
  });

  const workoutSplit = await WorkoutSplit.findOne({
    _id: exerciseExistent.workoutSplit,
    removedAt: null,
  });

  const inProgressRecord = getRecordInProgress({ workoutSplit });

  if (!inProgressRecord) {
    const { error: errorRecordCreate } = await recordCreate({
      payload: {
        workoutSplitId: workoutSplit._id,
      },
      context,
    });

    if (errorRecordCreate) {
      return {
        exercise: null,
        error: errorRecordCreate,
      };
    }
  }

  console.log({ inProgressRecord });

  const exercise = await ExerciseModel.findOneAndUpdate(
    {
      _id: getObjectId(id),
      removedAt: null,
    },
    {
      $push: {
        sessions: {
          series,
          repetitions,
          weight,
          breakTime,
          record: inProgressRecord._id,
        },
      },
    },
    {
      new: true,
    },
  );

  return {
    exercise,
    error: null,
  };
};
