/**
 * Reusable Response helpers for the Worker.
 */

const DEFAULT_HEADERS: Readonly<Record<string, string>> = {
  "content-type": "application/json; charset=utf-8",
};

export interface JsonResponseInit {
  status?: number;
  headers?: HeadersInit;
}

/**
 * Build a JSON `Response` with sensible defaults.
 */
export function jsonResponse<T>(data: T, init: JsonResponseInit = {}): Response {
  const headers = new Headers(DEFAULT_HEADERS);
  if (init.headers) {
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  }

  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers,
  });
}

export interface ErrorBody {
  error: {
    message: string;
    code: string;
    status: number;
    details?: unknown;
  };
}

/**
 * Build a standardized JSON error response.
 */
export function errorResponse(
  message: string,
  status = 500,
  code = "internal_error",
  details?: unknown,
): Response {
  const body: ErrorBody = {
    error: {
      message,
      code,
      status,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return jsonResponse(body, { status });
}
