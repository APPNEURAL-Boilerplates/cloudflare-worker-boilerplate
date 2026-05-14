import { createApp } from "./app";

const app = createApp();

export default {
  fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },
  scheduled(_event, env, ctx) {
    return app.scheduled?.(_event, env, ctx);
  },
  queue(batch, env, ctx) {
    return app.queue?.(batch, env, ctx);
  },
} satisfies ExportedHandler<Env>;
