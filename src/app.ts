import { loadConfig } from "./config/env";
import { AppError } from "./errors/app-error";
import { ErrorCode } from "./errors/codes";
import { addCorsHeaders, handleCorsPreflight } from "./middleware/cors";
import { withLogger } from "./middleware/logger";
import { withRequestId } from "./middleware/request-id";
import { addSecurityHeaders } from "./middleware/security-headers";
import { errorResponse } from "./responses/error";
import { route } from "./router";
import { runScheduledJob } from "./jobs/scheduled";
import { consumeQueue } from "./queues/consumer";
import type { AppContext, AppHandler, AppRuntime } from "./types/app";

const coreHandler: AppHandler = async (request, env, ctx, context) => {
  const preflight = handleCorsPreflight(request, env);
  if (preflight) return preflight;

  const response = await route(request, env, ctx, context);
  addSecurityHeaders(response.headers);
  addCorsHeaders(response.headers, request, env);
  return response;
};

const handler = withRequestId(withLogger(coreHandler));

export function createApp(): AppRuntime {
  return {
    async fetch(request, env, ctx) {
      const startedAt = Date.now();
      const context: AppContext = {
        config: loadConfig(env),
        requestId: "",
        startedAt,
      };

      try {
        return await handler(request, env, ctx, context);
      } catch (error) {
        const response =
          error instanceof AppError
            ? errorResponse(error)
            : errorResponse(
                new AppError("Internal Server Error", {
                  code: ErrorCode.InternalError,
                  status: 500,
                }),
              );

        if (!(error instanceof AppError)) {
          console.error("Unhandled Worker error", {
            requestId: context.requestId,
            error,
          });
        }

        addSecurityHeaders(response.headers);
        addCorsHeaders(response.headers, request, env);
        return response;
      }
    },

    scheduled(event, env, ctx) {
      ctx.waitUntil(runScheduledJob(event, env, ctx));
    },

    queue(batch, env, ctx) {
      ctx.waitUntil(consumeQueue(batch, env, ctx));
    },
  };
}
