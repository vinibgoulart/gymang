import { MUSCLE_GROUP } from '@gymang/enums';
import { graphqlEnumBuilder } from '@gymang/graphql';

export const ExerciseMuscleGroupEnum = graphqlEnumBuilder(
  'ExerciseMuscleGroupEnum',
  MUSCLE_GROUP,
);
