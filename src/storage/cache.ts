export async function withCache(
  request: Request,
  handler: () => Promise<Response>,
  options: { ttlSeconds?: number } = {},
): Promise<Response> {
  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await handler();
  if (response.ok && request.method === "GET") {
    const cachedResponse = new Response(response.body, response);
    cachedResponse.headers.set("cache-control", `public, max-age=${options.ttlSeconds ?? 60}`);
    await cache.put(request, cachedResponse.clone());
    return cachedResponse;
  }

  return response;
}
