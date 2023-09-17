import { GraphQLString } from 'graphql';

export const dateFilterFields = (key: string) => ({
  [`${key}_gt`]: {
    type: GraphQLString,
  },
  [`${key}_gte`]: {
    type: GraphQLString,
  },
  [`${key}_lt`]: {
    type: GraphQLString,
  },
  [`${key}_lte`]: {
    type: GraphQLString,
  },
});
