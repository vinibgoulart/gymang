import { isLoggedIn } from '@gymang/core';
import {
  edgeField,
  connectionArgs,
  NullConnection,
  withFilter,
} from '@gymang/graphql';
import { WorkoutSplitLoader } from '@gymang/workout-split';
import { GraphQLNonNull } from 'graphql';

import WorkoutSplitType, { WorkoutSplitConnection } from './WorkoutSplitType';

export const workoutSplitTypeField = (
  key = 'workoutSplit',
  bypassViewerCanSee = false,
) => ({
  [key]: {
    type: WorkoutSplitType,
    resolve: async (obj, args, context) => {
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

export const meWorkoutSplitsConnectionField = (customResolver = null) => ({
  meWorkoutSplits: {
    type: new GraphQLNonNull(WorkoutSplitConnection.connectionType),
    args: {
      ...connectionArgs,
      // filters: {
      //   type: WorkoutSplitFilterInputType,
      // },
    },
    resolve: (obj, args, context) => {
      if (customResolver) {
        return customResolver(obj, args, context);
      }

      if (!isLoggedIn(context)) {
        return NullConnection;
      }

      const argsWithUser = withFilter(args, {
        user: context.user._id,
      });

      return WorkoutSplitLoader.loadAll(context, argsWithUser);
    },
  },
});
