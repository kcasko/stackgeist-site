# StackGeist n8n + ComfyUI Automation Design

## Goal

Wire the existing StackGeist repo, local n8n container, and local ComfyUI server into a small automation layer that can generate branded site assets and schedule StackGeist growth work without pretending AI images are product evidence.

## Current system

- StackGeist site lives at `E:\Repos\stackgeist\stackgeist-site` and uses Astro with npm.
- n8n runs in Docker under Ubuntu WSL as container `n8n` on port `5678`.
- ComfyUI runs on Windows portable at `http://127.0.0.1:8188` with these checkpoints available: `Juggernaut-XL_v9_RunDiffusionPhoto_v2.safetensors`, `sd_xl_base_1.0.safetensors`, and `v1-5-pruned-emaonly-fp16.safetensors`.
- The laptop GPU is an RTX 4050 with 6 GB VRAM, so the default workflow must stay lightweight.

## Architecture

Add a repo-local Node script, `scripts/stackgeist-comfy-asset.mjs`, as the stable interface. It accepts JSON, builds a minimal ComfyUI API-format SDXL workflow, submits it to ComfyUI, polls `/history/{prompt_id}`, downloads images through `/view`, and writes files plus a manifest under `public/generated/stackgeist/<slug>/`.

n8n should not own the image workflow logic. It acts as a trigger and scheduler. The n8n container will mount the StackGeist repo read/write at `/workspace/stackgeist-site`, then imported workflows can run the repo script with `node scripts/stackgeist-comfy-asset.mjs` or run existing analytics scripts.

Because ComfyUI listens on Windows localhost, Docker in WSL cannot reach it directly. Add a Windows portproxy on port `8189` forwarding to `127.0.0.1:8188`, then n8n can reach it through the Windows host gateway from inside WSL/Docker.

## Workflows

### StackGeist Asset Request

Webhook receives JSON containing `slug`, `title`, `type`, `prompt`, `size`, and optional generation settings. It executes the repo script in `/workspace/stackgeist-site` with `COMFYUI_HOST` pointing at the Windows-host portproxy. The response includes the manifest JSON with saved repo-relative file paths.

### Weekly StackGeist Growth Report

Schedule trigger runs weekly. It executes `npm run analytics:weekly -- --write` inside `/workspace/stackgeist-site`. This depends on the existing StackGeist analytics script and whatever Cloudflare/wrangler auth is available to the runtime. If remote auth is missing, the workflow should fail loudly rather than fabricate a report.

## Safety rules

- Preserve existing untracked files.
- Generated art must say no readable text, no logos, no product packaging, and no fake screenshots.
- The script must choose from actually installed ComfyUI checkpoints.
- The n8n workflow is allowed to write generated assets and reports only inside the mounted StackGeist repo.
- No automatic git commits from n8n.

## Verification

- Unit tests for prompt generation, path slugging, workflow shape, checkpoint choice, and ComfyUI history parsing.
- `npm test` in StackGeist.
- Live ComfyUI smoke generation that produces at least one PNG and manifest.
- n8n CLI import/list verification.
- Direct container execution of the asset script through the mounted repo and portproxy, proving n8n can use the same path.
