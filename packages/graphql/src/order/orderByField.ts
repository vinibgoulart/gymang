import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull } from 'graphql';

export const orderByField = (orderInput: GraphQLInputObjectType) => ({
  orderBy: {
    type: new GraphQLList(new GraphQLNonNull(orderInput)),
  },
});
