import { isLoggedIn } from '@gymang/core';
import type { GraphQLContext } from '@gymang/core';
import { DIRECTION, createLoader } from '@gymang/graphql';

import { exerciseFilterMapping } from './ExerciseFilterInputType';
import type { IExercise } from './ExerciseModel';
import ExerciseModel from './ExerciseModel';
import { EXERCISE_SPLIT_SORT } from './ExerciseOrderBy';

const viewerCanSee = async (context: GraphQLContext, data: IExercise) => {
  if (isLoggedIn(context, context.graphql)) {
    return data;
  }

  return null;
};

const {
  Wrapper: Exercise,
  getLoader,
  clearCache,
  load,
  loadAll,
} = createLoader({
  model: ExerciseModel,
  loaderName: 'ExerciseLoader',
  filterMapping: exerciseFilterMapping,
  viewerCanSee,
  defaultArgs: {
    orderBy: [
      {
        direction: DIRECTION.DESC,
        sort: EXERCISE_SPLIT_SORT.createdAt,
      },
    ],
  },
});

export { getLoader, clearCache, load, loadAll, Exercise };
export default Exercise;
