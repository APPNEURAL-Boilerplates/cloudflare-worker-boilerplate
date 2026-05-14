import type { AppHandler } from "../types/app";

export function withRequestId(next: AppHandler): AppHandler {
  return async (request, env, ctx, context) => {
    context.requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
    const response = await next(request, env, ctx, context);
    response.headers.set("x-request-id", context.requestId);
    return response;
  };
}
