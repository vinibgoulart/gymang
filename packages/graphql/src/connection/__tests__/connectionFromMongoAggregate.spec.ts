import { cleanupTest, connectMongoose, disconnectMongoose } from '@gymang/test';

import GroupModel from '../__fixtures__/GroupFixtureModel';
import {
  createMongooseGroup,
  createMongooseUser,
} from '../__fixtures__/helpers';
import { connectionFromMongoAggregate } from '../connectionFromMongoAggregate';

beforeAll(connectMongoose);

beforeEach(cleanupTest);

afterAll(disconnectMongoose);

// failing by sort
it.skip('should return connection from mongo aggregate', async () => {
  const userA = await createMongooseUser();
  const userB = await createMongooseUser();

  await createMongooseUser();
  await createMongooseUser();

  await createMongooseGroup({ users: [userA._id, userB._id] });

  // simple aggregate to return all users inside any group
  const aggregate = GroupModel.aggregate([
    {
      $lookup: {
        from: 'UserFixture',
        localField: 'users',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      // remove empty groups
      $match: { users: { $exists: true, $ne: [] } },
    },
    {
      // promote each user to a new document
      $unwind: '$users',
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $replaceRoot: { newRoot: '$users' },
    },
  ]).allowDiskUse(true);

  const context = {
    // got it throwing a 🎲
    randomValue: 1,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const argsFirstPage = { first: 1 };

  const resultFirstPage = await connectionFromMongoAggregate({
    aggregate,
    context,
    args: argsFirstPage,
    loader,
    shouldCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(1);
  expect(loader.mock.calls[0]).toEqual([context, userA._id]);
  expect(resultFirstPage).toMatchSnapshot();

  const argsSecondPage = { after: resultFirstPage.pageInfo.endCursor };

  const resultSecondPage = await connectionFromMongoAggregate({
    aggregate,
    context,
    args: argsSecondPage,
    loader,
    shouldCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(2);
  expect(loader.mock.calls[1]).toEqual([context, userB._id]);
  expect(resultSecondPage).toMatchSnapshot();
});

// failing because of order
it.skip('should work with empty args', async () => {
  const userA = await createMongooseUser();
  const userB = await createMongooseUser();

  await createMongooseGroup({ users: [userA._id, userB._id] });

  // simple aggregate to return all users inside any group
  const aggregate = GroupModel.aggregate([
    {
      $lookup: {
        from: 'UserFixture',
        localField: 'users',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      // remove empty groups
      $match: { users: { $exists: true, $ne: [] } },
    },
    {
      // promote each user to a new document
      $unwind: '$users',
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $replaceRoot: { newRoot: '$users' },
    },
  ]).allowDiskUse(true);

  const context = {
    // got it throwing a 🎲
    randomValue: 1,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const args = {};

  const result = await connectionFromMongoAggregate({
    aggregate,
    context,
    args,
    loader,
    shouldCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(2);
  expect(loader.mock.calls[0]).toEqual([context, userA._id]);
  expect(result).toMatchSnapshot();
});

it('should work with empty args and empty result', async () => {
  // simple aggregate to return all users inside any group
  const aggregate = GroupModel.aggregate([
    {
      $lookup: {
        from: 'UserFixture',
        localField: 'users',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      // remove empty groups
      $match: { users: { $exists: true, $ne: [] } },
    },
    {
      // promote each user to a new document
      $unwind: '$users',
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $replaceRoot: { newRoot: '$users' },
    },
  ]).allowDiskUse(true);

  const context = {
    // got it throwing a 🎲
    randomValue: 1,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const args = {};

  const result = await connectionFromMongoAggregate({
    aggregate,
    context,
    args,
    loader,
    shouldCount: true,
  });

  expect(loader).not.toHaveBeenCalled();
  expect(result).toMatchSnapshot();
});

// sort failing
it.skip('should return connection from mongo aggregate with raw', async () => {
  const userA = await createMongooseUser();
  const userB = await createMongooseUser();

  await createMongooseUser();
  await createMongooseUser();

  await createMongooseGroup({ users: [userA._id, userB._id] });

  // simple aggregate to return all users inside any group
  const aggregate = GroupModel.aggregate([
    {
      $lookup: {
        from: 'UserFixture',
        localField: 'users',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      // remove empty groups
      $match: { users: { $exists: true, $ne: [] } },
    },
    {
      // promote each user to a new document
      $unwind: '$users',
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $replaceRoot: { newRoot: '$users' },
    },
  ]).allowDiskUse(true);

  const context = {
    // got it throwing a 🎲
    randomValue: 1,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const argsFirstPage = { first: 1 };

  const resultFirstPage = await connectionFromMongoAggregate({
    aggregate,
    context,
    args: argsFirstPage,
    loader,
    raw: true,
    shouldCount: true,
  });

  expect(loader).toHaveBeenCalledTimes(1);
  expect(loader.mock.calls[0][1].name).toEqual(userA.name);
  expect(resultFirstPage).toMatchSnapshot();
});

it('should not return negative limit', async () => {
  const userA = await createMongooseUser();
  const userB = await createMongooseUser();

  await createMongooseUser();
  await createMongooseUser();

  await createMongooseGroup({ users: [userA._id, userB._id] });

  // simple aggregate to return all users inside any group
  const aggregate = GroupModel.aggregate([
    {
      $lookup: {
        from: 'UserFixture',
        localField: 'users',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      // remove empty groups
      $match: { users: { $exists: true, $ne: [] } },
    },
    {
      // promote each user to a new document
      $unwind: '$users',
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $replaceRoot: { newRoot: '$users' },
    },
  ]).allowDiskUse(true);

  const context = {
    // got it throwing a 🎲
    randomValue: 1,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const args = { first: 10, after: 'bW9uZ286OQ==' };

  const result = await connectionFromMongoAggregate({
    aggregate,
    context,
    args,
    loader,
    shouldCount: true,
  });

  expect(result).toMatchSnapshot();
});

it('should return correct connection and hasNextPage when using shouldCount=false', async () => {
  const userA = await createMongooseUser();
  const userB = await createMongooseUser();
  const userC = await createMongooseUser();
  const userD = await createMongooseUser();
  const userE = await createMongooseUser();
  const userF = await createMongooseUser();

  await createMongooseUser();
  await createMongooseUser();

  await createMongooseGroup({
    users: [userA._id, userB._id, userC._id, userD._id, userE._id, userF._id],
  });

  // simple aggregate to return all users inside any group
  const aggregate = GroupModel.aggregate([
    {
      $lookup: {
        from: 'UserFixture',
        localField: 'users',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      // remove empty groups
      $match: { users: { $exists: true, $ne: [] } },
    },
    {
      // promote each user to a new document
      $unwind: '$users',
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $replaceRoot: { newRoot: '$users' },
    },
  ]).allowDiskUse(true);

  const context = {
    // got it throwing a 🎲
    randomValue: 1,
  };

  const loader = jest.fn();

  loader.mockReturnValue('user');

  const args = {
    first: 5,
  };

  const result = await connectionFromMongoAggregate({
    aggregate,
    context,
    args,
    loader,
    shouldCount: false,
  });

  expect(loader).toHaveBeenCalledTimes(5);
  expect(result.edges.length).toBe(5);
  expect(result).toMatchSnapshot();
});
