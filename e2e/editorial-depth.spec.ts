import { test, expect } from '@playwright/test';

const routes = [
  'logitech-brio-not-detected-windows-11',
  'usb-c-hub-ethernet-works-hdmi-doesnt',
  'microsd-card-not-detected',
  'mx-master-3s-scroll-wheel-not-working',
  'keychron-v6-max-bluetooth-not-connecting',
  'laptop-charger-wattage',
  'govee-strip-lights-not-connecting-wifi',
  'benq-screenbar-flickering',
  'office-chair-gas-cylinder-replacement',
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { sessionStorage.setItem('stackgeist:affiliate:audit', '1'); } catch {}
  });
});

for (const slug of routes) {
  test(slug + ': expanded guide loads at mobile width without clipped content', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto('/guides/' + slug + '/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main h2').first()).toBeVisible();
    expect(await page.locator('main').innerText()).not.toContain('Editorial deep dive');
    const health = await page.evaluate(async () => {
      const images = [...document.querySelectorAll('img[src^="/illustrations/"]')];
      for (const image of images) {
        image.loading = 'eager';
        image.scrollIntoView({ block: 'center' });
      }
      await Promise.race([
        Promise.all(images.map(i => i.decode().catch(() => {}))),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth + 3,
        broken: images.filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
      };
    });
    expect(health.overflow).toBe(false);
    expect(health.broken).toEqual([]);
  });
}
