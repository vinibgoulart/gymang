import Router from "@koa/router";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { koaPlayground } from "graphql-playground-middleware";
import type koa from "koa";

import { getAuth } from "./auth/getAuth";
import { schema } from "./schema/schema";
import { getDataloaders } from "../loader/loaderRegistry";
import { config } from "@gymang/config";
import { GRAPHQL_TYPE } from "@gymang/core";

export const serverHelix = async (ctx: koa.Context, next: koa.Next) => {
  const request = ctx.request;

  if (shouldRenderGraphiQL(request) && config.GYMANG_ENV !== "production") {
    ctx.body = renderGraphiQL({ endpoint: "/admin" });
    return;
  }

  // eslint-disable-next-line
  console.log("operationName", request.body.operationName);

  const dataloaders = ctx?.dataloaders ?? getDataloaders();

  const context = {
    dataloaders,
    graphql: GRAPHQL_TYPE.WEB,
    koaContext: ctx,
    user: ctx.user,
    // @todo implement i18n with react-i18next
    t: (key: string) => key,
  };

  const test = getGraphQLParameters(request);
  const { operationName, query, variables } = test;

  const result = await processRequest({
    operationName,
    query,
    variables,
    request,
    schema,
    contextFactory: () => context,
  });

  if (result.type === "RESPONSE") {
    result.headers.forEach(({ name, value }) => {
      ctx.headers[name] = value;
    });
    ctx.status = result.status;
    ctx.body = result.payload;
    await next();
    return;
  }

  ctx.status = 200;
  ctx.headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  await next();
};

export const routerWeb = new Router();

routerWeb.all("/admin", getAuth);

routerWeb.all(
  "/admin/playground",
  koaPlayground({
    endpoint: "/admin",
  })
);

routerWeb.all("/admin", serverHelix);
