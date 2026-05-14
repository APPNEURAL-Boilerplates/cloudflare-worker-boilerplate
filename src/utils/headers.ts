export function appendVary(headers: Headers, value: string): void {
  const existing = headers.get("vary");
  if (!existing) {
    headers.set("vary", value);
    return;
  }

  const parts = new Set(existing.split(",").map((part) => part.trim().toLowerCase()));
  if (!parts.has(value.toLowerCase())) {
    headers.set("vary", `${existing}, ${value}`);
  }
}
