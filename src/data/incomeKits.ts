const TAG = 'deskrespawn-20';
const search = (q: string) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${TAG}`;

export type KitItem = {
  label: string;
  role: string;
  href: string;
  kind: 'internal' | 'search';
  tier: 'must-have' | 'nice-next' | 'skip-until-needed';
  check: string;
};

export type IncomeKit = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  audience: string;
  promise: string;
  summary: string;
  buyingOrder: string[];
  items: KitItem[];
  related: { href: string; title: string; desc: string }[];
  socialAngles: { channel: 'pinterest' | 'tiktok' | 'reddit'; title: string; hook: string; utmContent: string }[];
  faqs: { question: string; answer: string }[];
  download?: { title: string; href: string; note: string };
};

import { EXTRA_KITS } from './extraIncomeKits';

const BASE_INCOME_KITS: IncomeKit[] = [
  {
    slug: 'help-desk-homelab-starter-kit',
    title: 'Help desk homelab starter kit',
    seoTitle: 'Help desk homelab starter kit: practical gear for entry-level IT practice | StackGeist',
    description: 'A practical help desk homelab starter kit for learning Windows support, Linux basics, networking, storage, backups, and remote troubleshooting without buying random gear.',
    audience: 'Entry-level IT, WGU, Net+, and cloud-support learners who need hands-on practice at home.',
    promise: 'Build a small lab that teaches support skills instead of collecting noisy hardware trophies.',
    summary: 'Start with a stable desk, one mini PC or spare machine, removable storage, a USB-C hub, a small switch, and backup power only when the lab stores anything important.',
    download: { title: 'Download the Help Desk Homelab Starter Checklist', href: '/downloads/help-desk-homelab-starter-checklist.pdf', note: 'Printable checklist for building the lab in the right order.' },
    buyingOrder: [
      'Use the computer you already own until it blocks the lab.',
      'Add storage and adapters that make recovery practice safe.',
      'Wire the network before buying more compute.',
      'Add a mini PC only when you need a dedicated always-on host.',
      'Add a UPS when storage, DNS, or self-hosted services matter.'
    ],
    items: [
      { label: 'WD Elements portable drive', role: 'Offline backups, recovery drills, and large file storage.', href: '/gear/budget-tech/wd-elements-portable-external-hard-drive', kind: 'internal', tier: 'must-have', check: 'Do not treat one external drive as a full backup plan.' },
      { label: 'SABRENT SATA to USB adapter', role: 'Read old laptop drives and practice recovery workflows.', href: '/gear/budget-tech/sabrent-sata-to-usb-adapter-cable', kind: 'internal', tier: 'must-have', check: 'Match SATA vs NVMe before buying an adapter.' },
      { label: 'TP-Link 8-port gigabit switch', role: 'Wire the lab instead of blaming Wi-Fi for every weird failure.', href: search('tp-link tl-sg108 gigabit switch'), kind: 'search', tier: 'must-have', check: 'A basic unmanaged switch is enough for most starter labs.' },
      { label: 'N100 or Ryzen mini PC', role: 'Dedicated host for Linux, Docker, Proxmox, Home Assistant, or test services.', href: search('n100 mini pc 16gb ram 512gb'), kind: 'search', tier: 'nice-next', check: 'Buy low idle wattage before peak benchmark numbers.' },
      { label: 'CyberPower CP1500PFCLCD UPS', role: 'Keeps network and storage alive long enough to shut down cleanly.', href: search('cyberpower cp1500pfclcd ups'), kind: 'search', tier: 'skip-until-needed', check: 'Skip until you run always-on services or store important data.' }
    ],
    related: [
      { href: '/setups/home-lab-dev-workstation', title: 'Home lab / dev workstation', desc: 'Full desk and lab setup with network, NAS, mini PC, dock, and power planning.' },
      { href: '/guides/wd-elements-not-showing-up', title: 'WD Elements not showing up', desc: 'Storage troubleshooting before formatting or replacing a drive.' },
      { href: '/guides/desk-layout-basics', title: 'Desk layout basics', desc: 'Place the lab gear without wrecking the daily desk.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Help desk homelab starter kit', hook: 'The first IT lab should teach tickets, backups, ports, and recovery. Not how to bankrupt yourself on rack gear.', utmContent: 'helpdesk_homelab_starter' },
      { channel: 'tiktok', title: 'Stop buying random homelab gear', hook: 'Start with storage, adapters, wired network, then a mini PC. Rack gear can wait.', utmContent: 'homelab_buying_order' },
      { channel: 'reddit', title: 'Entry-level IT lab order', hook: 'If the goal is help desk practice, a boring mini PC and a switch beat a loud enterprise server for most beginners.', utmContent: 'reddit_helpdesk_lab_order' }
    ],
    faqs: [
      { question: 'Do I need a rack server for a help desk homelab?', answer: 'No. For entry-level support practice, a spare laptop, mini PC, external drive, and basic wired network are enough to learn operating systems, backups, shares, remote access, and troubleshooting.' },
      { question: 'What should I buy first for an IT homelab?', answer: 'Buy the piece that removes the current blocker. Most beginners should start with storage, adapters, and a wired network before adding more compute.' }
    ]
  },
  {
    slug: 'wgu-software-engineering-desk-kit',
    title: 'WGU software engineering desk kit',
    seoTitle: 'WGU software engineering desk kit: practical gear for coding, studying, and exams | StackGeist',
    description: 'A practical desk kit for WGU software engineering students: monitor, webcam, keyboard, storage, calculator, lighting, and cable choices that help daily study.',
    audience: 'WGU software engineering students building a study desk that also works for coding projects.',
    promise: 'Spend on focus, comfort, visibility, and backups before decorative desk clutter.',
    summary: 'A student desk needs reliable video calls, a comfortable input setup, one decent monitor, backup storage, and lighting that does not turn every study block into eye strain.',
    buyingOrder: [
      'Fix chair height, keyboard reach, and screen height.',
      'Add a real monitor if the laptop screen is slowing work.',
      'Add lighting and webcam improvements for calls and proctored sessions.',
      'Add storage and adapters for backups and course projects.',
      'Only then add aesthetic upgrades.'
    ],
    items: [
      { label: 'Logitech C920x webcam', role: 'Reliable external camera for calls, interviews, and study sessions.', href: '/gear/budget-tech/logitech-c920x-hd-webcam', kind: 'internal', tier: 'must-have', check: 'Camera height and front light matter more than raw resolution.' },
      { label: 'Clamp-on LED desk lamp', role: 'Cheap lighting fix for notes, keyboard visibility, and video calls.', href: '/gear/budget-tech/clamp-on-led-desk-lamp', kind: 'internal', tier: 'must-have', check: 'Aim the light across the desk, not into your eyes.' },
      { label: 'Keychron V6 Max or smaller Keychron board', role: 'Mechanical keyboard path for long writing and coding sessions.', href: '/gear/input/keychron-v6-max', kind: 'internal', tier: 'nice-next', check: 'A full-size board is wide. Skip it if mouse reach gets worse.' },
      { label: 'Samsung EVO Select microSD', role: 'Cheap removable storage for devices, images, and quick transfers.', href: '/gear/budget-tech/samsung-evo-select-512gb-microsd-card', kind: 'internal', tier: 'nice-next', check: 'For primary backups, use a real external drive instead.' },
      { label: 'TI-84 Plus CE calculator', role: 'School and exam-friendly calculator when the course expects the ecosystem.', href: '/gear/budget-tech/texas-instruments-ti-84-plus-ce-graphing-calculator', kind: 'internal', tier: 'skip-until-needed', check: 'Only buy when your course or exam path actually requires it.' }
    ],
    related: [
      { href: '/guides/keyboard-mouse-fit', title: 'Keyboard and mouse fit', desc: 'Stop wrist and shoulder reach problems before buying another keyboard.' },
      { href: '/guides/better-video-calls', title: 'Better video calls', desc: 'Camera, light, mic, and background fixes before overspending.' },
      { href: '/setups/work-from-home-pro', title: 'Work-from-home pro', desc: 'A full study and remote-work desk route.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'WGU software engineering desk kit', hook: 'Build the desk around coding, calls, exams, and backups first. Decor can wait in the lobby.', utmContent: 'wgu_swe_desk_kit' },
      { channel: 'tiktok', title: 'Student desk upgrade order', hook: 'Screen height, keyboard reach, lighting, webcam, backup storage. That order beats buying random accessories.', utmContent: 'student_desk_order' },
      { channel: 'reddit', title: 'WGU desk gear order', hook: 'For a WGU study desk, the boring gear does the work: lighting, webcam, monitor height, backup storage, and comfortable input.', utmContent: 'reddit_wgu_desk_order' }
    ],
    faqs: [
      { question: 'What should a software engineering student buy first?', answer: 'Buy the piece that improves daily study friction. Usually that means monitor height, keyboard and mouse fit, lighting, webcam setup, or storage before any decorative desk gear.' },
      { question: 'Is a second monitor necessary for coding classes?', answer: 'Necessary, no. Useful, yes. A single larger monitor or one external 24 to 27 inch display usually helps more than forcing a cramped dual-monitor setup.' }
    ]
  },
  {
    slug: 'usb-c-desk-survival-kit',
    title: 'USB-C desk survival kit',
    seoTitle: 'USB-C desk survival kit: cables, hubs, chargers, and adapters that prevent desk chaos | StackGeist',
    description: 'A USB-C desk survival kit for laptops, docks, chargers, external displays, old USB-A accessories, and the cable problems that waste whole afternoons.',
    audience: 'Laptop users with too many dongles, mystery cables, chargers, and one port doing five jobs badly.',
    promise: 'Build a small USB-C kit that makes desk troubleshooting boring again.',
    summary: 'The useful kit is not a drawer full of dongles. It is one known-good cable, one hub that matches your laptop, one charger with enough headroom, and adapters for legacy gear.',
    buyingOrder: [
      'Identify which laptop port supports charging, display, data, Thunderbolt, or USB4.',
      'Buy one known-good USB-C cable and label it.',
      'Add a hub only after you know the display path you need.',
      'Add a charger around real device wattage, not the biggest number on the listing.',
      'Keep small USB-A and audio adapters for older gear.'
    ],
    items: [
      { label: 'INIU 240W USB-C cable', role: 'Known-good charging cable for laptops, tablets, and high-wattage devices.', href: '/gear/budget-tech/iniu-usb-c-to-usb-c-cable-240w-6-6ft', kind: 'internal', tier: 'must-have', check: 'Charging wattage does not prove high-speed data or video support.' },
      { label: 'USB-C to USB-A adapter two-pack', role: 'Keeps older mice, keyboards, drives, and receivers usable.', href: '/gear/budget-tech/usb-c-to-usb-a-adapter-2-pack', kind: 'internal', tier: 'must-have', check: 'Tiny adapters are easy to lose. Keep one in the bag and one at the desk.' },
      { label: 'Acodot 9-in-1 USB-C hub', role: 'Lower-cost port expansion for common desk accessories.', href: '/gear/budget-tech/acodot-9-in-1-usb-c-hub', kind: 'internal', tier: 'nice-next', check: 'Your laptop port still decides what the hub can do.' },
      { label: '500W multi-port GaN charging station', role: 'One desk charging base for laptop, tablet, phone, and accessories.', href: '/gear/budget-tech/500w-multi-port-gan-charging-station', kind: 'internal', tier: 'nice-next', check: 'Check per-port output when several devices are plugged in.' },
      { label: 'USB to 3.5mm audio adapter', role: 'Simple audio rescue when a headphone jack fails or disappears.', href: '/gear/budget-tech/usb-to-3-5mm-audio-adapter-cable', kind: 'internal', tier: 'skip-until-needed', check: 'Useful only when you still use wired headphones or speakers.' }
    ],
    related: [
      { href: '/guides/usb-c-dock-compatibility', title: 'USB-C dock compatibility', desc: 'Host ports, displays, power, bandwidth, and cable limits before buying.' },
      { href: '/guides/usb-c-cable-buying-guide', title: 'USB-C cable buying guide', desc: 'Charging, data speed, Thunderbolt, USB4, and unlabeled cable triage.' },
      { href: '/guides/usb-c-charging-display-problems', title: 'USB-C troubleshooting hub', desc: 'Fix charging and display weirdness before replacing working gear.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'USB-C desk survival kit', hook: 'One known-good cable, one correct hub, one charger with headroom, and adapters for the old stuff.', utmContent: 'usb_c_survival_kit' },
      { channel: 'tiktok', title: 'USB-C is not one thing', hook: 'Same connector, different charging, data, display, USB4, and Thunderbolt support. Label your known-good cable.', utmContent: 'usb_c_not_one_thing' },
      { channel: 'reddit', title: 'USB-C troubleshooting kit', hook: 'A known-good cable and port-capability check solve more USB-C issues than replacing the dock first.', utmContent: 'reddit_usb_c_kit' }
    ],
    faqs: [
      { question: 'Does a 240W USB-C cable support video?', answer: 'Not automatically. Wattage describes charging support, while video and high-speed data depend on separate capabilities. Check the cable and device specs before assuming one cable does every job.' },
      { question: 'Should I buy a dock or cable first?', answer: 'Buy or identify a known-good cable first. A bad or limited cable can make a working dock look broken.' }
    ]
  },
  {
    slug: 'budget-video-call-kit',
    title: 'Budget video call kit',
    seoTitle: 'Budget video call kit: webcam, light, audio, and desk fixes before a new laptop | StackGeist',
    description: 'A budget video call kit for remote work, interviews, school, and creator calls: webcam, light, mic, stand, and background fixes in the right order.',
    audience: 'Students, remote workers, and job seekers who need cleaner calls without buying a new laptop.',
    promise: 'Fix the call before blaming the computer.',
    summary: 'Most ugly video calls are bad angle, bad light, room noise, and background clutter. A cheap webcam and lamp work better when the setup around them is correct.',
    buyingOrder: [
      'Raise the camera to eye level.',
      'Put soft light in front of your face.',
      'Move the mic closer or use a headset.',
      'Clean the background and cable path.',
      'Upgrade the webcam only after the room stops fighting it.'
    ],
    items: [
      { label: 'Logitech C920x webcam', role: 'Budget external webcam that beats most built-in laptop cameras.', href: '/gear/budget-tech/logitech-c920x-hd-webcam', kind: 'internal', tier: 'must-have', check: 'Mount it near eye level. Low angle webcam horror is avoidable.' },
      { label: 'Clamp-on LED desk lamp', role: 'Front light for face visibility and less grainy video.', href: '/gear/budget-tech/clamp-on-led-desk-lamp', kind: 'internal', tier: 'must-have', check: 'Diffuse or bounce harsh light when possible.' },
      { label: 'Logitech Brio 500', role: 'Better framing and privacy shutter for frequent calls.', href: '/gear/video/logitech-brio-500', kind: 'internal', tier: 'nice-next', check: 'Only upgrade after lighting and height are fixed.' },
      { label: 'Elgato Wave:3', role: 'Cleaner voice for streaming, recording, and regular calls.', href: '/gear/audio/elgato-wave-3', kind: 'internal', tier: 'nice-next', check: 'Mic distance matters more than the spec sheet.' },
      { label: 'Adjustable desk phone stand', role: 'Cheap camera or second-screen angle fix for phones and small devices.', href: '/gear/budget-tech/adjustable-desk-phone-stand', kind: 'internal', tier: 'skip-until-needed', check: 'Only useful if your phone joins calls or records desk content.' }
    ],
    related: [
      { href: '/guides/better-video-calls', title: 'Better video calls', desc: 'Fix camera angle, front light, microphone distance, and background first.' },
      { href: '/setups/work-from-home-pro', title: 'Work-from-home pro', desc: 'Full desk path for calls, focus work, and ergonomics.' },
      { href: '/gear/budget-tech/compare/clamp-led-lamp-vs-screenbar', title: 'Clamp lamp vs ScreenBar', desc: 'Pick a light around desk space, glare, and aiming control.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Budget video call kit', hook: 'Camera height, front light, close audio, clean background. That order fixes more calls than a new laptop.', utmContent: 'budget_video_call_kit' },
      { channel: 'tiktok', title: 'Fix ugly laptop calls', hook: 'Raise the camera, light your face, move the mic closer, then consider a webcam.', utmContent: 'fix_ugly_laptop_calls' },
      { channel: 'reddit', title: 'Budget call setup order', hook: 'The camera is rarely the only problem. Angle, light, and audio usually matter more.', utmContent: 'reddit_call_setup_order' }
    ],
    faqs: [
      { question: 'Should I buy a webcam or a light first?', answer: 'If your face is dark or backlit, buy or reposition a light first. A better webcam still looks bad in bad light.' },
      { question: 'Can a cheap webcam look professional?', answer: 'Professional enough for school, interviews, and remote meetings, yes. Put it at eye level, light your face, and keep the microphone close.' }
    ]
  },
  {
    slug: 'cheap-desk-upgrades-under-100',
    title: 'Cheap desk upgrades under $100',
    seoTitle: 'Cheap desk upgrades under $100: practical fixes before replacing your whole setup | StackGeist',
    description: 'Cheap desk upgrades under $100 that fix lighting, cables, power, reach, storage, and daily friction before you replace expensive hardware.',
    audience: 'People who want a better desk without turning one annoying problem into a full room makeover.',
    promise: 'Fix the friction first. Keep the money for the upgrades that actually matter.',
    summary: 'Under $100 should buy relief: cleaner cables, safer power, better lighting, less reach, simple storage, and fewer small desk annoyances.',
    buyingOrder: [
      'Fix safety and power first.',
      'Fix lighting second.',
      'Fix cable paths and reach zones third.',
      'Add stands and storage only where clutter returns every day.',
      'Save the rest for chair, monitor, or desk upgrades later.'
    ],
    items: [
      { label: 'Flat plug surge protector', role: 'Cleaner wall power and fewer bulky adapters fighting for outlet space.', href: '/gear/budget-tech/flat-plug-surge-protector-power-strip-8-outlets-usb', kind: 'internal', tier: 'must-have', check: 'Do not daisy-chain power strips.' },
      { label: 'Clamp-on LED desk lamp', role: 'Better task light without eating desk surface.', href: '/gear/budget-tech/clamp-on-led-desk-lamp', kind: 'internal', tier: 'must-have', check: 'Check clamp clearance before buying.' },
      { label: 'Microfiber cleaning cloths', role: 'Screens, glasses, webcam lenses, and handhelds stop looking cursed.', href: '/gear/budget-tech/microfiber-cleaning-cloths-18-pack', kind: 'internal', tier: 'nice-next', check: 'Keep one cloth away from kitchen and shop grime.' },
      { label: 'Adjustable aluminum tablet stand', role: 'Turns a tablet or small second screen into a usable desk reference.', href: '/gear/budget-tech/adjustable-aluminum-tablet-stand', kind: 'internal', tier: 'nice-next', check: 'Confirm the hinge can hold your device angle.' },
      { label: 'Velcro cable ties and adhesive clips', role: 'Cheap cable cleanup that can be changed later.', href: search('velcro cable ties adhesive cable clips'), kind: 'search', tier: 'must-have', check: 'Use removable routing for cables you unplug often.' }
    ],
    related: [
      { href: '/guides/cheap-desk-upgrades', title: 'Cheap desk upgrades first', desc: 'The full order of operations before replacing working hardware.' },
      { href: '/guides/cable-management', title: 'Cable management', desc: 'Power, signal, and removable cable paths that stay fixable.' },
      { href: '/setups/budget-gaming-desk', title: 'Budget gaming desk', desc: 'A full low-cost setup that prioritizes useful upgrades.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Cheap desk upgrades under $100', hook: 'Fix power, lighting, cable paths, reach, and small storage before replacing working hardware.', utmContent: 'cheap_desk_under_100' },
      { channel: 'tiktok', title: 'Desk upgrades that are not dumb', hook: 'Surge strip, lamp, cable ties, stand, cleaning cloths. Boring upgrades win.', utmContent: 'boring_desk_upgrades_win' },
      { channel: 'reddit', title: 'Under $100 desk fixes', hook: 'If the desk feels bad, start with power safety, lighting, cable routing, and reach before buying new gear.', utmContent: 'reddit_under_100_desk' }
    ],
    faqs: [
      { question: 'What desk upgrade should I buy first?', answer: 'Start with the daily friction you notice most: unsafe power, bad lighting, cable mess, uncomfortable reach, or missing storage. Do not replace expensive hardware until the cheap fixes are done.' },
      { question: 'Are cheap desk upgrades worth it?', answer: 'Yes when they remove a real annoyance. They are not worth it when they only add decoration to a setup that still has bad power, lighting, or ergonomics.' }
    ]
  }
,
  {
    slug: 'network-plus-home-lab-kit',
    title: 'Network+ home lab kit',
    seoTitle: 'Network+ home lab kit: cheap gear for ports, cables, Wi-Fi, and troubleshooting | StackGeist',
    description: 'A Network+ home lab kit for practicing Ethernet, Wi-Fi, switches, adapters, cables, and practical support troubleshooting at home.',
    audience: 'Network+ learners who need hands-on networking practice without buying enterprise leftovers.',
    promise: 'Learn the network path with gear you can keep using after the exam.',
    summary: 'Start with a switch, Ethernet cables, a USB Wi-Fi adapter, a known-good USB-C hub, and a simple label-and-test routine.',
    buyingOrder: ['Wire one desk device first.', 'Add a basic switch.', 'Add spare Ethernet cables and labels.', 'Add a USB Wi-Fi adapter for driver and signal practice.', 'Add managed gear only after the basics make sense.'],
    items: [
      { label: 'TP-Link TL-SG108 switch', role: 'Basic wired network practice and desk expansion.', href: search('tp-link tl-sg108 gigabit switch'), kind: 'search', tier: 'must-have', check: 'Unmanaged is fine for starter practice.' },
      { label: 'Cat6 Ethernet cable pack', role: 'Patch cable testing, routing, and clean desk wiring.', href: search('cat6 ethernet cable pack'), kind: 'search', tier: 'must-have', check: 'Buy multiple lengths, not one absurd coil.' },
      { label: 'ALFA AC1900 USB Wi-Fi adapter', role: 'Driver, antenna, band, and signal troubleshooting practice.', href: '/gear/budget-tech/alfa-ac1900-long-range-usb-wi-fi-adapter', kind: 'internal', tier: 'nice-next', check: 'Driver support matters more than antenna size.' },
      { label: 'Acodot 9-in-1 USB-C hub', role: 'Ethernet and port expansion for laptops with too few ports.', href: '/gear/budget-tech/acodot-9-in-1-usb-c-hub', kind: 'internal', tier: 'nice-next', check: 'Laptop port capability still sets the ceiling.' },
      { label: 'Cable tester and label kit', role: 'Practice physical-layer checks without guessing.', href: search('ethernet cable tester label maker'), kind: 'search', tier: 'skip-until-needed', check: 'Useful once you make or route several cables.' }
    ],
    related: [{ href: '/guides/alfa-ac1900-slow-speed-fix', title: 'ALFA AC1900 slow speed fix', desc: 'Wi-Fi adapter troubleshooting in practical order.' }, { href: '/guides/usb-c-dock-compatibility', title: 'USB-C dock compatibility', desc: 'Host, display, power, and bandwidth checks.' }, { href: '/setups/home-lab-dev-workstation', title: 'Home lab / dev workstation', desc: 'The full desk and lab setup path.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Network+ home lab kit', hook: 'Start with cables, a switch, and Wi-Fi troubleshooting before buying enterprise gear.', utmContent: 'network_plus_lab_kit' }, { channel: 'tiktok', title: 'Network lab buying order', hook: 'Cable, switch, labels, Wi-Fi adapter, then managed gear. That order teaches more.', utmContent: 'network_lab_order' }, { channel: 'reddit', title: 'Cheap Network+ lab', hook: 'A basic switch and real cable testing teach more beginner networking than a rack full of noise.', utmContent: 'reddit_network_plus_lab' }],
    faqs: [{ question: 'Do I need managed switches for Network+?', answer: 'Not first. Learn the physical path, addressing, Wi-Fi behavior, and basic switch behavior before buying managed gear.' }, { question: 'What is the cheapest useful networking lab?', answer: 'A spare laptop, basic switch, Ethernet cables, labels, and one USB Wi-Fi adapter cover a lot of beginner troubleshooting.' }]
  },
  {
    slug: 'linux-beginner-lab-kit',
    title: 'Linux beginner lab kit',
    seoTitle: 'Linux beginner lab kit: cheap gear for learning Linux, storage, and recovery | StackGeist',
    description: 'A Linux beginner lab kit for installing distributions, practicing recovery, using boot media, and keeping experiments away from your daily machine.',
    audience: 'Linux beginners, WGU students, and help desk learners who need a safe practice machine.',
    promise: 'Break Linux on purpose without nuking your daily computer.',
    summary: 'Use a spare laptop or mini PC, a reliable flash drive, external storage, a SATA adapter, and a cheap keyboard and mouse if the lab lives at a desk.',
    buyingOrder: ['Use a spare machine if possible.', 'Make known-good boot media.', 'Back up before wiping drives.', 'Add external storage for ISOs and snapshots.', 'Add a mini PC only if you want a dedicated host.'],
    items: [
      { label: 'SanDisk Ultra Flair USB drive', role: 'Boot media for Linux installers and recovery tools.', href: '/gear/budget-tech/sandisk-ultra-flair-128gb-usb-3-0-flash-drive', kind: 'internal', tier: 'must-have', check: 'Keep one drive reserved for installers.' },
      { label: 'WD Elements portable drive', role: 'Backups before partition experiments.', href: '/gear/budget-tech/wd-elements-portable-external-hard-drive', kind: 'internal', tier: 'must-have', check: 'Back up before resizing or wiping partitions.' },
      { label: 'SABRENT SATA to USB adapter', role: 'Read old drives and recover files from pulled storage.', href: '/gear/budget-tech/sabrent-sata-to-usb-adapter-cable', kind: 'internal', tier: 'nice-next', check: 'SATA only, not NVMe.' },
      { label: 'Used ThinkPad or N100 mini PC', role: 'Dedicated Linux playground.', href: search('used thinkpad linux laptop'), kind: 'search', tier: 'nice-next', check: 'Check Wi-Fi chipset support.' },
      { label: 'USB-C to USB-A adapter', role: 'Keeps older keyboards, mice, and installers usable.', href: '/gear/budget-tech/usb-c-to-usb-a-adapter-2-pack', kind: 'internal', tier: 'skip-until-needed', check: 'Useful when the machine is port-starved.' }
    ],
    related: [{ href: '/guides/microsd-card-not-detected', title: 'microSD card not detected', desc: 'Removable-storage triage before formatting.' }, { href: '/guides/wd-elements-not-showing-up', title: 'WD Elements not showing up', desc: 'External drive checks for Windows and Linux learners.' }, { href: '/kits/help-desk-homelab-starter-kit', title: 'Help desk homelab starter kit', desc: 'The broader support lab path.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Linux beginner lab kit', hook: 'Boot media, backups, spare machine, storage. Learn Linux without wrecking your main PC.', utmContent: 'linux_beginner_lab' }, { channel: 'tiktok', title: 'Break Linux safely', hook: 'Use a spare box, make boot media, back up first, then experiment like a menace.', utmContent: 'break_linux_safely' }, { channel: 'reddit', title: 'Beginner Linux lab gear', hook: 'The safest Linux lab is boring: spare machine, boot USB, backup drive, and recovery adapter.', utmContent: 'reddit_linux_lab' }],
    faqs: [{ question: 'Can I learn Linux on my main PC?', answer: 'Yes, but a spare machine or VM lowers the blast radius. If you dual boot, backup first.' }, { question: 'What storage do I need for Linux practice?', answer: 'At minimum, one USB installer drive and one backup target. External storage keeps experiments reversible.' }]
  },
  {
    slug: 'proxmox-mini-pc-starter-kit',
    title: 'Proxmox mini PC starter kit',
    seoTitle: 'Proxmox mini PC starter kit: quiet home server gear for beginners | StackGeist',
    description: 'A Proxmox mini PC starter kit for beginners building a quiet virtualization host with storage, networking, backups, and power protection.',
    audience: 'Homelab beginners who want virtualization without a loud rack server.',
    promise: 'Run useful VMs without turning the room into a data-center leaf blower.',
    summary: 'A quiet Proxmox lab starts with a low-idle mini PC, enough RAM, an external backup drive, wired Ethernet, and a UPS when uptime matters.',
    buyingOrder: ['Pick the mini PC around idle power and RAM.', 'Use wired Ethernet.', 'Add backup storage.', 'Add a small switch if ports run out.', 'Add UPS once services matter.'],
    items: [
      { label: 'N100 16GB mini PC', role: 'Starter virtualization host for Linux services and labs.', href: search('n100 mini pc 16gb ram 512gb'), kind: 'search', tier: 'must-have', check: 'More RAM beats a slightly faster CPU for several VMs.' },
      { label: '64GB RAM mini PC', role: 'Headroom for more VMs and containers.', href: search('mini pc 64gb ram proxmox'), kind: 'search', tier: 'nice-next', check: 'Verify upgradeability before buying.' },
      { label: 'WD Elements portable drive', role: 'Backups and exported VM images.', href: '/gear/budget-tech/wd-elements-portable-external-hard-drive', kind: 'internal', tier: 'must-have', check: 'Backups need to live outside the host.' },
      { label: 'TP-Link gigabit switch', role: 'Wired ports for host, NAS, and test machine.', href: search('tp-link tl-sg108 gigabit switch'), kind: 'search', tier: 'nice-next', check: 'Gigabit is enough for starter labs.' },
      { label: 'CyberPower UPS', role: 'Clean shutdown during power dips.', href: search('cyberpower cp1500pfclcd ups'), kind: 'search', tier: 'skip-until-needed', check: 'Buy before the lab stores important data.' }
    ],
    related: [{ href: '/setups/home-lab-dev-workstation', title: 'Home lab / dev workstation', desc: 'Full desk and server setup.' }, { href: '/kits/network-plus-home-lab-kit', title: 'Network+ home lab kit', desc: 'Networking gear for the same lab.' }, { href: '/kits/backup-recovery-desk-kit', title: 'Backup and recovery kit', desc: 'Protect the lab before it grows.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Proxmox mini PC starter kit', hook: 'Mini PC, RAM, backup drive, switch, UPS. Quiet homelab beats loud regret.', utmContent: 'proxmox_mini_pc_kit' }, { channel: 'tiktok', title: 'Quiet Proxmox lab', hook: 'Do not buy a rack server first. Start with a mini PC and backups.', utmContent: 'quiet_proxmox_lab' }, { channel: 'reddit', title: 'Mini PC Proxmox start', hook: 'For a first Proxmox box, low idle power and RAM matter more than server cosplay.', utmContent: 'reddit_proxmox_mini_pc' }],
    faqs: [{ question: 'Is a mini PC enough for Proxmox?', answer: 'For beginner labs, yes. It can run several light VMs and containers if it has enough RAM and storage.' }, { question: 'Should I buy a rack server first?', answer: 'Usually no. Rack servers are loud, power hungry, and overkill for most first labs.' }]
  },
  {
    slug: 'backup-recovery-desk-kit',
    title: 'Backup and recovery desk kit',
    seoTitle: 'Backup and recovery desk kit: storage, adapters, and tools for safer files | StackGeist',
    description: 'A backup and recovery desk kit with external storage, adapters, flash drives, cleaning tools, and simple rules that prevent panic formatting.',
    audience: 'Anyone with school, work, media, or homelab files they cannot afford to lose.',
    promise: 'Make recovery boring before the drive starts clicking.',
    summary: 'The kit is simple: one external drive, one boot USB, one adapter for old drives, one cleaning cloth, and a rule that formatting is never step one.',
    buyingOrder: ['Buy external backup storage.', 'Make boot and recovery media.', 'Add drive adapters.', 'Label storage by purpose.', 'Test restore before trusting the system.'],
    items: [
      { label: 'WD Elements portable drive', role: 'Main offline backup target.', href: '/gear/budget-tech/wd-elements-portable-external-hard-drive', kind: 'internal', tier: 'must-have', check: 'One drive is better than nothing, not a full backup strategy.' },
      { label: 'SanDisk Ultra Flair flash drive', role: 'Recovery media and installer USB.', href: '/gear/budget-tech/sandisk-ultra-flair-128gb-usb-3-0-flash-drive', kind: 'internal', tier: 'must-have', check: 'Do not store your only files on the installer drive.' },
      { label: 'SABRENT SATA adapter', role: 'Read files from pulled laptop and desktop drives.', href: '/gear/budget-tech/sabrent-sata-to-usb-adapter-cable', kind: 'internal', tier: 'nice-next', check: 'SATA drives only.' },
      { label: 'SABRENT drive dock', role: 'More comfortable access for multiple bare drives.', href: '/gear/budget-tech/sabrent-usb-c-lay-flat-drive-dock-nvme-sata', kind: 'internal', tier: 'nice-next', check: 'Check NVMe and SATA support for your drive type.' },
      { label: 'Microfiber cloths', role: 'Clean screens, lenses, and drive enclosures without scratches.', href: '/gear/budget-tech/microfiber-cleaning-cloths-18-pack', kind: 'internal', tier: 'skip-until-needed', check: 'Cheap, but not a substitute for backups.' }
    ],
    related: [{ href: '/guides/wd-elements-not-showing-up', title: 'WD Elements not showing up', desc: 'Do the safe checks before formatting.' }, { href: '/guides/microsd-card-not-detected', title: 'microSD card not detected', desc: 'Card recovery triage.' }, { href: '/gear/budget-tech/compare/wd-elements-vs-samsung-t7', title: 'WD Elements vs Samsung T7', desc: 'Capacity-first HDD or speed-first SSD.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Backup and recovery desk kit', hook: 'External drive, boot USB, SATA adapter, labels, restore test. Panic is not a backup plan.', utmContent: 'backup_recovery_kit' }, { channel: 'tiktok', title: 'Do not format first', hook: 'If a drive disappears, formatting is not step one. Cable, port, disk utility, backup status first.', utmContent: 'dont_format_first' }, { channel: 'reddit', title: 'Basic recovery kit', hook: 'A backup drive, boot USB, and SATA adapter solve a lot of home recovery problems safely.', utmContent: 'reddit_backup_recovery' }],
    faqs: [{ question: 'What is the first backup device to buy?', answer: 'A reputable external drive with enough room for the files you care about. Then test that you can restore from it.' }, { question: 'Should I format a drive that is not showing up?', answer: 'Only if the data does not matter. Check cable, port, Disk Management or disk utility, and backup status first.' }]
  },
  {
    slug: 'cloud-support-study-desk-kit',
    title: 'Cloud support study desk kit',
    seoTitle: 'Cloud support study desk kit: gear for AWS, Linux, networking, and note-heavy study | StackGeist',
    description: 'A cloud support study desk kit for AWS learners who need a stable desk, second screen, Linux practice box, webcam, storage, and networking basics.',
    audience: 'AWS CCP, cloud support, and junior sysadmin learners studying from home.',
    promise: 'Build a study desk that supports labs, notes, calls, and troubleshooting reps.',
    summary: 'Cloud study gear should help with screen space, Linux practice, backups, calls, and basic networking. The cloud still starts on your desk, annoyingly enough.',
    buyingOrder: ['Fix screen space for docs and labs.', 'Add Linux practice hardware only when needed.', 'Back up notes and projects.', 'Make calls and interviews clean.', 'Wire the network if labs feel flaky.'],
    items: [
      { label: '27 inch 1440p monitor', role: 'Room for docs, console, notes, and labs.', href: search('27 inch 1440p monitor'), kind: 'search', tier: 'must-have', check: 'One good monitor beats cramped dual screens.' },
      { label: 'N100 mini PC', role: 'Linux practice host for services and command-line reps.', href: search('n100 mini pc linux'), kind: 'search', tier: 'nice-next', check: 'Use a VM first if your current machine handles it.' },
      { label: 'WD Elements portable drive', role: 'Back up notes, projects, and lab exports.', href: '/gear/budget-tech/wd-elements-portable-external-hard-drive', kind: 'internal', tier: 'must-have', check: 'Cloud accounts are not a substitute for local backups.' },
      { label: 'Logitech C920x webcam', role: 'Cleaner calls and mock interviews.', href: '/gear/budget-tech/logitech-c920x-hd-webcam', kind: 'internal', tier: 'nice-next', check: 'Light and camera height matter first.' },
      { label: 'TP-Link gigabit switch', role: 'Stable lab network when Wi-Fi starts lying.', href: search('tp-link gigabit switch'), kind: 'search', tier: 'skip-until-needed', check: 'Skip if everything is laptop-only.' }
    ],
    related: [{ href: '/kits/linux-beginner-lab-kit', title: 'Linux beginner lab kit', desc: 'Hardware for safe Linux practice.' }, { href: '/kits/help-desk-homelab-starter-kit', title: 'Help desk homelab starter kit', desc: 'Support-skill lab route.' }, { href: '/guides/better-video-calls', title: 'Better video calls', desc: 'Calls and interview setup.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Cloud support study desk kit', hook: 'Monitor, Linux box, backups, webcam, network. Study setup before cert panic.', utmContent: 'cloud_support_study_desk' }, { channel: 'tiktok', title: 'Cloud study gear order', hook: 'Screen space first, Linux reps second, backups always.', utmContent: 'cloud_study_order' }, { channel: 'reddit', title: 'Cloud support desk setup', hook: 'For cloud support study, gear should help labs, notes, Linux reps, calls, and backups.', utmContent: 'reddit_cloud_support_desk' }],
    faqs: [{ question: 'Do I need a server to study cloud support?', answer: 'No. A laptop and browser cover cloud labs. A mini PC helps when you want Linux and network practice outside the cloud account.' }, { question: 'What desk gear helps cloud study most?', answer: 'Screen space, backup storage, comfortable input, and a clean call setup usually help more than specialty hardware.' }]
  },
  {
    slug: 'cybersecurity-beginner-lab-kit',
    title: 'Cybersecurity beginner lab kit',
    seoTitle: 'Cybersecurity beginner lab kit: safe hardware for defensive security practice | StackGeist',
    description: 'A cybersecurity beginner lab kit focused on defensive practice, VMs, networking, backups, and safe experimentation at home.',
    audience: 'Security beginners who want legitimate defensive practice without shady nonsense.',
    promise: 'Practice safely, isolate experiments, and keep the boring evidence trail.',
    summary: 'Start with a machine that can run VMs, a backup drive, a USB Wi-Fi adapter for driver practice, a small switch, and a notebook habit for every change.',
    buyingOrder: ['Use VMs before extra hardware.', 'Back up clean snapshots.', 'Add network practice gear.', 'Add wireless adapter practice carefully.', 'Keep unsafe experiments isolated and legal.'],
    items: [
      { label: '64GB RAM workstation or mini PC', role: 'VM headroom for defensive labs.', href: search('mini pc 64gb ram virtualization'), kind: 'search', tier: 'must-have', check: 'RAM matters more than RGB and benchmark bait.' },
      { label: 'WD Elements portable drive', role: 'Backups and VM exports.', href: '/gear/budget-tech/wd-elements-portable-external-hard-drive', kind: 'internal', tier: 'must-have', check: 'Keep clean snapshots before experiments.' },
      { label: 'ALFA AC1900 Wi-Fi adapter', role: 'Wireless driver and signal troubleshooting practice.', href: '/gear/budget-tech/alfa-ac1900-long-range-usb-wi-fi-adapter', kind: 'internal', tier: 'nice-next', check: 'Use only on networks you own or are allowed to test.' },
      { label: 'TP-Link gigabit switch', role: 'Small isolated wired practice network.', href: search('tp-link tl-sg108 gigabit switch'), kind: 'search', tier: 'nice-next', check: 'Basic segmentation starts with knowing what is plugged in.' },
      { label: 'Precision screwdriver kit', role: 'Open old PCs safely for drive and RAM swaps.', href: '/gear/budget-tech/140-in-1-precision-screwdriver-repair-kit', kind: 'internal', tier: 'skip-until-needed', check: 'Use the right bit before you strip a laptop screw.' }
    ],
    related: [{ href: '/kits/network-plus-home-lab-kit', title: 'Network+ home lab kit', desc: 'Networking fundamentals before security tooling.' }, { href: '/kits/linux-beginner-lab-kit', title: 'Linux beginner lab kit', desc: 'Linux practice for security learners.' }, { href: '/setups/ai-ml-workstation', title: 'AI / ML workstation', desc: 'Higher-end workstation planning when compute becomes real.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Cybersecurity beginner lab kit', hook: 'VMs, backups, switch, Wi-Fi adapter, notes. Defensive lab first, movie-hacker cosplay never.', utmContent: 'cyber_beginner_lab' }, { channel: 'tiktok', title: 'Beginner cyber lab order', hook: 'RAM, snapshots, backups, switch, then wireless practice with permission.', utmContent: 'cyber_lab_order' }, { channel: 'reddit', title: 'Safe cyber lab gear', hook: 'A defensive beginner lab needs isolation, backups, and notes more than exotic hardware.', utmContent: 'reddit_safe_cyber_lab' }],
    faqs: [{ question: 'What hardware do I need for beginner cybersecurity?', answer: 'A VM-capable computer, enough RAM, backups, and basic network gear are enough for defensive beginner practice.' }, { question: 'Do I need Wi-Fi hacking gear?', answer: 'No. Learn networking, Linux, logging, and defensive tooling first. Only test wireless networks you own or have permission to assess.' }]
  },
  {
    slug: 'remote-work-under-300-kit',
    title: 'Remote work setup under $300',
    seoTitle: 'Remote work setup under $300: practical desk upgrades for calls and focus | StackGeist',
    description: 'A remote work setup under $300 that prioritizes chair comfort, lighting, webcam, audio, power, and cable cleanup before fancy accessories.',
    audience: 'Remote and hybrid workers trying to fix a bad desk without overspending.',
    promise: 'Spend the first $300 where it changes daily work.',
    summary: 'The under-$300 path should fix light, camera angle, audio, power, cables, and one ergonomic bottleneck. The giant desk upgrade can wait.',
    buyingOrder: ['Fix lighting.', 'Fix camera height.', 'Fix power safety.', 'Fix cable clutter.', 'Fix the worst ergonomic bottleneck.'],
    items: [
      { label: 'Clamp-on LED desk lamp', role: 'Front light and task light without desk clutter.', href: '/gear/budget-tech/clamp-on-led-desk-lamp', kind: 'internal', tier: 'must-have', check: 'Clamp clearance matters.' },
      { label: 'Logitech C920x webcam', role: 'Reliable external camera for calls.', href: '/gear/budget-tech/logitech-c920x-hd-webcam', kind: 'internal', tier: 'must-have', check: 'Raise it to eye level.' },
      { label: 'Flat plug surge protector', role: 'Clean, safer desk power.', href: '/gear/budget-tech/flat-plug-surge-protector-power-strip-8-outlets-usb', kind: 'internal', tier: 'must-have', check: 'Do not daisy-chain strips.' },
      { label: 'Under-desk cable tray', role: 'Gets cables off the floor and out of chair wheels.', href: search('under desk cable management tray'), kind: 'search', tier: 'nice-next', check: 'Measure desk thickness before clamping.' },
      { label: 'Compact mesh task chair', role: 'Budget seating improvement if the current chair is wrecking your back.', href: search('compact mesh ergonomic chair'), kind: 'search', tier: 'skip-until-needed', check: 'Seat height and arm height matter more than looks.' }
    ],
    related: [{ href: '/kits/budget-video-call-kit', title: 'Budget video call kit', desc: 'Call-specific upgrade order.' }, { href: '/guides/cheap-desk-upgrades', title: 'Cheap desk upgrades first', desc: 'Low-cost upgrade order.' }, { href: '/setups/work-from-home-pro', title: 'Work-from-home pro', desc: 'Full work desk route.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Remote work setup under $300', hook: 'Light, webcam, power, cable tray, chair fix. Spend where the workday hurts.', utmContent: 'remote_work_under_300' }, { channel: 'tiktok', title: 'Remote desk under $300', hook: 'You do not need a full makeover. Fix light, camera, power, and cables first.', utmContent: 'remote_under_300' }, { channel: 'reddit', title: 'Remote desk on a budget', hook: 'Under $300 should fix daily friction, not buy decoration.', utmContent: 'reddit_remote_under_300' }],
    faqs: [{ question: 'What should I upgrade first for remote work?', answer: 'Start with the thing hurting daily work: bad light, bad camera angle, unsafe power, cable clutter, or an uncomfortable chair.' }, { question: 'Is $300 enough for a remote work setup?', answer: 'Enough to make a bad setup usable, yes. It is not enough for a full premium desk rebuild.' }]
  },
  {
    slug: 'dual-monitor-desk-kit',
    title: 'Dual monitor desk kit',
    seoTitle: 'Dual monitor desk kit: arms, cables, docks, and layout checks before buying | StackGeist',
    description: 'A dual monitor desk kit for choosing monitor arms, cables, docks, power, and desk layout without creating a wobbling cable monster.',
    audience: 'People adding a second monitor for work, school, coding, streaming, or trading screen space for sanity.',
    promise: 'Make the second screen useful instead of just symmetrical clutter.',
    summary: 'A second monitor depends on desk width, arm geometry, cable path, host display support, and power. Buy the arm and cables around the real layout.',
    buyingOrder: ['Measure desk width and depth.', 'Check VESA and monitor weight.', 'Confirm laptop or GPU display support.', 'Buy the arm and cables together.', 'Clean the power path last.'],
    items: [
      { label: 'Amazon Basics dual monitor arm', role: 'Affordable dual-arm mount for common 24 to 27 inch panels.', href: '/gear/monitor-support/amazon-basics-dual-monitor-arm', kind: 'internal', tier: 'must-have', check: 'Match monitor weight and desk clamp thickness.' },
      { label: 'Ergotron LX arm', role: 'Premium arm for heavier or daily-adjusted displays.', href: '/gear/monitor-support/ergotron-lx', kind: 'internal', tier: 'nice-next', check: 'Buy one strong arm if one display matters most.' },
      { label: 'CalDigit TS4', role: 'Thunderbolt dock for serious laptop desk setups.', href: '/gear/connectivity/caldigit-ts4', kind: 'internal', tier: 'nice-next', check: 'Only useful if the host supports Thunderbolt.' },
      { label: 'DisplayPort cable pack', role: 'Known-good monitor cables for desktop GPUs.', href: search('displayport 1.4 cable 2 pack'), kind: 'search', tier: 'must-have', check: 'Match refresh rate and resolution needs.' },
      { label: 'Under-desk cable tray', role: 'Stops two monitors from creating floor spaghetti.', href: search('under desk cable tray'), kind: 'search', tier: 'skip-until-needed', check: 'Install before final cable routing.' }
    ],
    related: [{ href: '/setups/dual-monitor-productivity', title: 'Dual monitor productivity', desc: 'Full two-screen setup route.' }, { href: '/guides/monitor-arm-sagging-fix', title: 'Monitor arm sagging fix', desc: 'Troubleshoot sagging arms.' }, { href: '/guides/usb-c-dock-only-one-monitor', title: 'USB-C dock only detecting one monitor', desc: 'When the second display will not appear.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Dual monitor desk kit', hook: 'Measure desk, check VESA, check host support, then buy arms and cables.', utmContent: 'dual_monitor_kit' }, { channel: 'tiktok', title: 'Second monitor checklist', hook: 'Weight, VESA, desk clamp, display output, cable path. Then buy.', utmContent: 'second_monitor_checklist' }, { channel: 'reddit', title: 'Dual monitor buying order', hook: 'Most dual monitor mistakes are arm geometry and host output limits, not the monitors.', utmContent: 'reddit_dual_monitor_order' }],
    faqs: [{ question: 'Do I need a dock for two monitors?', answer: 'Only if your laptop supports the display path the dock uses. Many failures come from host limits, not dead docks.' }, { question: 'Should I buy a dual arm or two single arms?', answer: 'Two single arms are often easier to position. A dual arm can work when both monitors are similar size and weight.' }]
  },
  {
    slug: 'steam-deck-dock-kit',
    title: 'Steam Deck dock kit',
    seoTitle: 'Steam Deck dock kit: charger, dock, storage, display, and cable picks | StackGeist',
    description: 'A Steam Deck dock kit for handheld gaming setups with charger, dock, storage, display, Ethernet, and travel case choices.',
    audience: 'Steam Deck and handheld PC users who want docked play without dongle nonsense.',
    promise: 'Dock the handheld around the display you actually use.',
    summary: 'The useful handheld setup is dock, charger, microSD or SSD, display path, Ethernet when needed, and a case that fits the accessories.',
    buyingOrder: ['Pick the display target.', 'Match the dock to resolution and refresh rate.', 'Add a proper charger.', 'Add storage.', 'Add Ethernet and case only if you move it often.'],
    items: [
      { label: 'JSAUX Steam Deck dock', role: 'Affordable HDMI, USB, Ethernet, and charge passthrough.', href: search('jsaux steam deck dock'), kind: 'search', tier: 'must-have', check: 'Match HDMI output to the TV or monitor.' },
      { label: '65W USB-C GaN charger', role: 'Clean charging for handheld and dock.', href: search('65w usb c gan charger steam deck'), kind: 'search', tier: 'must-have', check: 'Use a known-good cable.' },
      { label: 'Samsung EVO Select microSD', role: 'Game library expansion.', href: '/gear/budget-tech/samsung-evo-select-512gb-microsd-card', kind: 'internal', tier: 'nice-next', check: 'Install speed varies by card and game.' },
      { label: 'INIU 240W USB-C cable', role: 'Known-good power cable for docked handhelds.', href: '/gear/budget-tech/iniu-usb-c-to-usb-c-cable-240w-6-6ft', kind: 'internal', tier: 'nice-next', check: 'Wattage does not prove video support.' },
      { label: 'Hard shell carry case', role: 'Protects the handheld and carries dock accessories.', href: search('steam deck hard shell carry case dock storage'), kind: 'search', tier: 'skip-until-needed', check: 'Measure dock and charger storage before buying.' }
    ],
    related: [{ href: '/setups/handheld-steam-deck', title: 'Handheld / Steam Deck dock setup', desc: 'Full docked handheld setup.' }, { href: '/guides/usb-c-cable-buying-guide', title: 'USB-C cable buying guide', desc: 'Know what the cable can actually do.' }, { href: '/kits/usb-c-desk-survival-kit', title: 'USB-C desk survival kit', desc: 'The broader USB-C support kit.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Steam Deck dock kit', hook: 'Dock, charger, storage, display path, case. Buy around the screen you use.', utmContent: 'steam_deck_dock_kit' }, { channel: 'tiktok', title: 'Steam Deck dock order', hook: 'Pick the display first, then dock, charger, storage, and case.', utmContent: 'steam_deck_order' }, { channel: 'reddit', title: 'Steam Deck dock checklist', hook: 'For docked Deck use, HDMI target and charger matter before accessory count.', utmContent: 'reddit_steam_deck_dock' }],
    faqs: [{ question: 'What dock should I buy for Steam Deck?', answer: 'Buy around the TV or monitor you actually use. 1080p60 needs less than 4K60 with Ethernet and multiple USB devices.' }, { question: 'Do I need the official dock?', answer: 'No. The official dock is convenient, but good third-party docks can work if they match your display and charging needs.' }]
  },
  {
    slug: 'ps5-living-room-upgrade-kit',
    title: 'PS5 living room upgrade kit',
    seoTitle: 'PS5 living room upgrade kit: TV, HDMI, soundbar, charging, and storage picks | StackGeist',
    description: 'A PS5 living room upgrade kit for TV height, HDMI 2.1, soundbar, controller charging, storage, and cable cleanup.',
    audience: 'Console players improving a living room setup without buying random RGB furniture.',
    promise: 'Upgrade the seat-to-screen path before decorating around it.',
    summary: 'A console setup lives on TV position, HDMI path, sound, controller charging, storage, and clean power. The console is only one part of the room.',
    buyingOrder: ['Set couch and TV height.', 'Confirm HDMI 2.1 ports if 4K120 matters.', 'Fix sound.', 'Fix controller charging.', 'Clean power and cable path.'],
    items: [
      { label: 'HDMI 2.1 cable', role: 'Supports the console display path when the TV supports it.', href: search('hdmi 2.1 cable ps5 4k 120hz'), kind: 'search', tier: 'must-have', check: 'Cable does nothing if the TV port lacks support.' },
      { label: 'TV wall mount or stand', role: 'Fixes eye-line and cable route.', href: search('tv wall mount 55 65 inch'), kind: 'search', tier: 'must-have', check: 'Mount into studs or use the correct anchors.' },
      { label: 'Vizio or Samsung soundbar', role: 'Big audio improvement over TV speakers.', href: search('2.1 soundbar hdmi arc'), kind: 'search', tier: 'nice-next', check: 'Check HDMI ARC or eARC support.' },
      { label: 'PS5 controller charging dock', role: 'Keeps controllers charged and off the table.', href: search('ps5 controller charging dock'), kind: 'search', tier: 'nice-next', check: 'Confirm controller generation support.' },
      { label: 'Flat plug surge protector', role: 'Clean power behind the TV stand.', href: '/gear/budget-tech/flat-plug-surge-protector-power-strip-8-outlets-usb', kind: 'internal', tier: 'skip-until-needed', check: 'Do not overload the strip.' }
    ],
    related: [{ href: '/setups/console-living-room', title: 'Console living room', desc: 'Full console setup route.' }, { href: '/gear/accessories/razer-base-station-v2-chroma', title: 'Razer Base Station V2 Chroma', desc: 'Headset stand and USB hub fit notes.' }, { href: '/guides/extension-cord-safety-guide', title: 'Extension cord safety guide', desc: 'Power safety before the entertainment center becomes cursed.' }],
    socialAngles: [{ channel: 'pinterest', title: 'PS5 living room upgrade kit', hook: 'TV height, HDMI, sound, controller charging, power. Upgrade the actual play path.', utmContent: 'ps5_living_room_kit' }, { channel: 'tiktok', title: 'PS5 setup order', hook: 'Couch, TV height, HDMI port, soundbar, charging dock, cable cleanup.', utmContent: 'ps5_setup_order' }, { channel: 'reddit', title: 'Console living room order', hook: 'For PS5 setups, display path and sound beat decorative accessories.', utmContent: 'reddit_ps5_living_room' }],
    faqs: [{ question: 'What should I upgrade first for PS5?', answer: 'Fix TV position and HDMI capability first. Sound and controller charging come next.' }, { question: 'Do I need HDMI 2.1?', answer: 'Only if your TV and game use features like 4K120 or VRR. Otherwise a good HDMI cable and correct port selection are enough.' }]
  },
  {
    slug: 'content-creator-under-300-kit',
    title: 'Content creator kit under $300',
    seoTitle: 'Content creator kit under $300: mic, light, webcam, arm, and simple desk picks | StackGeist',
    description: 'A content creator kit under $300 for video calls, TikTok, streaming, and beginner YouTube with mic, light, webcam, mount, and cable basics.',
    audience: 'New creators who need clean audio and video before buying pro camera gear.',
    promise: 'Fix sound and light first. The algorithm does not care about your unused cinema camera.',
    summary: 'Under $300 should buy close audio, front light, camera height, a stable mount, and clean cables. That beats one flashy camera purchase.',
    buyingOrder: ['Move the mic close.', 'Add soft front light.', 'Set camera height.', 'Stabilize the mount.', 'Clean the background and cable path.'],
    items: [
      { label: 'FIFINE or Samson USB mic', role: 'Close voice capture without an audio interface.', href: search('samson q2u usb microphone'), kind: 'search', tier: 'must-have', check: 'Mic distance beats mic price.' },
      { label: 'Clamp-on LED desk lamp', role: 'Cheap front light or desk light.', href: '/gear/budget-tech/clamp-on-led-desk-lamp', kind: 'internal', tier: 'must-have', check: 'Diffuse harsh light.' },
      { label: 'Logitech C920x webcam', role: 'Simple camera upgrade for video.', href: '/gear/budget-tech/logitech-c920x-hd-webcam', kind: 'internal', tier: 'nice-next', check: 'Use eye-level framing.' },
      { label: 'InnoGear boom arm', role: 'Gets the mic close without desk clutter.', href: search('innogear microphone boom arm'), kind: 'search', tier: 'nice-next', check: 'Check clamp thickness.' },
      { label: 'Velcro cable ties', role: 'Stops the recording desk from looking like a trap.', href: search('velcro cable ties desk'), kind: 'search', tier: 'skip-until-needed', check: 'Route cables you unplug separately.' }
    ],
    related: [{ href: '/setups/streaming-content-creator', title: 'Streaming / content creator', desc: 'Full creator setup path.' }, { href: '/kits/budget-video-call-kit', title: 'Budget video call kit', desc: 'Call and camera basics.' }, { href: '/gear/audio/elgato-wave-3', title: 'Elgato Wave:3', desc: 'Mic decision page.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Content creator kit under $300', hook: 'Mic close, light front, camera high, cables clean. Start there.', utmContent: 'creator_under_300' }, { channel: 'tiktok', title: 'Creator gear under $300', hook: 'Do not buy a camera first. Audio and light first, every time.', utmContent: 'creator_gear_order' }, { channel: 'reddit', title: 'Beginner creator kit', hook: 'For a first creator setup, close audio and lighting beat a fancy camera.', utmContent: 'reddit_creator_under_300' }],
    faqs: [{ question: 'Should a beginner creator buy a camera first?', answer: 'Usually no. Audio, lighting, and framing improve more content for less money.' }, { question: 'Is a USB mic enough?', answer: 'Yes for beginner streaming, calls, and short-form content if you keep it close and control room noise.' }]
  },
  {
    slug: 'podcast-starter-kit',
    title: 'Podcast starter kit',
    seoTitle: 'Podcast starter kit: microphone, headphones, interface, arm, and room fixes | StackGeist',
    description: 'A podcast starter kit for home recording with dynamic mic, headphones, interface, arm, backup recorder, and basic room treatment.',
    audience: 'New podcasters and interview hosts recording from a normal room.',
    promise: 'A close dynamic mic and a quieter room beat buying famous broadcast gear too early.',
    summary: 'Start with a forgiving dynamic mic, closed-back headphones, a stable arm, room-softening basics, and backup recording once interviews matter.',
    buyingOrder: ['Pick a dynamic mic.', 'Use closed-back headphones.', 'Mount the mic close.', 'Soften the room.', 'Add an interface or recorder when the show becomes regular.'],
    items: [
      { label: 'Samson Q2U or Rode PodMic USB', role: 'Forgiving dynamic mic with USB path.', href: search('samson q2u microphone'), kind: 'search', tier: 'must-have', check: 'Record close to the mic.' },
      { label: 'Sony MDR-7506 headphones', role: 'Closed-back monitoring without mic bleed.', href: search('sony mdr-7506 headphones'), kind: 'search', tier: 'must-have', check: 'Closed-back matters for recording.' },
      { label: 'InnoGear boom arm', role: 'Positions the mic correctly.', href: search('innogear microphone boom arm'), kind: 'search', tier: 'nice-next', check: 'Desk clamp fit matters.' },
      { label: 'Focusrite Scarlett Solo', role: 'Clean XLR path when you outgrow USB.', href: search('focusrite scarlett solo 4th gen'), kind: 'search', tier: 'nice-next', check: 'Skip if your USB mic already solves the problem.' },
      { label: 'Thick curtains or acoustic panels', role: 'Reduces room reflections.', href: search('acoustic curtains sound absorbing'), kind: 'search', tier: 'skip-until-needed', check: 'Foam alone is usually not magic.' }
    ],
    related: [{ href: '/setups/podcasting-audio', title: 'Podcasting / audio production', desc: 'Full audio setup route.' }, { href: '/gear/audio/elgato-wave-3', title: 'Elgato Wave:3', desc: 'USB mic decision page.' }, { href: '/kits/content-creator-under-300-kit', title: 'Creator kit under $300', desc: 'Video-first creator route.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Podcast starter kit', hook: 'Dynamic mic, closed headphones, arm, soft room. Famous mic can wait.', utmContent: 'podcast_starter_kit' }, { channel: 'tiktok', title: 'Podcast gear order', hook: 'Close mic, headphones, arm, room treatment, backup. That order saves recordings.', utmContent: 'podcast_gear_order' }, { channel: 'reddit', title: 'Home podcast starter kit', hook: 'A forgiving dynamic mic and quieter room beat buying the famous mic too early.', utmContent: 'reddit_podcast_start' }],
    faqs: [{ question: 'What microphone should a new podcaster buy?', answer: 'A dynamic USB or USB/XLR mic is usually safest because it rejects room noise better than many condenser mics.' }, { question: 'Do I need an audio interface?', answer: 'Not if you start with a good USB mic. Add an interface when you need XLR, more gain, or multiple microphones.' }]
  },
  {
    slug: 'desk-lighting-fix-kit',
    title: 'Desk lighting fix kit',
    seoTitle: 'Desk lighting fix kit: task light, bias light, smart strips, and video call lighting | StackGeist',
    description: 'A desk lighting fix kit for task work, video calls, eye comfort, ambient light, and smart-strip problems without buying random RGB.',
    audience: 'People with dark desks, ugly calls, screen glare, or lighting that looks cooler than it works.',
    promise: 'One useful light before five decorative ones.',
    summary: 'Fix task light and face light first, then add bias or ambient lighting. RGB strips are dessert, not dinner.',
    buyingOrder: ['Fix task lighting.', 'Fix face lighting for calls.', 'Add bias light behind the screen.', 'Add smart strips only for room ambience.', 'Troubleshoot Wi-Fi before replacing smart lights.'],
    items: [
      { label: 'Clamp-on LED desk lamp', role: 'Cheap, adjustable task light.', href: '/gear/budget-tech/clamp-on-led-desk-lamp', kind: 'internal', tier: 'must-have', check: 'Check clamp clearance and glare.' },
      { label: 'BenQ ScreenBar Pro', role: 'Monitor-mounted task light without desk footprint.', href: '/gear/desk-lighting/benq-screenbar-pro', kind: 'internal', tier: 'nice-next', check: 'Worth it when desk space matters.' },
      { label: 'Luminoodle bias light', role: 'Low-cost monitor backlight for contrast comfort.', href: '/gear/desk-lighting/luminoodle', kind: 'internal', tier: 'nice-next', check: 'Bias light is not task light.' },
      { label: 'Govee Strip Light 2 Pro', role: 'Room-scale ambient lighting.', href: '/gear/desk-lighting/govee-strip-light-2-pro', kind: 'internal', tier: 'skip-until-needed', check: 'Setup needs 2.4 GHz Wi-Fi.' },
      { label: 'Elgato Key Light Air', role: 'Creator and call lighting.', href: search('elgato key light air'), kind: 'search', tier: 'skip-until-needed', check: 'Overkill for normal desk work.' }
    ],
    related: [{ href: '/gear/budget-tech/compare/clamp-led-lamp-vs-screenbar', title: 'Clamp lamp vs ScreenBar', desc: 'Pick by desk space and aiming control.' }, { href: '/guides/benq-screenbar-flickering', title: 'BenQ ScreenBar flickering', desc: 'Power and flicker troubleshooting.' }, { href: '/guides/govee-strip-lights-not-connecting-wifi', title: 'Govee lights not connecting', desc: '2.4 GHz setup fixes.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Desk lighting fix kit', hook: 'Task light, face light, bias light, ambient strip. In that order.', utmContent: 'desk_lighting_fix' }, { channel: 'tiktok', title: 'Stop buying RGB first', hook: 'Fix the work light first. RGB strips are not a personality or a task lamp.', utmContent: 'lighting_order' }, { channel: 'reddit', title: 'Desk lighting order', hook: 'Useful desk lighting starts with task and face light, then ambience.', utmContent: 'reddit_desk_lighting' }],
    faqs: [{ question: 'Should I buy a ScreenBar or lamp?', answer: 'A clamp lamp is cheaper. A ScreenBar is useful when you need task light without using desk space.' }, { question: 'Do RGB strips help desk work?', answer: 'They help ambience, not task visibility. Fix the work light first.' }]
  },
  {
    slug: 'cable-management-starter-kit',
    title: 'Cable management starter kit',
    seoTitle: 'Cable management starter kit: trays, ties, clips, labels, and power cleanup | StackGeist',
    description: 'A cable management starter kit for desk power, signal cables, removable accessories, labels, trays, clips, and safer routing.',
    audience: 'People whose desk cables have reached horror-movie basement status.',
    promise: 'Route cables so future you can still change something without rage quitting.',
    summary: 'Cable management starts with power placement, removable cable paths, labels, Velcro, clips, and a tray only when the route is stable.',
    buyingOrder: ['Unplug and sort by power, signal, and removable cables.', 'Place the power strip safely.', 'Use Velcro before permanent adhesive.', 'Add clips for visible cable paths.', 'Add a tray when the route is stable.'],
    items: [
      { label: 'Velcro cable ties', role: 'Reusable bundling that survives changes.', href: search('velcro cable ties reusable'), kind: 'search', tier: 'must-have', check: 'Avoid zip ties for cables you change often.' },
      { label: 'Adhesive cable clips', role: 'Guides light cables along the desk edge.', href: search('adhesive cable clips desk'), kind: 'search', tier: 'must-have', check: 'Clean the surface before sticking.' },
      { label: 'Under-desk cable tray', role: 'Hides power bricks and slack.', href: search('under desk cable management tray'), kind: 'search', tier: 'nice-next', check: 'Measure desk thickness and screw clearance.' },
      { label: 'Flat plug surge protector', role: 'Cleaner wall connection and outlet spacing.', href: '/gear/budget-tech/flat-plug-surge-protector-power-strip-8-outlets-usb', kind: 'internal', tier: 'nice-next', check: 'Never daisy-chain power strips.' },
      { label: 'Label maker', role: 'Labels power bricks and removable cables.', href: search('label maker cable labels'), kind: 'search', tier: 'skip-until-needed', check: 'Useful once you have several similar cables.' }
    ],
    related: [{ href: '/guides/cable-management', title: 'Cable management', desc: 'Full routing rules.' }, { href: '/guides/extension-cord-safety-guide', title: 'Extension cord safety guide', desc: 'Power safety before cable aesthetics.' }, { href: '/kits/cheap-desk-upgrades-under-100', title: 'Cheap desk upgrades under $100', desc: 'Low-cost desk fixes.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Cable management starter kit', hook: 'Velcro, clips, tray, flat plug strip, labels. Future-you deserves mercy.', utmContent: 'cable_management_kit' }, { channel: 'tiktok', title: 'Cable cleanup order', hook: 'Sort power, signal, removable. Velcro first, tray later.', utmContent: 'cable_cleanup_order' }, { channel: 'reddit', title: 'Desk cable starter kit', hook: 'Reusable ties and a safe power path beat permanent cable art.', utmContent: 'reddit_cable_management' }],
    faqs: [{ question: 'Should I use zip ties for desk cables?', answer: 'Use Velcro for anything you might change. Zip ties are fine for semi-permanent bundles but annoying for daily desk changes.' }, { question: 'Do I need a cable tray?', answer: 'Only after you know where the power strip and bricks should live. Otherwise the tray becomes a junk drawer under the desk.' }]
  },
  {
    slug: 'college-tech-backpack-kit',
    title: 'College tech backpack kit',
    seoTitle: 'College tech backpack kit: laptop bag, charger, adapters, storage, and calculator | StackGeist',
    description: 'A college tech backpack kit with laptop protection, charger, adapters, storage, calculator, cleaning cloths, and simple daily carry rules.',
    audience: 'College and WGU students who need practical tech carry without stuffing the bag with junk.',
    promise: 'Carry what solves real campus and study problems.',
    summary: 'The useful tech bag protects the laptop, charges the daily devices, handles USB weirdness, stores files, and keeps screens readable.',
    buyingOrder: ['Protect the laptop.', 'Carry one charger and known-good cable.', 'Add small adapters.', 'Add removable storage.', 'Add course-specific tools only when required.'],
    items: [
      { label: 'KROSER laptop briefcase', role: 'Laptop protection with room for charger and accessories.', href: '/gear/budget-tech/kroser-laptop-briefcase-up-to-17-3', kind: 'internal', tier: 'must-have', check: 'Match laptop size before buying.' },
      { label: 'INIU 240W USB-C cable', role: 'Known-good charging cable.', href: '/gear/budget-tech/iniu-usb-c-to-usb-c-cable-240w-6-6ft', kind: 'internal', tier: 'must-have', check: 'Cable wattage does not prove data speed.' },
      { label: 'USB-C to USB-A adapter', role: 'Keeps older accessories usable.', href: '/gear/budget-tech/usb-c-to-usb-a-adapter-2-pack', kind: 'internal', tier: 'nice-next', check: 'Keep one in the bag.' },
      { label: 'SanDisk Ultra Flair USB drive', role: 'Simple file transfer and boot media.', href: '/gear/budget-tech/sandisk-ultra-flair-128gb-usb-3-0-flash-drive', kind: 'internal', tier: 'nice-next', check: 'Do not store your only copy on it.' },
      { label: 'TI-84 Plus CE', role: 'Calculator for courses or exams that expect it.', href: '/gear/budget-tech/texas-instruments-ti-84-plus-ce-graphing-calculator', kind: 'internal', tier: 'skip-until-needed', check: 'Only buy when the course or exam requires it.' }
    ],
    related: [{ href: '/kits/wgu-software-engineering-desk-kit', title: 'WGU software engineering desk kit', desc: 'Study desk counterpart.' }, { href: '/kits/usb-c-desk-survival-kit', title: 'USB-C desk survival kit', desc: 'Adapters, cable, hub, charger.' }, { href: '/guides/usb-c-cable-buying-guide', title: 'USB-C cable buying guide', desc: 'Know the cable limits.' }],
    socialAngles: [{ channel: 'pinterest', title: 'College tech backpack kit', hook: 'Laptop protection, cable, adapters, storage, calculator only when needed.', utmContent: 'college_tech_backpack' }, { channel: 'tiktok', title: 'Student tech carry', hook: 'Carry less junk. Protect laptop, charge devices, keep adapters, back up files.', utmContent: 'student_tech_carry' }, { channel: 'reddit', title: 'College tech backpack list', hook: 'A practical student tech bag is mostly protection, charging, adapters, and storage.', utmContent: 'reddit_college_backpack' }],
    faqs: [{ question: 'What tech should I carry daily for college?', answer: 'Laptop protection, charger, known-good cable, one or two adapters, and storage if your classes need file transfer.' }, { question: 'Should I buy a calculator before class starts?', answer: 'Only if the syllabus or exam requirements call for it.' }]
  },
  {
    slug: 'local-ai-workstation-starter-kit',
    title: 'Local AI workstation starter kit',
    seoTitle: 'Local AI workstation starter kit: GPU, RAM, storage, cooling, and power basics | StackGeist',
    description: 'A local AI workstation starter kit for running models at home with GPU VRAM, RAM, NVMe storage, cooling, and power planning.',
    audience: 'Builders who want local LLM or image-generation experiments without buying the wrong bottleneck.',
    promise: 'Buy VRAM, RAM, storage, airflow, and power in that order.',
    summary: 'Local AI hardware bottlenecks are usually VRAM, system RAM, storage, cooling, and PSU headroom. CPU bragging comes later.',
    buyingOrder: ['Pick GPU by VRAM.', 'Add system RAM.', 'Use fast NVMe storage.', 'Plan cooling and case fit.', 'Check PSU and UPS before long jobs.'],
    items: [
      { label: 'Used RTX 3060 12GB', role: 'Budget VRAM for small local models.', href: search('used rtx 3060 12gb'), kind: 'search', tier: 'must-have', check: 'VRAM capacity matters more than card tier.' },
      { label: '64GB DDR5 RAM kit', role: 'Headroom for models, tools, and browsers.', href: search('64gb ddr5 6000 cl30'), kind: 'search', tier: 'must-have', check: 'Match motherboard support.' },
      { label: '2TB Gen4 NVMe SSD', role: 'Model weights and datasets.', href: search('2tb gen4 nvme ssd'), kind: 'search', tier: 'nice-next', check: 'Leave free space for caches.' },
      { label: 'Fractal airflow case', role: 'Keeps GPU heat under control.', href: search('fractal airflow pc case'), kind: 'search', tier: 'nice-next', check: 'Check GPU length and fan clearance.' },
      { label: 'CyberPower UPS', role: 'Protects long runs from power dips.', href: search('cyberpower ups pc workstation'), kind: 'search', tier: 'skip-until-needed', check: 'UPS sizing depends on full system load.' }
    ],
    related: [{ href: '/setups/ai-ml-workstation', title: 'AI / ML workstation', desc: 'Full build path.' }, { href: '/kits/proxmox-mini-pc-starter-kit', title: 'Proxmox mini PC starter kit', desc: 'Server-side lab path.' }, { href: '/kits/backup-recovery-desk-kit', title: 'Backup and recovery kit', desc: 'Protect models and project files.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Local AI workstation starter kit', hook: 'VRAM, RAM, NVMe, airflow, PSU. Buy the bottleneck, not the brag.', utmContent: 'local_ai_workstation' }, { channel: 'tiktok', title: 'AI PC buying order', hook: 'For local models, VRAM first. CPU flexing can wait outside.', utmContent: 'ai_pc_order' }, { channel: 'reddit', title: 'Local AI hardware order', hook: 'Most local AI builds should start with VRAM capacity, then RAM and storage.', utmContent: 'reddit_local_ai_hardware' }],
    faqs: [{ question: 'What matters most for local AI hardware?', answer: 'GPU VRAM is usually the first hard limit, followed by system RAM and storage.' }, { question: 'Is a gaming PC enough for local AI?', answer: 'Often yes for small models if it has enough VRAM, RAM, cooling, and storage.' }]
  },
  {
    slug: 'raspberry-pi-starter-kit',
    title: 'Raspberry Pi starter kit',
    seoTitle: 'Raspberry Pi starter kit: power, storage, case, cooling, and display basics | StackGeist',
    description: 'A Raspberry Pi starter kit for booting reliably with power supply, microSD, case, cooling, HDMI, and troubleshooting basics.',
    audience: 'Pi beginners building a small lab, media box, learning machine, or automation project.',
    promise: 'Most Pi problems are power, image, storage, or HDMI. Buy around those first.',
    summary: 'The first Pi kit should solve power, boot media, cooling, display cable, and storage. Accessories come after it boots reliably.',
    buyingOrder: ['Buy the correct power supply.', 'Use reliable boot media.', 'Add case and cooling.', 'Use the right HDMI cable.', 'Add storage only after the base system boots.'],
    items: [
      { label: 'CanaKit Raspberry Pi 5 Starter Kit', role: 'Bundled board, power, case, cooling, and boot media.', href: '/gear/budget-tech/canakit-raspberry-pi-5-starter-kit-pro-8gb-128gb', kind: 'internal', tier: 'must-have', check: 'Check whether the kit includes the correct PSU.' },
      { label: 'Samsung EVO Select microSD', role: 'Reliable boot and project storage.', href: '/gear/budget-tech/samsung-evo-select-512gb-microsd-card', kind: 'internal', tier: 'must-have', check: 'Use known-good media before blaming the board.' },
      { label: 'Official Pi 5 power supply', role: 'Avoids low-voltage weirdness.', href: search('raspberry pi 5 official power supply'), kind: 'search', tier: 'nice-next', check: 'Cheap chargers cause ghost problems.' },
      { label: 'Micro HDMI cable', role: 'Correct display connection for Pi boards that need it.', href: search('raspberry pi 5 micro hdmi cable'), kind: 'search', tier: 'nice-next', check: 'Use the HDMI port order recommended for first boot.' },
      { label: 'USB SSD enclosure', role: 'Faster storage for server-style Pi projects.', href: search('raspberry pi 5 usb ssd enclosure'), kind: 'search', tier: 'skip-until-needed', check: 'Boot from microSD first if you are new.' }
    ],
    related: [{ href: '/guides/raspberry-pi-5-wont-boot', title: 'Raspberry Pi 5 won’t boot', desc: 'Power, image, LED, HDMI, and boot checks.' }, { href: '/kits/linux-beginner-lab-kit', title: 'Linux beginner lab kit', desc: 'Linux practice gear.' }, { href: '/kits/help-desk-homelab-starter-kit', title: 'Help desk homelab starter kit', desc: 'Broader IT lab setup.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Raspberry Pi starter kit', hook: 'Power, microSD, case, cooling, HDMI. Most Pi failures start there.', utmContent: 'raspberry_pi_starter' }, { channel: 'tiktok', title: 'Pi setup order', hook: 'Before blaming the board: power, image, card, HDMI, attached devices.', utmContent: 'pi_setup_order' }, { channel: 'reddit', title: 'Pi beginner buying order', hook: 'A reliable Pi kit starts with power and boot media, not random hats.', utmContent: 'reddit_pi_starter' }],
    faqs: [{ question: 'Why will my Raspberry Pi not boot?', answer: 'Power supply, bad image, boot media, HDMI order, and attached USB devices are more common than a dead board.' }, { question: 'Should I buy a Pi kit or parts separately?', answer: 'A kit is easier for beginners if it includes the right power supply, case, cooling, and boot media.' }]
  },
  {
    slug: 'office-chair-fix-kit',
    title: 'Office chair fix kit',
    seoTitle: 'Office chair fix kit: cylinder, mat, casters, lumbar, and tools before replacing the chair | StackGeist',
    description: 'An office chair fix kit for gas cylinder replacement, casters, floor mat, lumbar support, cleaning, and knowing when to replace the chair.',
    audience: 'Desk workers whose chair sinks, rolls badly, squeaks, or makes every workday worse.',
    promise: 'Fix the replaceable parts before throwing away a usable chair.',
    summary: 'A sinking or annoying chair may need a cylinder, casters, mat, cleaning, or better adjustment. Replace the whole chair only when fit or frame is the issue.',
    buyingOrder: ['Identify the failure.', 'Replace cylinder if it sinks.', 'Replace casters if rolling is bad.', 'Add mat if the floor is the problem.', 'Replace the chair if fit or frame is wrong.'],
    items: [
      { label: 'Universal chair gas cylinder', role: 'Fixes chairs that slowly sink.', href: search('universal office chair gas cylinder replacement'), kind: 'search', tier: 'must-have', check: 'Measure and confirm cylinder style.' },
      { label: 'Pipe wrench or removal kit', role: 'Removes stuck cylinders.', href: search('office chair cylinder removal tool'), kind: 'search', tier: 'must-have', check: 'Protect the chair base before wrenching.' },
      { label: 'Rollerblade chair casters', role: 'Smoother rolling on hard floors.', href: search('rollerblade office chair wheels'), kind: 'search', tier: 'nice-next', check: 'Check stem size.' },
      { label: 'Floor chair mat', role: 'Protects carpet or hard floor.', href: search('office chair mat for carpet'), kind: 'search', tier: 'nice-next', check: 'Buy for the floor type.' },
      { label: 'Big and tall office chair', role: 'Replacement route when size or frame is the actual problem.', href: '/gear/budget-tech/big-tall-high-back-office-chair-400lb-capacity', kind: 'internal', tier: 'skip-until-needed', check: 'Replace when fit is wrong, not just because a part failed.' }
    ],
    related: [{ href: '/guides/office-chair-gas-cylinder-replacement', title: 'Office chair gas cylinder replacement', desc: 'How to diagnose and replace the cylinder.' }, { href: '/kits/remote-work-under-300-kit', title: 'Remote work setup under $300', desc: 'Budget work desk route.' }, { href: '/setups/work-from-home-pro', title: 'Work-from-home pro', desc: 'Full ergonomic setup.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Office chair fix kit', hook: 'Sinking chair? Cylinder, wrench, casters, mat, then replacement only if fit is wrong.', utmContent: 'office_chair_fix' }, { channel: 'tiktok', title: 'Fix a sinking chair', hook: 'The chair might need a $25 cylinder, not a $300 replacement.', utmContent: 'fix_sinking_chair' }, { channel: 'reddit', title: 'Office chair repair kit', hook: 'A sinking chair is often a cylinder problem. Check parts before replacing the whole chair.', utmContent: 'reddit_chair_fix' }],
    faqs: [{ question: 'Can a sinking office chair be fixed?', answer: 'Usually yes. A failing gas cylinder is replaceable on many standard office chairs.' }, { question: 'When should I replace the chair instead?', answer: 'Replace it when the frame, seat size, back support, or adjustment range does not fit you.' }]
  },
  {
    slug: 'printer-scanner-home-office-kit',
    title: 'Printer and scanner home office kit',
    seoTitle: 'Printer and scanner home office kit: cables, Wi-Fi, paper, scanner, and setup tools | StackGeist',
    description: 'A printer and scanner home office kit for Wi-Fi setup, USB fallback, paper, scanning, power, and the usual printer hellscape.',
    audience: 'Home office users who print rarely but still need the cursed machine to work when it matters.',
    promise: 'Give the printer fewer ways to ruin your afternoon.',
    summary: 'A good printer setup has a USB fallback cable, stable Wi-Fi, accessible power, paper storage, and scanning workflow. The printer will still be a goblin, just a managed one.',
    buyingOrder: ['Put printer near power and Wi-Fi.', 'Keep USB fallback cable.', 'Use correct paper and ink plan.', 'Set up scan destination.', 'Label support info before it breaks.'],
    items: [
      { label: 'USB printer cable', role: 'Fallback when wireless setup fails.', href: search('usb printer cable 10 ft'), kind: 'search', tier: 'must-have', check: 'Match USB-B printer port.' },
      { label: 'Flat plug surge protector', role: 'Reachable power without bulky wall fights.', href: '/gear/budget-tech/flat-plug-surge-protector-power-strip-8-outlets-usb', kind: 'internal', tier: 'must-have', check: 'Printer draw can be higher during startup.' },
      { label: 'Paper tray or file box', role: 'Keeps paper dry and flat.', href: search('printer paper storage box'), kind: 'search', tier: 'nice-next', check: 'Moist paper causes jams.' },
      { label: 'USB flash drive', role: 'Scan transfer and driver installers.', href: '/gear/budget-tech/sandisk-ultra-flair-128gb-usb-3-0-flash-drive', kind: 'internal', tier: 'nice-next', check: 'Do not keep sensitive scans loose forever.' },
      { label: 'Cheap document scanner', role: 'Useful if scanning matters more than printing.', href: search('portable document scanner duplex'), kind: 'search', tier: 'skip-until-needed', check: 'Skip if phone scanning is enough.' }
    ],
    related: [{ href: '/kits/remote-work-under-300-kit', title: 'Remote work setup under $300', desc: 'Home office essentials.' }, { href: '/guides/extension-cord-safety-guide', title: 'Extension cord safety guide', desc: 'Power safety for desk equipment.' }, { href: '/kits/backup-recovery-desk-kit', title: 'Backup and recovery kit', desc: 'Handle scanned files safely.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Printer and scanner kit', hook: 'USB fallback cable, stable power, paper storage, scan workflow. Printer goblin contained.', utmContent: 'printer_scanner_kit' }, { channel: 'tiktok', title: 'Printer survival kit', hook: 'Keep the USB cable. Wireless printers betray everyone eventually.', utmContent: 'printer_survival' }, { channel: 'reddit', title: 'Home printer setup kit', hook: 'A USB fallback cable and clean power solve more printer emergencies than reinstalling drivers first.', utmContent: 'reddit_printer_kit' }],
    faqs: [{ question: 'Do I still need a USB printer cable?', answer: 'Yes. It is the cheap fallback when Wi-Fi setup fails at the worst possible time.' }, { question: 'Should I buy a scanner?', answer: 'Only if you scan often or need duplex document handling. Phone scanning is enough for occasional use.' }]
  },
  {
    slug: 'small-bedroom-gaming-kit',
    title: 'Small bedroom gaming kit',
    seoTitle: 'Small bedroom gaming kit: compact desk, monitor, lighting, audio, and storage | StackGeist',
    description: 'A small bedroom gaming kit for compact desks, single monitors, headset audio, lighting, controller storage, and cable cleanup.',
    audience: 'Gamers fitting a real setup into a bedroom without losing the walkway.',
    promise: 'Protect floor space first. RGB can wait its damn turn.',
    summary: 'A small room usually needs a compact desk, single good monitor, headset, clamp light or bias light, vertical storage, and disciplined cable routing.',
    buyingOrder: ['Measure walking path and door swing.', 'Pick compact desk depth.', 'Use one good monitor.', 'Use headset audio.', 'Add lighting and storage only where clutter appears.'],
    items: [
      { label: 'Compact 48 inch desk', role: 'Enough surface without stealing the room.', href: search('48 inch compact computer desk'), kind: 'search', tier: 'must-have', check: 'Depth matters more than width in small rooms.' },
      { label: 'Single monitor arm', role: 'Reclaims desk depth.', href: search('single monitor arm clamp'), kind: 'search', tier: 'must-have', check: 'Check VESA and desk clamp thickness.' },
      { label: 'Closed-back gaming headset', role: 'Keeps sound contained in shared walls.', href: search('closed back gaming headset'), kind: 'search', tier: 'nice-next', check: 'Comfort beats driver size.' },
      { label: 'Luminoodle bias light', role: 'Ambient light without adding a lamp base.', href: '/gear/desk-lighting/luminoodle', kind: 'internal', tier: 'nice-next', check: 'Bias light is not room lighting.' },
      { label: 'Razer Base Station V2 Chroma', role: 'Headset stand and USB hub if it earns desk space.', href: '/gear/accessories/razer-base-station-v2-chroma', kind: 'internal', tier: 'skip-until-needed', check: 'Skip if the desk is already crowded.' }
    ],
    related: [{ href: '/setups/small-bedroom-gaming', title: 'Small bedroom gaming setup', desc: 'Full small-room gaming route.' }, { href: '/kits/cable-management-starter-kit', title: 'Cable management starter kit', desc: 'Keep the tiny setup sane.' }, { href: '/guides/desk-layout-basics', title: 'Desk layout basics', desc: 'Room-first planning.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Small bedroom gaming kit', hook: 'Compact desk, one monitor, headset, bias light, vertical storage. Keep the walkway.', utmContent: 'small_bedroom_gaming' }, { channel: 'tiktok', title: 'Small room setup order', hook: 'Measure the walkway before buying a giant desk. Revolutionary stuff, apparently.', utmContent: 'small_room_setup_order' }, { channel: 'reddit', title: 'Small bedroom gaming gear', hook: 'A small gaming room works best with one strong monitor and strict cable/storage discipline.', utmContent: 'reddit_small_bedroom_gaming' }],
    faqs: [{ question: 'What desk size works in a small bedroom?', answer: 'A 48 inch wide desk with modest depth often works better than a huge surface that kills chair movement.' }, { question: 'Should I use dual monitors in a small room?', answer: 'Usually no. One good monitor on an arm keeps the setup usable without crowding the room.' }]
  },
  {
    slug: 'travel-tech-minimal-kit',
    title: 'Travel tech minimal kit',
    seoTitle: 'Travel tech minimal kit: charger, cable, adapter, storage, and laptop bag basics | StackGeist',
    description: 'A travel tech minimal kit for laptop users who need one charger, one cable, adapters, storage, cleaning cloths, and a protected bag.',
    audience: 'People who travel with a laptop and want fewer forgotten-cable disasters.',
    promise: 'Pack the boring gear once so travel days stop being side quests.',
    summary: 'The minimal kit is one charger, one known-good cable, a tiny adapter pair, removable storage, cloths, and a bag that actually fits the laptop.',
    buyingOrder: ['Pick one charger for the laptop.', 'Pack one known-good cable.', 'Add tiny adapters.', 'Add storage only if needed.', 'Protect the laptop and screen.'],
    items: [
      { label: '100W USB-C GaN charger', role: 'One travel charger for laptop and small devices.', href: search('100w usb c gan charger travel'), kind: 'search', tier: 'must-have', check: 'Check laptop wattage needs.' },
      { label: 'INIU 240W USB-C cable', role: 'Known-good travel charging cable.', href: '/gear/budget-tech/iniu-usb-c-to-usb-c-cable-240w-6-6ft', kind: 'internal', tier: 'must-have', check: 'Cable rating must match charger role.' },
      { label: 'USB-C to USB-A adapter', role: 'Tiny fallback for older accessories.', href: '/gear/budget-tech/usb-c-to-usb-a-adapter-2-pack', kind: 'internal', tier: 'nice-next', check: 'Keep one in the bag permanently.' },
      { label: 'KROSER laptop briefcase', role: 'Laptop protection and accessory organization.', href: '/gear/budget-tech/kroser-laptop-briefcase-up-to-17-3', kind: 'internal', tier: 'nice-next', check: 'Confirm laptop dimensions.' },
      { label: 'Microfiber cloths', role: 'Screens and glasses during travel.', href: '/gear/budget-tech/microfiber-cleaning-cloths-18-pack', kind: 'internal', tier: 'skip-until-needed', check: 'Keep one clean cloth sealed.' }
    ],
    related: [{ href: '/kits/college-tech-backpack-kit', title: 'College tech backpack kit', desc: 'Student carry route.' }, { href: '/kits/usb-c-desk-survival-kit', title: 'USB-C desk survival kit', desc: 'Adapters and USB-C basics.' }, { href: '/gear/budget-tech/kroser-laptop-briefcase-up-to-17-3', title: 'KROSER laptop briefcase', desc: 'Laptop bag fit notes.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Travel tech minimal kit', hook: 'One charger, one cable, tiny adapters, storage, cloth, laptop bag. Done.', utmContent: 'travel_tech_minimal' }, { channel: 'tiktok', title: 'Travel tech pack', hook: 'Stop packing the junk drawer. Charger, cable, adapters, storage, cloth.', utmContent: 'travel_tech_pack' }, { channel: 'reddit', title: 'Minimal laptop travel kit', hook: 'A permanent cable and adapter pouch prevents most travel tech annoyances.', utmContent: 'reddit_travel_tech' }],
    faqs: [{ question: 'What charger should I travel with?', answer: 'One charger that meets the laptop wattage and has enough ports for your real devices.' }, { question: 'How many cables should I pack?', answer: 'Pack one known-good primary cable and only add extras for devices that truly need different connectors.' }]
  },
  {
    slug: 'phone-tablet-desk-kit',
    title: 'Phone and tablet desk kit',
    seoTitle: 'Phone and tablet desk kit: stands, charger, cable, cleaning, and second-screen basics | StackGeist',
    description: 'A phone and tablet desk kit for charging, stands, second-screen use, cleaning, notes, video calls, and keeping devices reachable.',
    audience: 'People using a phone or tablet as a desk companion, camera, second screen, or study device.',
    promise: 'Make the small screens useful instead of letting them become desk clutter.',
    summary: 'The useful kit is a stable stand, charger, known-good cable, cloth, and adapter only if the tablet becomes a real second-screen tool.',
    buyingOrder: ['Set a stable viewing angle.', 'Route charging cleanly.', 'Clean screen and camera glass.', 'Add adapter only for real second-screen use.', 'Skip mounts that block the main desk work.'],
    items: [
      { label: 'Adjustable desk phone stand', role: 'Keeps phone visible and reachable.', href: '/gear/budget-tech/adjustable-desk-phone-stand', kind: 'internal', tier: 'must-have', check: 'Check stability with your phone case.' },
      { label: 'Adjustable aluminum tablet stand', role: 'Turns a tablet into a reference or second screen.', href: '/gear/budget-tech/adjustable-aluminum-tablet-stand', kind: 'internal', tier: 'must-have', check: 'Hinge strength matters.' },
      { label: 'INIU 240W USB-C cable', role: 'Charging path for tablets and USB-C phones.', href: '/gear/budget-tech/iniu-usb-c-to-usb-c-cable-240w-6-6ft', kind: 'internal', tier: 'nice-next', check: 'Longer is not always cleaner.' },
      { label: '500W GaN charging station', role: 'Central charging for several devices.', href: '/gear/budget-tech/500w-multi-port-gan-charging-station', kind: 'internal', tier: 'nice-next', check: 'Check per-port sharing.' },
      { label: 'Microfiber cleaning cloths', role: 'Clean screen and camera glass.', href: '/gear/budget-tech/microfiber-cleaning-cloths-18-pack', kind: 'internal', tier: 'skip-until-needed', check: 'Do not use paper towels on screens.' }
    ],
    related: [{ href: '/kits/usb-c-desk-survival-kit', title: 'USB-C desk survival kit', desc: 'Cable, hub, charger, adapters.' }, { href: '/kits/wgu-software-engineering-desk-kit', title: 'WGU desk kit', desc: 'Study desk route.' }, { href: '/guides/desk-layout-basics', title: 'Desk layout basics', desc: 'Placement before accessories.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Phone and tablet desk kit', hook: 'Stand, charger, cable, cleaning cloth, adapter only if it earns the space.', utmContent: 'phone_tablet_desk' }, { channel: 'tiktok', title: 'Tablet desk setup', hook: 'A tablet is useful when it has a real angle, charge path, and job.', utmContent: 'tablet_desk_setup' }, { channel: 'reddit', title: 'Phone tablet desk kit', hook: 'Small screens become useful when they are stable, charged, and assigned a real role.', utmContent: 'reddit_phone_tablet_desk' }],
    faqs: [{ question: 'Is a tablet useful as a second screen?', answer: 'Yes if it has a stable stand, good viewing angle, and a specific job like notes, docs, chat, or monitoring.' }, { question: 'What phone stand should I buy?', answer: 'Buy for stability, angle adjustment, and case compatibility before looks.' }]
  },
  {
    slug: 'desk-power-safety-kit',
    title: 'Desk power safety kit',
    seoTitle: 'Desk power safety kit: surge protector, extension cord, charger, UPS, and cable safety | StackGeist',
    description: 'A desk power safety kit for surge protectors, extension cords, chargers, UPS use, power strips, and avoiding unsafe cable stacks.',
    audience: 'Anyone whose desk power setup involves too many bricks, strips, and suspicious warmth.',
    promise: 'If power gets hot, smells weird, or clicks repeatedly, stop treating it as background ambiance.',
    summary: 'Desk power starts with a safe strip, correct cord rating, charger headroom, clean routing, and a UPS only when uptime or storage matters.',
    buyingOrder: ['Remove daisy chains.', 'Use one rated surge strip.', 'Match cord rating to load.', 'Consolidate chargers carefully.', 'Add UPS for network, NAS, or desktop uptime.'],
    items: [
      { label: 'Flat plug surge protector', role: 'Cleaner desk power and bulky-brick spacing.', href: '/gear/budget-tech/flat-plug-surge-protector-power-strip-8-outlets-usb', kind: 'internal', tier: 'must-have', check: 'Never daisy-chain power strips.' },
      { label: '15 ft indoor extension cord', role: 'Outlet reach when used within rating.', href: '/gear/budget-tech/15ft-indoor-extension-cord-16-3-flat-black', kind: 'internal', tier: 'must-have', check: 'Do not run high-load devices on underrated cords.' },
      { label: 'Anker 525 charging strip', role: 'Cleaner charging for laptop and small devices.', href: '/gear/desk-power/anker-525', kind: 'internal', tier: 'nice-next', check: 'Check shared output limits.' },
      { label: '500W GaN charging station', role: 'Central charger for multiple devices.', href: '/gear/budget-tech/500w-multi-port-gan-charging-station', kind: 'internal', tier: 'nice-next', check: 'Per-port output matters.' },
      { label: 'CyberPower UPS', role: 'Backup power for network and storage.', href: search('cyberpower cp1500pfclcd ups'), kind: 'search', tier: 'skip-until-needed', check: 'Size by actual load.' }
    ],
    related: [{ href: '/guides/extension-cord-safety-guide', title: 'Extension cord safety guide', desc: 'Load and rating basics.' }, { href: '/guides/extension-cord-getting-hot', title: 'Extension cord getting hot', desc: 'When to unplug immediately.' }, { href: '/guides/surge-protector-clicking', title: 'Surge protector clicking', desc: 'Clicking and cycling triage.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Desk power safety kit', hook: 'One rated strip, correct cord, charger headroom, UPS when it matters. No daisy-chain garbage.', utmContent: 'desk_power_safety' }, { channel: 'tiktok', title: 'Desk power red flags', hook: 'Hot cord, clicking strip, daisy chain, mystery brick pile. Fix that first.', utmContent: 'desk_power_red_flags' }, { channel: 'reddit', title: 'Desk power safety order', hook: 'Clean power routing matters more than cable aesthetics when cords get warm or strips click.', utmContent: 'reddit_power_safety' }],
    faqs: [{ question: 'Can I plug a power strip into another power strip?', answer: 'No. Do not daisy-chain power strips. Use a properly rated strip and reduce the load.' }, { question: 'When do I need a UPS?', answer: 'Use a UPS when a power dip would corrupt storage, knock out network gear, or interrupt important desktop work.' }]
  },
  {
    slug: 'webcam-not-detected-fix-kit',
    title: 'Webcam not detected fix kit',
    seoTitle: 'Webcam not detected fix kit: USB cable, hub, privacy, light, and camera replacement | StackGeist',
    description: 'A webcam not detected fix kit for USB ports, hubs, privacy settings, cables, lighting, and knowing when to replace the camera.',
    audience: 'People whose webcam disappears before meetings, interviews, or school sessions.',
    promise: 'Check the boring layers before buying another webcam.',
    summary: 'Webcam failures are often port, hub, permission, cable, app, or privacy-state problems. Replacement comes after those checks.',
    buyingOrder: ['Test direct USB connection.', 'Check OS privacy permissions.', 'Swap cable or port.', 'Remove hub from the path.', 'Replace camera only after the path is clean.'],
    items: [
      { label: 'Logitech C920x webcam', role: 'Reliable replacement when the old camera is actually the problem.', href: '/gear/budget-tech/logitech-c920x-hd-webcam', kind: 'internal', tier: 'must-have', check: 'Fix permissions and ports first.' },
      { label: 'Logitech Brio 500', role: 'Better framing and privacy shutter for frequent calls.', href: '/gear/video/logitech-brio-500', kind: 'internal', tier: 'nice-next', check: 'Lighting still matters.' },
      { label: 'Powered USB hub', role: 'Stable USB path for camera plus accessories.', href: search('powered usb 3 hub webcam'), kind: 'search', tier: 'nice-next', check: 'Test direct connection before adding a hub.' },
      { label: 'Clamp-on LED desk lamp', role: 'Improves video once detection is solved.', href: '/gear/budget-tech/clamp-on-led-desk-lamp', kind: 'internal', tier: 'skip-until-needed', check: 'Do not buy lighting to fix a detection problem.' },
      { label: 'USB-C to USB-A adapter', role: 'Port compatibility for older webcams.', href: '/gear/budget-tech/usb-c-to-usb-a-adapter-2-pack', kind: 'internal', tier: 'must-have', check: 'Use a stable adapter, not a loose dongle stack.' }
    ],
    related: [{ href: '/guides/logitech-brio-not-detected-windows-11', title: 'Logitech Brio not detected', desc: 'Windows webcam troubleshooting.' }, { href: '/guides/better-video-calls', title: 'Better video calls', desc: 'After detection, improve the call.' }, { href: '/kits/budget-video-call-kit', title: 'Budget video call kit', desc: 'Full call setup kit.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Webcam not detected fix kit', hook: 'Port, permission, cable, hub, app, then camera. Replacement is not step one.', utmContent: 'webcam_not_detected_kit' }, { channel: 'tiktok', title: 'Webcam disappeared?', hook: 'Before buying: privacy settings, direct USB, different port, remove hub.', utmContent: 'webcam_disappeared' }, { channel: 'reddit', title: 'Webcam detection checklist', hook: 'Most webcam detection issues are USB path or permission problems before hardware failure.', utmContent: 'reddit_webcam_fix' }],
    faqs: [{ question: 'Why is my webcam not detected?', answer: 'Common causes include privacy permissions, bad USB paths, hubs, cables, app selection, and driver state.' }, { question: 'Should I replace the webcam first?', answer: 'No. Test direct connection, permissions, another port, and another app first.' }]
  },
  {
    slug: 'bluetooth-desk-fix-kit',
    title: 'Bluetooth desk fix kit',
    seoTitle: 'Bluetooth desk fix kit: keyboard, mouse, headphones, receiver, and pairing fixes | StackGeist',
    description: 'A Bluetooth desk fix kit for keyboards, mice, headphones, receivers, adapters, pairing resets, and wireless desk troubleshooting.',
    audience: 'People whose wireless desk gear randomly disconnects like it has commitment issues.',
    promise: 'Separate pairing problems from radio problems before replacing everything.',
    summary: 'Bluetooth desk issues usually come from stale pairings, wrong mode, receiver placement, battery, interference, or device limits.',
    buyingOrder: ['Charge or replace battery.', 'Forget and re-pair cleanly.', 'Check device mode and profile keys.', 'Move receiver or adapter closer.', 'Replace only the failing device.'],
    items: [
      { label: 'Keychron V6 Max', role: 'Wireless mechanical keyboard route when full-size earns the width.', href: '/gear/input/keychron-v6-max', kind: 'internal', tier: 'nice-next', check: 'Check mode switch and profile keys first.' },
      { label: 'Logitech MX Master 3S', role: 'Workflow mouse with Bluetooth and receiver options.', href: '/gear/input/logitech-mx-master-3s', kind: 'internal', tier: 'nice-next', check: 'Receiver placement can matter.' },
      { label: 'Sennheiser Momentum 4', role: 'Bluetooth headphones for focus and calls.', href: '/gear/budget-tech/sennheiser-momentum-4-wireless-noise-cancelling-headphones', kind: 'internal', tier: 'nice-next', check: 'Multipoint can connect to the wrong device.' },
      { label: 'USB Bluetooth adapter', role: 'Fallback when built-in Bluetooth is weak.', href: search('usb bluetooth 5.3 adapter windows 11'), kind: 'search', tier: 'must-have', check: 'Driver support matters.' },
      { label: 'USB extension cable', role: 'Moves receiver away from RF noise.', href: search('usb extension cable receiver'), kind: 'search', tier: 'skip-until-needed', check: 'Useful for 2.4 GHz receivers near desktops.' }
    ],
    related: [{ href: '/guides/keychron-v6-max-bluetooth-not-connecting', title: 'Keychron Bluetooth not connecting', desc: 'Mode and pairing checks.' }, { href: '/guides/sennheiser-momentum-4-wont-pair', title: 'Momentum 4 not pairing', desc: 'Bluetooth headphone triage.' }, { href: '/guides/mx-master-3s-scroll-wheel-not-working', title: 'MX Master 3S scroll wheel', desc: 'Mouse troubleshooting.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Bluetooth desk fix kit', hook: 'Battery, clean pairing, mode switch, receiver placement, adapter. Then replace gear.', utmContent: 'bluetooth_desk_fix' }, { channel: 'tiktok', title: 'Bluetooth desk chaos', hook: 'Forget device, reset pairing, check mode, move receiver. Bluetooth is annoying, not magical.', utmContent: 'bluetooth_chaos' }, { channel: 'reddit', title: 'Bluetooth desk troubleshooting', hook: 'Stale pairings and receiver placement cause a lot of wireless desk problems.', utmContent: 'reddit_bluetooth_desk' }],
    faqs: [{ question: 'Why does Bluetooth keep reconnecting to the wrong device?', answer: 'Multipoint devices and stale pairings often grab the last known host. Forget the device on both sides and pair cleanly.' }, { question: 'Is a USB Bluetooth adapter worth it?', answer: 'It can be if built-in Bluetooth is weak or buried behind a metal desktop case.' }]
  },
  {
    slug: 'micro-sd-storage-kit',
    title: 'microSD storage kit',
    seoTitle: 'microSD storage kit: cards, readers, adapters, backups, and troubleshooting | StackGeist',
    description: 'A microSD storage kit for handhelds, cameras, Raspberry Pi, phones, readers, adapters, backups, and detection problems.',
    audience: 'People using microSD cards in handhelds, cameras, Pi boards, phones, and small devices.',
    promise: 'Treat tiny storage like real storage before it eats your files.',
    summary: 'A good microSD kit includes a reliable card, reader, adapter, backup target, and a no-format-first troubleshooting rule.',
    buyingOrder: ['Buy the card for the device role.', 'Use a known-good reader.', 'Back up important files.', 'Label cards by use.', 'Replace cards that show repeated errors.'],
    items: [
      { label: 'Samsung EVO Select 512GB', role: 'General microSD storage for handhelds and devices.', href: '/gear/budget-tech/samsung-evo-select-512gb-microsd-card', kind: 'internal', tier: 'must-have', check: 'Match capacity and speed to device support.' },
      { label: 'SanDisk Ultra 128GB two-pack', role: 'Spare cards for cameras, Pi, and transfers.', href: '/gear/budget-tech/sandisk-ultra-128gb-microsd-card-2-pack', kind: 'internal', tier: 'must-have', check: 'Two labeled cards beat one mystery card.' },
      { label: 'USB-C card reader', role: 'Known-good reader for laptops and phones.', href: search('usb c microsd card reader'), kind: 'search', tier: 'nice-next', check: 'Reader failure can mimic card failure.' },
      { label: 'WD Elements portable drive', role: 'Backup target for card contents.', href: '/gear/budget-tech/wd-elements-portable-external-hard-drive', kind: 'internal', tier: 'nice-next', check: 'Do not keep the only copy on microSD.' },
      { label: 'Card case and labels', role: 'Prevents mystery cards and bent adapters.', href: search('microsd card case labels'), kind: 'search', tier: 'skip-until-needed', check: 'Useful when you own more than two cards.' }
    ],
    related: [{ href: '/guides/microsd-card-not-detected', title: 'microSD card not detected', desc: 'Reader, device, and data-safety triage.' }, { href: '/kits/steam-deck-dock-kit', title: 'Steam Deck dock kit', desc: 'Handheld storage context.' }, { href: '/kits/raspberry-pi-starter-kit', title: 'Raspberry Pi starter kit', desc: 'Pi boot media context.' }],
    socialAngles: [{ channel: 'pinterest', title: 'microSD storage kit', hook: 'Card, reader, backup, labels. Tiny storage still loses real files.', utmContent: 'microsd_storage_kit' }, { channel: 'tiktok', title: 'microSD not detected?', hook: 'Reader, adapter, device, backup status, then format only if data does not matter.', utmContent: 'microsd_not_detected' }, { channel: 'reddit', title: 'microSD storage checklist', hook: 'A known-good reader and backup target prevent a lot of card panic.', utmContent: 'reddit_microsd_storage' }],
    faqs: [{ question: 'What microSD card should I buy?', answer: 'Buy for the device role: handheld storage, camera recording, Pi boot media, or simple file transfer all stress cards differently.' }, { question: 'Should I format a card that is not detected?', answer: 'Only if the data is disposable. Try another reader, adapter, port, and device first.' }]
  },
  {
    slug: 'student-video-interview-kit',
    title: 'Student video interview kit',
    seoTitle: 'Student video interview kit: webcam, lighting, mic, background, and desk setup | StackGeist',
    description: 'A student video interview kit for webcam placement, lighting, microphone, background, power, and small desk fixes before interviews.',
    audience: 'Students and job seekers who need cleaner remote interviews from a home desk.',
    promise: 'Look prepared without buying a studio.',
    summary: 'Interview setup is camera height, face light, clear audio, stable power, clean background, and notes within reach. The webcam is one piece.',
    buyingOrder: ['Raise camera.', 'Light face.', 'Move mic close.', 'Clean background.', 'Stabilize power and notes.'],
    items: [
      { label: 'Logitech C920x webcam', role: 'Reliable external camera.', href: '/gear/budget-tech/logitech-c920x-hd-webcam', kind: 'internal', tier: 'must-have', check: 'Eye-level beats laptop chin-cam.' },
      { label: 'Clamp-on LED desk lamp', role: 'Front light for a clear face.', href: '/gear/budget-tech/clamp-on-led-desk-lamp', kind: 'internal', tier: 'must-have', check: 'Avoid backlighting.' },
      { label: 'USB headset or mic', role: 'Cleaner voice than distant laptop audio.', href: search('usb headset with microphone for meetings'), kind: 'search', tier: 'nice-next', check: 'Mic position matters.' },
      { label: 'Adjustable phone stand', role: 'Keeps notes or backup device visible.', href: '/gear/budget-tech/adjustable-desk-phone-stand', kind: 'internal', tier: 'nice-next', check: 'Do not stare down at notes constantly.' },
      { label: 'Flat plug surge protector', role: 'Stable power for laptop, light, and camera.', href: '/gear/budget-tech/flat-plug-surge-protector-power-strip-8-outlets-usb', kind: 'internal', tier: 'skip-until-needed', check: 'Charge laptop before the call.' }
    ],
    related: [{ href: '/kits/budget-video-call-kit', title: 'Budget video call kit', desc: 'Full call setup kit.' }, { href: '/guides/better-video-calls', title: 'Better video calls', desc: 'Angle, light, mic, and background.' }, { href: '/kits/wgu-software-engineering-desk-kit', title: 'WGU desk kit', desc: 'Study and interview desk route.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Student video interview kit', hook: 'Camera high, face lit, mic close, background clean, power stable.', utmContent: 'student_video_interview' }, { channel: 'tiktok', title: 'Interview call setup', hook: 'Fix the chin-cam. Raise camera, light face, use close audio.', utmContent: 'interview_call_setup' }, { channel: 'reddit', title: 'Remote interview setup', hook: 'Students can look prepared with camera height, lighting, and audio before buying expensive gear.', utmContent: 'reddit_video_interview' }],
    faqs: [{ question: 'What matters most for remote interviews?', answer: 'Camera height, face lighting, clear audio, and a clean background matter more than buying an expensive webcam.' }, { question: 'Can I use a laptop webcam?', answer: 'Yes if it is raised to eye level and well-lit. An external webcam helps when the laptop camera is especially bad.' }]
  },
  {
    slug: 'desk-cleaning-maintenance-kit',
    title: 'Desk cleaning and maintenance kit',
    seoTitle: 'Desk cleaning and maintenance kit: cloths, tools, cable checks, and device care | StackGeist',
    description: 'A desk cleaning and maintenance kit for screens, lenses, keyboards, cables, small tools, and keeping gear useful longer.',
    audience: 'People whose desk gear works but slowly gets filthy, loose, dusty, and annoying.',
    promise: 'Maintenance is cheaper than replacing gear because grime won.',
    summary: 'A maintenance kit needs microfiber cloths, air or brush cleaning, tiny tools, cable checks, labels, and a monthly pass over the desk.',
    buyingOrder: ['Clean screens and lenses.', 'Clear keyboard and fan dust.', 'Check cables and power strips.', 'Tighten mounts and stands.', 'Replace worn parts before they fail mid-work.'],
    items: [
      { label: 'Microfiber cleaning cloths', role: 'Screens, glasses, lenses, handhelds.', href: '/gear/budget-tech/microfiber-cleaning-cloths-18-pack', kind: 'internal', tier: 'must-have', check: 'Keep separate clean and dirty cloths.' },
      { label: 'Electronics cleaning brush kit', role: 'Keyboard, vents, ports, and dust cleanup.', href: search('electronics cleaning brush kit keyboard'), kind: 'search', tier: 'must-have', check: 'Do not shove metal tools into ports.' },
      { label: 'Precision screwdriver kit', role: 'Tighten mounts, open small devices, and replace parts.', href: '/gear/budget-tech/140-in-1-precision-screwdriver-repair-kit', kind: 'internal', tier: 'nice-next', check: 'Use the exact bit.' },
      { label: 'Velcro ties and labels', role: 'Cable inspection and rerouting.', href: search('velcro cable ties labels'), kind: 'search', tier: 'nice-next', check: 'Label power bricks before moving them.' },
      { label: 'Replacement chair casters', role: 'Fix rough rolling before the floor loses.', href: search('office chair replacement casters'), kind: 'search', tier: 'skip-until-needed', check: 'Check stem size.' }
    ],
    related: [{ href: '/kits/cable-management-starter-kit', title: 'Cable management starter kit', desc: 'Cable routing and cleanup.' }, { href: '/kits/office-chair-fix-kit', title: 'Office chair fix kit', desc: 'Chair parts and repair route.' }, { href: '/kits/cheap-desk-upgrades-under-100', title: 'Cheap desk upgrades under $100', desc: 'Useful cheap fixes.' }],
    socialAngles: [{ channel: 'pinterest', title: 'Desk cleaning and maintenance kit', hook: 'Cloths, brush, screwdriver, cable ties, labels. Maintenance beats replacement.', utmContent: 'desk_maintenance_kit' }, { channel: 'tiktok', title: 'Clean your desk gear', hook: 'Your gear might not be dying. It might just be filthy and loose.', utmContent: 'clean_desk_gear' }, { channel: 'reddit', title: 'Desk maintenance kit', hook: 'A monthly cleaning and cable check keeps cheap desk problems from becoming replacements.', utmContent: 'reddit_desk_maintenance' }],
    faqs: [{ question: 'What should I use to clean screens?', answer: 'Use clean microfiber cloths and screen-safe cleaner when needed. Avoid paper towels and harsh chemicals.' }, { question: 'How often should I maintain desk gear?', answer: 'A quick monthly pass over screens, keyboard, cables, mounts, and power is enough for most setups.' }]
  }

];

export const INCOME_KITS: IncomeKit[] = [...BASE_INCOME_KITS, ...EXTRA_KITS];

export const INCOME_KIT_MAP = new Map(INCOME_KITS.map((kit) => [kit.slug, kit]));
