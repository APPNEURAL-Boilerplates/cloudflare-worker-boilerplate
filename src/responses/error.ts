import { AppError } from "../errors/app-error";
import { ErrorCode } from "../errors/codes";
import type { JsonFailure } from "../types/app";

export function errorResponse(error: AppError): Response {
  const message = error.expose ? error.message : "Internal Server Error";
  const body: JsonFailure = {
    ok: false,
    error: {
      code: error.code,
      message,
      ...(error.details !== undefined && error.expose ? { details: error.details } : {}),
    },
  };

  return Response.json(body, {
    status: error.status,
    headers: {
      "cache-control": "no-store",
    },
  });
}

export function internalErrorResponse(): Response {
  return errorResponse(
    new AppError("Internal Server Error", {
      code: ErrorCode.InternalError,
      status: 500,
      expose: false,
    }),
  );
}
