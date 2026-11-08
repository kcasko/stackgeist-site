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

test('RSS feed publishes fixes, labs, and cert pages with canonical links', async () => {
  const rss = await read('dist/rss.xml');
  assert.match(rss, /<rss version="2\.0"/);
  assert.match(rss, /<title>StackGeist: tech fixes, IT home labs, and certification guides<\/title>/);
  assert.ok((rss.match(/<item>/g) || []).length >= 20);
  assert.match(rss, /https:\/\/stackgeist\.dev\/guides\/sennheiser-momentum-4-wont-pair\//);
  assert.match(rss, /https:\/\/stackgeist\.dev\/labs\/active-directory-home-lab\//);
  assert.doesNotMatch(rss, /\/setups\//);
});
