import { GraphQLID, GraphQLNonNull } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { typeResolver } from './typeRegistry';

export const globalIdFieldTypeResolver = () => ({
  description: 'The ID of an object',
  type: new GraphQLNonNull(GraphQLID),
  resolve: (obj) => {
    const typeName = typeResolver(obj);

    return toGlobalId(typeName, obj._id);
  },
});
