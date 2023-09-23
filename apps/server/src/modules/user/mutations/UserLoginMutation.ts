import { errorField, successField } from '@gymang/graphql';
import {
  generateUserToken,
  setSessionTokenCookie,
  USER_SESSION_COOKIE,
  USER_TOKEN_SCOPES,
} from '@gymang/session';
import { User } from '@gymang/user';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { userTypeField } from '../UserFields';

type UserLoginArgs = { email: string; password: string };

const mutation = mutationWithClientMutationId({
  name: 'UserLogin',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ email, password }: UserLoginArgs, context) => {
    const { t } = context;

    if (!email || !password) {
      return {
        user: null,
        success: null,
        error: t('Fill all the fields'),
      };
    }

    const user = await User.findOne({
      email,
      removedAt: null,
    });

    if (!user) {
      return {
        user: null,
        success: null,
        error: t('User not found'),
      };
    }

    const passwordMatch = user.authenticate(password);

    if (!passwordMatch) {
      return {
        user: null,
        success: null,
        error: t('Email or password wrong'),
      };
    }

    const userToken = generateUserToken(user, USER_TOKEN_SCOPES.SESSION);

    await setSessionTokenCookie(
      context,
      USER_SESSION_COOKIE,
      `JWT ${userToken}`,
    );

    return {
      user: user._id,
      success: t('Logged in successfully'),
      error: null,
    };
  },
  outputFields: {
    ...userTypeField('user', true),
    ...errorField,
    ...successField,
  },
});

export default {
  ...mutation,
};
