import type { AppConfig } from "../config/env";

export type AppContext = {
  config: AppConfig;
  requestId: string;
  startedAt: number;
};

export type AppHandler = (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  context: AppContext,
) => Promise<Response>;

export type RouteHandler = (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  context: AppContext,
  params: Record<string, string | undefined>,
) => Promise<Response> | Response;

export type AppRuntime = {
  fetch: NonNullable<ExportedHandler<Env>["fetch"]>;
  scheduled: NonNullable<ExportedHandler<Env>["scheduled"]>;
  queue: NonNullable<ExportedHandler<Env>["queue"]>;
};

export type JsonSuccess<T> = {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type JsonFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
