import type { GraphQLContext } from '@gymang/core';
import { getObjectId } from '@gymang/graphql';
import type { Types } from 'mongoose';

import { validateRecordCreate } from './validateRecordCreate';
import WorkoutSplitModel from '../../WorkoutSplitModel';

type RecordCreatePayload = {
  workoutSplitId: Types.ObjectId;
};

export type RecordCreateArgs = {
  payload: RecordCreatePayload;
  context: GraphQLContext;
};

export const recordCreate = async ({ payload, context }: RecordCreateArgs) => {
  const { id, error: errorValidateRecordCreate } = await validateRecordCreate({
    payload,
    context,
  });

  if (errorValidateRecordCreate) {
    return {
      workoutSplit: null,
      error: errorValidateRecordCreate,
    };
  }

  const workoutSplit = await WorkoutSplitModel.findOneAndUpdate(
    {
      _id: getObjectId(id),
      removedAt: null,
    },
    {
      $push: {
        records: {
          finishedAt: null,
        },
      },
    },
    {
      new: true,
    },
  );

  return {
    workoutSplit,
    error: null,
  };
};
