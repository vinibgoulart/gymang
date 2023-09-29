import { WORKOUT_SPLIT_MODALITY } from '@gymang/enums';
import type { DeepPartial } from '@gymang/types';
import { User, handleCreateUser } from '@gymang/user';
import { Workout, handleCreateWorkout } from '@gymang/workout';

import type { IWorkoutSplit } from '../WorkoutSplitModel';
import WorkoutSplit from '../WorkoutSplitModel';

type WorkoutSplitOptions = {};

type HandleCreateWorkoutSplitArgs = DeepPartial<IWorkoutSplit> &
  WorkoutSplitOptions;

export const handleCreateWorkoutSplit = async (
  args: HandleCreateWorkoutSplitArgs = {},
): Promise<IWorkoutSplit> => {
  let { name, user, workout, modality, ...payload } = args;

  // const n = getCounter('workoutSplit');
  const n = (global.__COUNTERS__.workoutSplit += 1);

  if (name === undefined) {
    name = `WorkoutSplit ${n} name`;
  }

  let existentWorkout = await Workout.findOne();
  let existentUser = await User.findOne();

  if (workout === undefined) {
    if (!existentWorkout) {
      workout = await handleCreateWorkout();
      existentWorkout = workout;
    }

    workout = existentWorkout;
  }

  if (user === undefined) {
    if (!existentUser) {
      user = await handleCreateUser();
      existentUser = user;
    }

    user = existentUser;
  }

  if (modality === undefined) {
    modality = WORKOUT_SPLIT_MODALITY.BODYBUILDING;
  }

  return new WorkoutSplit({
    name,
    workout,
    user,
    modality,
    ...payload,
  }).save();
};
