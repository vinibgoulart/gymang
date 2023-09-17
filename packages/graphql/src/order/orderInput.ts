import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql';

import { DirectionEnum } from './DirectionEnum';

export const orderInput = (name: string, sort: GraphQLEnumType) =>
  new GraphQLInputObjectType({
    name,
    fields: () => ({
      sort: {
        type: new GraphQLNonNull(sort),
      },
      direction: {
        type: new GraphQLNonNull(DirectionEnum),
      },
    }),
  });
