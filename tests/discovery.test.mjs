import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { before, test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

before(() => {
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    encoding: 'utf8',
    shell: true,
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('sitemap keeps the focus setup once and leaves archived setups out', async () => {
  const sitemap = await read('dist/sitemap.xml');
  assert.equal(sitemap.split('https://stackgeist.dev/setups/home-lab-dev-workstation/').length - 1, 1);
  for (const slug of ['streaming-content-creator', 'console-living-room', 'sim-racing-flight']) {
    assert.doesNotMatch(sitemap, new RegExp(`https://stackgeist\\.dev/setups/${slug}/`));
  }
  assert.doesNotMatch(sitemap, /https:\/\/stackgeist\.dev\/404/);
});

test('research placeholders are noindex, non-commercial, and excluded from sitemap', async () => {
  const sitemap = await read('dist/sitemap.xml');
  for (const slug of [
    'iniu-usb-c-to-usb-c-cable-240w-6-6ft',
    'acodot-9-in-1-usb-c-hub',
    '500w-multi-port-gan-charging-station',
  ]) {
    const html = await read(`dist/gear/budget-tech/${slug}/index.html`);
    assert.match(html, /<meta name="robots" content="noindex/);
    assert.doesNotMatch(html, /tag=deskrespawn-20/);
    assert.doesNotMatch(sitemap, new RegExp(`https://stackgeist\\.dev/gear/budget-tech/${slug}/`));
  }
  assert.doesNotMatch(sitemap, /https:\/\/stackgeist\.dev\/gear\/budget-tech\/compare\//);
});

test('RSS feed publishes the complete setup catalog with canonical links', async () => {
  const rss = await read('dist/rss.xml');
  assert.match(rss, /<rss version="2\.0"/);
  assert.match(rss, /<title>StackGeist setup guides<\/title>/);
  assert.equal((rss.match(/<item>/g) || []).length, 12);
  assert.match(rss, /https:\/\/stackgeist\.dev\/setups\/streaming-content-creator/);
  assert.match(rss, /https:\/\/stackgeist\.dev\/setups\/midnight-shift/);
});

test('pages advertise the RSS feed and emit breadcrumb structured data', async () => {
  const home = await read('dist/index.html');
  assert.match(home, /rel="alternate"[^>]+type="application\/rss\+xml"[^>]+href="https:\/\/stackgeist\.dev\/rss\.xml"/);

  const setup = await read('dist/setups/streaming-content-creator/index.html');
  assert.match(setup, /"@type":"BreadcrumbList"/);
  assert.match(setup, /"item":"https:\/\/stackgeist\.dev\/setups\/"/);
  assert.match(setup, /"item":"https:\/\/stackgeist\.dev\/setups\/streaming-content-creator\/"/);
});
