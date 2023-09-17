import { GRAPHQL_TYPE } from './graphqlType';
import { GraphQLContext } from '@gymang/types';

export const isLoggedIn = (context: GraphQLContext, graphqlType?: string) => {
  const { user, graphql } = context;

  // also validate graphqlType if its passed
  if (graphqlType && graphql !== graphqlType) {
    return false;
  }

  if (graphql === GRAPHQL_TYPE.WEB && user?.__typename === 'User') {
    return true;
  }

  return false;
};
