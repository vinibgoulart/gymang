import {
  assertAndResolveMostRecentOperation,
  fieldInput,
  waitForOperation,
} from '@gymang/testutils';
import { resolveMostRecentOperation } from '@gymang/testutils/src/resolveMostRecentOperation';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMockEnvironment } from 'relay-test-utils';

import type { WorkoutAddMutation } from '../../../../__generated__/WorkoutAddMutation.graphql';
import { WithProvider } from '../../../../test/withProviders';
import WorkoutCreate from '../create';

it('should render workout create page with form and call mutation', async () => {
  const environment = createMockEnvironment();

  render(
    <WithProvider relayEnvironment={environment}>
      <WorkoutCreate />
    </WithProvider>,
  );

  const name = 'Chest Workout';

  const customMockResolvers = {
    WorkoutAddPayload: () => ({
      workout: {
        name,
      },
      success: 'Success',
      error: null,
    }),
  };

  resolveMostRecentOperation(environment, customMockResolvers);

  const buttonWorkoutAdd = screen.getByTestId('button-workout-add');

  expect(buttonWorkoutAdd).toBeDisabled();

  fieldInput('name', name);

  await waitFor(() => {
    expect(buttonWorkoutAdd).toBeEnabled();
  });

  fireEvent.click(buttonWorkoutAdd);

  await waitForOperation(environment);

  assertAndResolveMostRecentOperation<WorkoutAddMutation>(
    environment,
    {
      name: 'WorkoutAddMutation',
      variables: {
        input: {
          name,
        },
      },
    },
    customMockResolvers,
  );
});
