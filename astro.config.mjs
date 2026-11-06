import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://stackgeist.dev',
  // Keep page scripts in external files. Inlining would copy the affiliate attribution
  // script (and its tag string) into the HTML of every page, including research pages.
  vite: { build: { assetsInlineLimit: 0 } },
});
