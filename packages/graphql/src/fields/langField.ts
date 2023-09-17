import { GraphQLString } from 'graphql';

export const langField = {
  lang: {
    type: GraphQLString,
    resolve: ({ lang }) => lang ?? 'pt-BR',
  },
};
