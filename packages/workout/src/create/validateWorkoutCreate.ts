import type { WorkoutCreateArgs } from './workoutCreate';

type ValidateWorkoutCreateArgs = {} & WorkoutCreateArgs;

export const validateWorkoutCreate = async ({
  payload,
  context,
}: ValidateWorkoutCreateArgs) => {
  const { t } = context;
  const { name, user, createdBy, isPublic } = payload;

  if (!name) {
    return {
      name: null,
      user: null,
      createdBy: null,
      isPublic: null,
      error: t('Name is required'),
    };
  }

  if (!user) {
    return {
      name: null,
      user: null,
      createdBy: null,
      isPublic: null,
      error: t('User is required'),
    };
  }

  if (!createdBy) {
    return {
      name: null,
      user: null,
      createdBy: null,
      isPublic: null,
      error: t('Created by is required'),
    };
  }

  if (!isPublic) {
    return {
      name: null,
      user: null,
      createdBy: null,
      isPublic: null,
      error: t('Is public is required'),
    };
  }

  return {
    name,
    user,
    createdBy,
    isPublic,
    error: null,
  };
};
