import { GraphQLString } from 'graphql';

export const timestampFields = {
  createdAt: {
    type: GraphQLString,
    resolve: (obj) => (obj.createdAt ? obj.createdAt.toISOString() : null),
  },
  updatedAt: {
    type: GraphQLString,
    resolve: (obj) => (obj.updatedAt ? obj.updatedAt.toISOString() : null),
  },
};
