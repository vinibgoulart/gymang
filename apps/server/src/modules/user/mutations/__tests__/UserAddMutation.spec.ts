import { graphql } from 'graphql';

import { getContext } from '../../../../getContext';
import { schema as schemaWeb } from '../../../../graphql/schema/schema';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@gymang/testutils';
import { handleCreateUser } from '@gymang/user';
import { GRAPHQL_TYPE } from '@gymang/core';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  mutation UserAddSpecMutation($input: UserAddInput!) {
    UserAdd(input: $input) {
      user {
        id
      }
      success
      error
    }
  }
`;

it('should register a new user', async () => {
  const user = await handleCreateUser();

  const input = {
    email: 'heisen@test.com',
    password: 'awesomepass',
    firstName: 'Heins',
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

  expect(result.data.UserAdd.error).toBeNull();
  expect(result.data.UserAdd.success).toEqual('User created successfully');

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});

it('should return an error if the email is been used', async () => {
  const user = await handleCreateUser();

  const firstUser = await handleCreateUser({
    email: 'awesome@mail.com',
    firstName: 'some',
  });

  const input = {
    email: firstUser.email,
    password: 'awesomepass',
    firstName: 'Heins',
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

  expect(result.data.UserAdd.error).toEqual('Email already in use');
  expect(result.data.UserAdd.success).toBeNull();

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
