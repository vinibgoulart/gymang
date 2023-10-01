import type { GraphQLContext } from '@gymang/core';
import type { IExercise } from '@gymang/exercise';
import { ExerciseLoader } from '@gymang/exercise';
import {
  connectionDefinitions,
  nodeInterface,
  registerTypeLoader,
} from '@gymang/graphql';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
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
      resolve: (workoutSplit) => workoutSplit.name,
    },
    series: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (workoutSplit) => workoutSplit.series,
    },
    repetitions: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (workoutSplit) => workoutSplit.repetitions,
    },
    breakTime: {
      type: GraphQLString,
      resolve: (workoutSplit) => workoutSplit.breakTime,
    },
    muscleGroup: {
      type: GraphQLString,
      resolve: (workoutSplit) => workoutSplit.muscleGroup,
    },
    weight: {
      type: GraphQLString,
      resolve: (workoutSplit) => workoutSplit.weight,
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
