/**
 * Domain-level error type used by the Worker.
 *
 * Throwing an `AppError` from a route handler is converted into a
 * standardized JSON error response by the top-level `fetch` handler.
 */
export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    options: { status?: number; code?: string; details?: unknown } = {},
  ) {
    super(message);
    this.name = "AppError";
    this.status = options.status ?? 500;
    this.code = options.code ?? "internal_error";
    this.details = options.details;
  }

  static badRequest(message = "Bad Request", details?: unknown): AppError {
    return new AppError(message, { status: 400, code: "bad_request", details });
  }

  static notFound(message = "Not Found"): AppError {
    return new AppError(message, { status: 404, code: "not_found" });
  }

  static methodNotAllowed(message = "Method Not Allowed"): AppError {
    return new AppError(message, { status: 405, code: "method_not_allowed" });
  }
}
