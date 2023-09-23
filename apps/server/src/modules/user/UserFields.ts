import { isLoggedIn } from '@gymang/core';
import {
  edgeField,
  connectionArgs,
  NullConnection,
} from '@gymang/graphql';
import { UserLoader } from '@gymang/user';
import { GraphQLNonNull } from 'graphql';

import UserType, { UserConnection } from './UserType';

export const userTypeField = (key = 'user', bypassViewerCanSee = false) => ({
  [key]: {
    type: UserType,
    resolve: async (obj, args, context) => {
      return UserLoader.load(context, obj[key], bypassViewerCanSee);
    },
  },
});

export const userEdgeField = () =>
  edgeField({
    connection: UserConnection,
    load: UserLoader.load,
    edgeName: 'userEdge',
    name: 'User',
  });

export const userConnectionField = (customResolver = null) => ({
  users: {
    type: new GraphQLNonNull(UserConnection.connectionType),
    args: {
      ...connectionArgs,
      // filters: {
      //   type: UserFilterInputType,
      // },
    },
    resolve: (obj, args, context) => {
      if (customResolver) {
        return customResolver(obj, args, context);
      }

      if (!isLoggedIn(context)) {
        return NullConnection;
      }

      return UserLoader.loadAll(context, args);
    },
  },
});

export const meField = () => ({
  me: {
    type: UserType,
    resolve: (_root, _args, context) => {
      return UserLoader.load(context, context.user?._id);
    },
  },
});
