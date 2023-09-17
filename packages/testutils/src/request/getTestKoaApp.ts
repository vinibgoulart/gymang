import cors from '@koa/cors';
import type Router from '@koa/router';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import { config } from '@gymang/config';

export const getTestKoaApp = (router: Router) => {
  const app = new Koa({
    proxy: true, // we are behind a proxy
    keys: [config.JWT_KEY], // used for cookies sign
  });

  app.use(
    bodyParser({
      onerror(err, ctx) {
        // http-errors deprecated non-first-argument status code; replace with createError(422, ...)
        // ctx.throw(createHttpError(422, err));
        ctx.throw(err, 422);
      },
    }),
  );
  app.use(koaLogger());
  app.use(cors({ maxAge: 86400, credentials: true }));

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
