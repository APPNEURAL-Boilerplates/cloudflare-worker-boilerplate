export function handleCorsPreflight(request: Request, env: Env): Response | undefined {
  if (request.method.toUpperCase() !== "OPTIONS") return undefined;
  const response = new Response(null, { status: 204 });
  addCorsHeaders(response.headers, request, env);
  response.headers.set("access-control-max-age", "86400");
  return response;
}

export function addCorsHeaders(headers: Headers, request: Request, env: Env): void {
  const origin = request.headers.get("origin");
  const allowedOrigins = getAllowedOrigins(env);
  const allowAll = allowedOrigins.includes("*");
  const allowedOrigin = allowAll ? "*" : origin && allowedOrigins.includes(origin) ? origin : "";

  if (allowedOrigin) {
    headers.set("access-control-allow-origin", allowedOrigin);
  }

  headers.set("access-control-allow-methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  headers.set(
    "access-control-allow-headers",
    "authorization,content-type,idempotency-key,x-api-key,x-request-id",
  );
}

function getAllowedOrigins(env: Env): string[] {
  const raw = (env as { ALLOWED_ORIGINS?: string }).ALLOWED_ORIGINS ?? "*";
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
