import { GRAPHQL_TYPE } from '@gymang/core';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@gymang/testutils';
import { handleCreateUser } from '@gymang/user';
import { handleCreateWorkout } from '@gymang/workout';
import { graphql } from 'graphql';

import { getContext } from '../../../getContext';
import { schema as schemaAdmin } from '../../../graphql/schema/schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  query WorkoutQueriesSpecQuery {
    myWorkouts(first: 10) {
      edges {
        node {
          id
          name
          user
          createdBy
          description
        }
      }
    }
  }
`;

it('should get a list of workouts', async () => {
  const user = await handleCreateUser();
  await handleCreateWorkout({
    user,
    createdBy: user,
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

  const [workout] = result.data.myWorkouts.edges;

  expect(workout.node.user).toEqual(user.id);
  expect(workout.node.createdBy).toEqual(user.id);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should get a list of workouts in a user that not create this workout', async () => {
  const user = await handleCreateUser();
  const userWithWorkout = await handleCreateUser();

  await handleCreateWorkout({
    user: userWithWorkout._id,
    createdBy: userWithWorkout._id,
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

  const [workout] = result.data.myWorkouts.edges;

  expect(workout.node.user).toEqual(userWithWorkout.id);
  expect(workout.node.createdBy).toEqual(userWithWorkout.id);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
