# Cloudflare Workers TypeScript Microservice

Production-ready TypeScript starter for Cloudflare Workers. It includes routing, config loading, safe JSON responses, structured errors, middleware, Workers-runtime tests, Wrangler config, CI examples, and optional folders for storage, queues, cron, D1, and external API clients.

This boilerplate keeps optional Cloudflare products as scaffolding and comments. Uncomment bindings only when a project needs them.

## Features

- Module Worker entrypoint with `fetch`, `scheduled`, and `queue` handlers.
- Small router with 404 and 405 handling.
- Routes for `GET /`, `GET /health`, `GET /version`, `GET /api/status`, `POST /api/echo`, and `GET /api/users/:id`.
- Response helpers for JSON, errors, text, HTML, redirects, and no-content responses.
- `AppError` plus typed error codes and safe public error messages.
- Config loader for `APP_ENV`, `APP_NAME`, `APP_VERSION`, `LOG_LEVEL`, `ALLOWED_ORIGINS`, and optional `API_KEY`.
- Middleware for request IDs, structured logs, CORS, security headers, API-key auth, and rate-limit extension points.
- Helper modules for JSON parsing, cache, KV, R2, D1, queues, scheduled jobs, and outbound HTTP calls.
- Vitest running in the Workers runtime via `@cloudflare/vitest-pool-workers`.
- ESLint, Prettier, EditorConfig, VS Code recommendations, GitHub Actions examples, and a smoke-test script.

## Project Structure

```txt
.
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── router.ts
│   ├── routes/
│   ├── middleware/
│   ├── responses/
│   ├── errors/
│   ├── config/
│   ├── auth/
│   ├── http/
│   ├── storage/
│   ├── db/
│   ├── queues/
│   ├── jobs/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── types/
├── test/
├── public/
├── migrations/
├── scripts/
├── .github/workflows/
├── wrangler.jsonc
├── vitest.config.ts
└── package.json
```

## Requirements

- Node.js 22 recommended.
- npm.
- Cloudflare account for deployment.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

Wrangler starts the Worker at `http://127.0.0.1:8787`.

Try a few endpoints:

```bash
curl http://127.0.0.1:8787/health
curl http://127.0.0.1:8787/version
curl -X POST http://127.0.0.1:8787/api/echo \
  -H 'content-type: application/json' \
  -d '{"hello":"world"}'
```

## Environment Variables

Copy `.dev.vars.example` to `.dev.vars` for local secrets and overrides. Do not commit `.dev.vars`.

| Name | Required | Default | Notes |
| --- | --- | --- | --- |
| `APP_ENV` | No | `development` | `development`, `staging`, `production`, or `test`. |
| `APP_NAME` | No | `cloudflare-workers-typescript-microservice` | Returned by `/version`. |
| `APP_VERSION` | No | `1.0.0` | Returned by `/version`. |
| `LOG_LEVEL` | No | `info` | `debug`, `info`, `warn`, or `error`. |
| `ALLOWED_ORIGINS` | No | `*` | Comma-separated CORS origins. |
| `API_KEY` | No | unset | Use `wrangler secret put API_KEY` in deployed environments. |

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start local Wrangler dev server. |
| `npm run preview` | Run remote preview with Wrangler. |
| `npm run deploy` | Deploy to Cloudflare. |
| `npm run types` | Generate Worker and binding types from Wrangler config. |
| `npm run typecheck` | Generate types, then run `tsc --noEmit`. |
| `npm test` | Run Vitest in the Workers runtime. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run lint` | Run ESLint. |
| `npm run format` | Format files with Prettier. |
| `npm run check` | Run typecheck and tests. |
| `npm run ci` | Run lint, typecheck, and tests. |
| `npm run tail` | Tail deployed Worker logs. |
| `npm run smoke` | Check `/health` and `/version` against a running Worker. |

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Welcome payload and route list. |
| `GET` | `/health` | Health check. |
| `GET` | `/version` | App name, version, and environment. |
| `GET` | `/api/status` | API status and request ID. |
| `POST` | `/api/echo` | JSON body parsing example. |
| `GET` | `/api/users/:id` | Route params example. |

## Testing

```bash
npm test
npm run check
```

Tests use `cloudflare:test`, so they run against the Workers runtime instead of a plain Node.js approximation.

## Deployment

```bash
npm run deploy
```

Before production deployment:

- Replace `name` in `wrangler.jsonc`.
- Set production secrets with `wrangler secret put`.
- Run `npm run check`.
- Confirm `compatibility_date` and required bindings.
- Uncomment only the bindings your project actually uses.

## Optional Cloudflare Bindings

`wrangler.jsonc` includes commented examples for KV, D1, R2, Queues, Cron Triggers, and Assets. Keep unused bindings commented so local development and deployments stay simple.

## License

MIT
