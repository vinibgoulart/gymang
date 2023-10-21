import { GRAPHQL_TYPE } from '@gymang/core';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@gymang/testutils';
import { handleCreateUser } from '@gymang/user';
import { WorkoutSplit, handleCreateWorkoutSplit } from '@gymang/workout-split';
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { getContext } from '../../../../getContext';
import { schema as schemaWeb } from '../../../../graphql/schema/schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  mutation WorkoutSplitRecordStartSpecMutation($input: WorkoutSplitRecordStartInput!) {
    WorkoutSplitRecordStart(input: $input) {
      workoutSplit {
        id
        name
        user {
          firstName
        }
        records (first: 10) {
          edges {
            node {
              finishedAt
              id
            }
          }
        }
        lastRecord {
          finishedAt
          id
        }
        recordInProgress {
          finishedAt
          id
        }
      }
      success
      error
    }
  }
`;

it('should start a workout split record', async () => {
  const user = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit();

  const input = {
    workoutSplitId: toGlobalId('WorkoutSplit', workoutSplit._id),
  };

  const variables = {
    input,
  };

  const context = await getContext({
    graphql: GRAPHQL_TYPE.WEB,
    user,
  });

  const rootValue = {};

  const result = await graphql({
    schema: schemaWeb,
    source: query,
    rootValue,
    contextValue: context,
    variableValues: variables,
  });

  expect(result.errors).toBeUndefined();

  expect(result.data.WorkoutSplitRecordStart.error).toBeNull();
  expect(result.data.WorkoutSplitRecordStart.success).toEqual(
    'Record created successfully',
  );

  const workoutSplitUpdated = await WorkoutSplit.findOne({
    _id: workoutSplit._id,
  });

  expect(workoutSplitUpdated.records).toHaveLength(1);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not start a record for a workout split from another user', async () => {
  const user = await handleCreateUser();
  const anotherUser = await handleCreateUser();

  const workoutSplit = await handleCreateWorkoutSplit({
    user: anotherUser,
  });

  const input = {
    workoutSplitId: toGlobalId('WorkoutSplit', workoutSplit._id),
  };

  const variables = {
    input,
  };

  const context = await getContext({
    graphql: GRAPHQL_TYPE.WEB,
    user,
  });

  const rootValue = {};

  const result = await graphql({
    schema: schemaWeb,
    source: query,
    rootValue,
    contextValue: context,
    variableValues: variables,
  });

  expect(result.errors).toBeUndefined();

  expect(result.data.WorkoutSplitRecordStart.error).toEqual(
    'You can not initiate a record for this workout split',
  );
  expect(result.data.WorkoutSplitRecordStart.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not start a record for a workout split with a in progress record', async () => {
  const user = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit({
    withRecord: true,
  });

  const input = {
    workoutSplitId: toGlobalId('WorkoutSplit', workoutSplit._id),
  };

  const variables = {
    input,
  };

  const context = await getContext({
    graphql: GRAPHQL_TYPE.WEB,
    user,
  });

  const rootValue = {};

  const result = await graphql({
    schema: schemaWeb,
    source: query,
    rootValue,
    contextValue: context,
    variableValues: variables,
  });

  expect(result.errors).toBeUndefined();

  expect(result.data.WorkoutSplitRecordStart.error).toEqual(
    'You already have a record in progress, finish it first',
  );
  expect(result.data.WorkoutSplitRecordStart.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should start a record for a workout split with a completed record', async () => {
  const user = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit({
    withFinishedRecord: true,
  });

  const input = {
    workoutSplitId: toGlobalId('WorkoutSplit', workoutSplit._id),
  };

  const variables = {
    input,
  };

  const context = await getContext({
    graphql: GRAPHQL_TYPE.WEB,
    user,
  });

  const rootValue = {};

  const result = await graphql({
    schema: schemaWeb,
    source: query,
    rootValue,
    contextValue: context,
    variableValues: variables,
  });

  expect(result.errors).toBeUndefined();

  expect(result.data.WorkoutSplitRecordStart.error).toBeNull();
  expect(result.data.WorkoutSplitRecordStart.success).toEqual(
    'Record created successfully',
  );

  const workoutSplitUpdated = await WorkoutSplit.findOne({
    _id: workoutSplit._id,
  });

  expect(workoutSplitUpdated.records).toHaveLength(2);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
