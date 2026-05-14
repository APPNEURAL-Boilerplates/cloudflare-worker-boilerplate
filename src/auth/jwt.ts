import { AppError } from "../errors/app-error";

export async function verifyJwtPlaceholder(token: string): Promise<Record<string, unknown>> {
  if (!token) throw AppError.unauthorized("Missing bearer token");
  throw new Error("JWT verification is not configured for this boilerplate.");
}
