import { isLoggedIn } from '@gymang/core';
import type { GraphQLContext } from '@gymang/core';
import { createLoader } from '@gymang/graphql';

import type { IWorkoutSplit } from './WorkoutSplitModel';
import WorkoutSplitModel from './WorkoutSplitModel';

const viewerCanSee = async (context: GraphQLContext, data: IWorkoutSplit) => {
  if (isLoggedIn(context, context.graphql)) {
    return data;
  }

  return null;
};

const {
  Wrapper: WorkoutSplit,
  getLoader,
  clearCache,
  load,
  loadAll,
} = createLoader({
  model: WorkoutSplitModel,
  loaderName: 'WorkoutSplitLoader',
  viewerCanSee,
});

export { getLoader, clearCache, load, loadAll, WorkoutSplit };
export default WorkoutSplit;
