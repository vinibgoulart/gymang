
import { config } from '@gymang/config';
import type { GraphQLContext } from '@gymang/core';
import { getObjectId } from '@gymang/graphql';
import type { IUser } from '@gymang/user';
import jwt from 'jsonwebtoken';

// 1 year
// eslint-disable-next-line
const maxAge = 365 * 24 * 60 * 60 * 100;

export const setSessionTokenCookie = async (
  context: GraphQLContext,
  COLLECTION_SESSION_COOKIE: string,
  token: string | null,
) => {
  const domain = config.GYMANG_ENV === 'production' ? 'gymang.com' : undefined;

  try {
    const options = {
      domain,
      httpOnly: true,
      secure: config.GYMANG_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      maxAge,
    };

    context.koaContext.cookies.set(COLLECTION_SESSION_COOKIE, token, options);
  } catch (err) {
    // eslint-disable-next-line
    console.log('set cookie failed: ', err);
  }
};

export const generateCollectionToken = (model: IUser, scope: string) =>
  jwt.sign(
    {
      id: getObjectId(model)?.toString(),
      scope,
    },
    config.JWT_KEY,
  );

export const generateUserToken = (model: IUser, scope: string) =>
  jwt.sign(
    {
      id: getObjectId(model)?.toString(),
      scope,
    },
    config.JWT_KEY,
  );
