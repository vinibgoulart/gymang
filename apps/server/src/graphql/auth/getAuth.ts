import { setSessionTokenCookie, USER_SESSION_COOKIE } from '@gymang/session';
import type { Context, Next } from 'koa';

import { getUserFromCookie } from './getUserFromCookie';
import { getDataloaders } from '../../loader/loaderRegistry';

export const getAuth = async (ctx: Context, next: Next) => {
  const dataloaders = getDataloaders();
  const sessionCookie = ctx.cookies.get(USER_SESSION_COOKIE);

  const { user } = await getUserFromCookie({ sessionCookie, dataloaders });

  ctx.dataloaders = dataloaders;
  ctx.user = user;

  if (!user) {
    await setSessionTokenCookie(ctx, USER_SESSION_COOKIE, null);
  }

  await next();
};
