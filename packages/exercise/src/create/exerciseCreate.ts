import type { GraphQLContext } from '@gymang/core';
import type { IUser } from '@gymang/user';
import type { IWorkoutSplit } from '@gymang/workout-split';

import { validateExerciseCreate } from './validateExerciseCreate';
import Exercise from '../ExerciseModel';

type ExerciseCreatePayload = {
  name: string;
  user: IUser;
  workoutSplit: IWorkoutSplit;
  series: string;
  repetitions: string;
  weight?: string;
  breakTime?: string;
  muscleGroup: string;
};

export type ExerciseCreateArgs = {
  payload: ExerciseCreatePayload;
  context: GraphQLContext;
  shouldCheckExerciseExistent?: boolean;
};

export const exerciseCreate = async ({
  payload,
  context,
  shouldCheckExerciseExistent = true,
}: ExerciseCreateArgs) => {
  const {
    name,
    user,
    workoutSplit,
    breakTime,
    muscleGroup,
    repetitions,
    series,
    weight,
    error: errorValidateExerciseCreate,
  } = await validateExerciseCreate({
    payload,
    context,
    shouldCheckExerciseExistent,
  });

  if (errorValidateExerciseCreate) {
    return {
      exercise: null,
      error: errorValidateExerciseCreate,
    };
  }

  const exercise = await new Exercise({
    name,
    user,
    workoutSplit,
    breakTime,
    muscleGroup,
    repetitions,
    series,
    weight,
  }).save();

  return {
    exercise,
    error: null,
  };
};
