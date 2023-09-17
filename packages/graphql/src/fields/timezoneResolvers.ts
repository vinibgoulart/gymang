import { GraphQLString } from 'graphql';

export const timezoneResolvers = {
  timezone: {
    type: GraphQLString,
    description: 'timezone of this item',
    resolve: (obj) => obj.timezone ?? 'America/Sao_Paulo',
  },
};
