import { AppError } from "../errors/app-error";
import { ErrorCode } from "../errors/codes";

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new AppError(message, {
      code: ErrorCode.ValidationError,
      status: 422,
    });
  }
}
