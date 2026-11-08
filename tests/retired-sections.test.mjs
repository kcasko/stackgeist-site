import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const dist = 'dist';
const get = (p) => readFileSync(p, 'utf8');

test('retired kit/setup routes are not published or indexed', { skip: !existsSync(join(dist, 'sitemap.xml')) }, () => {
  for (const group of ['kits', 'setups']) {
    assert.ok(!existsSync(join(dist, group)), group + ' should no longer generate HTML');
    assert.doesNotMatch(get(join(dist, 'sitemap.xml')), new RegExp('/' + group + '/'));
  }
});

test('retired URLs have permanent redirects to still-published destinations', { skip: !existsSync(join(dist, '_redirects')) }, () => {
  const routes = get(join(dist, '_redirects')).split(/\r?\n/).map(line => line.trim().split(/\s+/));
  for (const group of ['kits', 'setups']) {
    const groupRules = routes.filter(parts => parts[0]?.startsWith('/' + group + '/') && parts[2] === '301');
    assert.ok(groupRules.length >= 20, group + ': not enough retirement mappings');
    for (const [from, to] of groupRules) {
      assert.ok(existsSync(join(dist, to, 'index.html')), from + ' redirects to missing destination ' + to);
      assert.ok(!to.startsWith('/kits/') && !to.startsWith('/setups/'), from + ' still points to retired content');
    }
  }
  assert.ok(routes.some(parts => parts[0] === '/kits/' && parts[2] === '301'));
  assert.ok(routes.some(parts => parts[0] === '/setups/' && parts[2] === '301'));
});

test('remaining HTML contains no links to kit or setup pages', { skip: !existsSync(dist) }, () => {
  function walk(path) {
    return readdirSync(path).flatMap(name => {
      const full = join(path, name);
      if (statSync(full).isDirectory()) return walk(full);
      return name.endsWith('.html') ? [full] : [];
    });
  }
  for (const path of walk(dist)) {
    const html = get(path);
    assert.doesNotMatch(html, /href=["']\/(?:kits|setups)(?:\/|["'])/, path);
  }
});

test('WGU, certification, home-lab and product content remains available', { skip: !existsSync(dist) }, () => {
  for (const path of [
    '/certs/wgu-software-engineering-degree/',
    '/certs/security-plus-v7-vs-v8/',
    '/labs/active-directory-home-lab/',
    '/guides/usb-c-dock-only-one-monitor/',
    '/gear/connectivity/anker-553-usb-c-hub/',
    '/tools/usb-c-compatibility/'
  ]) {
    assert.ok(existsSync(join(dist, path, 'index.html')), path + ' must be retained');
  }
});
