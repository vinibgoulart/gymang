import type { DeepPartial } from '@gymang/types';
import { User, handleCreateUser } from '@gymang/user';

import type { IWorkout } from '../WorkoutModel';
import Workout from '../WorkoutModel';

type WorkoutOptions = {};

type HandleCreateWorkoutArgs = DeepPartial<IWorkout> & WorkoutOptions;

export const handleCreateWorkout = async (
  args: HandleCreateWorkoutArgs = {},
): Promise<IWorkout> => {
  let { name, createdBy, user, ...payload } = args;

  // const n = getCounter('workout');
  const n = (global.__COUNTERS__.workout += 1);

  if (name === undefined) {
    name = `Workout ${n} name`;
  }

  let existentUser = await User.findOne();

  if (createdBy === undefined) {
    if (!existentUser) {
      createdBy = await handleCreateUser();
      existentUser = createdBy;
    }

    createdBy = existentUser;
  }

  if (user === undefined) {
    if (!existentUser) {
      user = await handleCreateUser();
      existentUser = createdBy;
    }

    user = existentUser;
  }

  return new Workout({
    name,
    createdBy,
    user,
    ...payload,
  }).save();
};
