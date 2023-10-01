import { GRAPHQL_TYPE } from '@gymang/core';
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
    muscleGroup: 'Back',
  });

  await handleCreateExercise({
    name: 'Supino Reto',
    workoutSplit,
    series: 3,
    repetitions: 10,
    weight: 20,
    breakTime: 60,
    muscleGroup: 'Chest',
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
