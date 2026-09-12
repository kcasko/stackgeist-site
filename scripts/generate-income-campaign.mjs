import { mkdir, writeFile } from 'node:fs/promises';

const site = 'https://stackgeist.dev';
const campaign = 'income_kits';
const kits = [
  ['help-desk-homelab-starter-kit', 'Help desk homelab starter kit', 'helpdesk_homelab_starter', 'The first IT lab should teach tickets, backups, ports, and recovery. Not how to bankrupt yourself on rack gear.'],
  ['wgu-software-engineering-desk-kit', 'WGU software engineering desk kit', 'wgu_swe_desk_kit', 'Build the desk around coding, calls, exams, and backups first. Decor can wait in the lobby.'],
  ['usb-c-desk-survival-kit', 'USB-C desk survival kit', 'usb_c_survival_kit', 'One known-good cable, one correct hub, one charger with headroom, and adapters for the old stuff.'],
  ['budget-video-call-kit', 'Budget video call kit', 'budget_video_call_kit', 'Camera height, front light, close audio, clean background. That order fixes more calls than a new laptop.'],
  ['cheap-desk-upgrades-under-100', 'Cheap desk upgrades under $100', 'cheap_desk_under_100', 'Fix power, lighting, cable paths, reach, and small storage before replacing working hardware.'],
];

const destination = (slug, source, content) => `${site}/kits/${slug}?utm_source=${source}&utm_medium=organic&utm_campaign=${campaign}&utm_content=${content}`;
const csvEscape = (value) => `"${String(value).replaceAll('"', '""')}"`;

await mkdir('marketing/income-engine', { recursive: true });
const rows = [['Title', 'Board/channel', 'Description', 'Destination URL', 'UTM content', 'Status']];
for (const [slug, title, content, hook] of kits) {
  rows.push([title, 'Pinterest: Desk Setup Gear', hook, destination(slug, 'pinterest', content), content, 'draft']);
  rows.push([title, 'TikTok @stackgeist', hook, destination(slug, 'tiktok', content), content, 'draft']);
}
await writeFile('marketing/income-engine/social-batch.csv', rows.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n');

const scripts = kits.map(([slug, title, content, hook]) => [
  `## ${title}`,
  `Destination: ${destination(slug, 'tiktok', content)}`,
  `Hook: ${hook}`,
  'Shot list: show the problem, show the buying order, show the first useful pick, close on the StackGeist page.',
  'Caption: Practical setup gear, fit checks first. Full kit at StackGeist.dev. #desksetup #homelab #techtok #productivity',
].join('\n')).join('\n\n');
await writeFile('marketing/income-engine/tiktok-scripts.md', scripts + '\n');
console.log('wrote marketing/income-engine/social-batch.csv');
console.log('wrote marketing/income-engine/tiktok-scripts.md');
