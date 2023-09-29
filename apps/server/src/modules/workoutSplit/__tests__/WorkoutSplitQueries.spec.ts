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
import { handleCreateWorkoutSplit } from '@gymang/workout-split';
import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { getContext } from '../../../getContext';
import { schema as schemaAdmin } from '../../../graphql/schema/schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  query WorkoutSplitQueriesSpecQuery {
    meWorkoutSplits(first: 10) {
      edges {
        node {
          id
          name
          user {
            id
          }
          workout {
            id
            name
          }
          modality
        }
      }
    }
  }
`;

it('should get a list of workouts splits', async () => {
  const user = await handleCreateUser();
  const workout = await handleCreateWorkout({
    user,
    createdBy: user,
  });

  await handleCreateWorkoutSplit({
    name: 'A',
    workout,
    user,
    modality: WORKOUT_SPLIT_MODALITY.BOXING,
  });

  await handleCreateWorkoutSplit({
    name: 'B',
    workout,
    user,
    modality: WORKOUT_SPLIT_MODALITY.BOXING,
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

  expect(result.data.meWorkoutSplits.edges.length).toEqual(2);
  const [workoutSplit] = result.data.meWorkoutSplits.edges;

  expect(workoutSplit.node.user.id).toEqual(toGlobalId('User', user.id));
  expect(workoutSplit.node.workout.id).toEqual(
    toGlobalId('Workout', workout.id),
  );

  expect(sanitizeTestObject(result.data)).toMatchSnapshot();
});
