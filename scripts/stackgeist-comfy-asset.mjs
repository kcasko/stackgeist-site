#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

export function slugify(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'stackgeist-asset';
}

export function normalizeSize(input = {}) {
  const preset = input.size || input.aspect || 'hero';
  const presets = {
    hero: [1344, 768],
    wide: [1344, 768],
    square: [1024, 1024],
    pin: [832, 1216],
    pinterest: [832, 1216],
    card: [1024, 768],
    thumb: [1024, 576],
    thumbnail: [1024, 576],
  };
  if (Array.isArray(input.dimensions) && input.dimensions.length === 2) {
    return { width: Number(input.dimensions[0]), height: Number(input.dimensions[1]) };
  }
  const [width, height] = presets[preset] || presets.hero;
  return { width, height };
}

export function stackgeistPrompt({ title = '', prompt = '', type = 'hero' } = {}) {
  const subject = [title, prompt].filter(Boolean).join(', ');
  return [
    `StackGeist ${type} artwork`,
    subject,
    'dark terminal/operator aesthetic',
    'black graphite background, subtle phosphor green and amber glow, cyber workstation mood',
    'premium editorial tech illustration, sharp composition, cinematic lighting',
    'no readable text, no logos, no product packaging, no fake screenshots',
  ].filter(Boolean).join(', ');
}

export function buildSdxlWorkflow({
  checkpoint = 'sd_xl_base_1.0.safetensors',
  positive,
  negative = 'readable text, watermark, logo, brand name, fake product packaging, blurry, low quality, distorted hands, deformed objects',
  width = 1344,
  height = 768,
  steps = 18,
  cfg = 6,
  seed = -1,
  batchSize = 1,
  sampler = 'euler',
  scheduler = 'normal',
  filenamePrefix = 'StackGeist/asset',
} = {}) {
  const finalSeed = seed === -1 || seed == null ? crypto.randomInt(1, 2 ** 32 - 1) : Number(seed);
  return {
    workflow: {
      '3': { class_type: 'KSampler', inputs: { seed: finalSeed, steps, cfg, sampler_name: sampler, scheduler, denoise: 1, model: ['4', 0], positive: ['6', 0], negative: ['7', 0], latent_image: ['5', 0] } },
      '4': { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: checkpoint } },
      '5': { class_type: 'EmptyLatentImage', inputs: { width, height, batch_size: batchSize } },
      '6': { class_type: 'CLIPTextEncode', inputs: { text: positive, clip: ['4', 1] } },
      '7': { class_type: 'CLIPTextEncode', inputs: { text: negative, clip: ['4', 1] } },
      '8': { class_type: 'VAEDecode', inputs: { samples: ['3', 0], vae: ['4', 2] } },
      '9': { class_type: 'SaveImage', inputs: { filename_prefix: filenamePrefix, images: ['8', 0] } },
    },
    seed: finalSeed,
  };
}

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  if (!res.ok) throw new Error(`${options.method || 'GET'} ${url} failed ${res.status}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : {};
}

export async function getCheckpoints(host) {
  const info = await fetchJson(`${host}/object_info/CheckpointLoaderSimple`);
  return info.CheckpointLoaderSimple?.input?.required?.ckpt_name?.[0] || [];
}

export function chooseCheckpoint(available, preferred) {
  if (preferred && available.includes(preferred)) return preferred;
  for (const candidate of ['Juggernaut-XL_v9_RunDiffusionPhoto_v2.safetensors', 'sd_xl_base_1.0.safetensors', 'v1-5-pruned-emaonly-fp16.safetensors']) {
    if (available.includes(candidate)) return candidate;
  }
  if (available.length) return available[0];
  throw new Error('No ComfyUI checkpoints found. Install SDXL or SD 1.5 before generating StackGeist assets.');
}

export function collectImages(historyEntry) {
  const outputs = historyEntry?.outputs || {};
  return Object.values(outputs).flatMap((node) => node.images || []);
}

async function waitForHistory(host, promptId, timeoutMs = 180000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const history = await fetchJson(`${host}/history/${promptId}`);
    if (history[promptId]) return history[promptId];
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error(`Timed out waiting for ComfyUI prompt ${promptId}`);
}

async function downloadImage(host, image, destination) {
  const params = new URLSearchParams({ filename: image.filename, subfolder: image.subfolder || '', type: image.type || 'output' });
  const res = await fetch(`${host}/view?${params}`);
  if (!res.ok) throw new Error(`GET /view failed ${res.status} for ${image.filename}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  await writeFile(destination, bytes);
  return bytes.length;
}

export async function runAssetRequest(input, io = console) {
  const host = (input.comfyHost || process.env.COMFYUI_HOST || 'http://127.0.0.1:8188').replace(/\/$/, '');
  const slug = slugify(input.slug || input.title);
  const type = slugify(input.type || 'hero');
  const outputRoot = path.resolve(input.outputDir || path.join(REPO_ROOT, 'public', 'generated', 'stackgeist', slug));
  const manifestPath = path.join(outputRoot, 'manifest.json');
  const { width, height } = normalizeSize(input);

  const available = await getCheckpoints(host);
  const checkpoint = chooseCheckpoint(available, input.checkpoint);
  const positive = input.positive || stackgeistPrompt(input);
  const filenamePrefix = `StackGeist/${slug}/${type}`;
  const { workflow, seed } = buildSdxlWorkflow({ checkpoint, positive, width, height, seed: input.seed ?? -1, steps: Number(input.steps || 18), cfg: Number(input.cfg || 6), batchSize: Number(input.count || 1), filenamePrefix });

  await mkdir(outputRoot, { recursive: true });
  const submit = await fetchJson(`${host}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflow, client_id: `stackgeist-${Date.now()}` }),
  });

  const promptId = submit.prompt_id;
  if (!promptId) throw new Error(`ComfyUI did not return prompt_id: ${JSON.stringify(submit)}`);
  io.error?.(`Queued ComfyUI prompt ${promptId} with ${checkpoint}, seed ${seed}`);
  const historyEntry = await waitForHistory(host, promptId, Number(input.timeoutMs || 180000));
  const images = collectImages(historyEntry);
  if (!images.length) throw new Error(`ComfyUI prompt ${promptId} completed with no image outputs`);

  const saved = [];
  for (let i = 0; i < images.length; i += 1) {
    const ext = path.extname(images[i].filename) || '.png';
    const destination = path.join(outputRoot, `${type}-${promptId.slice(0, 8)}-${i + 1}${ext}`);
    const bytes = await downloadImage(host, images[i], destination);
    saved.push({ file: path.relative(REPO_ROOT, destination).replace(/\\/g, '/'), bytes, comfy: images[i] });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    slug,
    type,
    title: input.title || '',
    prompt: positive,
    negative: input.negative || undefined,
    checkpoint,
    seed,
    width,
    height,
    promptId,
    outputs: saved,
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

async function readJsonArg(argv) {
  const jsonIndex = argv.indexOf('--json');
  if (jsonIndex !== -1) return JSON.parse(argv[jsonIndex + 1]);
  const fileIndex = argv.indexOf('--file');
  if (fileIndex !== -1) return JSON.parse(await readFile(argv[fileIndex + 1], 'utf8'));
  const input = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '');
    const value = argv[i + 1];
    if (!key) continue;
    input[key] = value;
  }
  return input;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const input = await readJsonArg(process.argv);
    const result = await runAssetRequest(input);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  }
}
