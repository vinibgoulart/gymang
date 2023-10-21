import { WORKOUT_SPLIT_SORT } from '@gymang/enums';
import { graphqlEnumBuilder, orderInput } from '@gymang/graphql';


export const WorkoutSplitSort = graphqlEnumBuilder(
  'WorkoutSplitSort',
  WORKOUT_SPLIT_SORT,
);

export const WorkoutSplitOrdering = orderInput(
  'WorkoutSplitOrdering',
  WorkoutSplitSort,
);
