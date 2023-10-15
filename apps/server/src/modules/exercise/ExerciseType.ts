import type { GraphQLContext } from '@gymang/core';
import type { IExercise } from '@gymang/exercise';
import { ExerciseLoader, ExerciseMuscleGroupEnum } from '@gymang/exercise';
import {
  connectionDefinitions,
  nodeInterface,
  registerTypeLoader,
} from '@gymang/graphql';
import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { userTypeField } from '../user/UserFields';
import { workoutSplitTypeField } from '../workoutSplit/WorkoutSplitFields';

const ExerciseType = new GraphQLObjectType<IExercise, GraphQLContext>({
  name: 'Exercise',
  description: 'Represents a Exercise',
  fields: () => ({
    id: globalIdField('Exercise'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (exercise) => exercise.name,
    },
    series: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (exercise) => exercise.series,
    },
    repetitions: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (exercise) => exercise.repetitions,
    },
    breakTime: {
      type: GraphQLString,
      resolve: (exercise) => exercise.breakTime,
    },
    muscleGroup: {
      type: new GraphQLNonNull(ExerciseMuscleGroupEnum),
      resolve: (exercise) => exercise.muscleGroup,
    },
    weight: {
      type: GraphQLString,
      resolve: (exercise) => exercise.weight,
    },
    hasSessionInProgress: {
      type: GraphQLBoolean,
      resolve: (exercise) => {
        return !!exercise.sessions?.find(
          (session) => !session.finishedAt || session.finishedAt === null,
        );
      },
    },
    ...userTypeField(),
    ...workoutSplitTypeField(),
  }),
  interfaces: () => [nodeInterface],
});

export const ExerciseConnection = connectionDefinitions({
  name: 'Exercise',
  nodeType: ExerciseType,
});

registerTypeLoader(ExerciseType, ExerciseLoader.load);

export default ExerciseType;
