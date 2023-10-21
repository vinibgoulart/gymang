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
  mutation ExerciseSessionFinishSpecMutation($input: ExerciseSessionFinishInput!) {
    ExerciseSessionFinish(input: $input) {
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
        sessionInProgress {
          id
        }
      }
      success
      error
    }
  }
`;

it('should finish a exercise session', async () => {
  const user = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit({
    withRecord: true,
  });

  const exercise = await handleCreateExercise({
    sessions: [
      {
        series: '1',
        repetitions: '1',
        breakTime: '1',
        muscleGroup: 'CHEST',
        weight: '1',
        finishedAt: null,
        record: workoutSplit.records[0]._id,
      },
    ],
  });

  const input = {
    exerciseId: toGlobalId('Exercise', exercise._id),
    sessionId: toGlobalId('Session', exercise.sessions[0]._id),
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

  expect(result.data.ExerciseSessionFinish.error).toBeNull();
  expect(result.data.ExerciseSessionFinish.success).toEqual(
    'Session finished successfully',
  );

  const exerciseUpdated = await Exercise.findOne({
    _id: exercise._id,
  });

  expect(exerciseUpdated.sessions).toHaveLength(1);

  const [session] = exerciseUpdated.sessions;

  expect(session.finishedAt).not.toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not finish a session for a exercise from another user', async () => {
  const user = await handleCreateUser();
  const anotherUser = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit({
    withRecord: true,
  });

  const exercise = await handleCreateExercise({
    user: anotherUser,
    sessions: [
      {
        series: '1',
        repetitions: '1',
        breakTime: '1',
        muscleGroup: 'CHEST',
        weight: '1',
        finishedAt: null,
        record: workoutSplit.records[0]._id,
      },
    ],
  });

  const input = {
    exerciseId: toGlobalId('Exercise', exercise._id),
    sessionId: toGlobalId('Session', exercise.sessions[0]._id),
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

  expect(result.data.ExerciseSessionFinish.error).toEqual(
    'You can not finish this exercise session',
  );
  expect(result.data.ExerciseSessionFinish.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not finish a session already finished', async () => {
  const user = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit({
    withRecord: true,
  });

  const exercise = await handleCreateExercise({
    sessions: [
      {
        series: '1',
        repetitions: '1',
        breakTime: '1',
        muscleGroup: 'CHEST',
        weight: '1',
        finishedAt: new Date(),
        record: workoutSplit.records[0]._id,
      },
    ],
  });

  const input = {
    exerciseId: toGlobalId('Exercise', exercise._id),
    sessionId: toGlobalId('Session', exercise.sessions[0]._id),
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

  expect(result.data.ExerciseSessionFinish.error).toEqual(
    'Session already finished',
  );
  expect(result.data.ExerciseSessionFinish.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
