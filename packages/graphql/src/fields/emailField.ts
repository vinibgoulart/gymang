import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export const EmailType = new GraphQLObjectType({
  name: 'Email',
  description: 'Email and verification status',
  fields: () => ({
    email: {
      type: GraphQLString,
      resolve: (email) => email.email,
    },
    wasVerified: {
      type: GraphQLBoolean,
      resolve: (email) => email.wasVerified,
    },
  }),
});

export const emailsField = {
  emails: {
    type: new GraphQLList(EmailType),
    resolve: ({ emails }) => emails ?? [],
  },
};

export const emailField = {
  email: {
    type: EmailType,
    resolve: ({ email }) => email,
  },
};
