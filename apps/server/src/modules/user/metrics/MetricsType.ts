import type { GraphQLContext } from '@gymang/core';
import {
  connectionDefinitions,
  createdAtField,
  nodeInterface,
} from '@gymang/graphql';
import type { IMetrics } from '@gymang/user';
import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

const MetricsType = new GraphQLObjectType<IMetrics, GraphQLContext>({
  name: 'Metrics',
  description: 'Represents a Metrics',
  fields: () => ({
    id: globalIdField('Session', (obj) => obj.id || obj._id),
    weight: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (metrics) => metrics.weight,
    },
    height: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (metrics) => metrics.height,
    },
    age: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (metrics) => metrics.age,
    },
    fat: {
      type: GraphQLString,
      resolve: (metrics) => metrics.fat,
    },
    imc: {
      type: GraphQLString,
      resolve: (metrics) => {
        const imc = metrics.weight / 1000 / (metrics.height / 100) ** 2;
        return imc.toFixed(2);
      },
    },
    ...createdAtField,
  }),
  interfaces: () => [nodeInterface],
});

export const MetricsConnection = connectionDefinitions({
  name: 'Metrics',
  nodeType: MetricsType,
});

export default MetricsType;
