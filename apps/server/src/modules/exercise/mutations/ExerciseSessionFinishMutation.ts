import type { GraphQLContext } from '@gymang/core';
import { Exercise } from '@gymang/exercise';
import { errorField, getObjectId, successField } from '@gymang/graphql';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { exerciseTypeField } from '../ExerciseFields';

type ExerciseSessionFinishMutationArgs = {
  exerciseId: string;
  sessionId: string;
};

const mutation = mutationWithClientMutationId({
  name: 'ExerciseSessionFinish',
  inputFields: {
    exerciseId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    sessionId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { exerciseId, sessionId }: ExerciseSessionFinishMutationArgs,
    context: GraphQLContext,
  ) => {
    const { t, user } = context;

    const exercise = await Exercise.findOne({
      _id: getObjectId(exerciseId),
      'sessions._id': getObjectId(sessionId),
      removedAt: null,
    });

    if (!exercise) {
      return {
        exercise: null,
        success: null,
        error: t('Exercise not found'),
      };
    }

    const session = exercise.sessions.find(
      (s) => s._id.toString() === getObjectId(sessionId).toString(),
    );

    if (session?.finishedAt !== null) {
      return {
        exercise: null,
        success: null,
        error: t('Session already finished'),
      };
    }

    if (exercise.user.toString() !== user._id.toString()) {
      return {
        exercise: null,
        success: null,
        error: t('You can not finish this exercise session'),
      };
    }

    const exerciseWithSessionFinished = await Exercise.findOneAndUpdate(
      {
        _id: getObjectId(exerciseId),
        'sessions._id': getObjectId(sessionId),
      },
      {
        $set: {
          'sessions.$.finishedAt': new Date(),
        },
      },
      {
        new: true,
      },
    );

    return {
      exercise: exerciseWithSessionFinished._id,
      success: t('Session finished successfully'),
      error: null,
    };
  },
  outputFields: {
    ...exerciseTypeField(),
    ...errorField,
    ...successField,
  },
});

export default {
  ...mutation,
};
