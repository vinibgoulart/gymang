import {
  FILTER_CONDITION_TYPE,
  orderByField,
  orderByFilterField,
} from '@gymang/graphql';
import { GraphQLBoolean, GraphQLInputObjectType } from 'graphql';

import { WorkoutOrdering } from './WorkoutOrderBy';

export const workoutFilterMapping = {
  isPublic: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'isPublic',
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
    ...orderByField(WorkoutOrdering),
  }),
});
