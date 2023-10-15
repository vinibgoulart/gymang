import type { GraphQLContext } from '@gymang/core';
import { isLoggedIn } from '@gymang/core';
import {
  edgeField,
  connectionArgs,
  NullConnection,
  withFilter,
} from '@gymang/graphql';
import { WorkoutFilterInputType, WorkoutLoader } from '@gymang/workout';
import { GraphQLNonNull } from 'graphql';
import type { ConnectionArguments } from 'graphql-relay';

import WorkoutType, { WorkoutConnection } from './WorkoutType';

export const workoutTypeField = <T>(
  key = 'workout',
  bypassViewerCanSee = false,
) => ({
  [key]: {
    type: WorkoutType,
    resolve: async (obj: T, _, context: GraphQLContext) => {
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

type WorkoutConnectionArgs = {
  filters: WorkoutFilterInputType;
} & ConnectionArguments;

export const workoutConnectionField = <T>(customResolver = null) => ({
  workouts: {
    type: new GraphQLNonNull(WorkoutConnection.connectionType),
    args: {
      ...connectionArgs,
      filters: {
        type: WorkoutFilterInputType,
      },
    },
    resolve: (obj: T, args: WorkoutConnectionArgs, context: GraphQLContext) => {
      if (customResolver) {
        return customResolver(obj, args, context);
      }

      if (!isLoggedIn(context)) {
        return NullConnection;
      }

      const argsWithFilter = withFilter(args, {
        isPublic: true,
      });

      return WorkoutLoader.loadAll(context, argsWithFilter);
    },
  },
});

type MeWorkoutConnectionArgs = ConnectionArguments;

export const meWorkoutConnectionField = <T = unknown>(
  customResolver = null,
) => ({
  meWorkouts: {
    type: new GraphQLNonNull(WorkoutConnection.connectionType),
    args: {
      ...connectionArgs,
      // filters: {
      //   type: WorkoutFilterInputType,
      // },
    },
    resolve: (
      obj: T,
      args: MeWorkoutConnectionArgs,
      context: GraphQLContext,
    ) => {
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
