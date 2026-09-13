import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify, normalizeSize, stackgeistPrompt, buildSdxlWorkflow, chooseCheckpoint, collectImages } from '../scripts/stackgeist-comfy-asset.mjs';

test('slugify creates safe short path segments', () => {
  assert.equal(slugify('Budget Linux Homelab: $500 & Under!'), 'budget-linux-homelab-500-and-under');
  assert.equal(slugify(''), 'stackgeist-asset');
});

test('normalizeSize supports StackGeist social presets', () => {
  assert.deepEqual(normalizeSize({ size: 'hero' }), { width: 1344, height: 768 });
  assert.deepEqual(normalizeSize({ size: 'pinterest' }), { width: 832, height: 1216 });
  assert.deepEqual(normalizeSize({ dimensions: [640, 360] }), { width: 640, height: 360 });
});

test('stackgeistPrompt bans fake product evidence', () => {
  const prompt = stackgeistPrompt({ title: 'Linux Homelab', prompt: 'mini pc rack', type: 'hero' });
  assert.match(prompt, /dark terminal\/operator aesthetic/);
  assert.match(prompt, /no readable text/);
  assert.match(prompt, /no logos/);
  assert.match(prompt, /no fake screenshots/);
});

test('chooseCheckpoint prefers installed StackGeist-friendly models', () => {
  const available = ['v1-5-pruned-emaonly-fp16.safetensors', 'sd_xl_base_1.0.safetensors'];
  assert.equal(chooseCheckpoint(available), 'sd_xl_base_1.0.safetensors');
  assert.equal(chooseCheckpoint(available, 'v1-5-pruned-emaonly-fp16.safetensors'), 'v1-5-pruned-emaonly-fp16.safetensors');
});

test('buildSdxlWorkflow returns ComfyUI API-format nodes', () => {
  const { workflow, seed } = buildSdxlWorkflow({ positive: 'test prompt', seed: 123, width: 1024, height: 576, filenamePrefix: 'StackGeist/test/hero' });
  assert.equal(seed, 123);
  assert.equal(workflow['4'].class_type, 'CheckpointLoaderSimple');
  assert.equal(workflow['5'].inputs.width, 1024);
  assert.equal(workflow['5'].inputs.height, 576);
  assert.equal(workflow['6'].inputs.text, 'test prompt');
  assert.equal(workflow['9'].inputs.filename_prefix, 'StackGeist/test/hero');
});

test('collectImages flattens ComfyUI history output image nodes', () => {
  const images = collectImages({ outputs: { '9': { images: [{ filename: 'a.png' }] }, '10': { text: ['ignored'] } } });
  assert.deepEqual(images, [{ filename: 'a.png' }]);
});
