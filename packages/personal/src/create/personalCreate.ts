import type { GraphQLContext } from '@gymang/core';

import { validatePersonalCreate } from './validatePersonalCreate';
import Personal from '../PersonalModel';

type PersonalCreatePayload = {
  email: string;
  password: string;
  firstName: string;
};

export type PersonalCreateArgs = {
  payload: PersonalCreatePayload;
  context: GraphQLContext;
  shouldCheckPersonalExistent?: boolean;
};

export const personalCreate = async ({
  payload,
  context,
  shouldCheckPersonalExistent = true,
}: PersonalCreateArgs) => {
  const {
    email,
    password,
    firstName,
    error: errorValidatePersonalCreate,
  } = await validatePersonalCreate({
    payload,
    context,
    shouldCheckPersonalExistent,
  });

  if (errorValidatePersonalCreate) {
    return {
      personal: null,
      error: errorValidatePersonalCreate,
    };
  }

  const personal = await new Personal({
    email,
    password,
    firstName,
  }).save();

  return {
    personal,
    error: null,
  };
};
