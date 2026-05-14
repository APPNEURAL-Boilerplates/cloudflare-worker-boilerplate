import { AppError } from "../errors/app-error";
import { ErrorCode } from "../errors/codes";
import { retry } from "./retry";
import { withTimeout } from "./timeout";

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMs?: number; retryAttempts?: number } = {},
): Promise<T> {
  const timeout = withTimeout(init.timeoutMs ?? 5_000);

  try {
    return await retry(
      async () => {
        const response = await fetch(input, { ...init, signal: timeout.signal });
        if (!response.ok) {
          throw new AppError("Upstream request failed", {
            code: ErrorCode.UpstreamError,
            status: 502,
            details: { upstreamStatus: response.status },
          });
        }
        return (await response.json()) as T;
      },
      { attempts: init.retryAttempts ?? 1 },
    );
  } finally {
    timeout.cancel();
  }
}
