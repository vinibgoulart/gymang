import { GRAPHQL_TYPE } from '@gymang/core';
import { MUSCLE_GROUP } from '@gymang/enums';
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
  mutation ExerciseAddSpecMutation($input: ExerciseAddInput!) {
    ExerciseAdd(input: $input) {
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

it('should add a new exercise', async () => {
  const user = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit();

  const input = {
    name: 'Pull Down',
    workoutSplit: toGlobalId('WorkoutSplit', workoutSplit._id),
    series: '3',
    repetitions: '10',
    weight: '50',
    breakTime: '60',
    muscleGroup: MUSCLE_GROUP.BACK,
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

  expect(result.data.ExerciseAdd.error).toBeNull();
  expect(result.data.ExerciseAdd.success).toEqual(
    'Exercise created successfully',
  );

  const exerciseCreated = result.data.ExerciseAdd.exercise;

  expect(exerciseCreated?.user.firstName).toEqual(user.firstName);
  expect(exerciseCreated?.workoutSplit.name).toEqual(workoutSplit.name);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not add a new exercise for another user', async () => {
  const user = await handleCreateUser();
  const anotherUser = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit({
    user: anotherUser,
  });

  const input = {
    name: 'Pull Down',
    workoutSplit: toGlobalId('WorkoutSplit', workoutSplit._id),
    series: '3',
    repetitions: '10',
    weight: '50',
    breakTime: '60',
    muscleGroup: MUSCLE_GROUP.BACK,
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

  expect(result.data.ExerciseAdd.error).toEqual(
    'You can not create a Exercise for another user',
  );
  expect(result.data.ExerciseAdd.success).toBeNull();
});
