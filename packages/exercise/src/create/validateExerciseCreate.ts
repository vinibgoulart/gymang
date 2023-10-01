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

  const nullPayload = {
    name: null,
    user: null,
    workoutSplit: null,
    repetitions: null,
    series: null,
    breakTime: null,
    muscleGroup: null,
    weight: null,
  };

  if (!name) {
    return {
      ...nullPayload,
      error: t('Name is required'),
    };
  }

  if (!user) {
    return {
      ...nullPayload,
      error: t('User is required'),
    };
  }

  if (!workoutSplit) {
    return {
      ...nullPayload,
      error: t('Workout Split is required'),
    };
  }

  if (!repetitions) {
    return {
      ...nullPayload,
      error: t('Repetitions is required'),
    };
  }

  if (!series) {
    return {
      ...nullPayload,
      error: t('Series is required'),
    };
  }

  if (!muscleGroup) {
    return {
      ...nullPayload,
      error: t('Muscle Group is required'),
    };
  }

  if (weight && isNaN(Number(weight))) {
    return {
      ...nullPayload,
      error: t('Weight must be a number'),
    };
  }

  if (breakTime && isNaN(Number(breakTime))) {
    return {
      ...nullPayload,
      error: t('Break Time must be a number'),
    };
  }

  if (repetitions && isNaN(Number(repetitions))) {
    return {
      ...nullPayload,
      error: t('Repetitions must be a number'),
    };
  }

  if (series && isNaN(Number(series))) {
    return {
      ...nullPayload,
      error: t('Series must be a number'),
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
