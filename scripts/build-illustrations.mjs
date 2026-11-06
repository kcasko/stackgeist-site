// Generates StackGeist's original SVG illustrations into public/illustrations/.
// One shared "plate" frame keeps every image consistent: white ground, faint grid,
// corner registration marks, a figure label, ink line art with Geist-yellow highlights.
// Run: node scripts/build-illustrations.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'public/illustrations';
mkdirSync(OUT, { recursive: true });

const C = { bg: '#ffffff', panel: '#f6f6f3', grid: '#eeeeea', line: '#121212', lime: '#121212', purple: '#5f5f5a', text: '#121212', muted: '#5f5f5a', amber: '#9a5b00' };
const sans = "ui-sans-serif,system-ui,'Segoe UI',sans-serif";
const mono = 'ui-monospace,Consolas,monospace';

function plate(w, h, label, body, title) {
  const grid = [];
  for (let x = 40; x < w; x += 40) grid.push(`M${x} 0V${h}`);
  for (let y = 40; y < h; y += 40) grid.push(`M0 ${y}H${w}`);
  const m = 18, k = 14;
  const marks = [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]]
    .map(([x, y, dx, dy]) => `M${x} ${y + dy * k}V${y}H${x + dx * k}`).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>`
    + `<rect width="${w}" height="${h}" fill="${C.bg}"/>`
    + `<path d="${grid.join('')}" stroke="${C.grid}" stroke-width="1"/>`
    + `<path d="${marks}" fill="none" stroke="${C.line}" stroke-width="2"/>`
    + `<text x="${m + 22}" y="${h - m - 4}" fill="${C.purple}" font-family="${mono}" font-size="13" letter-spacing="1.5">${label}</text>`
    + body + `</svg>`;
}
const s = (d, color = C.lime, wd = 3) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${wd}" stroke-linecap="round" stroke-linejoin="round"/>`;
const box = (x, y, w, h, color = C.line, fill = C.panel, r = 10, wd = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${color}" stroke-width="${wd}"/>`;
const t = (x, y, str, size = 16, color = C.text, weight = 600, family = sans, anchor = 'start') => `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${str}</text>`;
const save = (name, svg) => writeFileSync(join(OUT, name), svg);

// ---------- Glyphs (reusable line art) ----------
const laptop = (x, y, sc = 1, screen = '') => `<g transform="translate(${x} ${y}) scale(${sc})">${box(0, 0, 300, 190, C.text, C.panel, 12, 3)}${box(14, 14, 272, 162, C.line, C.bg, 6, 1.5)}${screen}<path d="M-30 204H330L310 228H-10Z" fill="${C.text}" opacity=".9"/></g>`;
const drive = (x, y, sc = 1) => `<g transform="translate(${x} ${y}) scale(${sc})">${box(0, 0, 120, 170, C.lime, C.panel, 16, 3)}<circle cx="60" cy="70" r="34" fill="none" stroke="${C.line}" stroke-width="2"/><circle cx="60" cy="70" r="6" fill="${C.lime}"/>${s('M60 70L86 52', C.purple, 3)}<rect x="20" y="132" width="80" height="10" rx="5" fill="${C.line}"/><circle cx="96" cy="152" r="4" fill="${C.lime}"/></g>`;
const usbc = (x, y, sc = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})">${box(0, -14, 60, 28, C.text, C.panel, 14, 3)}<rect x="12" y="-5" width="36" height="10" rx="5" fill="${C.text}"/></g>`;
const magnifier = (x, y, sc = 1) => `<g transform="translate(${x} ${y}) scale(${sc})"><circle cx="0" cy="0" r="40" fill="rgba(255,207,46,.55)" stroke="${C.lime}" stroke-width="5"/>${s('M29 29L66 66', C.lime, 9)}</g>`;
const check = (x, y, sc = 1, color = C.lime) => `<g transform="translate(${x} ${y}) scale(${sc})">${s('M0 0l10 10l20-20', color, 4)}</g>`;
const server = (x, y, label, ip, color = C.line) => `${box(x, y, 150, 86, color, C.panel, 8, color === C.line ? 2 : 2.5)}${t(x + 16, y + 30, label, 17)}${t(x + 16, y + 52, ip, 13, C.lime, 600, mono)}<circle cx="${x + 132}" cy="${y + 20}" r="4" fill="${C.lime}"/>`;

