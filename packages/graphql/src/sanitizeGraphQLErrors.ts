import { GraphQLError } from 'graphql';

export const sanitizeGraphQLErrors = (error: GraphQLError) => ({
  message: 'Server error',
  path: error.path,
});
