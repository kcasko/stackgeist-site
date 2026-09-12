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
};

export const INCOME_KITS: IncomeKit[] = [
  {
    slug: 'help-desk-homelab-starter-kit',
    title: 'Help desk homelab starter kit',
    seoTitle: 'Help desk homelab starter kit: practical gear for entry-level IT practice | StackGeist',
    description: 'A practical help desk homelab starter kit for learning Windows support, Linux basics, networking, storage, backups, and remote troubleshooting without buying random gear.',
    audience: 'Entry-level IT, WGU, Net+, and cloud-support learners who need hands-on practice at home.',
    promise: 'Build a small lab that teaches support skills instead of collecting noisy hardware trophies.',
    summary: 'Start with a stable desk, one mini PC or spare machine, removable storage, a USB-C hub, a small switch, and backup power only when the lab stores anything important.',
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
];

export const INCOME_KIT_MAP = new Map(INCOME_KITS.map((kit) => [kit.slug, kit]));
