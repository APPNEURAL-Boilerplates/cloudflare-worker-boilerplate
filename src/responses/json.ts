import type { JsonSuccess } from "../types/app";

export type JsonResponseInit = ResponseInit & {
  meta?: Record<string, unknown>;
};

export function json<T>(data: T, init: JsonResponseInit = {}): Response {
  const body: JsonSuccess<T> = {
    ok: true,
    data,
    ...(init.meta ? { meta: init.meta } : {}),
  };

  return Response.json(body, {
    ...init,
    headers: mergeHeaders({ "cache-control": "no-store" }, init.headers),
  });
}

export function text(body: string, init: ResponseInit = {}): Response {
  return new Response(body, {
    ...init,
    headers: mergeHeaders({ "content-type": "text/plain; charset=utf-8" }, init.headers),
  });
}

export function html(body: string, init: ResponseInit = {}): Response {
  return new Response(body, {
    ...init,
    headers: mergeHeaders({ "content-type": "text/html; charset=utf-8" }, init.headers),
  });
}

export function noContent(init: ResponseInit = {}): Response {
  return new Response(null, { ...init, status: init.status ?? 204 });
}

export function redirect(location: string, status = 302): Response {
  return Response.redirect(location, status);
}

export function mergeHeaders(
  defaults: HeadersInit,
  overrides: HeadersInit | undefined,
): Headers {
  const headers = new Headers(defaults);
  if (overrides) {
    new Headers(overrides).forEach((value, key) => headers.set(key, value));
  }
  return headers;
}
