import { isLoggedIn } from '@gymang/core';
import type { GraphQLContext } from '@gymang/core';
import { createLoader } from '@gymang/graphql';

import type { IWorkout } from './WorkoutModel';
import WorkoutModel from './WorkoutModel';

const viewerCanSee = async (context: GraphQLContext, data: IWorkout) => {
  if (isLoggedIn(context, context.graphql)) {
    return data;
  }

  return null;
};

const {
  Wrapper: Workout,
  getLoader,
  clearCache,
  load,
  loadAll,
} = createLoader({
  model: WorkoutModel,
  loaderName: 'WorkoutLoader',
  viewerCanSee,
});

export { getLoader, clearCache, load, loadAll, Workout };
export default Workout;
