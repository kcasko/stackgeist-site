import { test, expect } from '@playwright/test';

// Read-only smoke tests on public pages. First-party event writes and any mirrored
// Cloudflare analytics requests are intercepted; merchant navigation is prevented.
for (const scenario of [
  { path: '/gear/connectivity/anker-553-usb-c-hub/', vendor: 'amazon.com', productId: 'B0874M3KW4' },
  { path: '/guides/usb-c-dock-only-one-monitor/', vendor: 'ugreen.pxf.io', productId: 'usb-c-dock' },
]) {
  test(`affiliate click captured on ${scenario.path} without persisting fake D1 events`, async ({ page }) => {
    const events: Array<{ eventType?: string; pagePath?: string; placement?: string; productId?: string }> = [];
    await page.route('**/api/events', async route => {
      if (route.request().method() === 'POST') {
        try { events.push(JSON.parse(route.request().postData() || '{}')); } catch {}
      }
      await route.fulfill({ status: 204, headers: { 'cache-control': 'no-store' }, body: '' });
    });
    await page.route(/\/cdn-cgi\/rum|cloudflareinsights\.com\/beacon|google-analytics\.com\/g\/collect/, async route => {
      await route.abort();
    });
    await page.addInitScript(() => {
      Object.defineProperty(window, '__cfBeacon', { configurable: true, value: { push: () => undefined } });
      Object.defineProperty(window, 'cfBeacon', { configurable: true, value: { push: () => undefined } });
    });
    await page.goto(`${scenario.path}?audit=0`, { waitUntil: 'domcontentloaded' });
    const anchors = page.locator('a[data-affiliate-link], a[href*="tag=deskrespawn-20"]');
    const items = await anchors.evaluateAll(els => els.map((el: HTMLAnchorElement) => el.href));
    const targetIndex = items.findIndex(url => url.includes(scenario.vendor));
    console.log('affiliate candidates:', JSON.stringify(items), 'selected:', targetIndex);
    expect(targetIndex).toBeGreaterThanOrEqual(0);
    const anchor = anchors.nth(targetIndex);
    await anchor.evaluate(el => el.addEventListener('click', event => event.preventDefault()));
    await anchor.click();
    await expect.poll(() => events.some(e => e.eventType === 'affiliate_click'), { timeout: 3000 }).toBe(true);
    const click = events.find(e => e.eventType === 'affiliate_click');
    console.log('intercepted affiliate event:', JSON.stringify(click));
    expect(click?.pagePath).toBe(scenario.path);
    expect(click?.productId).toBe(scenario.productId);
    expect(click?.placement).toBeTruthy();
  });
}
