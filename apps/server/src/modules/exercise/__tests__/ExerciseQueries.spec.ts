import { GRAPHQL_TYPE } from '@gymang/core';
import { MUSCLE_GROUP } from '@gymang/enums';
import { handleCreateExercise } from '@gymang/exercise';
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

import { getContext } from '../../../getContext';
import { schema as schemaAdmin } from '../../../graphql/schema/schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  query ExerciseQueriesSpecQuery {
    exercises(first: 10) {
      edges {
        node {
          id
          name
          user {
            id
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
          lastSession {
            id
          }
          sessions(first: 10) {
            edges {
              node {
                id
                series
                repetitions
                breakTime
                weight
              }
            }
          }
        }
      }
    }
  }
`;

it('should get a list of exercies', async () => {
  const user = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit();

  await handleCreateExercise({
    name: 'Pull Down',
    workoutSplit,
    series: 3,
    repetitions: 10,
    weight: 50,
    breakTime: 60,
    muscleGroup: MUSCLE_GROUP.BACK,
  });

  await handleCreateExercise({
    name: 'Supino Reto',
    workoutSplit,
    series: 3,
    repetitions: 10,
    weight: 20,
    breakTime: 60,
    muscleGroup: MUSCLE_GROUP.CHEST,
  });

  const context = await getContext({
    graphql: GRAPHQL_TYPE.WEB,
    user,
  });

  const rootValue = {};

  const result = await graphql({
    schema: schemaAdmin,
    source: query,
    rootValue,
    contextValue: context,
  });

  expect(result.errors).toBeUndefined();

  expect(result.data.exercises.edges.length).toEqual(2);
  const [exercise] = result.data.exercises.edges;

  expect(exercise.node.user.id).toEqual(toGlobalId('User', user.id));
  expect(exercise.node.workoutSplit.id).toEqual(
    toGlobalId('WorkoutSplit', workoutSplit.id),
  );

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should get a list of exercies with sessions', async () => {
  const user = await handleCreateUser();
  const workoutSplit = await handleCreateWorkoutSplit({
    withRecord: true,
  });

  await handleCreateExercise({
    name: 'Pull Down',
    workoutSplit,
    series: 3,
    repetitions: 10,
    weight: 50,
    breakTime: 60,
    muscleGroup: MUSCLE_GROUP.BACK,
    sessions: [
      {
        // _id: new Types.ObjectId(),
        series: 3,
        repetitions: 10,
        weight: 50,
        breakTime: 60,
        record: workoutSplit.records[0]._id,
      },
      {
        // _id: new Types.ObjectId(),
        series: 3,
        repetitions: 10,
        weight: 50,
        breakTime: 60,
        record: workoutSplit.records[0]._id,
      },
    ],
  });

  await handleCreateExercise({
    name: 'Supino Reto',
    workoutSplit,
    series: 3,
    repetitions: 10,
    weight: 20,
    breakTime: 60,
    muscleGroup: MUSCLE_GROUP.CHEST,
  });

  const context = await getContext({
    graphql: GRAPHQL_TYPE.WEB,
    user,
  });

  const rootValue = {};

  const result = await graphql({
    schema: schemaAdmin,
    source: query,
    rootValue,
    contextValue: context,
  });

  expect(result.errors).toBeUndefined();

  expect(result.data.exercises.edges.length).toEqual(2);
  const [exercise] = result.data.exercises.edges;

  expect(exercise.node.user.id).toEqual(toGlobalId('User', user.id));
  expect(exercise.node.workoutSplit.id).toEqual(
    toGlobalId('WorkoutSplit', workoutSplit.id),
  );

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should not query removed exercises', async () => {
  const user = await handleCreateUser();

  await handleCreateExercise({
    removedAt: new Date(),
  });

  const context = await getContext({
    graphql: GRAPHQL_TYPE.WEB,
    user,
  });

  const rootValue = {};

  const result = await graphql({
    schema: schemaAdmin,
    source: query,
    rootValue,
    contextValue: context,
  });

  expect(result.errors).toBeUndefined();

  expect(result.data.exercises.edges.length).toEqual(0);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
