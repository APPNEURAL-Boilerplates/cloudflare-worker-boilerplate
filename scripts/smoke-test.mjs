const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:8787";

const checks = ["/health", "/version"];

for (const path of checks) {
  const response = await fetch(new URL(path, baseUrl));
  if (!response.ok) {
    throw new Error(`Smoke check failed for ${path}: ${response.status}`);
  }
}

console.log(`Smoke checks passed for ${baseUrl}`);
