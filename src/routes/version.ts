import { json } from "../responses/json";
import type { RouteHandler } from "../types/app";

export const versionRoute: RouteHandler = (_request, _env, _ctx, context) => {
  return json({
    name: context.config.appName,
    version: context.config.version,
    env: context.config.appEnv,
  });
};
