import type { ExerciseCreateArgs } from './exerciseCreate';
import { validateSessionCreate } from '../session/create/validateSessionCreate';

type ValidateExerciseCreateArgs = ExerciseCreateArgs;

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
    sessions,
  } = payload;

  const emptyPayload = {
    name: null,
    user: null,
    workoutSplit: null,
    repetitions: null,
    series: null,
    breakTime: null,
    muscleGroup: null,
    weight: null,
    sessions: [],
  };

  if (!name) {
    return {
      ...emptyPayload,
      error: t('Name is required'),
    };
  }

  if (!user) {
    return {
      ...emptyPayload,
      error: t('User is required'),
    };
  }

  if (!workoutSplit) {
    return {
      ...emptyPayload,
      error: t('Workout Split is required'),
    };
  }

  if (!repetitions) {
    return {
      ...emptyPayload,
      error: t('Repetitions is required'),
    };
  }

  if (!series) {
    return {
      ...emptyPayload,
      error: t('Series is required'),
    };
  }

  if (!muscleGroup) {
    return {
      ...emptyPayload,
      error: t('Muscle Group is required'),
    };
  }

  if (weight && isNaN(Number(weight))) {
    return {
      ...emptyPayload,
      error: t('Weight must be a number'),
    };
  }

  if (breakTime && isNaN(Number(breakTime))) {
    return {
      ...emptyPayload,
      error: t('Break Time must be a number'),
    };
  }

  if (repetitions && isNaN(Number(repetitions))) {
    return {
      ...emptyPayload,
      error: t('Repetitions must be a number'),
    };
  }

  if (series && isNaN(Number(series))) {
    return {
      ...emptyPayload,
      error: t('Series must be a number'),
    };
  }

  if (sessions?.length) {
    const sessionValidation = await Promise.all(
      sessions.map((session) =>
        validateSessionCreate({ payload: session, context }),
      ),
    );

    const sessionWithError = sessionValidation.find(
      (session) => !!session.error,
    );

    if (sessionWithError) {
      return {
        ...emptyPayload,
        error: sessionWithError.error,
      };
    }
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
    sessions,
    error: null,
  };
};
