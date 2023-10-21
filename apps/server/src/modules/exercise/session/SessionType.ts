import type { GraphQLContext } from '@gymang/core';
import type { ISession } from '@gymang/exercise';
import { nodeInterface, createdAtField } from '@gymang/graphql';
import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  connectionDefinitions,
  globalIdField,
  toGlobalId,
} from 'graphql-relay';

const SessionType = new GraphQLObjectType<ISession, GraphQLContext>({
  name: 'Session',
  description: 'Represents a Session',
  fields: () => ({
    id: globalIdField('Session', (obj) => obj.id || obj._id),
    series: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (session) => session.series,
    },
    repetitions: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (session) => session.repetitions,
    },
    breakTime: {
      type: GraphQLString,
      resolve: (session) => session.breakTime,
    },
    weight: {
      type: GraphQLString,
      resolve: (session) => session.weight,
    },
    record: {
      type: GraphQLID,
      resolve: (session) => toGlobalId('Record', session.record._id),
    },
    ...createdAtField,
    finishedAt: {
      type: GraphQLString,
      resolve: (session) =>
        session.finishedAt ? session.finishedAt.toISOString() : null,
    },
  }),
  interfaces: () => [nodeInterface],
});

export const SessionConnection = connectionDefinitions({
  name: 'Session',
  nodeType: SessionType,
});

export default SessionType;
