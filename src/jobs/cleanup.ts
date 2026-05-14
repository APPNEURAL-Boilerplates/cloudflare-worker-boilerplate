export async function cleanupJob(_env: Env, _ctx: ExecutionContext): Promise<void> {
  console.log(JSON.stringify({ event: "cleanup_job", status: "ok" }));
}
