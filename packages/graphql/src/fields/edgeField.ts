import { toGlobalId } from 'graphql-relay';

import { GraphQLConnectionDefinitions } from '../connection/connectionDefinitions';

export type EdgeFieldParams<Context> = {
  connection: GraphQLConnectionDefinitions;
  load: (context: Context, id: string) => Promise<any>;
  name: string;
  edgeName: string;
  fieldName?: string;
};

export const edgeField = <Context extends object>({
  connection,
  load,
  name,
  edgeName,
  fieldName = 'id',
}: EdgeFieldParams<Context>) => ({
  [edgeName]: {
    type: connection.edgeType,
    resolve: async (output, args, context) => {
      const id = output[fieldName];

      const node = await load(context, id);

      if (!node) {
        return null;
      }

      return {
        cursor: toGlobalId(name, node._id),
        node,
      };
    },
  },
});
