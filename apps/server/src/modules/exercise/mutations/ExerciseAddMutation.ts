import type { GraphQLContext } from '@gymang/core';
import type { MUSCLE_GROUP } from '@gymang/enums';
import { ExerciseMuscleGroupEnum, exerciseCreate } from '@gymang/exercise';
import { errorField, getObjectId, successField } from '@gymang/graphql';
import { Workout } from '@gymang/workout';
import { WorkoutSplit } from '@gymang/workout-split';
import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { exerciseTypeField } from '../ExerciseFields';

type ExerciseAddMutationArgs = {
  name: string;
  workoutSplit: string;
  repetitions: string;
  series: string;
  breakTime?: string;
  muscleGroup: keyof typeof MUSCLE_GROUP;
  weight?: string;
};

const mutation = mutationWithClientMutationId({
  name: 'ExerciseAdd',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    workoutSplit: {
      type: new GraphQLNonNull(GraphQLID),
    },
    repetitions: {
      type: new GraphQLNonNull(GraphQLString),
    },
    series: {
      type: new GraphQLNonNull(GraphQLString),
    },
    breakTime: {
      type: GraphQLString,
    },
    muscleGroup: {
      type: new GraphQLNonNull(ExerciseMuscleGroupEnum),
    },
    weight: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (
    {
      name,
      workoutSplit,
      repetitions,
      series,
      breakTime,
      muscleGroup,
      weight,
    }: ExerciseAddMutationArgs,
    context: GraphQLContext,
  ) => {
    const { t, user } = context;

    const workoutSplitExistent = await WorkoutSplit.findOne({
      _id: getObjectId(workoutSplit),
      removedAt: null,
    });

    if (!workoutSplitExistent) {
      return {
        exercise: null,
        success: null,
        error: t('Workout Split not found'),
      };
    }

    const workout = await Workout.findOne({
      _id: workoutSplitExistent.workout,
      removedAt: null,
    });

    if (!workout) {
      return {
        exercise: null,
        success: null,
        error: t('Workout not found'),
      };
    }

    if (workoutSplitExistent.user.toString() !== user._id.toString()) {
      return {
        exercise: null,
        success: null,
        error: t('You can not create a Exercise for another user'),
      };
    }

    const payload = {
      name,
      user,
      workoutSplit: workoutSplitExistent,
      repetitions,
      series,
      breakTime,
      muscleGroup,
      weight,
    };

    const { exercise, error } = await exerciseCreate({
      payload,
      context,
    });

    if (error) {
      return {
        exercise: null,
        success: null,
        error,
      };
    }

    return {
      exercise: exercise._id,
      success: t('Exercise created successfully'),
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
