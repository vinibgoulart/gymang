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
  getLastRecord,
  getRecordInProgress,
} from '@gymang/workout-split';
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { recordConnectionField } from './record/RecordFields';
import RecordType from './record/RecordType';
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
    modality: {
      type: new GraphQLNonNull(WorkoutSplitModality),
      resolve: (workoutSplit) => workoutSplit.modality,
    },
    recordInProgress: {
      type: RecordType,
      resolve: (workoutSplit) => getRecordInProgress({ workoutSplit }),
    },
    lastRecord: {
      type: RecordType,
      resolve: (workoutSplit) => getLastRecord({ workoutSplit }),
    },
    ...userTypeField(),
    ...workoutTypeField(),
    ...recordConnectionField(),
  }),
  interfaces: () => [nodeInterface],
});

export const WorkoutSplitConnection = connectionDefinitions({
  name: 'WorkoutSplit',
  nodeType: WorkoutSplitType,
});

registerTypeLoader(WorkoutSplitType, WorkoutSplitLoader.load);

export default WorkoutSplitType;
