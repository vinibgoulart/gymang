import { graphqlEnumBuilder, orderInput } from "@gymang/graphql";


export const WORKOUT_SPLIT_SORT = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export const WorkoutSplitSort = graphqlEnumBuilder(
  'WorkoutSplitSort',
  WORKOUT_SPLIT_SORT,
);

export const WorkoutSplitOrdering = orderInput(
  'WorkoutSplitOrdering',
  WorkoutSplitSort,
);
