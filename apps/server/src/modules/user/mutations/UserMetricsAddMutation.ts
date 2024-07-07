import { errorField, successField } from '@gymang/graphql';
import { metricsCreate } from '@gymang/user';
import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { userTypeField } from '../UserFields';

type RegisterMutationArgs = {
  weight: number;
  height: number;
  age: number;
  fat?: string;
};

const mutation = mutationWithClientMutationId({
  name: 'UserMetricsAdd',
  inputFields: {
    weight: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    height: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    age: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    fat: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (
    { age, height, weight, fat }: RegisterMutationArgs,
    context,
  ) => {
    const { t, user } = context;

    const payload = {
      user,
      age,
      height,
      weight,
      fat,
    };

    const metricsCreateResult = await metricsCreate({
      context,
      payload,
    });

    if (metricsCreateResult.error) {
      return {
        metrics: null,
        error: metricsCreateResult.error,
        success: null,
      };
    }

    return {
      user: user!._id,
      success: t('Metric created successfully!'),
      error: null,
    };
  },
  outputFields: {
    ...userTypeField(),
    ...errorField,
    ...successField,
  },
});

export default {
  ...mutation,
};
