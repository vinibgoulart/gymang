import type { GraphQLContext } from '@gymang/core';
import {
  FILTER_CONDITION_TYPE,
  orderByField,
  orderByFilterField,
} from '@gymang/graphql';
import { GraphQLBoolean, GraphQLInputObjectType } from 'graphql';

import { WorkoutOrdering } from './WorkoutOrderBy';

export const workoutFilterMapping = {
  isPublic: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: (isPublic: boolean) => {
      if (typeof isPublic !== 'boolean') {
        return {};
      }

      if (isPublic) {
        return {
          isPublic,
        };
      }

      return {};
    },
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

export type WorkoutFilterInputType = {
  workout?: string;
};

export const WorkoutFilterInputType = new GraphQLInputObjectType({
  name: 'WorkoutFilter',
  description: 'Used to filter workout',
  fields: () => ({
    isPublic: {
      type: GraphQLBoolean,
    },
    fromLoggedUser: {
      type: GraphQLBoolean,
    },
    ...orderByField(WorkoutOrdering),
  }),
});
