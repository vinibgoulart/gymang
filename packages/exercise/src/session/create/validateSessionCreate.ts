import { getObjectId } from '@gymang/graphql';
import { WorkoutSplit, getRecordInProgress } from '@gymang/workout-split';

import type { SessionCreateArgs } from './sessionCreate';
import ExerciseModel from '../../ExerciseModel';
import { getSessionInProgress } from '../getSessionInProgress';

type ValidateSessionCreateArgs = SessionCreateArgs;

export const validateSessionCreate = async ({
  payload,
  context,
}: ValidateSessionCreateArgs) => {
  const { t } = context;

  const { id } = payload;

  const emptyPayload = {
    id: null,
    series: null,
    repetitions: null,
    weight: null,
    breakTime: null,
    record: null,
  };

  const exercise = await ExerciseModel.findOne({
    _id: getObjectId(id),
    removedAt: null,
  });

  if (!exercise) {
    return {
      ...emptyPayload,
      error: t('Exercise not found'),
    };
  }

  const workoutSplitExercises = await ExerciseModel.find({
    workoutSplit: exercise.workoutSplit,
    removedAt: null,
  });

  const inProgressSession = workoutSplitExercises.some((exercise) => {
    const inProgress = getSessionInProgress({ exercise });

    return !!inProgress;
  });

  if (inProgressSession) {
    return {
      ...emptyPayload,
      error: t('You already have a session in progress, finish it first'),
    };
  }

  const workoutSplit = await WorkoutSplit.findOne({
    _id: exercise.workoutSplit,
    removedAt: null,
  });

  const inProgressRecord = getRecordInProgress({ workoutSplit });

  if (!inProgressRecord) {
    return {
      ...emptyPayload,
      error: t('You do not have a record in progress, create it first'),
    };
  }

  const { series, repetitions, weight, breakTime } = exercise;

  if (!series) {
    return {
      ...emptyPayload,
      error: t('Series is required'),
    };
  }

  if (!repetitions) {
    return {
      ...emptyPayload,
      error: t('Repetitions is required'),
    };
  }

  return {
    id,
    series,
    repetitions,
    weight,
    breakTime,
    record: inProgressRecord,
    error: null,
  };
};
