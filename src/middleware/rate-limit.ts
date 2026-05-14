import { AppError } from "../errors/app-error";
import { ErrorCode } from "../errors/codes";
import type { AppHandler } from "../types/app";

export function withNoopRateLimit(next: AppHandler): AppHandler {
  return (request, env, ctx, context) => {
    const blocked = false;
    if (blocked) {
      throw new AppError("Rate limit exceeded", {
        code: ErrorCode.RateLimited,
        status: 429,
      });
    }
    return next(request, env, ctx, context);
  };
}
