import assert from 'node:assert/strict';
import { test } from 'node:test';

test('privacy choices remain usable when the browser refuses storage', async () => {
  const { readPinterestConsent, writePinterestConsent } = await import('../src/scripts/pinterest-consent.ts');
  const storage = {
    getItem() { throw new DOMException('Storage denied', 'SecurityError'); },
    setItem() { throw new DOMException('Storage denied', 'SecurityError'); },
  };
  assert.equal(readPinterestConsent(storage), null);
  assert.equal(writePinterestConsent(storage, 'denied'), false);
});

test('search AD lab finds Active Directory without treating adapter as an AD alias', async () => {
  const { matchesSearch } = await import('../src/lib/search.ts');
  assert.equal(matchesSearch('Active Directory home lab: what I built and what broke', 'AD lab'), true);
  assert.equal(matchesSearch('USB adapter lab equipment', 'AD lab'), false);
  assert.equal(matchesSearch('WGU D287 Java Frameworks', 'd287'), true);
  assert.equal(matchesSearch('USB-C dock troubleshooting', '  DOCK  '), true);
  assert.equal(matchesSearch('anything', ''), true);
  assert.equal(matchesSearch('USB-C dock', '<script>alert(1)</script>'), false);
});

test('breadcrumbs omit nonexistent path folders and use real titles', async () => {
  const { buildBreadcrumbs } = await import('../src/lib/breadcrumbs.ts');
  const known = new Set(['/', '/gear/', '/gear/connectivity/caldigit-ts4/']);
  assert.deepEqual(buildBreadcrumbs('/gear/connectivity/caldigit-ts4/', 'CalDigit TS4 dock compatibility guide | StackGeist', known), [
    { name: 'StackGeist', path: '/' },
    { name: 'Gear', path: '/gear/' },
    { name: 'CalDigit TS4 dock compatibility guide', path: '/gear/connectivity/caldigit-ts4/' },
  ]);
  assert.deepEqual(buildBreadcrumbs('/', 'StackGeist', known), []);
  assert.deepEqual(buildBreadcrumbs('/guides/example/', 'Example fix', new Set(['/', '/guides/', '/guides/usb-c/']), [
    { name: 'Fixes', path: '/guides/' }, { name: 'USB-C', path: '/guides/usb-c/' },
  ]).slice(1, -1), [
    { name: 'Fixes', path: '/guides/' }, { name: 'USB-C', path: '/guides/usb-c/' },
  ]);
});

test('only configured commercial destinations are counted as paid links', async () => {
  const { isPaidAffiliateUrl } = await import('../src/lib/affiliate.ts');
  assert.equal(isPaidAffiliateUrl('https://obsproject.com/'), false);
  assert.equal(isPaidAffiliateUrl('https://www.ikea.com/us/en/p/desk/'), false);
  assert.equal(isPaidAffiliateUrl('https://www.amazon.com/dp/B0C2V1512F?tag=deskrespawn-20'), true);
  assert.equal(isPaidAffiliateUrl('https://www.amazon.com/dp/B0C2V1512F'), false);
  assert.equal(isPaidAffiliateUrl('https://ugreen.pxf.io/L0LLBO'), true);
  assert.equal(isPaidAffiliateUrl('https://ugreen.pxf.io.attacker.example/L0LLBO'), false);
});

test('non-Amazon offers retain a stable identifier without a schema migration', async () => {
  const { extractProductId } = await import('../src/scripts/affiliate-attribution.ts');
  assert.equal(extractProductId('https://ugreen.pxf.io/L0LLBO'), 'usb-c-cable');
  assert.equal(extractProductId('https://www.anrdoezrs.net/click-101921811-17232584'), 'data-recovery-software');
  assert.equal(extractProductId('https://obsproject.com/'), '');
});
