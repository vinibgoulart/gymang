import { graphql } from 'graphql';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@gymang/testutils';

import { schema as schemaAdmin } from '../../../graphql/schema/schema';
import { GRAPHQL_TYPE } from '@gymang/core';
import { handleCreateUser } from '@gymang/user';
import { getContext } from '../../../getContext';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  query UserQueriesSpecQuery {
    me {
      id
      firstName
    }
  }
`;

it('should get an user from context', async () => {
  const user = await handleCreateUser({
    email: 'heisen@test.com',
    password: 'awesomepass',
    firstName: 'Walter',
  });

  const variables = {
    input: {
      email: user.email,
      password: 'awesomepass',
    },
  };

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
    variableValues: variables,
  });

  expect(result.errors).toBeUndefined();
  expect(result.data.me.id).toBeTruthy();
  expect(result.data.me.firstName).toBeTruthy();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should return null if no context', async () => {
  const user = await handleCreateUser({
    email: 'heisen@test.com',
    password: 'awesomepass',
    firstName: 'Walter',
  });

  const variables = {
    input: {
      email: user.email,
      password: 'awesomepass',
    },
  };

  const context = await getContext({
    graphql: GRAPHQL_TYPE.WEB,
  });

  const rootValue = {};

  const result = await graphql({
    schema: schemaAdmin,
    source: query,
    rootValue,
    contextValue: context,
    variableValues: variables,
  });

  expect(result.errors).toBeUndefined();
  expect(result.data.me).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
