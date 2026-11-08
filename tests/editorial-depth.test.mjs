import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const pages = [
  ['/gear/connectivity/anker-553-usb-c-hub/', 'decision-usbc-hub-vs-thunderbolt.svg', 'macOS does not support MST'],
  ['/gear/connectivity/caldigit-ts4/', 'decision-usbc-hub-vs-thunderbolt.svg', '98W'],
  ['/guides/sennheiser-momentum-4-wont-pair/', 'momentum4-pairing-diagnostic.svg', 'factory-default reset'],
  ['/certs/wgu-c949-data-structures-and-algorithms-review/', 'c949-algorithm-trace.svg', '86%'],
  ['/certs/wgu-d287-java-frameworks-review/', 'spring-mvc-request-layers.svg', 'Spring MVC'],
  ['/labs/active-directory-home-lab/', 'ad-troubleshooting-sequence.svg', 'SecureChannel'],
];

test('expanded articles render original diagrams with captions and technical content', { skip: !existsSync('dist') }, () => {
  for (const [url, diagram, claim] of pages) {
    const html = readFileSync('dist' + url + 'index.html', 'utf8');
    assert.ok(html.includes('/illustrations/' + diagram), 'missing diagram: ' + url);
    assert.ok(html.includes(claim), 'missing detailed section: ' + url);
    assert.match(html, /<figcaption>/);
    assert.ok(existsSync('dist/illustrations/' + diagram), 'missing asset: ' + diagram);
  }
});

test('WGU articles differentiate first-person reports from Reddit suggestions', { skip: !existsSync('dist') }, () => {
  for (const route of [
    '/certs/wgu-c949-data-structures-and-algorithms-review/',
    '/certs/wgu-d287-java-frameworks-review/',
    '/certs/wgu-d282-cloud-foundations-review/'
  ]) {
    const html = readFileSync('dist' + route + 'index.html', 'utf8');
    assert.ok(html.includes('reddit.com/r/'), 'source Reddit discussion missing: ' + route);
    assert.match(html, /student|experience/i);
  }
});
