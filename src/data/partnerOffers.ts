// Affiliate offers for lab and certification pages.
// An offer stays hidden until its url holds an approved tracking link, so pages
// never show a recommendation without a working program behind it.
// Only add what you would recommend without the commission.

export type PartnerOffer = {
  id: string;
  label: string;
  note: string;
  url: string;
};

export const PARTNER_OFFERS: Record<string, PartnerOffer> = {
  awsPractice: {
    id: 'aws-practice-exams',
    label: 'AWS practice exams',
    note: 'Use after the free AWS Skill Builder material, once you can explain each exam domain.',
    url: '',
  },
  comptiaPractice: {
    id: 'comptia-practice-exams',
    label: 'CompTIA practice exams',
    note: 'Confirm the provider matches your exact exam version before buying.',
    url: '',
  },
  linuxTraining: {
    id: 'linux-training',
    label: 'Linux training',
    note: 'For the Linux skills behind service and permissions tickets.',
    url: '',
  },
  labHosting: {
    id: 'lab-hosting',
    label: 'VPS for lab projects',
    note: 'Use when a project has to be reachable from the internet. Local labs do not need it.',
    url: '',
  },
};
