import type { GraphQLContext } from '@gymang/core';
import { getObjectId } from '@gymang/graphql';
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
    muscleGroup,
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
          muscleGroup,
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
