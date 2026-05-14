import { AppError } from "../errors/app-error";

export async function parseJson<T = unknown>(request: Request, maxBytes = 1_048_576): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw AppError.badRequest("Expected Content-Type: application/json");
  }

  const text = await request.text();
  if (!text) {
    throw AppError.badRequest("Request body must not be empty");
  }

  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw AppError.badRequest("Request body is too large", { maxBytes });
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw AppError.badRequest("Invalid JSON body", {
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}
