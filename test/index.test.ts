import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Cloudflare Worker boilerplate", () => {
  it("GET / returns a JSON welcome payload", async () => {
    const res = await SELF.fetch("https://example.com/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(res.headers.get("x-request-id")).toBeTruthy();

    const body = (await res.json()) as {
      ok: true;
      data: { name: string; routes: string[] };
    };
    expect(body.ok).toBe(true);
    expect(body.data.name).toBe("cloudflare-worker-boilerplate");
    expect(body.data.routes).toContain("GET /health");
  });

  it("GET /health returns healthy status", async () => {
    const res = await SELF.fetch("https://example.com/health");
    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      ok: true;
      data: { status: string; uptime: string };
    };
    expect(body.data.status).toBe("healthy");
    expect(body.data.uptime).toBe("ok");
  });

  it("GET /version returns project metadata", async () => {
    const res = await SELF.fetch("https://example.com/version");
    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      ok: true;
      data: { name: string; version: string; env: string };
    };
    expect(body.data.name).toBe("cloudflare-worker-boilerplate");
    expect(body.data.version).toBe("1.0.0");
    expect(body.data.env).toBe("development");
  });

  it("GET /api/status returns request-aware status", async () => {
    const res = await SELF.fetch("https://example.com/api/status", {
      headers: { "x-request-id": "test-request-id" },
    });
    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      ok: true;
      data: { service: string; status: string; requestId: string };
    };
    expect(body.data.status).toBe("ok");
    expect(body.data.requestId).toBe("test-request-id");
  });

  it("POST /api/echo returns the submitted JSON", async () => {
    const payload = { hello: "world", n: 42, nested: { ok: true } };
    const res = await SELF.fetch("https://example.com/api/echo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(res.status).toBe(200);

    const body = (await res.json()) as { ok: true; data: typeof payload };
    expect(body.data).toEqual(payload);
  });

  it("supports route params", async () => {
    const res = await SELF.fetch("https://example.com/api/users/user_123");
    expect(res.status).toBe(200);

    const body = (await res.json()) as { ok: true; data: { id: string } };
    expect(body.data.id).toBe("user_123");
  });

  it("POST /api/echo with invalid JSON returns 400", async () => {
    const res = await SELF.fetch("https://example.com/api/echo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not-json",
    });
    expect(res.status).toBe(400);

    const body = (await res.json()) as { ok: false; error: { code: string } };
    expect(body.error.code).toBe("BAD_REQUEST");
  });

  it("unknown route returns 404", async () => {
    const res = await SELF.fetch("https://example.com/does-not-exist");
    expect(res.status).toBe(404);

    const body = (await res.json()) as { ok: false; error: { code: string } };
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("unsupported method returns 405", async () => {
    const res = await SELF.fetch("https://example.com/health", { method: "POST" });
    expect(res.status).toBe(405);

    const body = (await res.json()) as {
      ok: false;
      error: { code: string; details: { allowedMethods: string[] } };
    };
    expect(body.error.code).toBe("METHOD_NOT_ALLOWED");
    expect(body.error.details.allowedMethods).toEqual(["GET"]);
  });

  it("OPTIONS preflight returns CORS headers", async () => {
    const res = await SELF.fetch("https://example.com/api/status", {
      method: "OPTIONS",
      headers: { origin: "https://app.example.com" },
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });
});
