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

test('sitemap includes every generated setup route exactly once', async () => {
  const sitemap = await read('dist/sitemap.xml');
  const slugs = [
    'streaming-content-creator',
    'console-living-room',
    'handheld-steam-deck',
    'work-from-home-pro',
    'home-lab-dev-workstation',
    'dual-monitor-productivity',
    'sim-racing-flight',
    'ai-ml-workstation',
    'podcasting-audio',
  ];
  for (const slug of slugs) {
    const url = `https://stackgeist.dev/setups/${slug}`;
    assert.equal(sitemap.split(url).length - 1, 1, `${url} should appear once`);
  }
  assert.doesNotMatch(sitemap, /https:\/\/stackgeist\.dev\/404/);
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
  assert.match(setup, /"item":"https:\/\/stackgeist\.dev\/setups"/);
  assert.match(setup, /"item":"https:\/\/stackgeist\.dev\/setups\/streaming-content-creator"/);
});
