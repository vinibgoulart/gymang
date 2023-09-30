import {
  FILTER_CONDITION_TYPE,
  getObjectId,
  orderByField,
  orderByFilterField,
} from '@gymang/graphql';
import { GraphQLInputObjectType, GraphQLString } from 'graphql';

import { WorkoutSplitOrdering } from './WorkoutSplitOrderBy';

export const workoutSplitFilterMapping = {
  workout: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val),
  },
  ...orderByFilterField,
};

export type WorkoutSplitFilterInputType = {
  workout?: string;
};

export const WorkoutSplitFilterInputType = new GraphQLInputObjectType({
  name: 'WorkoutSplitFilter',
  description: 'Used to filter workout split',
  fields: () => ({
    workout: {
      type: GraphQLString,
    },
    ...orderByField(WorkoutSplitOrdering),
  }),
});
