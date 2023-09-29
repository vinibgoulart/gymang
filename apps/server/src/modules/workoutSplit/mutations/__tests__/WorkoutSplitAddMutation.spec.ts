import { GRAPHQL_TYPE } from '@gymang/core';
import { WORKOUT_SPLIT_MODALITY } from '@gymang/enums';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@gymang/testutils';
import { handleCreateUser } from '@gymang/user';
import { handleCreateWorkout } from '@gymang/workout';
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { getContext } from '../../../../getContext';
import { schema as schemaWeb } from '../../../../graphql/schema/schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  mutation WorkoutSplitAddSpecMutation($input: WorkoutSplitAddInput!) {
    WorkoutSplitAdd(input: $input) {
      workoutSplit {
        id
        name
        description
        user {
          firstName
        }
        modality
        workout {
          id
          name
        }
      }
      success
      error
    }
  }
`;

it.only('should add a new workout split', async () => {
  const user = await handleCreateUser();
  const workout = await handleCreateWorkout({ user });

  const input = {
    name: 'Chest Workout',
    description: 'Hard work',
    workout: toGlobalId('Workout', workout._id),
    modality: WORKOUT_SPLIT_MODALITY.BODYBUILDING,
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

  expect(result.data.WorkoutSplitAdd.error).toBeNull();
  expect(result.data.WorkoutSplitAdd.success).toEqual(
    'Workout Split created successfully',
  );

  const workoutSplitCreated = result.data.WorkoutSplitAdd.workoutSplit;

  expect(workoutSplitCreated?.user.firstName).toEqual(user.firstName);
  expect(workoutSplitCreated?.workout.name).toEqual(workout.name);
  expect(workoutSplitCreated?.modality).toEqual(
    WORKOUT_SPLIT_MODALITY.BODYBUILDING,
  );

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
