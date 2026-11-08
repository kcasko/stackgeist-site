import { test, expect } from '@playwright/test';

// Prevent automated browser checks from polluting production affiliate analytics.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { sessionStorage.setItem('stackgeist:affiliate:audit', '1'); } catch { /* storage unavailable */ }
  });
});

test('homepage loads and links to useful content', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1').first()).toBeVisible();
});

test('USB-C checker gives a cautious result for unknown hardware', async ({ page }) => {
  const response = await page.goto('/tools/usb-c-compatibility/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'USB-C dock and monitor compatibility checker', exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Check compatibility' }).click();
  await expect(page.locator('#usb-compat-result')).toBeVisible();
  await expect(page.locator('#usb-compat-summary')).toContainText('Compatibility is not confirmed');
});

test('gear product decision page remains available', async ({ page }) => {
  const response = await page.goto('/gear/connectivity/anker-553-usb-c-hub/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('a[data-affiliate-link]').first()).toHaveAttribute('rel', /sponsored/);
});
