import type { DeepPartial } from '@gymang/types';

import type { IUser } from '../UserModel';
import User from '../UserModel';

type UserOptions = {};

type HandleCreateUserArgs = DeepPartial<IUser> & UserOptions;

export const handleCreateUser = async (
  args: HandleCreateUserArgs = {},
): Promise<IUser> => {
  let { firstName, email, ...payload } = args;

  const n = (global.__COUNTERS__.user += 1);

  if (firstName === undefined) {
    firstName = `User ${n} firstName`;
  }

  if (email === undefined) {
    email = `user${n}@example.com`;
  }

  return new User({
    firstName,
    password: '123#123',
    email,
    ...payload,
  }).save();
};
