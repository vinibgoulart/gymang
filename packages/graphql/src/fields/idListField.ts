import { GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
import { toGlobalId } from 'graphql-relay';

type WithIds = {
  ids: string[];
};

export const idListField = <T extends WithIds>(
  typeName: string,
  key = 'ids',
) => ({
  [key]: {
    type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    resolve: async ({ ids }: T) => {
      if (!ids) {
        return null;
      }

      return ids.map((id) => toGlobalId(typeName, id));
    },
  },
});
