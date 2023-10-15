import { getObjectId } from '@gymang/graphql';

import type { SessionCreateArgs } from './sessionCreate';
import ExerciseModel from '../../ExerciseModel';

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
    muscleGroup: null,
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

  const inProgressSession = exercise?.sessions.find(
    (session) => !session.finishedAt || session.finishedAt === null,
  );

  if (inProgressSession) {
    return {
      ...emptyPayload,
      error: t('You already have a session in progress, finish it first'),
    };
  }

  const { series, repetitions, weight, breakTime, muscleGroup } = exercise;

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

  if (!muscleGroup) {
    return {
      ...emptyPayload,
      error: t('Muscle Group is required'),
    };
  }

  return {
    id,
    series,
    repetitions,
    weight,
    breakTime,
    muscleGroup,
    error: null,
  };
};
