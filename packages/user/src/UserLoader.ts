import { isLoggedIn } from '@gymang/core';
import type { GraphQLContext } from '@gymang/core';
import { createLoader } from '@gymang/graphql';

import UserModel from './UserModel';
import type { IUser } from './UserModel';

const viewerCanSee = async (context: GraphQLContext, data: IUser) => {
  if (isLoggedIn(context, context.graphql)) {
    return data;
  }

  return null;
};

const {
  Wrapper: User,
  getLoader,
  clearCache,
  load,
  loadAll,
} = createLoader({
  model: UserModel,
  loaderName: 'UserLoader',
  viewerCanSee,
});

export { getLoader, clearCache, load, loadAll, User };
export default User;
