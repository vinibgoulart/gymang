import type { GraphQLContext } from '@gymang/core';
import { getObjectId } from '@gymang/graphql';

import { validateMetricsCreate } from './validateMetricsCreate';
import type { IUser } from '../../UserModel';
import UserModel from '../../UserModel';

type MetricsCreatePayload = {
  user: IUser;
  weight: number;
  height: number;
  age: number;
  fat?: string;
};

export type MetricsCreateArgs = {
  payload: MetricsCreatePayload;
  context: GraphQLContext;
};

export const metricsCreate = async ({
  payload,
  context,
}: MetricsCreateArgs) => {
  const { error: errorValidateMetricsCreate } = await validateMetricsCreate({
    payload,
    context,
  });

  if (errorValidateMetricsCreate) {
    return {
      ...payload,
      error: errorValidateMetricsCreate,
    };
  }

  const metrics = {
    weight: payload.weight,
    height: payload.height,
    age: payload.age,
    fat: payload.fat,
  };

  await UserModel.findOneAndUpdate(
    { _id: getObjectId(payload.user._id) },
    {
      $push: {
        metrics: {
          $each: [metrics],
          $position: 0,
        },
      },
    },
    { new: true },
  );

  return {
    metrics,
    error: null,
  };
};
