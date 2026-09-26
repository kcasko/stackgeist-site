# StackGeist automation (n8n + ComfyUI)

Local-only automation glue. Nothing here is deployed.

## Components

- `scripts/stackgeist-comfy-asset.mjs` — Node CLI that talks to ComfyUI at
  `http://127.0.0.1:8188`, builds an SDXL workflow, waits for the render,
  downloads the PNG to `public/generated/stackgeist/<slug>/`, and writes a
  `manifest.json` next to it.
- `automation/n8n/stackgeist-asset-request.json` — n8n workflow with a POST
  webhook at `/webhook/stackgeist-asset` that shells out to the CLI inside
  the n8n container. Returns the manifest as the HTTP response.
- `automation/n8n/stackgeist-weekly-growth-report.json` — n8n cron workflow
  (Mondays 08:00 America/New_York) that runs `npm run analytics:weekly -- --write`
  inside the n8n container. Requires `CLOUDFLARE_API_TOKEN` (see below).

## n8n container wiring

`~/docker/n8n/compose.yml` (in Ubuntu WSL) mounts:

- `/mnt/e/Repos/stackgeist/stackgeist-site` → `/workspace/stackgeist-site`
- `n8n_stackgeist_node_deps` volume → `/home/node/stackgeist-node-deps`
  (holds a container-native `wrangler` install so we don't hit the Windows
  `workerd` binary mismatch)

Environment added:

- `COMFYUI_HOST=http://172.28.96.1:8189` (Windows host, via the WSL vEthernet
  gateway; port 8189 → 127.0.0.1:8188 via `netsh interface portproxy` and a
  matching Windows Firewall rule)
- `STACKGEIST_SITE_DIR=/workspace/stackgeist-site`
- `NODE_FUNCTION_ALLOW_BUILTIN=fs,path,crypto,child_process,http,https,url,buffer`
  (needed by the Function-node code that calls the CLI)

## Verified

- `node scripts/stackgeist-comfy-asset.mjs --json ...` → real PNG rendered.
- `POST http://127.0.0.1:5678/webhook/stackgeist-asset` → n8n workflow
  triggered ComfyUI and returned the manifest for `n8n-smoke`.
- `npm test` → 48/48 passing (includes new unit tests for the CLI).

## Not yet unblocked

Weekly growth report needs a Cloudflare API token so wrangler can query D1
non-interactively from inside the n8n container:

```
docker exec -u node n8n sh -lc 'mkdir -p /home/node/.stackgeist && echo "CLOUDFLARE_API_TOKEN=..." > /home/node/.stackgeist/env'
```

Or add `CLOUDFLARE_API_TOKEN` to `~/docker/n8n/compose.yml` env and
`docker compose up -d`. Token needs D1 read on `stackgeist-affiliate-events`.

Until that lands, the weekly workflow will import and schedule cleanly but
fail at execution time with the Wrangler "CLOUDFLARE_API_TOKEN" error.

## Regenerating

```
node scripts/stackgeist-comfy-asset.mjs --json '{"slug":"foo","title":"Foo","type":"hero","prompt":"..."}'

curl -sS -H 'Content-Type: application/json' \
  -d '{"slug":"foo","title":"Foo","type":"hero","prompt":"..."}' \
  http://127.0.0.1:5678/webhook/stackgeist-asset
```

`type` is one of `hero`, `card`, `illustration`, `og`. Optional overrides:
`size` (`hero`|`card`|`og`|`thumb`), `steps`, `count`, `seed`, `checkpoint`,
`negative`.
