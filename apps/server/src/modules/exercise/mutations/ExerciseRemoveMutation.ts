import type { GraphQLContext } from '@gymang/core';
import { Exercise, ExerciseLoader, exerciseRemove } from '@gymang/exercise';
import {
  errorField,
  getObjectId,
  successField,
  deletedIdField,
} from '@gymang/graphql';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

type ExerciseRemoveMutationArgs = {
  exerciseId: string;
};

const mutation = mutationWithClientMutationId({
  name: 'ExerciseRemove',
  inputFields: {
    exerciseId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { exerciseId }: ExerciseRemoveMutationArgs,
    context: GraphQLContext,
  ) => {
    const { t, user } = context;

    const exercise = await Exercise.findOne({
      _id: getObjectId(exerciseId),
    });

    if (!exercise) {
      return {
        exercise: null,
        success: null,
        error: t('Exercise not found'),
      };
    }

    if (exercise.removedAt) {
      return {
        exercise: null,
        success: null,
        error: t('Exercise already removed'),
      };
    }

    if (exercise.user.toString() !== user._id.toString()) {
      return {
        workout: null,
        success: null,
        error: t('You are not allowed to remove this exercise'),
      };
    }

    const { error } = await exerciseRemove({
      context,
      exerciseId: getObjectId(exerciseId),
    });

    if (error) {
      return {
        exercise: null,
        success: null,
        error,
      };
    }

    return {
      deletedId: exercise._id,
      success: t('Exercise removed successfully'),
      error: null,
    };
  },
  outputFields: {
    ...deletedIdField('Exercise', ExerciseLoader),
    ...errorField,
    ...successField,
  },
});

export default {
  ...mutation,
};
