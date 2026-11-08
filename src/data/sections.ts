import { CATALOG, type Entry, type EntryType, type Section } from './catalog';

// The four departments. `href` is the department front; URLs of individual
// pages are not tied to it (Fixes pages live under /guides/, Learning under /certs/).
export const SECTIONS: Record<Section, { label: string; href: string; strap: string; blurb: string }> = {
  fixes: {
    label: 'Fixes',
    href: '/guides/',
    strap: 'Windows, hardware, storage, USB-C, and networking problems',
    blurb: 'Diagnosis in the order a repair bench would do it: confirm the symptom, run the free checks, then decide whether anything needs replacing.',
  },
  labs: {
    label: 'Labs',
    href: '/labs/',
    strap: 'Home labs, Active Directory, VMware, and cloud projects',
    blurb: 'Systems built at home to practise support and sysadmin work, written up with the real output and the parts that broke.',
  },
  learning: {
    label: 'Learning',
    href: '/learning/',
    strap: 'WGU courses, certifications, and the path into IT',
    blurb: 'Course reviews from a WGU Software Engineering student, and certification comparisons checked against the official exam pages.',
  },
  gear: {
    label: 'Gear',
    href: '/gear/',
    strap: 'Hardware notes, comparisons, and buying advice',
    blurb: 'Decision pages for specific models: who each one fits, what to check before buying, and when to skip it.',
  },
};

export const SECTION_ORDER: Section[] = ['fixes', 'labs', 'learning', 'gear'];

export const TYPE_LABEL: Record<EntryType, string> = {
  troubleshooting: 'Fix',
  topic: 'Topic guide',
  'buying-guide': 'Buying guide',
  lab: 'Lab write-up',
  'lab-hardware': 'Lab hardware',
  certification: 'Certification',
  'course-review': 'Course review',
  'study-log': 'Study log',
  product: 'Product notes',
};

export const TOPIC_LABEL: Record<string, string> = {
  'usb-c': 'USB-C, docks, and displays',
  power: 'Charging and power',
  storage: 'Storage, recovery, and boot',
  wireless: 'Wi-Fi, Bluetooth, and peripherals',
  desk: 'Desk hardware',
};

const norm = (href: string) => (href.endsWith('/') ? href : `${href}/`);
const byHref = new Map(CATALOG.map((e) => [e.href, e]));

export function entry(href: string): Entry {
  const e = byHref.get(norm(href));
  if (!e) throw new Error(`catalog: no entry for ${href}`);
  return e;
}

export const entries = (hrefs: string[]) => hrefs.map(entry);

export function inSection(section: Section, opts: { types?: EntryType[]; exclude?: EntryType[] } = {}) {
  return CATALOG.filter((e) => e.section === section
    && (!opts.types || opts.types.includes(e.type))
    && (!opts.exclude || !opts.exclude.includes(e.type)));
}

export function latest(n: number, filter: (e: Entry) => boolean = () => true) {
  return CATALOG.filter((e) => e.updated && filter(e))
    .sort((a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title))
    .slice(0, n);
}

/** Same-topic pages first, then the rest of the section, never the page itself. */
export function related(href: string, n = 4) {
  const self = byHref.get(norm(href));
  if (!self) return [];
  const pool = CATALOG.filter((e) => e.href !== self.href && e.type !== 'kit' && e.type !== 'setup');
  const sameTopic = pool.filter((e) => e.topic === self.topic && e.section === self.section);
  const sameSection = pool.filter((e) => e.section === self.section && e.topic !== self.topic);
  return [...sameTopic, ...sameSection].slice(0, n);
}

export function formatDate(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
