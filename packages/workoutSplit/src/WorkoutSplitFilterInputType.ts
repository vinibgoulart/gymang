import type { GraphQLContext } from '@gymang/core';
import {
  FILTER_CONDITION_TYPE,
  getObjectId,
  orderByField,
  orderByFilterField,
} from '@gymang/graphql';
import { GraphQLBoolean, GraphQLInputObjectType, GraphQLString } from 'graphql';

import { WorkoutSplitOrdering } from './WorkoutSplitOrderBy';

export const workoutSplitFilterMapping = {
  workout: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val),
  },
  fromLoggedUser: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: (fromLoggedUser: boolean, _, context: GraphQLContext) => {
      if (typeof fromLoggedUser !== 'boolean') {
        return {};
      }

      if (fromLoggedUser) {
        return {
          user: context.user._id,
        };
      }

      return {};
    },
  },
  ...orderByFilterField,
};

export type WorkoutSplitFilterInputTypeArgs = {
  workout?: string;
};

export const WorkoutSplitFilterInputType = new GraphQLInputObjectType({
  name: 'WorkoutSplitFilter',
  description: 'Used to filter workout split',
  fields: () => ({
    workout: {
      type: GraphQLString,
    },
    fromLoggedUser: {
      type: GraphQLBoolean,
    },
    ...orderByField(WorkoutSplitOrdering),
  }),
});
