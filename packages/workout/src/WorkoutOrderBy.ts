import { graphqlEnumBuilder, orderInput } from '@gymang/graphql';

export const WORKOUT_SORT = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export const WorkoutSort = graphqlEnumBuilder('WorkoutSort', WORKOUT_SORT);

export const WorkoutOrdering = orderInput('WorkoutOrdering', WorkoutSort);
