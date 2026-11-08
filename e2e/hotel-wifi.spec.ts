import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { sessionStorage.setItem('stackgeist:affiliate:audit', '1'); } catch {}
  });
});

test('hotel Wi-Fi guide appears in Fixes, includes platform checks and no broken diagram', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/guides/');
  await expect(page.getByRole('link', { name: /Hotel Wi-Fi connected but no internet/ })).toBeVisible();

  const response = await page.goto('/guides/hotel-wifi-login-page-not-showing/');
  expect(response?.status()).toBe(200);

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const body = await page.locator('main').innerText();
  for (const phrase of [
    'Windows 11',
    'iPhone and iPad',
    'Android',
    'Mac:',
    'PS5',
    'http://example.com',
    'certificate warning',
    'VPN'
  ]) expect(body).toContain(phrase);

  const image = page.locator('img[src="/illustrations/hotel-wifi-captive-portal-flow.svg"]');
  await expect(image).toBeVisible();
  const health = await page.evaluate(async () => {
    const img = document.querySelector('img[src="/illustrations/hotel-wifi-captive-portal-flow.svg"]') as HTMLImageElement;
    await img.decode();
    return { broken: img.naturalWidth === 0, overflow: document.documentElement.scrollWidth > window.innerWidth + 3 };
  });
  expect(health).toEqual({ broken: false, overflow: false });
});

test('hotel login advice does not advise bypassing certificate warnings or disabling privacy permanently', async ({ page }) => {
  await page.goto('/guides/hotel-wifi-login-page-not-showing/');
  await expect(page.getByText(/don't bypass a certificate warning/i)).toBeVisible();
  await expect(page.getByText(/restart it after connecting/i)).toBeVisible();
  await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached();
});
