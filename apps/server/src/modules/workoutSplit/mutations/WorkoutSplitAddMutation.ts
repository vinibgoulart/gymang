import type { GraphQLContext } from '@gymang/core';
import type {
  WORKOUT_SPLIT_MODALITY} from '@gymang/enums';
import { errorField, getObjectId, successField } from '@gymang/graphql';
import { Workout } from '@gymang/workout';
import {
  WorkoutSplitModality,
  workoutSplitCreate,
} from '@gymang/workout-split';
import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { workoutSplitTypeField } from '../WorkoutSplitFields';


type WorkoutSplitAddMutationArgs = {
  name: string;
  description?: string;
  modality: keyof typeof WORKOUT_SPLIT_MODALITY;
  workout: string;
};

const mutation = mutationWithClientMutationId({
  name: 'WorkoutSplitAdd',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
    modality: {
      type: new GraphQLNonNull(WorkoutSplitModality),
    },
    workout: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { name, description, modality, workout }: WorkoutSplitAddMutationArgs,
    context: GraphQLContext,
  ) => {
    const { t, user } = context;

    const workoutExistent = await Workout.findOne({
      _id: getObjectId(workout),
    });

    if (!workoutExistent) {
      return {
        workoutSplit: null,
        success: null,
        error: t('Workout not found'),
      };
    }

    const payload = {
      name,
      user,
      description,
      modality,
      workout: workoutExistent,
    };

    const { workoutSplit, error } = await workoutSplitCreate({
      payload,
      context,
    });

    if (error) {
      return {
        workoutSplit: null,
        success: null,
        error,
      };
    }

    return {
      workoutSplit: workoutSplit._id,
      success: t('Workout Split created successfully'),
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
