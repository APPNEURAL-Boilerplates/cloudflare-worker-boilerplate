import { AppError } from "../errors/app-error";

export function requireRole(roles: string[], requiredRole: string): void {
  if (!roles.includes(requiredRole)) {
    throw AppError.forbidden("Insufficient permissions");
  }
}
