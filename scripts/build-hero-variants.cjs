#!/usr/bin/env node
// Generate AVIF + WebP variants (400w, 800w) alongside every hero image.
// LF line endings; ESM-safe via require in CJS mode.
// Idempotent: overwrites variants each run.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputs = [
  { src: 'public/setups/budget-gaming-desk.png', name: 'budget-gaming-desk' },
  { src: 'public/gear/caldigit-ts4.jpg', name: 'caldigit-ts4' },
  { src: 'public/gear/clamp-on-led-desk-lamp.jpg', name: 'clamp-on-led-desk-lamp' },
  { src: 'public/gear/anker-553-usb-c-hub.jpg', name: 'anker-553-usb-c-hub' },
];

const widths = [400, 800];

async function main() {
  for (const { src, name } of inputs) {
    if (!fs.existsSync(src)) {
      console.error('missing:', src);
      process.exitCode = 1;
      continue;
    }
    const dir = path.dirname(src);
    const meta = await sharp(src).metadata();
    for (const w of widths) {
      const targetW = Math.min(w, meta.width || w);
      const avifOut = path.join(dir, `${name}-${w}w.avif`);
      const webpOut = path.join(dir, `${name}-${w}w.webp`);
      await sharp(src).resize({ width: targetW }).avif({ quality: 55, effort: 6 }).toFile(avifOut);
      await sharp(src).resize({ width: targetW }).webp({ quality: 78, effort: 5 }).toFile(webpOut);
      const a = fs.statSync(avifOut).size, b = fs.statSync(webpOut).size;
      console.log(`  ${name} ${w}w  avif=${(a/1024).toFixed(1)}KB  webp=${(b/1024).toFixed(1)}KB`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
