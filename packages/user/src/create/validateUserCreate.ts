import { UserCreateArgs } from './userCreate';
import User from '../UserModel';

type ValidateUserCreateArgs = {} & UserCreateArgs;

export const validateUserCreate = async ({
  payload,
  context,
  shouldCheckUserExistent = true,
}: ValidateUserCreateArgs) => {
  const { t } = context;
  const { email, password, firstName } = payload;

  if (!email) {
    return {
      email: null,
      password: null,
      firstName: null,
      error: t('Email is required'),
    };
  }

  if (!password) {
    return {
      email: null,
      password: null,
      firstName: null,
      error: t('Password is required'),
    };
  }

  if (!firstName) {
    return {
      email: null,
      password: null,
      firstName: null,
      error: t('First name is required'),
    };
  }

  if (shouldCheckUserExistent) {
    const userExistent = await User.findOne({
      email: email.trim().toLowerCase(),
      removedAt: null,
    });

    if (userExistent) {
      return {
        email: null,
        password: null,
        firstName: null,
        error: t('Email already in use'),
      };
    }
  }

  return {
    email,
    password,
    firstName,
    error: null,
  };
};
