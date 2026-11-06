// Affiliate offers for fix guides, lab pages, and certification pages.
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
    label: 'Tutorials Dojo AWS practice exams',
    note: 'Use after the free AWS Skill Builder material, once you can explain each exam domain.',
    url: 'https://portal.tutorialsdojo.com/product-category/aws/aws-practice-exams/ref/379698',
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

  // Fix guides: shown only where the diagnosis points to replacing hardware or recovering data.
  usbcCharger: {
    id: 'usb-c-charger',
    label: 'USB-C PD chargers',
    note: 'Pick one whose per-port output covers your laptop’s rated input, not just the total wattage on the box.',
    url: '',
  },
  usbcCable: {
    id: 'usb-c-cable',
    label: 'USB-C cables rated for your wattage',
    note: 'Get a cable marked for 100W or 240W if the charger and laptop need more than 60W.',
    url: '',
  },
  usbcDock: {
    id: 'usb-c-dock',
    label: 'USB-C and Thunderbolt docks',
    note: 'Only buy after confirming your laptop port supports the displays and charging you need.',
    url: '',
  },
  dataRecovery: {
    id: 'data-recovery-software',
    label: 'Data recovery software',
    note: 'For deleted files or unreadable partitions on a drive that still detects. Stop writing to it first. Software cannot fix a physically failing drive.',
    url: '',
  },
  backupSoftware: {
    id: 'backup-software',
    label: 'Backup and drive-cloning software',
    note: 'Useful for a full-drive image or clone. Windows Backup and File History are free if you only need your files.',
    url: '',
  },
  homelabRam: {
    id: 'homelab-ram',
    label: 'Laptop and desktop RAM upgrades',
    note: 'Check your exact model’s maximum RAM and whether the memory is soldered before buying. RAM is the first limit most VMware labs hit.',
    url: '',
  },
  nvmeSsd: {
    id: 'nvme-ssd',
    label: 'NVMe SSDs for VM storage',
    note: 'Plan for at least 250 GB free for a six-VM lab, plus room for snapshots. Confirm your slot’s size and PCIe generation first.',
    url: '',
  },
  miniPc: {
    id: 'homelab-mini-pc',
    label: 'Mini PCs for a dedicated lab host',
    note: 'Only worth it if your current PC can’t take more RAM. Look for 8 cores and support for 64 GB.',
    url: '',
  },
  wifiAdapter: {
    id: 'usb-wifi-adapter',
    label: 'USB Wi-Fi adapters',
    note: 'A fix when only one PC drops and its built-in adapter or driver is the problem. Check driver support for your Windows version first.',
    url: '',
  },
  wifiSystem: {
    id: 'wifi-router-mesh',
    label: 'Routers and mesh Wi-Fi',
    note: 'Worth it when every device drops, or the signal is weak in the rooms you use. Not needed if only one PC has the problem.',
    url: '',
  },
  externalBackupDrive: {
    id: 'external-backup-drive',
    label: 'External drives for backups',
    note: 'Pick one larger than the data you are backing up, and keep it unplugged between backups.',
    url: '',
  },
};
