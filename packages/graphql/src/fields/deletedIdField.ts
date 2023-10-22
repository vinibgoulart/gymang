import { GraphQLID } from 'graphql';
import { toGlobalId } from 'graphql-relay';

export const deletedIdField = (model: string, loader: any) => ({
  deletedId: {
    type: GraphQLID,
    resolve: async ({ deletedId }, _, context) => {
      const record = await loader.load(context, deletedId);

      if (!record) {
        return null;
      }

      return toGlobalId(model, deletedId);
    },
  },
});
