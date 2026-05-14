import { parseJson } from "../utils/parse-json";
import { json } from "../responses/json";
import type { RouteHandler } from "../types/app";

type RouteDefinition = {
  method: string;
  pattern: URLPattern;
  handler: RouteHandler;
};

const statusRoute: RouteHandler = (_request, _env, _ctx, context) => {
  return json({
    service: context.config.appName,
    status: "ok",
    requestId: context.requestId,
  });
};

const echoRoute: RouteHandler = async (request) => {
  const body = await parseJson(request);
  return json(body);
};

const userRoute: RouteHandler = (_request, _env, _ctx, _context, params) => {
  return json({
    id: params.id,
  });
};

export const apiRoutes: RouteDefinition[] = [
  { method: "GET", pattern: new URLPattern({ pathname: "/api/status" }), handler: statusRoute },
  { method: "POST", pattern: new URLPattern({ pathname: "/api/echo" }), handler: echoRoute },
  { method: "GET", pattern: new URLPattern({ pathname: "/api/users/:id" }), handler: userRoute },
];
