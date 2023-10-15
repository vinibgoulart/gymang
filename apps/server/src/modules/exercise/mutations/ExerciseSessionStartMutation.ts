import type { GraphQLContext } from '@gymang/core';
import { Exercise, sessionCreate } from '@gymang/exercise';
import { errorField, getObjectId, successField } from '@gymang/graphql';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { exerciseTypeField } from '../ExerciseFields';

type ExerciseSessionStartMutationArgs = {
  id: string;
};

const mutation = mutationWithClientMutationId({
  name: 'ExerciseSessionStart',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { id }: ExerciseSessionStartMutationArgs,
    context: GraphQLContext,
  ) => {
    const { t, user } = context;

    const exercise = await Exercise.findOne({
      _id: getObjectId(id),
      removedAt: null,
    });

    if (!exercise) {
      return {
        exercise: null,
        success: null,
        error: t('Exercise not found'),
      };
    }

    if (exercise.user.toString() !== user._id.toString()) {
      return {
        exercise: null,
        success: null,
        error: t('You can not initiate a Session for this exercise'),
      };
    }

    const payload = {
      id: exercise._id,
    };

    const { exercise: exerciseWithSession, error } = await sessionCreate({
      payload,
      context,
    });

    if (error || !exerciseWithSession) {
      return {
        exercise: null,
        success: null,
        error,
      };
    }

    return {
      exercise: exerciseWithSession._id,
      success: t('Session created successfully'),
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
