import type { GraphQLContext } from '@gymang/core';
import {
  connectionDefinitions,
  nodeInterface,
  registerTypeLoader,
} from '@gymang/graphql';
import type { IWorkoutSplit } from '@gymang/workout-split';
import {
  WorkoutSplitLoader,
  WorkoutSplitModality,
} from '@gymang/workout-split';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { userTypeField } from '../user/UserFields';
import { workoutTypeField } from '../workout/WorkoutFields';

const WorkoutSplitType = new GraphQLObjectType<IWorkoutSplit, GraphQLContext>({
  name: 'WorkoutSplit',
  description: 'Represents a WorkoutSplit',
  fields: () => ({
    id: globalIdField('WorkoutSplit'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (workoutSplit) => workoutSplit.name,
    },
    description: {
      type: GraphQLString,
      resolve: (workoutSplit) => workoutSplit.description,
    },
    modality: {
      type: WorkoutSplitModality,
      resolve: (workoutSplit) => workoutSplit.modality,
    },
    ...userTypeField(),
    ...workoutTypeField(),
  }),
  interfaces: () => [nodeInterface],
});

export const WorkoutSplitConnection = connectionDefinitions({
  name: 'WorkoutSplit',
  nodeType: WorkoutSplitType,
});

registerTypeLoader(WorkoutSplitType, WorkoutSplitLoader.load);

export default WorkoutSplitType;
