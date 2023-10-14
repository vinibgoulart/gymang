import { isLoggedIn } from '@gymang/core';
import type { GraphQLContext } from '@gymang/core';
import { DIRECTION, createLoader } from '@gymang/graphql';

import { workoutFilterMapping } from './WorkoutFilterInputType';
import type { IWorkout } from './WorkoutModel';
import WorkoutModel from './WorkoutModel';
import { WORKOUT_SORT } from './WorkoutOrderBy';

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
  filterMapping: workoutFilterMapping,
  viewerCanSee,
  defaultArgs: {
    orderBy: [
      {
        direction: DIRECTION.DESC,
        sort: WORKOUT_SORT.createdAt,
      },
    ],
  },
});

export { getLoader, clearCache, load, loadAll, Workout };
export default Workout;
