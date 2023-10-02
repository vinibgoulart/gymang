import { Exercise } from '@gymang/exercise';
import { getObjectId } from '@gymang/graphql';
import { WorkoutSplit } from '@gymang/workout-split';
import type { TFunction } from 'i18next';

import WorkoutModel from '../WorkoutModel';

type DuplicateWorkoutArgs = {
  workout: string;
  originalWorkout: string;
  t: TFunction;
};

export const duplicateWorkout = async (args: DuplicateWorkoutArgs) => {
  const { t } = args;

  const workout = await WorkoutModel.findOne({
    _id: getObjectId(args.workout),
  });

  if (!workout) {
    return {
      workoutSplit: null,
      error: t('Workout not found'),
    };
  }

  const originalWorkoutSplits = await WorkoutSplit.find({
    workout: getObjectId(args.originalWorkout),
    removedAt: null,
  });

  const newWorkoutSplits = await Promise.all(
    originalWorkoutSplits.map(async (workoutSplit) => {
      const newWorkoutSplit = await new WorkoutSplit({
        ...workoutSplit,
        workout,
        user: workout.user,
        name: workoutSplit.name,
        modality: workoutSplit.modality,
      }).save();


      const originalExercises = await Exercise.find({
        workoutSplit: workoutSplit._id,
        removedAt: null,
      });

      await Promise.all(
        originalExercises.map(async (exercise) => {
          await new Exercise({
            workoutSplit: newWorkoutSplit,
            user: workout.user,
            name: exercise.name,
            series: exercise.series,
            repetitions: exercise.repetitions,
            weight: exercise.weight,
            breakTime: exercise.breakTime,
            muscleGroup: exercise.muscleGroup,
          }).save();
        }),
      );

      return newWorkoutSplit;
    }),
  );

  return {
    workoutSplit: newWorkoutSplits,
    error: null,
  };
};
