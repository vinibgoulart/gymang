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
  query WorkoutQueriesWorkoutsSpecQuery {
    workouts(first: 10) {
      edges {
        node {
          id
          name
          user {
            id
            firstName
          }
          createdBy {
            id
            firstName
          }
        }
      }
    }
  }
`;

it('should get a list of public workouts', async () => {
  const user = await handleCreateUser();
  await handleCreateWorkout({
    user,
    createdBy: user,
  });

  await handleCreateWorkout({
    user,
    createdBy: user,
  });

  await handleCreateWorkout({
    user,
    createdBy: user,
    isPublic: false,
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

  expect(result.data.workouts.edges).toHaveLength(2);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should get a mepty list of public workouts', async () => {
  const user = await handleCreateUser();

  await handleCreateWorkout({
    user,
    createdBy: user,
    isPublic: false,
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

  expect(result.data.workouts.edges).toHaveLength(0);

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