// ---------- Homepage hero ----------
{
  const screen = `${t(30, 44, '$ diagnose --before-replace', 15, C.lime, 600, mono)}`
    + [['host port supports video', 72], ['cable rated for 100W', 100], ['dock firmware current', 128]].map(([str, y]) => `${check(32, y - 6, 0.7)}${t(62, y, str, 14, C.text, 500, mono)}`).join('')
    + `${t(30, 158, 'replace hardware? not yet', 14, C.amber, 600, mono)}`;
  const body = laptop(440, 210, 1.35, screen)
    + drive(150, 360, 1.05)
    + s('M276 470C330 470 340 560 420 560S500 520 520 520', C.text, 6)
    + usbc(250, 470, 1, 0) + usbc(505, 520, 1, 0)
    + magnifier(330, 520, 1.1)
    + `<g>${box(120, 120, 220, 120, C.purple, C.panel, 10, 2)}${t(140, 156, 'SYMPTOM', 13, C.purple, 600, mono)}${t(140, 186, 'Second monitor', 20)}${t(140, 212, 'not detected', 20)}</g>`
    + s('M340 180C400 180 400 260 430 290', C.purple, 2.5)
    + `<g>${box(900, 600, 190, 92, C.lime, 'rgba(255,207,46,.55)', 10, 2)}${t(918, 634, 'RESULT', 13, C.lime, 600, mono)}${t(918, 664, 'Fixed. Nothing', 18)}${t(918, 686, 'bought.', 18)}</g>`;
  save('hero-fix-first.svg', plate(1200, 760, 'STACKGEIST / FIG. 00 — FIX BEFORE YOU REPLACE', body, 'Illustration of a laptop running a diagnostic checklist, connected by USB-C cable to an external drive, with a magnifying glass over the cable'));
}

// ---------- Category artwork (800x450) ----------
const cat = (file, label, title, body) => save(file, plate(800, 450, label, body, title));
cat('category-fixes.svg', 'FIG. 01 — FIXES', 'Illustration of a USB-C cable, a wrench, and a magnifying glass for troubleshooting guides',
  usbc(150, 210, 1.6) + s('M246 210H360C420 210 430 150 480 150H560', C.text, 6) + usbc(560, 150, 1.6)
  + `<g transform="translate(470 300) rotate(-35)">${s('M0 0H150', C.purple, 14)}<circle cx="0" cy="0" r="26" fill="none" stroke="${C.purple}" stroke-width="10"/><rect x="-12" y="-30" width="24" height="22" fill="${C.bg}"/></g>`
  + magnifier(300, 270, 1.2));
cat('category-labs.svg', 'FIG. 02 — HOME LABS', 'Illustration of three virtual machines on a network, connected to a domain controller',
  server(325, 70, 'DC01', '.10', C.lime) + s('M400 156V200', C.line, 3) + s('M140 200H660', C.purple, 4)
  + [0, 1, 2].map((i) => s(`M${215 + i * 185} 200V236`, C.line, 3) + server(140 + i * 185, 236, ['FILE01', 'WIN11-01', 'LINUX01'][i], ['.20', '.30', '.40'][i])).join('')
  + t(560, 190, '10.20.30.0/24', 14, C.purple, 600, mono));
cat('category-certs.svg', 'FIG. 03 — CERTIFICATIONS', 'Illustration of a certificate with a seal next to a study checklist',
  box(150, 70, 300, 300, C.text, C.panel, 8, 3) + t(180, 120, 'CERTIFICATE', 16, C.purple, 600, mono)
  + s('M180 160H420M180 190H390M180 220H410', C.line, 4) + `<circle cx="380" cy="300" r="40" fill="rgba(255,207,46,.55)" stroke="${C.lime}" stroke-width="4"/>${s('M366 300l10 10l18-18', C.lime, 4)}${s('M362 336l-10 36l18-10l12 14l6-34', C.lime, 3)}`
  + box(500, 110, 170, 230, C.line, C.panel, 8, 2) + [0, 1, 2, 3].map((i) => `<rect x="520" y="${140 + i * 48}" width="22" height="22" rx="4" fill="none" stroke="${C.line}" stroke-width="2"/>${i < 3 ? check(524, 152 + i * 48, 0.55) : ''}${s(`M556 ${151 + i * 48}H646`, C.line, 4)}`).join(''));
cat('category-gear.svg', 'FIG. 04 — GEAR', 'Illustration of a USB-C dock with ports beside a pair of headphones',
  box(160, 180, 330, 110, C.text, C.panel, 14, 3) + [0, 1, 2, 3, 4].map((i) => `<rect x="${190 + i * 56}" y="220" width="${i < 2 ? 40 : 28}" height="${i < 2 ? 22 : 14}" rx="4" fill="none" stroke="${i === 0 ? C.lime : C.line}" stroke-width="2.5"/>`).join('')
  + t(190, 270, 'DOCK', 13, C.purple, 600, mono)
  + s('M540 250C540 150 680 150 680 250', C.text, 8) + box(520, 240, 44, 80, C.lime, C.panel, 14, 3) + box(658, 240, 44, 80, C.lime, C.panel, 14, 3));

