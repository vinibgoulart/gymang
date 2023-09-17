import type { Context } from 'koa';
import { IUser } from '@gymang/user';

export type GraphQLContext = {
  graphql: string;
  koaContext: Context;
  user: IUser;
  t: (key: string) => string;
};
