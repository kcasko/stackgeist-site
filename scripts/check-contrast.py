"""Flag text whose colour contrast against its effective background is below WCAG AA,
in light and dark themes. Run against a served build:
  python scripts/check-contrast.py [--base http://localhost:4322] /path/ /path2/ ...
"""
import argparse
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('paths', nargs='*', default=['/'])
ap.add_argument('--base', default='http://localhost:4322')
a = ap.parse_args()

JS = r"""
() => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (x, y) => { const [h, l] = [lum(x), lum(y)].sort((m, n) => n - m); return (h + 0.05) / (l + 0.05); };
  const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0.5) return c; if (getComputedStyle(e).backgroundImage !== 'none' && e.tagName !== 'A') return null; } return parse(getComputedStyle(document.documentElement).backgroundColor); };
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode; const el = t.parentElement;
    if (!el || seen.has(el) || !t.textContent.trim()) continue; seen.add(el);
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[hidden],svg,.sr-only,[aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const fg = parse(cs.color); const bg = bgOf(el); if (!fg || !bg) continue;
    const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight) >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    const cr = ratio(fg, bg);
    if (cr < need) out.push(`${cr.toFixed(2)} < ${need}  <${el.tagName.toLowerCase()} class="${el.className}"> "${t.textContent.trim().slice(0, 50)}"`);
  }
  return out;
}
"""
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme in ('light', 'dark'):
        pg = b.new_page(viewport={'width': 1440, 'height': 900}, color_scheme=scheme)
        for path in a.paths:
            pg.goto(a.base + path, wait_until='networkidle')
            issues = pg.evaluate(JS)
            bad += len(issues)
            for i in issues[:12]:
                print(f'[{scheme}] {path}  {i}')
            if len(issues) > 12:
                print(f'[{scheme}] {path}  ... {len(issues) - 12} more')
        pg.close()
    b.close()
print(f'{bad} low-contrast text elements')
