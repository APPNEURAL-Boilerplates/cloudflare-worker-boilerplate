export type AppConfig = {
  appEnv: "development" | "staging" | "production" | "test";
  appName: string;
  version: string;
  logLevel: "debug" | "info" | "warn" | "error";
  allowedOrigins: string[];
  apiKey?: string;
};

type RawEnv = Env & {
  APP_ENV?: string;
  APP_NAME?: string;
  APP_VERSION?: string;
  LOG_LEVEL?: string;
  ALLOWED_ORIGINS?: string;
  API_KEY?: string;
};

export function loadConfig(env: Env): AppConfig {
  const raw = env as RawEnv;
  return {
    appEnv: parseAppEnv(raw.APP_ENV),
    appName: raw.APP_NAME ?? "cloudflare-workers-typescript-microservice-boilerplate",
    version: raw.APP_VERSION ?? "1.0.0",
    logLevel: parseLogLevel(raw.LOG_LEVEL),
    allowedOrigins: parseCsv(raw.ALLOWED_ORIGINS ?? "*"),
    apiKey: raw.API_KEY,
  };
}

function parseAppEnv(value: string | undefined): AppConfig["appEnv"] {
  if (value === "production" || value === "staging" || value === "test") return value;
  return "development";
}

function parseLogLevel(value: string | undefined): AppConfig["logLevel"] {
  if (value === "debug" || value === "warn" || value === "error") return value;
  return "info";
}

function parseCsv(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
