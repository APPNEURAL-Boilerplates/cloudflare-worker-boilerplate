import { AppError } from "./errors";
import { errorResponse, jsonResponse } from "./responses";

/**
 * Cloudflare Worker entrypoint (module syntax).
 *
 * Routes:
 *   GET  /        -> JSON welcome message
 *   GET  /health  -> { ok: true, status: "healthy" }
 *   POST /echo    -> echo the submitted JSON body
 *   *             -> 404 / 405 JSON error
 */
export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    try {
      return await route(request);
    } catch (err) {
      if (err instanceof AppError) {
        return errorResponse(err.message, err.status, err.code, err.details);
      }
      console.error("Unhandled error in Worker:", err);
      return errorResponse("Internal Server Error", 500, "internal_error");
    }
  },
} satisfies ExportedHandler<Env>;

async function route(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method.toUpperCase();

  if (pathname === "/") {
    if (method !== "GET") throw AppError.methodNotAllowed();
    return jsonResponse({
      name: "cloudflare-worker-boilerplate",
      message: "Welcome to the Cloudflare Worker boilerplate.",
      endpoints: ["GET /", "GET /health", "POST /echo"],
    });
  }

  if (pathname === "/health") {
    if (method !== "GET") throw AppError.methodNotAllowed();
    return jsonResponse({ ok: true, status: "healthy" });
  }

  if (pathname === "/echo") {
    if (method !== "POST") throw AppError.methodNotAllowed();
    const body = await parseJson(request);
    return jsonResponse(body);
  }

  throw AppError.notFound(`No handler for ${method} ${pathname}`);
}

async function parseJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw AppError.badRequest("Expected Content-Type: application/json");
  }
  const text = await request.text();
  if (text.length === 0) {
    throw AppError.badRequest("Request body must not be empty");
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    throw AppError.badRequest("Invalid JSON body", {
      reason: err instanceof Error ? err.message : String(err),
    });
  }
}