// ---------- Guide topic thumbnails (640x360) ----------
const thumb = (file, label, title, body) => save(file, plate(640, 360, label, body, title));
thumb('topic-usb-c-displays.svg', 'TOPIC — USB-C AND DISPLAYS', 'Illustration of a laptop connected through a USB-C dock to two monitors',
  box(70, 150, 120, 74, C.text) + s('M190 187H250', C.text, 4) + box(250, 160, 110, 54, C.lime, C.panel, 10, 2.5) + t(268, 193, 'DOCK', 13, C.purple, 600, mono)
  + s('M360 177C400 177 400 110 430 110M360 197C400 197 400 250 430 250', C.purple, 3) + box(430, 70, 140, 84, C.text) + box(430, 210, 140, 84, C.line, C.panel, 10, 2) + t(500, 260, '?', 30, C.amber, 700, sans, 'middle'));
thumb('topic-charging.svg', 'TOPIC — CHARGING AND POWER', 'Illustration of a USB-C charger delivering power through a cable to a laptop',
  box(80, 120, 120, 140, C.text) + `<path d="M150 150l-24 46h20l-12 40l34-54h-20l12-32z" fill="${C.lime}"/>` + s('M200 190H300C340 190 340 150 380 150H420', C.text, 5)
  + t(250, 175, '20V', 16, C.lime, 700, mono) + laptop(420, 110, 0.55));
thumb('topic-storage.svg', 'TOPIC — STORAGE AND RECOVERY', 'Illustration of an external drive with a partition bar showing recovered and damaged regions',
  drive(90, 90, 1) + box(260, 130, 300, 46, C.line, C.panel, 6, 2) + `<rect x="264" y="134" width="170" height="38" rx="4" fill="rgba(255,207,46,.55)"/><rect x="438" y="134" width="118" height="38" rx="4" fill="rgba(242,184,114,.18)"/>`
  + t(270, 160, 'NTFS', 14, C.lime, 600, mono) + t(446, 160, 'RAW', 14, C.amber, 600, mono) + check(270, 226, 0.9) + t(312, 236, 'recover first', 16, C.text, 600, mono));
thumb('topic-wireless.svg', 'TOPIC — WI-FI AND BLUETOOTH', 'Illustration of Wi-Fi signal arcs and a Bluetooth symbol beside a pair of headphones',
  s('M120 230a110 110 0 0 1 160 0M150 260a66 66 0 0 1 100 0', C.lime, 6) + `<circle cx="200" cy="290" r="10" fill="${C.lime}"/>`
  + s('M330 130l70 60l-36 30V100l36 30l-70 60', C.purple, 6) + s('M440 240C440 150 560 150 560 240', C.text, 6) + box(424, 232, 34, 62, C.lime, C.panel, 12, 3) + box(542, 232, 34, 62, C.lime, C.panel, 12, 3));
thumb('topic-home-office.svg', 'TOPIC — HOME OFFICE HARDWARE', 'Illustration of a monitor on an arm, a desk lamp, and a chair outline',
  box(140, 90, 180, 110, C.text) + s('M230 200V250M200 250H260', C.line, 5) + s('M400 260V140L460 110', C.text, 5) + `<path d="M440 100l60 30l-24 18z" fill="${C.lime}"/>` + s('M470 150l-20 40', C.lime, 2) + s('M100 280H560', C.line, 4));

thumb('topic-help-desk.svg', 'TOPIC — HELP DESK PRACTICE', 'Illustration of a ticket queue with open and resolved tickets',
  [['#1042', 'Printer offline', C.lime, 'RESOLVED'], ['#1043', 'Password reset', C.lime, 'RESOLVED'], ['#1044', 'VPN drops at login', C.amber, 'OPEN']]
    .map(([id, title, col, st], i) => `${box(110, 70 + i * 70, 420, 54, i === 2 ? C.amber : C.line, C.panel, 8, 2)}${t(130, 103 + i * 70, id, 14, C.purple, 600, mono)}${t(200, 103 + i * 70, title, 17)}${t(510, 103 + i * 70, st, 12, col, 700, mono, 'end')}`).join(''));
