import type { WORKOUT_SPLIT_MODALITY } from '@gyamng/enums';
import type { GraphQLContext } from '@gymang/core';
import type { IUser } from '@gymang/user';
import type { IWorkout } from '@gymang/workout';

import { validateWorkoutSplitCreate } from './validateWorkoutSplitCreate';
import WorkoutSplit from '../WorkoutSplitModel';

type WorkoutSplitCreatePayload = {
  name: string;
  user: IUser;
  modality: keyof typeof WORKOUT_SPLIT_MODALITY;
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
    modality,
    workout,
    user,
  }).save();

  return {
    workoutSplit,
    error: null,
  };
};
