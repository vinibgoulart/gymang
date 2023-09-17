import type { Model, Types } from 'mongoose';

import { getObjectId } from '@gymang/graphql';

type Id = string | Model<any> | Types.ObjectId | null;

export const assertIdsAsString = (idA: Id, idB: Id) =>
  expect(getObjectId(idA).toString()).toBe(getObjectId(idB).toString());
