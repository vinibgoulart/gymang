import type { ExerciseCreateArgs } from './exerciseCreate';

type ValidateExerciseCreateArgs = {} & ExerciseCreateArgs;

export const validateExerciseCreate = async ({
  payload,
  context,
}: ValidateExerciseCreateArgs) => {
  const { t } = context;
  const {
    name,
    user,
    workoutSplit,
    repetitions,
    series,
    breakTime,
    muscleGroup,
    weight,
  } = payload;

  if (!name) {
    return {
      name: null,
      user: null,
      workoutSplit: null,
      repetitions: null,
      series: null,
      breakTime: null,
      muscleGroup: null,
      weight: null,
      error: t('Name is required'),
    };
  }

  if (!user) {
    return {
      name: null,
      user: null,
      workoutSplit: null,
      repetitions: null,
      series: null,
      breakTime: null,
      muscleGroup: null,
      weight: null,
      error: t('User is required'),
    };
  }

  if (!workoutSplit) {
    return {
      name: null,
      user: null,
      workoutSplit: null,
      repetitions: null,
      series: null,
      breakTime: null,
      muscleGroup: null,
      weight: null,
      error: t('Workout Split is required'),
    };
  }

  if (!repetitions) {
    return {
      name: null,
      user: null,
      workoutSplit: null,
      repetitions: null,
      series: null,
      breakTime: null,
      muscleGroup: null,
      weight: null,
      error: t('Repetitions is required'),
    };
  }

  if (!series) {
    return {
      name: null,
      user: null,
      workoutSplit: null,
      repetitions: null,
      series: null,
      breakTime: null,
      muscleGroup: null,
      weight: null,
      error: t('Series is required'),
    };
  }

  if (!muscleGroup) {
    return {
      name: null,
      user: null,
      workoutSplit: null,
      repetitions: null,
      series: null,
      breakTime: null,
      muscleGroup: null,
      weight: null,
      error: t('Muscle Group is required'),
    };
  }

  return {
    name,
    user,
    workoutSplit,
    repetitions,
    series,
    breakTime,
    muscleGroup,
    weight,
    error: null,
  };
};
