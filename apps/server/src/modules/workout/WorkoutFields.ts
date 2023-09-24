import { isLoggedIn } from '@gymang/core';
import {
  edgeField,
  connectionArgs,
  NullConnection,
  withFilter,
} from '@gymang/graphql';
import { WorkoutLoader } from '@gymang/workout';
import { GraphQLNonNull } from 'graphql';

import WorkoutType, { WorkoutConnection } from './WorkoutType';

export const workoutTypeField = (
  key = 'workout',
  bypassViewerCanSee = false,
) => ({
  [key]: {
    type: WorkoutType,
    resolve: async (obj, args, context) => {
      return WorkoutLoader.load(context, obj[key], bypassViewerCanSee);
    },
  },
});

export const workoutEdgeField = () =>
  edgeField({
    connection: WorkoutConnection,
    load: WorkoutLoader.load,
    edgeName: 'workoutEdge',
    name: 'Workout',
  });

export const myWorkoutConnectionField = (customResolver = null) => ({
  myWorkouts: {
    type: new GraphQLNonNull(WorkoutConnection.connectionType),
    args: {
      ...connectionArgs,
      // filters: {
      //   type: WorkoutFilterInputType,
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

      return WorkoutLoader.loadAll(context, argsWithUser);
    },
  },
});
