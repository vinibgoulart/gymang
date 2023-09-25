import type { GraphQLContext } from '@gymang/core';
import { nodeField, nodesField } from '@gymang/graphql';
import { GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';

import UserQueries from '../../modules/user/UserQueries';
import WorkoutQueries from '../../modules/workout/WorkoutQueries';
import WorkoutSplitQueries from '../../modules/workoutSplit/WorkoutSplitQueries';

const QueryType = new GraphQLObjectType<
  Record<string, unknown>,
  GraphQLContext
>({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    id: globalIdField('Query'),
    node: nodeField,
    nodes: nodesField,
    ...UserQueries,
    ...WorkoutQueries,
    ...WorkoutSplitQueries,
  }),
});

export default QueryType;
