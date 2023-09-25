import type { GraphQLContext } from '@gymang/core';
import type { IUser } from '@gymang/user';
import type { IWorkout } from '@gymang/workout';

import { validateWorkoutSplitCreate } from './validateWorkoutSplitCreate';
import type { WORKOUT_SPLIT_MODALITY } from '../WorkoutSplitModality';
import WorkoutSplit from '../WorkoutSplitModel';

type WorkoutSplitCreatePayload = {
  name: string;
  description?: string;
  user: IUser;
  modality: WORKOUT_SPLIT_MODALITY;
  workout: IWorkout;
};

export type WorkoutSplitCreateArgs = {
  payload: WorkoutSplitCreatePayload;
  context: GraphQLContext;
  shouldCheckWorkoutSplitExistent?: boolean;
};

export const workoutSplitCreate = async ({
  payload,
  context,
  shouldCheckWorkoutSplitExistent = true,
}: WorkoutSplitCreateArgs) => {
  const {
    name,
    description,
    user,
    modality,
    workout,
    error: errorValidateWorkoutSplitCreate,
  } = await validateWorkoutSplitCreate({
    payload,
    context,
    shouldCheckWorkoutSplitExistent,
  });

  if (errorValidateWorkoutSplitCreate) {
    return {
      workoutSplit: null,
      error: errorValidateWorkoutSplitCreate,
    };
  }

  const workoutSplit = await new WorkoutSplit({
    name,
    description,
    modality,
    workout,
    user,
  }).save();

  return {
    workoutSplit,
    error: null,
  };
};