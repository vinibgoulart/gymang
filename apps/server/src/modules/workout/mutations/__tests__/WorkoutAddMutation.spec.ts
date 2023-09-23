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
  mutation WorkoutAddSpecMutation($input: WorkoutAddInput!) {
    WorkoutAdd(input: $input) {
      workout {
        id
        name
        description
        createdBy
        user
      }
      success
      error
    }
  }
`;

it('should add a new workout', async () => {
  const user = await handleCreateUser();

  const input = {
    name: 'Chest Workout',
    description: 'Hard work',
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

  expect(result.data.WorkoutAdd.error).toBeNull();
  expect(result.data.WorkoutAdd.success).toEqual(
    'Workout created successfully',
  );

  const workoutCreated = await Workout.findOne();

  expect(workoutCreated?.user).toEqual(user._id);
  expect(workoutCreated?.createdBy).toEqual(user._id);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should add a new workout created by other user', async () => {
  const user = await handleCreateUser();

  const userWithWorkout = await handleCreateUser();
  const existentWorkout = await handleCreateWorkout({
    user: userWithWorkout,
    createdBy: userWithWorkout,
  });

  const input = {
    name: 'Chest Workout',
    description: 'Hard work',
    originalWorkout: toGlobalId('Workout', existentWorkout._id),
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

  expect(result.data.WorkoutAdd.error).toBeNull();
  expect(result.data.WorkoutAdd.success).toEqual(
    'Workout created successfully',
  );

  console.log({ test: result.data.WorkoutAdd });
  const workoutCreated = result.data.WorkoutAdd.workout;

  expect(workoutCreated?.user).toEqual(user._id.toString());
  expect(workoutCreated?.createdBy).toEqual(userWithWorkout._id.toString());

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
