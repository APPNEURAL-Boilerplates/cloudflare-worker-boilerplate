import { AppError } from "./errors/app-error";
import { ErrorCode } from "./errors/codes";
import { apiRoutes } from "./routes/api";
import { healthRoute } from "./routes/health";
import { homeRoute } from "./routes/home";
import { versionRoute } from "./routes/version";
import type { AppContext, RouteHandler } from "./types/app";

type RouteDefinition = {
  method: string;
  pattern: URLPattern;
  handler: RouteHandler;
};

const routes: RouteDefinition[] = [
  { method: "GET", pattern: new URLPattern({ pathname: "/" }), handler: homeRoute },
  { method: "GET", pattern: new URLPattern({ pathname: "/health" }), handler: healthRoute },
  { method: "GET", pattern: new URLPattern({ pathname: "/version" }), handler: versionRoute },
  ...apiRoutes,
];

export async function route(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  context: AppContext,
): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const pathname = url.pathname;

  const matchedPath = routes.filter((routeDefinition) =>
    routeDefinition.pattern.test({ pathname }),
  );

  const matchedRoute = matchedPath.find((routeDefinition) => routeDefinition.method === method);
  if (matchedRoute) {
    const match = matchedRoute.pattern.exec({ pathname });
    return matchedRoute.handler(request, env, ctx, context, match?.pathname.groups ?? {});
  }

  if (matchedPath.length > 0) {
    throw new AppError("Method Not Allowed", {
      code: ErrorCode.MethodNotAllowed,
      status: 405,
      details: {
        allowedMethods: matchedPath.map((routeDefinition) => routeDefinition.method),
      },
    });
  }

  throw new AppError(`No route for ${method} ${pathname}`, {
    code: ErrorCode.NotFound,
    status: 404,
  });
}
