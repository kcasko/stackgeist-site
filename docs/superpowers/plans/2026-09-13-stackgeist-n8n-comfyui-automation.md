# StackGeist n8n ComfyUI Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a verified local automation path where n8n can trigger StackGeist-branded ComfyUI image generation and weekly StackGeist report jobs.

**Architecture:** Keep image-generation logic in the StackGeist repo as a Node CLI with exported pure functions. Mount the repo into the existing n8n container, expose Windows-local ComfyUI to WSL Docker through a Windows portproxy, and import n8n workflows that call the repo scripts.

**Tech Stack:** Astro repo, Node ESM, npm, n8n Docker container, ComfyUI REST API, Windows netsh portproxy, WSL Docker Compose.

**Spec:** `docs/superpowers/specs/2026-09-13-stackgeist-n8n-comfyui-design.md`

## Global Constraints

- Preserve existing untracked files: `marketing/tiktok/posting-checklist.md` and `scripts/reddit-outreach-tracker.py`.
- Use npm for StackGeist.
- Generated art must include prompt constraints against readable text, logos, product packaging, and fake screenshots.
- Default ComfyUI host is `http://127.0.0.1:8188`, with `COMFYUI_HOST` override for n8n.
- No automatic git commits from n8n.
- Verify with `npm test` and at least one live ComfyUI run.

---

### Task 1: Repo-local ComfyUI asset CLI

**Files:**
- Create: `scripts/stackgeist-comfy-asset.mjs`
- Create: `tests/stackgeist-comfy-asset.test.mjs`

**Interfaces:**
- Produces: `runAssetRequest(input, io)` returning a manifest object.
- Produces CLI: `node scripts/stackgeist-comfy-asset.mjs --json '{...}'`.

- [x] **Step 1: Write tests for pure helpers**

Tests cover `slugify`, `normalizeSize`, `stackgeistPrompt`, `chooseCheckpoint`, `buildSdxlWorkflow`, and `collectImages`.

- [x] **Step 2: Implement the CLI**

The CLI discovers checkpoints from ComfyUI, builds API-format workflow JSON, submits `/prompt`, polls `/history/{prompt_id}`, downloads `/view`, writes files under `public/generated/stackgeist/<slug>/`, and writes `manifest.json`.

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all test files pass.

### Task 2: n8n container access

**Files:**
- Modify: `/home/keith/docker/n8n/compose.yml` inside Ubuntu WSL

**Interfaces:**
- Mounts StackGeist repo at `/workspace/stackgeist-site`.
- Provides `COMFYUI_HOST=http://10.255.255.254:8189` or equivalent Windows gateway URL.

- [ ] **Step 1: Add repo mount and environment**

Add the StackGeist repo mount and `COMFYUI_HOST` to the n8n service.

- [ ] **Step 2: Restart n8n**

Run: `docker compose -f ~/docker/n8n/compose.yml up -d`
Expected: n8n is running and can see `/workspace/stackgeist-site/package.json`.

### Task 3: Windows ComfyUI portproxy

**Files:**
- Create/update Windows portproxy rule, no repo file.

**Interfaces:**
- n8n accesses ComfyUI via Windows gateway port `8189`, forwarded to `127.0.0.1:8188`.

- [ ] **Step 1: Add portproxy rule as admin**

Run elevated PowerShell/netsh to add `listenport=8189 connectport=8188 connectaddress=127.0.0.1`.

- [ ] **Step 2: Verify from n8n container**

Run: `docker exec n8n sh -lc 'wget -qO- $COMFYUI_HOST/system_stats | head -c 100'`
Expected: ComfyUI JSON begins with `{"system":`.

### Task 4: n8n workflows

**Files:**
- Create: `automation/n8n/stackgeist-asset-request.json`
- Create: `automation/n8n/stackgeist-weekly-growth-report.json`

**Interfaces:**
- Asset workflow receives a webhook payload and executes the repo CLI.
- Weekly workflow runs `npm run analytics:weekly -- --write` in the mounted repo.

- [ ] **Step 1: Write n8n workflow JSON files**

Create importable n8n JSON definitions with clear names and inactive defaults if activation fails.

- [ ] **Step 2: Import workflows**

Run: `docker exec n8n n8n import:workflow --input=/workspace/stackgeist-site/automation/n8n/<file>.json --activeState=fromJson`
Expected: `n8n list:workflow` shows both StackGeist workflows.

### Task 5: Live verification

**Files:**
- Generated: `public/generated/stackgeist/<slug>/manifest.json`
- Generated: `public/generated/stackgeist/<slug>/*.png`

**Interfaces:**
- Direct CLI and container path both work.

- [ ] **Step 1: Run direct Windows-side smoke generation**

Run: `node scripts/stackgeist-comfy-asset.mjs --json '{"slug":"automation-smoke","title":"StackGeist Automation Smoke","type":"hero","prompt":"dark terminal homelab dashboard","size":"thumb","steps":4}'`
Expected: one PNG and manifest are written.

- [ ] **Step 2: Run n8n-container-side smoke generation**

Run the same command inside the n8n container from `/workspace/stackgeist-site`.
Expected: one PNG and manifest are written.

- [ ] **Step 3: Run repo test suite**

Run: `npm test`
Expected: all tests pass.
