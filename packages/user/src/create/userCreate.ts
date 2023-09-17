import { GraphQLContext } from '@gymang/core';
import User from '../UserModel';
import { validateUserCreate } from './validateUserCreate';

type UserCreatePayload = {
  email: string;
  password: string;
  firstName: string;
};

export type UserCreateArgs = {
  payload: UserCreatePayload;
  context: GraphQLContext;
  shouldCheckUserExistent?: boolean;
};

export const userCreate = async ({
  payload,
  context,
  shouldCheckUserExistent = true,
}: UserCreateArgs) => {
  const {
    email,
    password,
    firstName,
    error: errorValidateUserCreate,
  } = await validateUserCreate({ payload, context, shouldCheckUserExistent });

  if (errorValidateUserCreate) {
    return {
      user: null,
      error: errorValidateUserCreate,
    };
  }

  const user = await new User({
    email,
    password,
    firstName,
  }).save();

  return {
    user,
    error: null,
  };
};
