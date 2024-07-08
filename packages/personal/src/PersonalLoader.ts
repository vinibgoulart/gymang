import { isLoggedIn } from '@gymang/core';
import type { GraphQLContext } from '@gymang/core';
import { createLoader } from '@gymang/graphql';

import PersonalModel from './PersonalModel';
import type { IPersonal } from './PersonalModel';

const viewerCanSee = async (context: GraphQLContext, data: IPersonal) => {
  if (isLoggedIn(context, context.graphql)) {
    return data;
  }

  return null;
};

const {
  Wrapper: Personal,
  getLoader,
  clearCache,
  load,
  loadAll,
} = createLoader({
  model: PersonalModel,
  loaderName: 'PersonalLoader',
  viewerCanSee,
});

export { getLoader, clearCache, load, loadAll, Personal };
export default Personal;
