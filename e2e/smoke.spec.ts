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

test('active buying list displays honest CTA labels', async ({ page }) => {
  const response = await page.goto('/kits/budget-video-call-kit/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('.kit-quick-tiers')).toBeVisible();
  await expect(page.locator('.kit-action-btn').first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Check Price on Amazon');
});
