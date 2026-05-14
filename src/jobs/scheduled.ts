import { cleanupJob } from "./cleanup";

export async function runScheduledJob(
  event: ScheduledEvent,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  switch (event.cron) {
    case "0 0 * * *":
      await cleanupJob(env, ctx);
      break;
    default:
      console.log(JSON.stringify({ event: "scheduled_noop", cron: event.cron }));
  }
}
