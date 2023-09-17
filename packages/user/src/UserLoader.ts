import { createLoader } from "@gymang/graphql";
import UserModel from "./UserModel";
import type { IUser } from "./UserModel";
import { isLoggedIn } from "@gymang/core";
import { GraphQLContext } from "@gymang/core";

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
  loaderName: "UserLoader",
  viewerCanSee,
});

export { getLoader, clearCache, load, loadAll, User };
export default User;
