import { json } from "../responses/json";
import type { RouteHandler } from "../types/app";

export const homeRoute: RouteHandler = (_request, _env, _ctx, context) => {
  return json({
    name: context.config.appName,
    message: "Welcome to the Cloudflare Worker boilerplate.",
    routes: ["GET /", "GET /health", "GET /version", "GET /api/status", "POST /api/echo"],
  });
};
