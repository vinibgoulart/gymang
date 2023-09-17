import type { GraphQLObjectType } from 'graphql';

import type { GraphQLContext, FieldObject } from '@gymang/types';

export const createTypeResolver =
  <T>(type: GraphQLObjectType<T, GraphQLContext>) =>
  <O>(key: keyof O) => ({
    [key]: {
      type,
      resolve: (obj: FieldObject<O>) => obj[key],
    },
  });
