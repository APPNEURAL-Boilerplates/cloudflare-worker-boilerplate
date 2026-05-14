import { ErrorCode } from "./codes";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: unknown;
  public readonly expose: boolean;

  constructor(
    message: string,
    options: {
      code?: ErrorCode;
      status?: number;
      details?: unknown;
      expose?: boolean;
    } = {},
  ) {
    super(message);
    this.name = "AppError";
    this.code = options.code ?? ErrorCode.InternalError;
    this.status = options.status ?? 500;
    this.details = options.details;
    this.expose = options.expose ?? this.status < 500;
  }

  static badRequest(message = "Bad Request", details?: unknown): AppError {
    return new AppError(message, {
      code: ErrorCode.BadRequest,
      status: 400,
      details,
    });
  }

  static unauthorized(message = "Unauthorized"): AppError {
    return new AppError(message, {
      code: ErrorCode.Unauthorized,
      status: 401,
    });
  }

  static forbidden(message = "Forbidden"): AppError {
    return new AppError(message, {
      code: ErrorCode.Forbidden,
      status: 403,
    });
  }
}
