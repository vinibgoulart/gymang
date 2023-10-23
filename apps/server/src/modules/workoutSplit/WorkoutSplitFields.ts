import type { GraphQLContext } from '@gymang/core';
import { edgeField, connectionArgs } from '@gymang/graphql';
import type {
  WorkoutSplitFilterInputTypeArgs} from '@gymang/workout-split';
import {
  WorkoutSplitFilterInputType,
  WorkoutSplitLoader,
} from '@gymang/workout-split';
import { GraphQLNonNull } from 'graphql';
import type { ConnectionArguments } from 'graphql-relay';

import WorkoutSplitType, { WorkoutSplitConnection } from './WorkoutSplitType';

export const workoutSplitTypeField = (
  key = 'workoutSplit',
  bypassViewerCanSee = false,
) => ({
  [key]: {
    type: WorkoutSplitType,
    resolve: async (obj, _, context: GraphQLContext) => {
      return WorkoutSplitLoader.load(context, obj[key], bypassViewerCanSee);
    },
  },
});

export const workoutSplitEdgeField = () =>
  edgeField({
    connection: WorkoutSplitConnection,
    load: WorkoutSplitLoader.load,
    edgeName: 'workoutSplitEdge',
    name: 'WorkoutSplit',
  });

type MeWorkoutSplitsConnectionArgs = {
  filters?: WorkoutSplitFilterInputTypeArgs;
} & ConnectionArguments;

export const workoutSplitsConnectionField = <T = unknown>(
  customResolver = null,
) => ({
  workoutSplits: {
    type: new GraphQLNonNull(WorkoutSplitConnection.connectionType),
    args: {
      ...connectionArgs,
      filters: {
        type: WorkoutSplitFilterInputType,
      },
    },
    resolve: (
      obj: T,
      args: MeWorkoutSplitsConnectionArgs,
      context: GraphQLContext,
    ) => {
      if (customResolver) {
        return customResolver(obj, args, context);
      }

      return WorkoutSplitLoader.loadAll(context, args);
    },
  },
});
