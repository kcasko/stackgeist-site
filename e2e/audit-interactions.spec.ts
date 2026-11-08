import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { sessionStorage.setItem('stackgeist:affiliate:audit', '1'); } catch {}
  });
});

test('desktop search filters pages for a real hardware query', async ({ page }) => {
  await page.goto('/search/?audit=1');
  const input = page.locator('#q');
  await input.fill('usb-c dock');
  await expect(page.locator('.search-status')).toContainText('match');
  const visible = page.locator('[data-results] li:visible');
  expect(await visible.count()).toBeGreaterThan(0);
  for (const item of await visible.all()) {
    await expect(item).toContainText(/dock|USB-C/i);
  }
  await input.fill('xxxxxxxxnotarealproductxxxxxxxx');
  await expect(page.locator('[data-empty]')).toBeVisible();
});

test('mobile section navigation and search entry are usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?audit=1');
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Search' })).toBeVisible();
  await nav.getByRole('link', { name: 'Search' }).click();
  await expect(page).toHaveURL(/\/search\/$/);
  await expect(page.locator('#q')).toBeFocused();
});

test('privacy panel allows decline without loading Pinterest tracker', async ({ page }) => {
  await page.goto('/?audit=1');
  const panel = page.locator('[data-pinterest-consent]');
  await expect(panel).toBeVisible();
  await page.locator('[data-pinterest-deny]').click();
  await expect(panel).toBeHidden();
  expect(await page.locator('script[data-pinterest-tag]').count()).toBe(0);
});

test('USB-C checker does not claim guaranteed displays on Thunderbolt 4', async ({ page }) => {
  await page.goto('/tools/usb-c-compatibility/?audit=1');
  await page.locator('input[name="usbType"][value="tb4"]').check();
  await page.locator('#displayCount').selectOption('2');
  await page.getByRole('button', { name: 'Check compatibility' }).click();
  await expect(page.locator('#usb-compat-summary')).toContainText('Compatibility is not confirmed');
  await expect(page.locator('#usb-compat-missing')).toContainText('maximum external-display count');
  await expect(page.locator('#usb-compat-summary')).not.toContainText('can likely run natively');
});

test('product affiliate link is disclosed and does not use deceptive destination', async ({ page }) => {
  await page.goto('/gear/connectivity/anker-553-usb-c-hub/?audit=1');
  const link = page.locator('a[data-affiliate-link]').first();
  await expect(link).toBeVisible();
  const target = await link.getAttribute('href');
  expect(target).toMatch(/^https:\/\//);
  expect(await link.getAttribute('rel')).toContain('sponsored');
  expect(await link.getAttribute('rel')).toContain('noopener');
});

test('browser audit mode does not emit production analytics events', async ({ page }) => {
  const outgoing = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/events') outgoing.push(request.method());
  });
  await page.goto('/?audit=1', { waitUntil: 'networkidle' });
  await page.goto('/guides/usb-c-dock-only-one-monitor/?audit=1', { waitUntil: 'networkidle' });
  expect(outgoing).toEqual([]);
});
