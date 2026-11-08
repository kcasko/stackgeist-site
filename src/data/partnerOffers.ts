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
    label: 'UGREEN USB-C PD chargers',
    note: 'Pick one whose per-port output covers your laptop’s rated input, not just the total wattage on the box.',
    url: 'https://ugreen.pxf.io/dyWWgy',
  },
  usbcCable: {
    id: 'usb-c-cable',
    label: 'UGREEN USB-C cables',
    note: 'Get a cable marked for 100W or 240W if the charger and laptop need more than 60W.',
    url: 'https://ugreen.pxf.io/L0LLBO',
  },
  usbcDock: {
    id: 'usb-c-dock',
    label: 'UGREEN USB-C and Thunderbolt docks',
    note: 'Only buy after confirming your laptop port supports the displays and charging you need.',
    url: 'https://ugreen.pxf.io/yZKKAy',
  },
  dataRecovery: {
    id: 'data-recovery-software',
    label: 'AOMEI FastRecovery for Windows',
    note: 'For deleted files or unreadable partitions on a drive that still detects. Stop writing to it first. Install on another drive and save recovered files elsewhere. Software cannot fix a physically failing drive.',
    url: 'https://www.anrdoezrs.net/click-101921811-17232584',
  },
  backupSoftware: {
    id: 'backup-software',
    label: 'AOMEI Backupper for Windows',
    note: 'Useful for a full-drive image or clone. Windows Backup and File History are free if you only need your files.',
    url: 'https://www.kqzyfj.com/click-101921811-17143105',
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
  monitorArm: {
    id: 'amazon-basics-dual-monitor-arm',
    label: 'Amazon Basics Gas Spring Dual Monitor Arm',
    note: 'Check weight, VESA pattern, and desk thickness against the exact model before buying.',
    url: 'https://www.amazon.com/dp/B0CQXPGNCH/?tag=deskrespawn-20',
  },
  benqScreenbar: {
    id: 'benq-screenbar-pro',
    label: 'BenQ ScreenBar Pro',
    note: 'Verify monitor thickness, curvature, and USB-C power match BenQ’s fit range.',
    url: 'https://www.amazon.com/dp/B0CZ9P1QW9?tag=deskrespawn-20',
  },
};
