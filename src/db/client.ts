export function getD1Database(env: Env, bindingName = "DB"): D1Database | undefined {
  return (env as unknown as Record<string, D1Database | undefined>)[bindingName];
}
