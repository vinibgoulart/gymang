import { GRAPHQL_TYPE } from '@gymang/core';
import { getDataloaders } from './loader/loaderRegistry';
import { UserLoader } from '@gymang/user';

export const getContext = async (ctx: Record<string, unknown>) => {
  let context = {
    ...ctx,
  };

  const dataloaders = getDataloaders();

  const graphql = ctx.graphql || GRAPHQL_TYPE.WEB;

  if (context.user) {
    context.user = await UserLoader.load(
      { ...context, dataloaders, graphql: GRAPHQL_TYPE.WEB },
      context.user._id,
      true,
    );
  }

  const koaContext = {
    cookies: {
      // eslint-disable-next-line
      set: () => {},
    },
  };

  return {
    dataloaders,
    graphql,
    koaContext,
    t: (key: string) => key,
    ...context,
  };
};
