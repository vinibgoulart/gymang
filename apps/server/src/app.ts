import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import koaLogger from "koa-logger";

import { config } from "@gymang/config";
import { routerWeb } from "./graphql/routerWeb";

const app = new Koa();

const router = new Router();

export const statusMiddleware = async (ctx: Record<string, any>) => {
  try {
    ctx.body = "Server Working";
    ctx.status = 200;
  } catch (err) {
    // eslint-disable-next-line
    console.log({
      err,
    });
    ctx.body = err.toString();
    ctx.status = 400;
  }
};

// needed for sentry to log data correctly
app.use(bodyParser());

app.on("error", async (err) => {
  console.log("Error while answering request", { error: err });
});

app.use(koaLogger());

app.use(
  cors({
    maxAge: 86400,
    credentials: true,
    origin: config.GYMANG_ENV === "production" ? "https://gymang.com.br" : "*",
  })
);

router.get("/status", statusMiddleware);

app.use(router.routes()).use(router.allowedMethods());
app.use(routerWeb.routes()).use(routerWeb.allowedMethods());

export default app;
