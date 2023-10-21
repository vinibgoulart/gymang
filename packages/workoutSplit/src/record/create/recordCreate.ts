import type { GraphQLContext } from '@gymang/core';
import { getObjectId } from '@gymang/graphql';
import type { Types } from 'mongoose';

import { validateSessionCreate } from './validateRecordCreate';
import WorkoutSplitModel from '../../WorkoutSplitModel';

type SessionCreatePayload = {
  workoutSplitId: Types.ObjectId;
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
    exercises,
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

  const exercise = await WorkoutSplitModel.findOneAndUpdate(
    {
      _id: getObjectId(id),
      removedAt: null,
    },
    {
      $push: {
        records: {
          exercises,
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
