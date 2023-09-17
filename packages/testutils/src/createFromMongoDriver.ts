import type { Document } from 'mongoose';
import mongoose from 'mongoose';

// import * as M from '../src/models';

// rethink this approach
export const createFromMongoDriver = async <T extends Record<string, unknown>>(
  createRow: (args: T) => Promise<Document>,
  overrides: { [key: string]: any },
  args: T = {},
) => {
  const defaultRow = await createRow(args);
  const collectionName = defaultRow.collection.name;

  const model = mongoose.models[collectionName];

  const leanFixture = await model.findOne({ _id: defaultRow._id }).lean();

  await model.findOne({ _id: defaultRow._id }).deleteOne();

  // try updateOne $unset approach
  // await model.findOneAndUpdate({
  //   _id: defaultRow._id,
  // }, {
  //   $unset: {
  //     ...fields,
  //   },
  // })

  const fixtureWithOverrides = {
    ...leanFixture,
    ...overrides,
  };

  // remove undefined objects from the object, kinda like a mongo db unset
  Object.keys(fixtureWithOverrides).forEach((key) => {
    if (fixtureWithOverrides[key] === undefined) {
      delete fixtureWithOverrides[key];
    }
  });

  const result = await model.collection.insertOne(fixtureWithOverrides);

  const data = await model.collection.findOne({ _id: result.insertedId });

  return data;
};

export const createRowWithoutDefaults =
  (createRow: () => Promise<Document>, overrides: { [key: string]: any }) =>
  async (args) =>
    await createFromMongoDriver(createRow, overrides, args);
