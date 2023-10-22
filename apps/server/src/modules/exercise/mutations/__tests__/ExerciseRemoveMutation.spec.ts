import { GRAPHQL_TYPE } from '@gymang/core';
import { Exercise, handleCreateExercise } from '@gymang/exercise';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@gymang/testutils';
import { handleCreateUser } from '@gymang/user';
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import MockDate from 'mockdate';

import { getContext } from '../../../../getContext';
import { schema as schemaWeb } from '../../../../graphql/schema/schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  mutation ExerciseRemoveSpecMutation($input: ExerciseRemoveInput!) {
    ExerciseRemove(input: $input) {
      exercise {
        id
        name
        user {
          firstName
        }
        workoutSplit {
          id
          name
        }
        series
        repetitions
        breakTime
        muscleGroup
        weight
      }
      success
      error
    }
  }
`;

MockDate.set(new Date('2030-06-01T00:00:00.000Z'));

it('should remove a exercise', async () => {
  const user = await handleCreateUser();
  const exercise = await handleCreateExercise();

  const input = {
    exerciseId: toGlobalId('Exercise', exercise._id),
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

  expect(result.data.ExerciseRemove.error).toBeNull();
  expect(result.data.ExerciseRemove.success).toEqual(
    'Exercise removed successfully',
  );

  const exerciseRemoved = await Exercise.findOne({
    _id: exercise._id,
  });

  expect(exerciseRemoved?.removedAt).toBeDefined();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not remove a new exercise for another user', async () => {
  const user = await handleCreateUser();
  const anotherUser = await handleCreateUser();

  const exercise = await handleCreateExercise({
    user: anotherUser,
  });

  const input = {
    exerciseId: toGlobalId('Exercise', exercise._id),
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

  expect(result.data.ExerciseRemove.error).toEqual(
    'You are not allowed to remove this exercise',
  );
  expect(result.data.ExerciseRemove.success).toBeNull();

  const exerciseNotRemoved = await Exercise.findOne({
    _id: exercise._id,
  });

  expect(exerciseNotRemoved?.removedAt).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not remove a removed exercise', async () => {
  const removedAt = new Date();

  const user = await handleCreateUser();
  const exercise = await handleCreateExercise({
    removedAt,
  });

  const input = {
    exerciseId: toGlobalId('Exercise', exercise._id),
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

  expect(result.data.ExerciseRemove.error).toEqual('Exercise already removed');
  expect(result.data.ExerciseRemove.success).toBeNull();

  const exerciseNotRemoved = await Exercise.findOne({
    _id: exercise._id,
  });

  expect(exerciseNotRemoved?.removedAt).toEqual(removedAt);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
