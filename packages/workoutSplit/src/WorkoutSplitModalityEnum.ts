import { WORKOUT_SPLIT_MODALITY } from "@gymang/enums";
import { graphqlEnumBuilder } from "@gymang/graphql";

export const WorkoutSplitModality = graphqlEnumBuilder(
  'WorkoutSplitModalityEnum',
  WORKOUT_SPLIT_MODALITY,
);
