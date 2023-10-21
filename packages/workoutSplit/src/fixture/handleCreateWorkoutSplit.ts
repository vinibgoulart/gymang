import { WORKOUT_SPLIT_MODALITY } from '@gymang/enums';
import { Exercise, handleCreateExercise } from '@gymang/exercise';
import type { DeepPartial } from '@gymang/types';
import { User, handleCreateUser } from '@gymang/user';
import { Workout, handleCreateWorkout } from '@gymang/workout';

import type { IWorkoutSplit } from '../WorkoutSplitModel';
import WorkoutSplit from '../WorkoutSplitModel';

type WorkoutSplitOptions = {
  withRecord?: boolean;
  withSession?: boolean;
};

type HandleCreateWorkoutSplitArgs = DeepPartial<IWorkoutSplit> &
  WorkoutSplitOptions;

export const handleCreateWorkoutSplit = async (
  args: HandleCreateWorkoutSplitArgs = {},
): Promise<IWorkoutSplit> => {
  let { name, user, workout, modality, withRecord, withSession, ...payload } =
    args;

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

  let workoutSplit = await new WorkoutSplit({
    name,
    workout,
    user,
    modality,
    ...payload,
  }).save();

  if (withRecord) {
    const exercise = await handleCreateExercise({
      workoutSplit,
    });

    workoutSplit = await WorkoutSplit.findOneAndUpdate(
      {
        _id: workoutSplit._id,
      },
      {
        $set: {
          records: [
            {
              exercises: [exercise._id],
              finishedAt: null,
            },
          ],
        },
      },
      {
        new: true,
      },
    );

    if (withSession) {
      await Exercise.findOneAndUpdate(
        {
          _id: exercise._id,
        },
        {
          $set: {
            sessions: [
              {
                series: '1',
                repetitions: '1',
                breakTime: '1',
                muscleGroup: 'CHEST',
                weight: '1',
                finishedAt: null,
                record: workoutSplit.records[0]._id,
              },
            ],
          },
        },
      );
    }

    return workoutSplit;
  }

  return workoutSplit;
};
