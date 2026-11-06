"""Full-page desktop and mobile screenshots of StackGeist pages for design review.

Usage: python scripts/shoot.py OUTDIR /path/one/ /path/two/ [--base http://localhost:4321] [--theme light|dark]
"""
import argparse
import pathlib
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('out')
ap.add_argument('paths', nargs='+')
ap.add_argument('--base', default='http://localhost:4321')
ap.add_argument('--theme', default='light')
ap.add_argument('--viewport-only', action='store_true')
a = ap.parse_args()
out = pathlib.Path(a.out)
out.mkdir(parents=True, exist_ok=True)

SIZES = {'desktop': dict(width=1440, height=900), 'mobile': dict(width=390, height=844)}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, vp in SIZES.items():
        ctx = browser.new_context(viewport=vp, device_scale_factor=1, color_scheme=a.theme,
                                  is_mobile=name == 'mobile', has_touch=name == 'mobile')
        # Keep the consent panel out of review shots.
        ctx.add_init_script("try{localStorage.setItem('stackgeist:pinterest-consent','denied')}catch(e){}")
        page = ctx.new_page()
        errors = []
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        for path in a.paths:
            page.goto(a.base + path, wait_until='networkidle')
            page.evaluate("document.querySelector('[data-pinterest-deny]')?.click()")
            # Full-page captures misplace sticky elements; pin them in normal flow for the shot.
            page.add_style_tag(content='.rail-inner{position:static!important}')
            page.evaluate("document.activeElement && document.activeElement.blur()")
            page.wait_for_timeout(300)
            slug = path.strip('/').replace('/', '_') or 'home'
            f = out / f'{slug}-{name}-{a.theme}.png'
            page.screenshot(path=str(f), full_page=not a.viewport_only)
            overflow = page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
            print(f'{f.name}  horizontal-overflow={overflow}px')
        if errors:
            print('console errors:', *errors, sep='\n  ')
        ctx.close()
    browser.close()
