import { GRAPHQL_TYPE } from '@gymang/core';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@gymang/testutils';
import { handleCreateUser } from '@gymang/user';
import { Workout, handleCreateWorkout } from '@gymang/workout';
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { getContext } from '../../../../getContext';
import { schema as schemaWeb } from '../../../../graphql/schema/schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  mutation WorkoutRemoveSpecMutation($input: WorkoutRemoveInput!) {
    WorkoutRemove(input: $input) {
      workout {
        id
        name
        createdBy {
          firstName
        }
        user {
          firstName
        }
      }
      success
      error
    }
  }
`;

it('should remove a workout', async () => {
  const user = await handleCreateUser();
  const workout = await handleCreateWorkout();

  const input = {
    id: toGlobalId('Workout', workout._id),
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

  expect(result.data.WorkoutRemove.error).toBeNull();
  expect(result.data.WorkoutRemove.success).toEqual(
    'Workout removed successfully',
  );

  const workoutRemoved = await Workout.findOne({
    _id: workout._id,
  });

  expect(workoutRemoved.removedAt).toBeDefined();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not remove a workout already removed', async () => {
  const user = await handleCreateUser();
  const workout = await handleCreateWorkout({
    removedAt: new Date(),
  });

  const input = {
    id: toGlobalId('Workout', workout._id),
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

  expect(result.data.WorkoutRemove.error).toEqual('Workout already removed');
  expect(result.data.WorkoutRemove.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not remove a workout from another user', async () => {
  const user = await handleCreateUser();
  const anotherUser = await handleCreateUser();

  const workout = await handleCreateWorkout({
    user: anotherUser,
  });

  const input = {
    id: toGlobalId('Workout', workout._id),
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

  expect(result.data.WorkoutRemove.error).toEqual(
    'You are not allowed to remove this workout',
  );
  expect(result.data.WorkoutRemove.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
