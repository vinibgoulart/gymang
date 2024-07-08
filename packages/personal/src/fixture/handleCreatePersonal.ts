import type { DeepPartial } from '@gymang/types';

import type { IPersonal } from '../PersonalModel';
import Personal from '../PersonalModel';

type PersonalOptions = {};

type HandleCreatePersonalArgs = DeepPartial<IPersonal> & PersonalOptions;

export const handleCreatePersonal = async (
  args: HandleCreatePersonalArgs = {},
): Promise<IPersonal> => {
  let { firstName, email, ...payload } = args;

  const n = (global.__COUNTERS__.personal += 1);

  if (firstName === undefined) {
    firstName = `Personal ${n} firstName`;
  }

  if (email === undefined) {
    email = `personal${n}@example.com`;
  }

  return new Personal({
    firstName,
    password: '123#123',
    email,
    ...payload,
  }).save();
};
