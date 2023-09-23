import type { GraphQLContext } from '@gymang/core';
import { errorField, getObjectId, successField } from '@gymang/graphql';
import { Workout, workoutCreate } from '@gymang/workout';
import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { workoutTypeField } from '../WorkoutFields';

type WorkoutAddMutationArgs = {
  name: string;
  originalWorkout?: string;
  description: string;
};

const mutation = mutationWithClientMutationId({
  name: 'WorkoutAdd',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    originalWorkout: {
      type: GraphQLID,
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { name, originalWorkout, description }: WorkoutAddMutationArgs,
    context: GraphQLContext,
  ) => {
    const { t, user } = context;

    const getCreatedBy = async () => {
      if (!originalWorkout) {
        return { createdBy: user };
      }

      const existentWorkout = await Workout.findOne({
        _id: getObjectId(originalWorkout),
      });

      return {
        createdBy: existentWorkout.user,
      };
    };

    const payload = {
      name,
      user,
      description,
      ...(await getCreatedBy()),
    };

    const { workout, error } = await workoutCreate({
      payload,
      context,
    });

    if (error) {
      return {
        workout: null,
        success: null,
        error,
      };
    }

    return {
      workout: workout._id,
      success: t('Workout created successfully'),
      error: null,
    };
  },
  outputFields: {
    ...workoutTypeField(),
    ...errorField,
    ...successField,
  },
});

export default {
  ...mutation,
};
