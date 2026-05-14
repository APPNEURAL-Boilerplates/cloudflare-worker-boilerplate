export function withTimeout(ms: number): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(`Timed out after ${ms}ms`), ms);
  return {
    signal: controller.signal,
    cancel: () => clearTimeout(timeout),
  };
}
