import { isLoggedIn } from '@gymang/core';
import type { GraphQLContext } from '@gymang/core';
import { WORKOUT_SPLIT_SORT } from '@gymang/enums';
import { DIRECTION, createLoader } from '@gymang/graphql';

import { workoutSplitFilterMapping } from './WorkoutSplitFilterInputType';
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
  filterMapping: workoutSplitFilterMapping,
  viewerCanSee,
  defaultArgs: {
    orderBy: [
      {
        direction: DIRECTION.DESC,
        sort: WORKOUT_SPLIT_SORT.createdAt,
      },
    ],
  },
});

export { getLoader, clearCache, load, loadAll, WorkoutSplit };
export default WorkoutSplit;
