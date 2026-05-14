import type { AppHandler } from "../types/app";

export function withLogger(next: AppHandler): AppHandler {
  return async (request, env, ctx, context) => {
    const url = new URL(request.url);

    try {
      const response = await next(request, env, ctx, context);
      log("info", context.config.logLevel, {
        event: "request",
        requestId: context.requestId,
        method: request.method,
        path: url.pathname,
        status: response.status,
        durationMs: Date.now() - context.startedAt,
      });
      return response;
    } catch (error) {
      log("error", context.config.logLevel, {
        event: "request_error",
        requestId: context.requestId,
        method: request.method,
        path: url.pathname,
        durationMs: Date.now() - context.startedAt,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  };
}

function log(
  level: "debug" | "info" | "warn" | "error",
  configuredLevel: "debug" | "info" | "warn" | "error",
  fields: Record<string, unknown>,
): void {
  const order = { debug: 10, info: 20, warn: 30, error: 40 };
  if (order[level] < order[configuredLevel]) return;
  console[level](JSON.stringify({ level, ...fields }));
}
