import {
  FILTER_CONDITION_TYPE,
  getObjectId,
  orderByField,
  orderByFilterField,
} from '@gymang/graphql';
import { GraphQLInputObjectType, GraphQLString } from 'graphql';

import { ExerciseOrdering } from './ExerciseOrderBy';

export const exerciseFilterMapping = {
  workoutSplit: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val),
  },
  ...orderByFilterField,
};

export type ExerciseFilterInputType = {
  workoutSplit?: string;
};

export const ExerciseFilterInputType = new GraphQLInputObjectType({
  name: 'ExerciseFilter',
  description: 'Used to filter exercises',
  fields: () => ({
    workoutSplit: {
      type: GraphQLString,
    },
    ...orderByField(ExerciseOrdering),
  }),
});
