import { GraphQLString } from 'graphql';

export const createdAtField = {
  createdAt: {
    type: GraphQLString,
    resolve: (obj) => (obj.createdAt ? obj.createdAt.toISOString() : null),
  },
};