thumb('topic-network.svg', 'TOPIC — NETWORKING', 'Illustration of a network switch with cables running to two computers',
  box(150, 90, 340, 70, C.text) + [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${172 + i * 50}" y="112" width="34" height="24" rx="3" fill="none" stroke="${i < 2 ? C.lime : C.line}" stroke-width="2.5"/>`).join('')
  + s('M189 160V210H140V240M239 160V200H400V240', C.lime, 3) + box(90, 240, 100, 64, C.line) + box(350, 240, 100, 64, C.line) + t(430, 150, '10.20.30.0/24', 13, C.purple, 600, mono, 'end'));
thumb('topic-virtualization.svg', 'TOPIC — VIRTUALIZATION', 'Illustration of one laptop hosting several virtual machines',
  box(120, 60, 400, 230, C.text, C.panel, 12, 3) + t(140, 92, 'ONE HOST · 64 GB', 13, C.purple, 600, mono)
  + [0, 1, 2, 3, 4, 5].map((i) => `${box(140 + (i % 3) * 124, 110 + Math.floor(i / 3) * 80, 108, 64, i === 0 ? C.lime : C.line, C.bg, 6, 2)}${t(154 + (i % 3) * 124, 148 + Math.floor(i / 3) * 80, ['DC01', 'FILE01', 'WIN11', 'LINUX01', 'ARCH01', 'PARROT'][i], 14, C.text, 600, mono)}`).join(''));

// ---------- Technical diagrams ----------
// USB-C Power Delivery negotiation (used on charging guides)
save('diagram-usb-c-power-delivery.svg', plate(960, 420, 'FIG. — USB POWER DELIVERY, SIMPLIFIED',
  box(40, 90, 220, 220, C.text) + t(60, 125, 'Charger', 20) + t(60, 150, 'offers these profiles', 13, C.muted, 500)
  + [['5V', '3A'], ['9V', '3A'], ['15V', '3A'], ['20V', '3.25A']].map(([v, a], i) => `${box(60, 166 + i * 34, 180, 26, i === 3 ? C.lime : C.line, C.bg, 5, i === 3 ? 2.5 : 1.5)}${t(74, 184 + i * 34, v, 14, i === 3 ? C.lime : C.text, 700, mono)}${t(150, 184 + i * 34, a, 14, C.muted, 600, mono)}`).join('')
  + s('M260 200H380', C.text, 6) + box(380, 160, 200, 80, C.purple, C.panel, 10, 2.5) + t(400, 192, 'Cable', 20) + t(400, 220, 'rated 3A or 5A', 13, C.muted, 500)
  + s('M580 200H700', C.text, 6) + box(700, 90, 220, 220, C.text) + t(720, 125, 'Laptop', 20) + t(720, 150, 'requests one profile', 13, C.muted, 500)
  + box(720, 180, 180, 40, C.lime, 'rgba(255,207,46,.55)', 6, 2.5) + t(736, 206, '20V × 3.25A = 65W', 14, C.lime, 700, mono)
  + t(720, 254, 'No 20V offered?', 14, C.amber, 600) + t(720, 276, 'May charge slowly or not at all.', 13, C.muted, 500)
  + t(400, 290, 'A 3A cable caps 20V at 60W.', 14, C.amber, 600) + t(400, 312, 'Above 60W needs a 5A (100W) cable.', 13, C.muted, 500),
  'Diagram: a USB-C charger offers 5, 9, 15, and 20 volt profiles; the laptop requests 20 volts at 3.25 amps for 65 watts; a 3 amp cable caps 20 volts at 60 watts'));

// Recover then repair (used on storage guides)
save('diagram-recover-then-repair.svg', plate(960, 360, 'FIG. — RECOVER FIRST, REPAIR LAST',
  [['01', 'Stop writing', 'Cancel format and', 'initialize prompts', C.amber], ['02', 'Diagnose', 'Compare disk and', 'partition sizes', C.line], ['03', 'Recover', 'Copy files to a', 'different drive', C.lime], ['04', 'Repair', 'Fix or recreate the', 'partition table', C.line]]
    .map(([n, h, a, b, col], i) => `${box(40 + i * 225, 90, 195, 170, col, col === C.lime ? 'rgba(255,207,46,.55)' : C.panel, 10, col === C.line ? 2 : 2.5)}${t(60 + i * 225, 124, n, 13, C.purple, 600, mono)}${t(60 + i * 225, 156, h, 20)}${t(60 + i * 225, 188, a, 14, C.muted, 500)}${t(60 + i * 225, 208, b, 14, C.muted, 500)}${i < 3 ? s(`M${235 + i * 225} 175H${265 + i * 225}`, C.purple, 3) : ''}`).join('')
  + t(40, 304, 'Every write before step 03 can overwrite what recovery tools need.', 15, C.amber, 600),
  'Diagram: four steps in order: stop writing, diagnose, recover files to a different drive, then repair the partition table'));

// Active Directory DNS for domain join (used on AD lab)
save('diagram-ad-dns-domain-join.svg', plate(960, 400, 'FIG. — WHY A CLIENT NEEDS DOMAIN DNS',
  box(40, 140, 200, 110, C.text) + t(60, 176, 'WIN11-01', 20) + t(60, 200, 'joining the domain', 13, C.muted, 500) + t(60, 226, 'ad.bytegeist.lab', 13, C.lime, 600, mono)
  + s('M240 170C330 170 340 100 420 100', C.amber, 3) + box(420, 60, 240, 80, C.amber, C.panel, 10, 2) + t(440, 92, 'VMware NAT DNS', 18) + t(440, 116, "doesn't know the domain", 13, C.amber, 500)
  + s('M240 220C330 220 340 290 420 290', C.lime, 3.5) + box(420, 250, 240, 80, C.lime, 'rgba(255,207,46,.55)', 10, 2.5) + t(440, 282, 'DC01 DNS  .10', 18) + t(440, 306, 'returns the DC records', 13, C.lime, 500)
  + s('M660 290H740', C.lime, 3.5) + box(740, 250, 180, 80, C.text) + t(760, 282, 'Join succeeds', 18) + t(760, 306, 'LDAP port 389 open', 13, C.muted, 500)
  + t(440, 180, 'Set-DnsClientServerAddress … 10.20.30.10', 13, C.purple, 600, mono),
  'Diagram: a Windows 11 client using VMware NAT DNS cannot find the domain; pointed at the domain controller DNS at 10.20.30.10 it finds the domain and the join succeeds'));

// AWS app architecture (used on AWS lab)
save('diagram-aws-cognito-crud.svg', plate(960, 380, 'FIG. — PRIVATE CRUD ON AWS',
  box(40, 140, 150, 90, C.text) + t(60, 176, 'Browser', 18) + t(60, 200, 'signed-in user', 13, C.muted, 500)
  + s('M190 160C240 160 240 100 290 100', C.purple, 3) + box(290, 60, 170, 80, C.purple, C.panel, 10, 2.5) + t(310, 94, 'Cognito', 18) + t(310, 118, 'issues a JWT', 13, C.muted, 500)
  + s('M190 205H290', C.lime, 3.5) + box(290, 170, 170, 80, C.lime, 'rgba(255,207,46,.55)', 10, 2.5) + t(310, 204, 'API Gateway', 18) + t(310, 228, 'JWT authorizer', 13, C.lime, 500)
  + s('M460 210H540', C.lime, 3.5) + box(540, 170, 170, 80, C.text) + t(560, 204, 'Lambda', 18) + t(560, 228, 'checks the owner', 13, C.muted, 500)
  + s('M710 210H790', C.lime, 3.5) + box(790, 170, 140, 80, C.text) + t(810, 204, 'DynamoDB', 18) + t(810, 228, 'per-user items', 13, C.muted, 500)
  + t(290, 300, 'No valid token: request rejected before Lambda runs.', 15, C.amber, 600),
  'Diagram: a signed-in browser gets a JWT from Cognito, calls API Gateway with a JWT authorizer, which invokes Lambda that checks record ownership before reading DynamoDB'));

// Wi-Fi isolation (used on Wi-Fi guide)
save('diagram-wifi-router-or-pc.svg', plate(960, 380, 'FIG. — ROUTER OR PC?',
  box(380, 50, 200, 80, C.text) + t(400, 84, 'Wi-Fi drops', 20) + t(400, 108, 'Check other devices', 13, C.muted, 500)
  + s('M430 130C430 170 250 160 250 200', C.purple, 3) + s('M530 130C530 170 710 160 710 200', C.purple, 3)
  + box(130, 200, 240, 110, C.amber, C.panel, 10, 2) + t(150, 234, 'Everything drops', 18) + t(150, 260, 'Router, modem,', 14, C.muted, 500) + t(150, 280, 'or provider', 14, C.muted, 500)
  + box(590, 200, 240, 110, C.lime, 'rgba(255,207,46,.55)', 10, 2.5) + t(610, 234, 'Only this PC drops', 18) + t(610, 260, 'Test on a phone hotspot,', 14, C.muted, 500) + t(610, 280, 'then fix the PC side', 14, C.muted, 500),
  'Diagram: when Wi-Fi drops, check other devices; if everything drops the router, modem, or provider is likely; if only one PC drops, test it on a phone hotspot and fix the PC side'));

console.log('illustrations written to', OUT);
