import type { GraphQLContext } from '@gymang/core';
import { errorField, getObjectId, successField } from '@gymang/graphql';
import { WorkoutSplit, recordCreate } from '@gymang/workout-split';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { workoutSplitTypeField } from '../WorkoutSplitFields';

type WorkoutSplitRecordStartMutationArgs = {
  workoutSplitId: string;
};

const mutation = mutationWithClientMutationId({
  name: 'WorkoutSplitRecordStart',
  inputFields: {
    workoutSplitId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { workoutSplitId }: WorkoutSplitRecordStartMutationArgs,
    context: GraphQLContext,
  ) => {
    const { t, user } = context;

    const workoutSplit = await WorkoutSplit.findOne({
      _id: getObjectId(workoutSplitId),
      removedAt: null,
    });

    if (!workoutSplit) {
      return {
        workoutSplit: null,
        success: null,
        error: t('Workout split not found'),
      };
    }

    if (workoutSplit.user.toString() !== user._id.toString()) {
      return {
        workoutSplit: null,
        success: null,
        error: t('You can not initiate a record for this workout split'),
      };
    }

    const payload = {
      workoutSplitId: workoutSplit._id,
    };

    const { workoutSplit: workoutSplitWithRecord, error } = await recordCreate({
      payload,
      context,
    });

    if (error || !workoutSplitWithRecord) {
      return {
        workoutSplit: null,
        success: null,
        error,
      };
    }

    return {
      workoutSplit: workoutSplitWithRecord._id,
      success: t('Record created successfully'),
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
