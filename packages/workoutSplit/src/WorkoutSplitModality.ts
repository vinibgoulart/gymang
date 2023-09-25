import { graphqlEnumBuilder } from '@gymang/graphql';

export enum WORKOUT_SPLIT_MODALITY {
  BODYBUILDING = 'BODYBUILDING',
  CYCLING = 'CYCLING',
  RUNNING = 'RUNNING',
  SWIMMING = 'SWIMMING',
  WALKING = 'WALKING',
  WEIGHTLIFTING = 'WEIGHTLIFTING',
  YOGA = 'YOGA',
  BEACH_TENNIS = 'BEACH_TENNIS',
  BASKETBALL = 'BASKETBALL',
  BOXING = 'BOXING',
  FOOTBALL = 'FOOTBALL',
  HANDBALL = 'HANDBALL',
  VOLLEYBALL = 'VOLLEYBALL',
  TENNIS = 'TENNIS',
  OTHER = 'OTHER',
}

export const WorkoutSplitModality = graphqlEnumBuilder(
  'WorkoutSplitModalityEnum',
  WORKOUT_SPLIT_MODALITY,
);
