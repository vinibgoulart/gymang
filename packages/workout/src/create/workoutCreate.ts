import type { GraphQLContext } from '@gymang/core';
import type { IUser } from '@gymang/user';

import { validateWorkoutCreate } from './validateWorkoutCreate';
import Workout from '../WorkoutModel';

type WorkoutCreatePayload = {
  name: string;
  user: IUser;
  createdBy: IUser;
  isPublic: boolean;
};

export type WorkoutCreateArgs = {
  payload: WorkoutCreatePayload;
  context: GraphQLContext;
  shouldCheckWorkoutExistent?: boolean;
};

export const workoutCreate = async ({
  payload,
  context,
  shouldCheckWorkoutExistent = true,
}: WorkoutCreateArgs) => {
  const {
    name,
    createdBy,
    user,
    isPublic,
    error: errorValidateWorkoutCreate,
  } = await validateWorkoutCreate({
    payload,
    context,
    shouldCheckWorkoutExistent,
  });

  if (errorValidateWorkoutCreate) {
    return {
      workout: null,
      error: errorValidateWorkoutCreate,
    };
  }

  const workout = await new Workout({
    name,
    createdBy,
    user,
    isPublic,
  }).save();

  return {
    workout,
    error: null,
  };
};
