import type { AppConfig } from "../config/env";
import { AppError } from "../errors/app-error";

export function requireApiKey(request: Request, config: AppConfig): void {
  if (!config.apiKey) return;

  const provided = request.headers.get("x-api-key");
  if (!provided || provided !== config.apiKey) {
    throw AppError.unauthorized("Missing or invalid API key");
  }
}
