import type { WorkoutSplitCreateArgs } from './workoutSplitCreate';

type ValidateWorkoutSplitCreateArgs = {} & WorkoutSplitCreateArgs;

export const validateWorkoutSplitCreate = async ({
  payload,
  context,
}: ValidateWorkoutSplitCreateArgs) => {
  const { t } = context;
  const { name, user, modality, workout } = payload;

  if (!name) {
    return {
      name: null,
      user: null,
      modality: null,
      workout: null,
      error: t('Name is required'),
    };
  }

  if (!user) {
    return {
      name: null,
      user: null,
      modality: null,
      workout: null,
      error: t('User is required'),
    };
  }

  if (!modality) {
    return {
      name: null,
      user: null,
      modality: null,
      workout: null,
      error: t('Modality is required'),
    };
  }

  if (!workout) {
    return {
      name: null,
      user: null,
      modality: null,
      workout: null,
      error: t('Workout is required'),
    };
  }

  return {
    name,
    user,
    modality,
    workout,
    error: null,
  };
};
