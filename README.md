# Cloudflare Worker TypeScript Boilerplate

A production-ready starter for [Cloudflare Workers](https://developers.cloudflare.com/workers/) written in TypeScript with strict typing, JSON helpers, structured error handling, and a complete test setup using the official [`@cloudflare/vitest-pool-workers`](https://developers.cloudflare.com/workers/testing/vitest-integration/) integration.

## Features

- **Module syntax Worker** (`export default { fetch }`)
- **TypeScript strict mode** with `wrangler types`-generated `Env` bindings
- **Reusable helpers** — `jsonResponse`, `errorResponse`, `AppError`
- **Routing** for `GET /`, `GET /health`, `POST /echo`
- **Standardized JSON errors** — 400 / 404 / 405 / 500
- **Vitest tests** running inside the actual Workers runtime

## Project Structure

```
.
├── src/
│   ├── index.ts        # Worker entrypoint (fetch handler + router)
│   ├── responses.ts    # jsonResponse / errorResponse helpers
│   └── errors.ts       # AppError class
├── test/
│   └── index.test.ts   # Vitest suite (runs in Workers runtime)
├── package.json
├── tsconfig.json
├── wrangler.jsonc
├── vitest.config.ts
├── .gitignore
├── .dev.vars.example
└── README.md
```

## Prerequisites

- Node.js **>= 18**
- npm (or pnpm/yarn — examples use npm)
- A Cloudflare account for `wrangler deploy` (not required for local dev or tests)

## Install

```bash
npm install
```

## Develop

Run the Worker locally with hot reload via Wrangler's local runtime (workerd):

```bash
npm run dev
```

By default it listens on `http://127.0.0.1:8787`.

Try the endpoints:

```bash
curl http://127.0.0.1:8787/
curl http://127.0.0.1:8787/health
curl -X POST http://127.0.0.1:8787/echo \
     -H 'content-type: application/json' \
     -d '{"hello":"world"}'
```

## Test

Tests run against the real Workers runtime via `@cloudflare/vitest-pool-workers`:

```bash
npm test
```

Run typecheck + tests together:

```bash
npm run check
```

## Deploy

```bash
npm run deploy
```

You'll be prompted to authenticate the first time. After deploy, Wrangler prints your `*.workers.dev` URL.

## Environment Variables & Secrets

Two kinds of configuration:

1. **Non-sensitive vars** — declare under a `vars` block in `wrangler.jsonc`. These are committed.
2. **Secrets** — never commit these.
   - **Local dev:** copy `.dev.vars.example` to `.dev.vars` and fill values. The file is gitignored.
   - **Production:** push secrets with Wrangler:
     ```bash
     wrangler secret put MY_SECRET
     ```

Secrets and vars are exposed inside the Worker as `env.MY_SECRET`. Run `npm run types` to regenerate `worker-configuration.d.ts` and pick up new bindings in TypeScript.

> ⚠️ **Never commit `.dev.vars`, `.env`, API keys, tokens, or any other secret material.** They are listed in `.gitignore` for that reason — keep it that way.

## Useful Scripts

| Script              | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Run the Worker locally with Wrangler.                   |
| `npm run deploy`    | Deploy the Worker to Cloudflare.                        |
| `npm run types`     | Regenerate `Env`/binding types via `wrangler types`.    |
| `npm run typecheck` | Regenerate types then run `tsc --noEmit`.               |
| `npm test`          | Run the Vitest suite inside the Workers runtime.        |
| `npm run check`     | Typecheck **and** test — run before pushing / deploying. |

## License

MIT — use freely as a starting point for your own Workers projects.
