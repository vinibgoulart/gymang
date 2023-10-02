import { GRAPHQL_TYPE } from '@gymang/core';
import { Exercise, handleCreateExercise } from '@gymang/exercise';
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
  mutation WorkoutAddSpecMutation($input: WorkoutAddInput!) {
    WorkoutAdd(input: $input) {
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

it('should add a new workout', async () => {
  const user = await handleCreateUser();

  const input = {
    name: 'Chest Workout',
    isPublic: true,
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

  const workoutCreated = result.data.WorkoutAdd.workout;

  expect(workoutCreated?.user.firstName).toEqual(user.firstName);
  expect(workoutCreated?.createdBy.firstName).toEqual(user.firstName);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should add a new workout created by other user and duplicate splits and exercises', async () => {
  const user = await handleCreateUser();
  const userWithWorkout = await handleCreateUser();

  const existentWorkout = await handleCreateWorkout({
    user: userWithWorkout,
    createdBy: userWithWorkout,
  });

  const workoutSplit = await handleCreateWorkoutSplit({
    workout: existentWorkout,
  });

  await handleCreateExercise({
    workoutSplit,
  });

  const input = {
    name: 'Chest Workout',
    isPublic: true,
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

  const workoutCreated = result.data.WorkoutAdd.workout;

  expect(workoutCreated?.user.firstName).toEqual(user.firstName);
  expect(workoutCreated?.createdBy.firstName).toEqual(
    userWithWorkout.firstName,
  );

  const allWorkoutSplits = await WorkoutSplit.find();

  expect(allWorkoutSplits.length).toEqual(2);

  const allExercises = await Exercise.find();

  expect(allExercises.length).toEqual(2);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
