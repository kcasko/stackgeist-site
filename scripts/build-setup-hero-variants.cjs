#!/usr/bin/env node
// Generate AVIF + WebP variants for setup-hero PNGs at 600w and 1200w.
// SetupHero.astro renders at full container width (up to ~1000-1100 px on desktop),
// so 1200w handles retina up to that break and 600w handles mobile.
// Idempotent; overwrites variants each run.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputs = [
  { src: 'public/setups/budget-gaming-desk.png', name: 'budget-gaming-desk' },
  { src: 'public/setups/gaming.png', name: 'gaming' },
  { src: 'public/setups/midnight-shift.png', name: 'midnight-shift' },
  { src: 'public/setups/small-bedroom-gaming.png', name: 'small-bedroom-gaming' },
];

const widths = [600, 1200];

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
