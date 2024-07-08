import type { PersonalCreateArgs } from './personalCreate';
import Personal from '../PersonalModel';

type ValidatePersonalCreateArgs = {} & PersonalCreateArgs;

export const validatePersonalCreate = async ({
  payload,
  context,
  shouldCheckPersonalExistent = true,
}: ValidatePersonalCreateArgs) => {
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

  if (shouldCheckPersonalExistent) {
    const personalExistent = await Personal.findOne({
      email: email.trim().toLowerCase(),
      removedAt: null,
    });

    if (personalExistent) {
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
