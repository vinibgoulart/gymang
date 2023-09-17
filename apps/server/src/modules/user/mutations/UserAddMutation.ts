import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { userTypeField } from '../UserFields';
import { userCreate } from '@gymang/user';
import { errorField, successField } from '@gymang/graphql';

type RegisterMutationArgs = {
  email: string;
  password: string;
  firstName: string;
};

const mutation = mutationWithClientMutationId({
  name: 'UserAdd',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { email, password, firstName }: RegisterMutationArgs,
    context,
  ) => {
    const { t } = context;

    const payload = {
      email,
      password,
      firstName,
    };

    const { user, error } = await userCreate({
      payload,
      context,
    });

    if (error) {
      return {
        error,
      };
    }

    return {
      user: user!._id,
      success: t('User created successfully'),
      error: null,
    };
  },
  outputFields: {
    ...userTypeField(),
    ...errorField,
    ...successField,
  },
});

export default {
  ...mutation,
};
