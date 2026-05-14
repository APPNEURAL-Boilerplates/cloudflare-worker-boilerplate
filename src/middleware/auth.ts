import { requireApiKey } from "../auth/api-key";
import type { AppHandler } from "../types/app";

export function withApiKeyAuth(next: AppHandler): AppHandler {
  return (request, env, ctx, context) => {
    requireApiKey(request, context.config);
    return next(request, env, ctx, context);
  };
}
