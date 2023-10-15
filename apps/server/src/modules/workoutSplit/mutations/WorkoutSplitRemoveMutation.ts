import type { GraphQLContext } from '@gymang/core';
import { errorField, getObjectId, successField } from '@gymang/graphql';
import { Workout } from '@gymang/workout';
import { WorkoutSplit } from '@gymang/workout-split';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { workoutSplitTypeField } from '../WorkoutSplitFields';

type WorkoutSplitRemoveMutationArgs = {
  id: string;
};

const mutation = mutationWithClientMutationId({
  name: 'WorkoutSplitRemove',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { id }: WorkoutSplitRemoveMutationArgs,
    context: GraphQLContext,
  ) => {
    const { t, user } = context;

    const workoutSplit = await WorkoutSplit.findOne({
      _id: getObjectId(id),
      removedAt: null,
    });

    if (!workoutSplit) {
      return {
        workoutSplit: null,
        success: null,
        error: t('Workout Split not found'),
      };
    }

    const workout = await Workout.findOne({
      _id: workoutSplit.workout,
    });

    if (!workout || workout.removedAt) {
      return {
        workoutSplit: null,
        success: null,
        error: t('Workout not found'),
      };
    }

    if (workoutSplit.user.toString() !== user._id.toString()) {
      return {
        workoutSplit: null,
        success: null,
        error: t('You are not allowed to remove this workout split'),
      };
    }

    await WorkoutSplit.findOneAndUpdate(
      {
        _id: getObjectId(id),
      },
      {
        removedAt: new Date(),
      },
    );

    return {
      workoutSplit: workoutSplit._id,
      success: t('Workout Split removed successfully'),
      error: null,
    };
  },
  outputFields: {
    ...workoutSplitTypeField(),
    ...errorField,
    ...successField,
  },
});

export default {
  ...mutation,
};
