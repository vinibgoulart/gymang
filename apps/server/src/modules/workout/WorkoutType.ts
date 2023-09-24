import type { GraphQLContext } from '@gymang/core';
import {
  connectionDefinitions,
  nodeInterface,
  registerTypeLoader,
} from '@gymang/graphql';
import type { IWorkout } from '@gymang/workout';
import { WorkoutLoader } from '@gymang/workout';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { userTypeField } from '../user/UserFields';

const WorkoutType = new GraphQLObjectType<IWorkout, GraphQLContext>({
  name: 'Workout',
  description: 'Represents a Workout',
  fields: () => ({
    id: globalIdField('Workout'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (workout) => workout.name,
    },
    description: {
      type: GraphQLString,
      resolve: (workout) => workout.description,
    },
    ...userTypeField('createdBy'),
    ...userTypeField(),
  }),
  interfaces: () => [nodeInterface],
});

export const WorkoutConnection = connectionDefinitions({
  name: 'Workout',
  nodeType: WorkoutType,
});

registerTypeLoader(WorkoutType, WorkoutLoader.load);

export default WorkoutType;
