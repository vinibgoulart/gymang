import type { GraphQLContext } from '@gymang/core';
import type { IExercise } from '@gymang/exercise';
import {
  ExerciseLoader,
  ExerciseMuscleGroupEnum,
  getLastSession,
  getSessionInProgress,
} from '@gymang/exercise';
import {
  connectionDefinitions,
  nodeInterface,
  registerTypeLoader,
} from '@gymang/graphql';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { sessionConnectionField } from './session/SessionFields';
import SessionType from './session/SessionType';
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
    sessionInProgress: {
      type: SessionType,
      resolve: (exercise) => getSessionInProgress({ exercise }),
    },
    lastSession: {
      type: SessionType,
      resolve: (exercise) => getLastSession({ exercise }),
    },
    ...sessionConnectionField(),
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
