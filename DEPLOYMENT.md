# Production deployment

Public URL: https://winspo.kaooffline.top

Next.js runs on Vercel project `winspo` in `kikoaidev-gmailcoms-projects`.
The stable origin is https://winspo-brown.vercel.app.
Cloudflare Worker `winspo-router` forwards only `winspo.kaooffline.top/*`
to that origin, taking precedence over QuickHost's wildcard route. Existing
Cloudflare wildcard DNS remains in place; no DNS edit permission is required.

Deploy the frontend with `vercel deploy --prod` after linking this project.
Deploy routing with `wrangler deploy --config infra/wrangler.jsonc`.
Use an authenticated Wrangler v4 installation; credentials stay outside Git.

## Verified release — 2026-11-02

- Application source: `f4d09f9`.
- Vercel deployment: `dpl_6qT3sotpniiLKsw5d39Vi2ecd6iJ` (Ready).
- Immutable URL: https://winspo-patg38khq-kikoaidev-gmailcoms-projects.vercel.app
- Worker version: `346892ac-8ca3-4b67-ba1f-0799c90e3dbf`.
- All 37 local tests, lint, typecheck, and production build passed.
- Public gallery, home, Czech manual, lookup, and thumbnail returned HTTP 200.
- Root API returned 103 items; slots 0,1,2 encoded to 7 and decoded to 3 items.
- MP4 byte-range request returned HTTP 206.

## Recovery

For future frontend releases, use `vercel rollback` with the retained known-good
deployment URL above, then repeat the live checks. The router follows the stable
production alias. Worker changes can be reverted with `wrangler rollback`.

Before this initial routing deployment there was no Winspo-specific Worker route;
removing only `winspo.kaooffline.top/*` restores QuickHost wildcard handling.
The pre-change route inventory is retained on the deploying PC at
`%TEMP%/winspo-routing-before.json`. No database or application data was changed.
