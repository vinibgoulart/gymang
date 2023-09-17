import {
  cleanupTest,
  connectMongoose,
  disconnectMongoose,
  mongooseObjectIdToString,
} from '@gymang/test';

import { createMongooseUser } from '../__fixtures__/helpers';
import UserFixtureModel from '../__fixtures__/UserFixtureModel';
import { connectionFromMongoCursor } from '../connectionFromMongoCursor';

beforeAll(connectMongoose);

beforeEach(cleanupTest);

afterAll(disconnectMongoose);

it('should return connection from mongo cursor', async () => {
  const userA = await createMongooseUser();
  const userB = await createMongooseUser();
  const userC = await createMongooseUser();
  const userD = await createMongooseUser();

  const cursor = UserFixtureModel.find();
  const context = {
    // got it throwing a 🎲
    randomValue: 2,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const argsFirstPage = { first: 2 };

  const resultFirstPage = await connectionFromMongoCursor({
    cursor,
    context,
    args: argsFirstPage,
    loader,
    shouldCount: true,
    useEstimatedCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(2);
  expect(mongooseObjectIdToString(loader.mock.calls[0])).toEqual(
    mongooseObjectIdToString([context, userA._id]),
  );
  expect(mongooseObjectIdToString(loader.mock.calls[1])).toEqual(
    mongooseObjectIdToString([context, userB._id]),
  );
  expect(resultFirstPage).toMatchSnapshot();

  // second page

  const argsSecondPage = { after: resultFirstPage.pageInfo.endCursor };

  const resultSecondPage = await connectionFromMongoCursor({
    cursor,
    context,
    args: argsSecondPage,
    loader,
    shouldCount: true,
    useEstimatedCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(4);
  expect(mongooseObjectIdToString(loader.mock.calls[2])).toEqual(
    mongooseObjectIdToString([context, userC._id]),
  );
  expect(mongooseObjectIdToString(loader.mock.calls[3])).toEqual(
    mongooseObjectIdToString([context, userD._id]),
  );
  expect(resultSecondPage).toMatchSnapshot();
});

it('should work with empty args', async () => {
  const userA = await createMongooseUser();

  await createMongooseUser();
  await createMongooseUser();
  await createMongooseUser();

  const cursor = UserFixtureModel.find();
  const context = {
    // got it throwing a 🎲
    randomValue: 2,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const args = {};

  const result = await connectionFromMongoCursor({
    cursor,
    context,
    args,
    loader,
    shouldCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(4);
  expect(mongooseObjectIdToString(loader.mock.calls[0])).toEqual(
    mongooseObjectIdToString([context, userA._id]),
  );
  expect(result).toMatchSnapshot();
});

it('should work with empty args and empty result', async () => {
  const cursor = UserFixtureModel.find();
  const context = {
    // got it throwing a 🎲
    randomValue: 2,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const args = {};

  const result = await connectionFromMongoCursor({
    cursor,
    context,
    args,
    loader,
    shouldCount: true,
  });

  expect(loader).not.toHaveBeenCalled();
  expect(result).toMatchSnapshot();
});

it('should return connection from mongo cursor using raw', async () => {
  const userA = await createMongooseUser();

  await createMongooseUser();
  await createMongooseUser();
  await createMongooseUser();

  const cursor = UserFixtureModel.find();
  const context = {
    // got it throwing a 🎲
    randomValue: 2,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const argsFirstPage = { first: 2 };

  const resultFirstPage = await connectionFromMongoCursor({
    cursor,
    context,
    args: argsFirstPage,
    loader,
    raw: true,
    shouldCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(2);
  expect(loader.mock.calls[0][1].name).toEqual(userA.name);
  expect(resultFirstPage).toMatchSnapshot();
});

it('should return connection from mongo cursor using first 1 and last as null', async () => {
  await createMongooseUser();
  await createMongooseUser();
  await createMongooseUser();
  await createMongooseUser();

  const cursor = UserFixtureModel.find();
  const context = {
    // got it throwing a 🎲
    randomValue: 2,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const argsFirstPage = {
    first: 1,
    before: null,
    last: null,
    after: null,
    search: '',
  };

  const resultFirstPage = await connectionFromMongoCursor({
    cursor,
    context,
    args: argsFirstPage,
    loader,
    raw: true,
    shouldCount: true,
  });

  expect(resultFirstPage.edges.length).toBe(1);
  expect(loader).toHaveBeenCalledTimes(1);
});

it('should return connection from mongo cursor with useEstimatedCount', async () => {
  const userA = await createMongooseUser();
  const userB = await createMongooseUser();
  const userC = await createMongooseUser();
  const userD = await createMongooseUser();

  const cursor = UserFixtureModel.find();
  const context = {
    // got it throwing a 🎲
    randomValue: 2,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const argsFirstPage = { first: 2 };

  const resultFirstPage = await connectionFromMongoCursor({
    cursor,
    context,
    args: argsFirstPage,
    loader,
    useEstimatedCount: true,
    shouldCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(2);
  expect(mongooseObjectIdToString(loader.mock.calls[0])).toEqual(
    mongooseObjectIdToString([context, userA._id]),
  );
  expect(mongooseObjectIdToString(loader.mock.calls[1])).toEqual(
    mongooseObjectIdToString([context, userB._id]),
  );
  expect(resultFirstPage).toMatchSnapshot();

  // second page

  const argsSecondPage = { after: resultFirstPage.pageInfo.endCursor };

  const resultSecondPage = await connectionFromMongoCursor({
    cursor,
    context,
    args: argsSecondPage,
    loader,
    shouldCount: true,
    useEstimatedCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(4);
  expect(mongooseObjectIdToString(loader.mock.calls[2])).toEqual(
    mongooseObjectIdToString([context, userC._id]),
  );
  expect(mongooseObjectIdToString(loader.mock.calls[3])).toEqual(
    mongooseObjectIdToString([context, userD._id]),
  );
  expect(resultSecondPage).toMatchSnapshot();
});

it('should return connection from mongo cursor using lean equals false', async () => {
  const userA = await createMongooseUser();
  const userB = await createMongooseUser();
  const userC = await createMongooseUser();
  const userD = await createMongooseUser();

  const cursor = UserFixtureModel.find();
  const context = {
    // got it throwing a 🎲
    randomValue: 2,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const argsFirstPage = { first: 2 };

  const resultFirstPage = await connectionFromMongoCursor({
    cursor,
    context,
    args: argsFirstPage,
    loader,
    lean: false,
    shouldCount: true,
    useEstimatedCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(2);
  expect(mongooseObjectIdToString(loader.mock.calls[0])).toEqual(
    mongooseObjectIdToString([context, userA._id]),
  );
  expect(mongooseObjectIdToString(loader.mock.calls[1])).toEqual(
    mongooseObjectIdToString([context, userB._id]),
  );
  expect(resultFirstPage).toMatchSnapshot();

  // second page

  const argsSecondPage = { after: resultFirstPage.pageInfo.endCursor };

  const resultSecondPage = await connectionFromMongoCursor({
    cursor,
    context,
    args: argsSecondPage,
    loader,
    useEstimatedCount: true,
    shouldCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(4);
  expect(mongooseObjectIdToString(loader.mock.calls[2])).toEqual(
    mongooseObjectIdToString([context, userC._id]),
  );
  expect(mongooseObjectIdToString(loader.mock.calls[3])).toEqual(
    mongooseObjectIdToString([context, userD._id]),
  );
  expect(resultSecondPage).toMatchSnapshot();
});
