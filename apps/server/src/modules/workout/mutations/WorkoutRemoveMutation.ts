import type { GraphQLContext } from '@gymang/core';
import {
  errorField,
  getObjectId,
  successField,
  deletedIdField,
} from '@gymang/graphql';
import { Workout, WorkoutLoader, workoutRemove } from '@gymang/workout';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

type WorkoutRemoveMutationArgs = {
  id: string;
};

const mutation = mutationWithClientMutationId({
  name: 'WorkoutRemove',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { id }: WorkoutRemoveMutationArgs,
    context: GraphQLContext,
  ) => {
    const { t, user } = context;

    const workout = await Workout.findOne({
      _id: getObjectId(id),
    });

    if (!workout) {
      return {
        workout: null,
        success: null,
        error: t('Workout not found'),
      };
    }

    if (workout.removedAt) {
      return {
        workout: null,
        success: null,
        error: t('Workout already removed'),
      };
    }

    if (workout.user.toString() !== user._id.toString()) {
      return {
        workout: null,
        success: null,
        error: t('You are not allowed to remove this workout'),
      };
    }

    await workoutRemove({
      workoutId: workout._id,
      context,
    });

    return {
      deletedId: workout._id,
      success: t('Workout removed successfully'),
      error: null,
    };
  },
  outputFields: {
    ...deletedIdField('Workout', WorkoutLoader),
    ...errorField,
    ...successField,
  },
});

export default {
  ...mutation,
};
