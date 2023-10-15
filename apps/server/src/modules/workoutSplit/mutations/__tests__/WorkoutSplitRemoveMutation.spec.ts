import { GRAPHQL_TYPE } from '@gymang/core';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@gymang/testutils';
import { handleCreateUser } from '@gymang/user';
import { handleCreateWorkout } from '@gymang/workout';
import { WorkoutSplit, handleCreateWorkoutSplit } from '@gymang/workout-split';
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { getContext } from '../../../../getContext';
import { schema as schemaWeb } from '../../../../graphql/schema/schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  mutation WorkoutSplitRemoveSpecMutation($input: WorkoutSplitRemoveInput!) {
    WorkoutSplitRemove(input: $input) {
      workoutSplit {
        id
        name
        user {
          firstName
        }
        modality
        workout {
          id
          name
        }
      }
      success
      error
    }
  }
`;

it('should remove a workout split', async () => {
  const user = await handleCreateUser();
  const workouSplit = await handleCreateWorkoutSplit();

  const input = {
    id: toGlobalId('WorkoutSplit', workouSplit._id),
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

  expect(result.data.WorkoutSplitRemove.error).toBeNull();
  expect(result.data.WorkoutSplitRemove.success).toEqual(
    'Workout Split removed successfully',
  );

  const workoutSplitRemoved = await WorkoutSplit.findOne({
    _id: workouSplit._id,
  });

  expect(workoutSplitRemoved.removedAt).toBeDefined();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not remove a workout split already removed', async () => {
  const user = await handleCreateUser();
  const workouSplit = await handleCreateWorkoutSplit({
    removedAt: new Date(),
  });

  const input = {
    id: toGlobalId('WorkoutSplit', workouSplit._id),
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

  expect(result.data.WorkoutSplitRemove.error).toEqual(
    'Workout Split not found',
  );
  expect(result.data.WorkoutSplitRemove.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not remove a workout split from another user', async () => {
  const user = await handleCreateUser();
  const anotherUser = await handleCreateUser();
  const workouSplit = await handleCreateWorkoutSplit({
    user: anotherUser,
  });

  const input = {
    id: toGlobalId('WorkoutSplit', workouSplit._id),
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

  expect(result.data.WorkoutSplitRemove.error).toEqual(
    'You are not allowed to remove this workout split',
  );
  expect(result.data.WorkoutSplitRemove.success).toBeNull();

  const workoutSplitRemoved = await WorkoutSplit.findOne({
    _id: workouSplit._id,
  });

  expect(workoutSplitRemoved.removedAt).toBeDefined();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not remove a workout split using a removed workout', async () => {
  const user = await handleCreateUser();
  const workout = await handleCreateWorkout({
    removedAt: new Date(),
  });
  const workouSplit = await handleCreateWorkoutSplit({
    workout,
  });

  const input = {
    id: toGlobalId('WorkoutSplit', workouSplit._id),
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

  expect(result.data.WorkoutSplitRemove.error).toEqual('Workout not found');
  expect(result.data.WorkoutSplitRemove.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
