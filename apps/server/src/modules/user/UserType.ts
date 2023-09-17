import { GraphQLContext } from '@gymang/core';
import {
  connectionDefinitions,
  nodeInterface,
  registerTypeLoader,
} from '@gymang/graphql';
import { IUser, UserLoader } from '@gymang/user';
import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

const UserType = new GraphQLObjectType<IUser, GraphQLContext>({
  name: 'User',
  description: 'Represents a User',
  fields: () => ({
    id: globalIdField('User'),
    firstName: {
      type: GraphQLString,
      resolve: (user) => user.firstName,
    },
    email: {
      type: GraphQLString,
      resolve: (user) => user.email,
    },
  }),
  interfaces: () => [nodeInterface],
});

export const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

registerTypeLoader(UserType, UserLoader.load);

export default UserType;
