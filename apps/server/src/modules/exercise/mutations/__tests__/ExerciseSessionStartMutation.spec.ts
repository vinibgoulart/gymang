import { GRAPHQL_TYPE } from '@gymang/core';
import { Exercise, handleCreateExercise } from '@gymang/exercise';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@gymang/testutils';
import { handleCreateUser } from '@gymang/user';
import { handleCreateWorkoutSplit } from '@gymang/workout-split';
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { getContext } from '../../../../getContext';
import { schema as schemaWeb } from '../../../../graphql/schema/schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  mutation ExerciseSessionStartSpecMutation($input: ExerciseSessionStartInput!) {
    ExerciseSessionStart(input: $input) {
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

it('should start a exercise session', async () => {
  const user = await handleCreateUser();
  const exercise = await handleCreateExercise();

  const input = {
    id: toGlobalId('Exercise', exercise._id),
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

  expect(result.data.ExerciseSessionStart.error).toBeNull();
  expect(result.data.ExerciseSessionStart.success).toEqual(
    'Session created successfully',
  );

  const exerciseUpdated = await Exercise.findOne({
    _id: exercise._id,
  });

  expect(exerciseUpdated.sessions).toHaveLength(1);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not start a session for a exercise from another user', async () => {
  const user = await handleCreateUser();
  const anotherUser = await handleCreateUser();

  const exercise = await handleCreateExercise({
    user: anotherUser,
  });

  const input = {
    id: toGlobalId('Exercise', exercise._id),
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

  expect(result.data.ExerciseSessionStart.error).toEqual(
    'You can not initiate a Session for this exercise',
  );
  expect(result.data.ExerciseSessionStart.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not start a session for a exercise with a in progress session', async () => {
  const user = await handleCreateUser();

  const exercise = await handleCreateExercise({
    sessions: [
      {
        series: '1',
        repetitions: '1',
        breakTime: '1',
        muscleGroup: 'CHEST',
        weight: '1',
        finishedAt: null,
      },
    ],
  });

  const input = {
    id: toGlobalId('Exercise', exercise._id),
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

  expect(result.data.ExerciseSessionStart.error).toEqual(
    'You already have a session in progress, finish it first',
  );
  expect(result.data.ExerciseSessionStart.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should start a session for a exercise with a completed session', async () => {
  const user = await handleCreateUser();

  const exercise = await handleCreateExercise({
    sessions: [
      {
        series: '1',
        repetitions: '1',
        breakTime: '1',
        muscleGroup: 'CHEST',
        weight: '1',
        finishedAt: new Date(),
      },
    ],
  });

  const input = {
    id: toGlobalId('Exercise', exercise._id),
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

  expect(result.data.ExerciseSessionStart.error).toBeNull();
  expect(result.data.ExerciseSessionStart.success).toEqual(
    'Session created successfully',
  );

  const exerciseUpdated = await Exercise.findOne({
    _id: exercise._id,
  });

  expect(exerciseUpdated.sessions).toHaveLength(2);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not start a session for a workout split with an exercise in progress', async () => {
  const user = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit();

  await handleCreateExercise({
    workoutSplit,
    sessions: [
      {
        series: '1',
        repetitions: '1',
        breakTime: '1',
        muscleGroup: 'CHEST',
        weight: '1',
        finishedAt: null,
      },
    ],
  });

  const exercise = await handleCreateExercise({
    workoutSplit,
  });

  const input = {
    id: toGlobalId('Exercise', exercise._id),
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

  expect(result.data.ExerciseSessionStart.error).toEqual(
    'You already have a session in progress, finish it first',
  );
  expect(result.data.ExerciseSessionStart.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
