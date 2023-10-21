import { MUSCLE_GROUP } from '@gymang/enums';
import type { DeepPartial } from '@gymang/types';
import { User, handleCreateUser } from '@gymang/user';
import { WorkoutSplit, handleCreateWorkoutSplit } from '@gymang/workout-split';

import type { IExercise } from '../ExerciseModel';
import Exercise from '../ExerciseModel';

type HandleCreateExerciseArgs = DeepPartial<IExercise>;

export const handleCreateExercise = async (
  args: HandleCreateExerciseArgs = {},
): Promise<IExercise> => {
  let {
    name,
    user,
    workoutSplit,
    series,
    repetitions,
    muscleGroup,
    ...payload
  } = args;

  // const n = getCounter('workoutSplit');
  const n = (global.__COUNTERS__.workoutSplit += 1);

  if (name === undefined) {
    name = `Exercise ${n} name`;
  }

  let existentWorkoutSplit = await WorkoutSplit.findOne();
  let existentUser = await User.findOne();

  if (workoutSplit === undefined) {
    if (!existentWorkoutSplit) {
      workoutSplit = await handleCreateWorkoutSplit({
        withRecord: true,
      });
      existentWorkoutSplit = workoutSplit;
    }

    workoutSplit = existentWorkoutSplit;
  }

  if (user === undefined) {
    if (!existentUser) {
      user = await handleCreateUser();
      existentUser = user;
    }

    user = existentUser;
  }

  if (series === undefined) {
    series = 4;
  }

  if (repetitions === undefined) {
    repetitions = 12;
  }

  if (muscleGroup === undefined) {
    muscleGroup = MUSCLE_GROUP.BACK;
  }

  return new Exercise({
    name,
    user,
    workoutSplit,
    series,
    repetitions,
    muscleGroup,
    ...payload,
  }).save();
};
