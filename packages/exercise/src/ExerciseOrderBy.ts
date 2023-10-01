import { graphqlEnumBuilder, orderInput } from '@gymang/graphql';

export const EXERCISE_SPLIT_SORT = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export const ExerciseSort = graphqlEnumBuilder(
  'ExerciseSort',
  EXERCISE_SPLIT_SORT,
);

export const ExerciseOrdering = orderInput('ExerciseOrdering', ExerciseSort);
