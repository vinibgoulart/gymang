import type { GraphQLContext } from '@gymang/core';
import { ExerciseFilterInputType, ExerciseLoader } from '@gymang/exercise';
import { edgeField, connectionArgs, withFilter } from '@gymang/graphql';
import { GraphQLNonNull } from 'graphql';
import type { ConnectionArguments } from 'graphql-relay';

import ExerciseType, { ExerciseConnection } from './ExerciseType';

export const exerciseTypeField = (
  key = 'exercise',
  bypassViewerCanSee = false,
) => ({
  [key]: {
    type: ExerciseType,
    resolve: async (obj, _, context: GraphQLContext) => {
      return ExerciseLoader.load(context, obj[key], bypassViewerCanSee);
    },
  },
});

export const exerciseEdgeField = () =>
  edgeField({
    connection: ExerciseConnection,
    load: ExerciseLoader.load,
    edgeName: 'exerciseEdge',
    name: 'Exercise',
  });

type MeExercisesConnectionArgs = {
  filters?: ExerciseFilterInputType;
} & ConnectionArguments;

export const exercisesConnectionField = <T = unknown>(
  customResolver = null,
) => ({
  exercises: {
    type: new GraphQLNonNull(ExerciseConnection.connectionType),
    args: {
      ...connectionArgs,
      filters: {
        type: ExerciseFilterInputType,
      },
    },
    resolve: (
      obj: T,
      args: MeExercisesConnectionArgs,
      context: GraphQLContext,
    ) => {
      if (customResolver) {
        return customResolver(obj, args, context);
      }

      const argsWithWorkoutSplit = withFilter(args, {
        workoutSplit: args.filters?.workoutSplit,
      });

      return ExerciseLoader.loadAll(context, argsWithWorkoutSplit);
    },
  },
});
