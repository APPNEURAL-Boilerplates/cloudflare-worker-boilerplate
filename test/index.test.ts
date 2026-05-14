import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Cloudflare Worker boilerplate", () => {
  it("GET / returns 200 with a JSON welcome payload", async () => {
    const res = await SELF.fetch("https://example.com/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const body = (await res.json()) as { name: string; endpoints: string[] };
    expect(body.name).toBe("cloudflare-worker-boilerplate");
    expect(body.endpoints).toContain("GET /health");
  });

  it("GET /health returns ok=true", async () => {
    const res = await SELF.fetch("https://example.com/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; status: string };
    expect(body.ok).toBe(true);
    expect(body.status).toBe("healthy");
  });

  it("POST /echo returns the submitted JSON", async () => {
    const payload = { hello: "world", n: 42, nested: { ok: true } };
    const res = await SELF.fetch("https://example.com/echo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(payload);
  });

  it("POST /echo with invalid JSON returns 400", async () => {
    const res = await SELF.fetch("https://example.com/echo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not-json",
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string; status: number } };
    expect(body.error.code).toBe("bad_request");
    expect(body.error.status).toBe(400);
  });

  it("unknown route returns 404", async () => {
    const res = await SELF.fetch("https://example.com/does-not-exist");
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("not_found");
  });

  it("unsupported method returns 405", async () => {
    const res = await SELF.fetch("https://example.com/health", { method: "POST" });
    expect(res.status).toBe(405);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("method_not_allowed");
  });
});
