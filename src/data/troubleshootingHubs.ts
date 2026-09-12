export type HubGuide = {
  slug: string;
  title: string;
  kicker: string;
  desc: string;
  problem: string;
};

export type TroubleshootingHub = {
  slug: string;
  kicker: string;
  title: string;
  seoTitle: string;
  description: string;
  lead: string;
  primaryProblem: string;
  quickChecks: string[];
  guides: HubGuide[];
  related: { href: string; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
};

export const troubleshootingHubs: TroubleshootingHub[] = [
  {
    slug: 'usb-c-charging-display-problems',
    kicker: 'USB-C troubleshooting hub',
    title: 'USB-C charging and display problems',
    seoTitle: 'USB-C charging and display problems: docks, cables, chargers, and portable monitors | StackGeist',
    description: 'Fix common USB-C charging and display problems: docks that only show one monitor, slow cables, GaN charger wattage limits, and portable monitors with no signal.',
    lead: 'USB-C is one connector hiding a dozen different capabilities. Before you return a dock, cable, charger, or portable monitor, run the boring compatibility checks first.',
    primaryProblem: 'Most USB-C failures are not dead hardware. They are port capability, cable rating, DisplayPort Alt Mode, USB Power Delivery negotiation, or shared wattage limits doing exactly what the tiny print said they would do.',
    quickChecks: [
      'Confirm the exact laptop port supports video, USB4, Thunderbolt, or the wattage you expect.',
      'Swap in a known full-featured USB-C, USB4, or Thunderbolt cable before changing the dock or charger.',
      'Test one device at a time so a multi-port charger or hub is not silently splitting bandwidth or wattage.',
      'Check OS display settings, firmware, and vendor utilities after the physical path is verified.',
    ],
    guides: [
      {
        slug: 'usb-c-dock-only-one-monitor',
        kicker: 'Display troubleshooting',
        title: 'USB-C dock only detecting one monitor',
        desc: 'Diagnose host port limits, MST vs DisplayLink vs Thunderbolt, and cables before returning a working dock.',
        problem: 'One monitor works, the second never appears.',
      },
      {
        slug: 'usb-c-cable-charging-slow',
        kicker: 'Cable troubleshooting',
        title: 'Why your USB-C cable is charging slow',
        desc: 'Isolate cable rating, charger per-port output, and device ceiling before replacing anything.',
        problem: 'The charger is fast on paper but slow in real life.',
      },
      {
        slug: 'gan-charger-not-charging-laptop-full-speed',
        kicker: 'Power troubleshooting',
        title: 'GaN charger not charging laptop full speed',
        desc: 'PDO negotiation, multi-port wattage sharing, and proprietary charging quirks explained.',
        problem: 'A 100W charger behaves like a much smaller brick.',
      },
      {
        slug: 'portable-usb-c-monitor-no-signal',
        kicker: 'Display troubleshooting',
        title: 'Portable USB-C monitor showing no signal',
        desc: 'The host port is usually why. DisplayPort Alt Mode, cables, and hub passthrough checks.',
        problem: 'The portable display powers on but says no signal.',
      },
    ],
    related: [
      { href: '/guides/usb-c-dock-compatibility', title: 'USB-C dock compatibility', desc: 'Buying-side checks for host ports, displays, power, bandwidth, and cable limits.' },
      { href: '/guides/usb-c-cable-buying-guide', title: 'USB-C cable buying guide', desc: 'Wattage, data speed, Thunderbolt, USB4, and how to stop guessing from connector shape.' },
      { href: '/guides/laptop-charger-wattage', title: 'Laptop charger wattage', desc: 'How many watts your laptop actually needs and when lower wattage is safe.' },
    ],
    faqs: [
      {
        question: 'Why do USB-C problems happen even when everything plugs in?',
        answer: 'USB-C is a connector, not a guarantee of video, charging wattage, data speed, or Thunderbolt support. Two devices can physically connect while missing the protocol needed for the job.',
      },
      {
        question: 'Should I replace the dock, cable, or charger first?',
        answer: 'Replace nothing first. Test with the known-good cable that shipped with the device, confirm the laptop port capability, and isolate one device at a time. Cables and port limits cause more failures than dead docks.',
      },
    ],
  },
  {
    slug: 'desk-power-safety-problems',
    kicker: 'Desk power safety hub',
    title: 'Desk power safety problems',
    seoTitle: 'Desk power safety problems: hot extension cords, clicking surge protectors, and charger wattage | StackGeist',
    description: 'Troubleshoot desk power problems before they become expensive or unsafe: hot extension cords, clicking surge protectors, GaN charger wattage splits, and laptop charger sizing.',
    lead: 'A desk setup can quietly become a mess of chargers, hubs, lamps, power strips, and extension cords. When something gets hot or starts clicking, stop treating it like background noise.',
    primaryProblem: 'Power problems need a lower tolerance for nonsense than a Bluetooth mouse. Heat, clicking, buzzing, and overloaded cords are signals to reduce load and inspect the chain.',
    quickChecks: [
      'Unplug high-draw devices first: heaters, printers, large chargers, speakers, and anything with a motor.',
      'Check the cord gauge and amp rating against the actual devices plugged into it.',
      'Avoid coiled extension cords under load because heat has nowhere useful to go.',
      'Replace any power strip or cord that repeatedly clicks, smells hot, buzzes, or shows discoloration.',
    ],
    guides: [
      {
        slug: 'extension-cord-getting-hot',
        kicker: 'Safety troubleshooting',
        title: 'Extension cord getting hot',
        desc: 'Watt draw vs gauge, coiled cord heat traps, and when to unplug immediately.',
        problem: 'The cord feels warm or hot during normal desk use.',
      },
      {
        slug: 'surge-protector-clicking',
        kicker: 'Power troubleshooting',
        title: 'Surge protector clicking sound',
        desc: 'MOV wear, thermal breaker cycling, inrush current — when to keep it and when to replace.',
        problem: 'The power strip clicks, cycles, buzzes, or acts weird under load.',
      },
      {
        slug: 'gan-charger-not-charging-laptop-full-speed',
        kicker: 'Charging troubleshooting',
        title: 'GaN charger not charging laptop full speed',
        desc: 'PDO negotiation, multi-port wattage sharing, and proprietary charging quirks explained.',
        problem: 'A multi-port charger drops laptop wattage when other devices are connected.',
      },
    ],
    related: [
      { href: '/guides/extension-cord-safety-guide', title: 'Extension cord safety guide', desc: 'Calculate desk load, pick the right amp rating and gauge, and avoid stack-of-doom wiring.' },
      { href: '/guides/laptop-charger-wattage', title: 'Laptop charger wattage', desc: 'Match the laptop input rating and leave headroom for docks and multi-device chargers.' },
      { href: '/gear/power/flat-plug-surge-protector', title: 'Flat plug surge protector', desc: 'Fit-first notes for a low-profile desk power strip.' },
    ],
    faqs: [
      {
        question: 'Is it normal for an extension cord to get warm?',
        answer: 'Slight warmth can happen under load, but hot, soft, smelly, buzzing, or discolored cords are not normal. Unplug the load and check the cord rating before using it again.',
      },
      {
        question: 'Can a surge protector click normally?',
        answer: 'A single click from a switch or relay can be normal. Repeated clicking, clicking under a steady load, buzzing, or resets usually means overload, thermal cycling, or a failing strip.',
      },
    ],
  },
  {
    slug: 'home-office-peripheral-fixes',
    kicker: 'Peripheral troubleshooting hub',
    title: 'Home office peripheral fixes',
    seoTitle: 'Home office peripheral fixes: webcams, mice, keyboards, monitor arms, and desk lights | StackGeist',
    description: 'Fix common desk peripheral problems: Logitech Brio not detected, MX Master 3S scroll issues, Keychron Bluetooth pairing, monitor arm sagging, and ScreenBar flicker.',
    lead: 'Most peripheral problems are not dramatic hardware deaths. They are bad ports, stale pairings, software profiles, weak USB power, cable pull, and one cursed setting hiding in a vendor app.',
    primaryProblem: 'The peripheral stack fails in layers: power, cable, port, receiver distance, OS permission, vendor software, firmware, then hardware. Skip the order and you end up replacing working gear like an NPC with a credit card.',
    quickChecks: [
      'Test the device directly on the computer before blaming hubs, docks, or receivers.',
      'Check OS permissions for cameras, Bluetooth, and input devices.',
      'Reset stale pairings or software profiles before factory resetting hardware.',
      'For mounted gear, check physical tension, cable pull, and weight rating before replacing parts.',
    ],
    guides: [
      {
        slug: 'logitech-brio-not-detected-windows-11',
        kicker: 'Webcam troubleshooting',
        title: 'Logitech Brio not detected on Windows 11',
        desc: 'Camera privacy, USB 3.0 port, driver conflicts, and cable checks in order.',
        problem: 'Windows sees no camera, or meeting apps cannot select it.',
      },
      {
        slug: 'mx-master-3s-scroll-wheel-not-working',
        kicker: 'Mouse troubleshooting',
        title: 'MX Master 3s scroll wheel not working',
        desc: 'SmartShift toggle, axle debris, firmware, and battery — clean-unlock-replace triage.',
        problem: 'Scrolling skips, stops, changes mode, or behaves differently per app.',
      },
      {
        slug: 'keychron-v6-max-bluetooth-not-connecting',
        kicker: 'Keyboard troubleshooting',
        title: 'Keychron V6 Max not connecting over Bluetooth',
        desc: 'Mode switch, profile keys, pairing sequence, and factory reset in order.',
        problem: 'The keyboard will not pair or keeps reconnecting to the wrong device.',
      },
      {
        slug: 'monitor-arm-sagging-fix',
        kicker: 'Mount troubleshooting',
        title: 'Monitor arm sagging or drooping',
        desc: 'Find the tension hex, match monitor weight to arm range, and know when the strut is truly blown.',
        problem: 'The monitor slowly drops, tilts, or refuses to stay where you put it.',
      },
      {
        slug: 'benq-screenbar-flickering',
        kicker: 'Lighting troubleshooting',
        title: 'BenQ ScreenBar flickering',
        desc: 'Underpowered USB port, Halo puck battery, and PWM dimming perception explained.',
        problem: 'The monitor light flickers, flashes, or changes brightness unexpectedly.',
      },
    ],
    related: [
      { href: '/guides/keyboard-mouse-fit', title: 'Keyboard and mouse fit', desc: 'Choose keyboard width and pointer shape as one reach system.' },
      { href: '/guides/better-video-calls', title: 'Better video calls', desc: 'Fix camera angle, front lighting, microphone distance, and background first.' },
      { href: '/guides/desk-layout-basics', title: 'Desk layout basics', desc: 'Fix the primary zone before deciding where accessories should live.' },
    ],
    faqs: [
      {
        question: 'Why do peripherals work on one port but not another?',
        answer: 'Different ports can provide different bandwidth, power, controller paths, and hub behavior. A webcam, receiver, or light bar may fail through a hub while working directly on the machine.',
      },
      {
        question: 'Should I factory reset a keyboard, mouse, or webcam first?',
        answer: 'Usually no. Check mode switches, pairings, app permissions, vendor profiles, receiver placement, and cable or hub issues first. Factory reset is useful after the simple state problems are ruled out.',
      },
    ],
  },
  {
    slug: 'wireless-bluetooth-smart-home-fixes',
    kicker: 'Wireless troubleshooting hub',
    title: 'Wireless, Bluetooth, and smart home fixes',
    seoTitle: 'Wireless, Bluetooth, and smart home fixes: Wi-Fi adapters, headphones, keyboards, and Govee lights | StackGeist',
    description: 'Troubleshoot wireless gear: ALFA AC1900 slow speeds, Momentum 4 pairing, Keychron Bluetooth issues, and Govee strip lights that will not connect to Wi-Fi.',
    lead: 'Wireless problems feel like haunted hardware because you cannot see the failing layer. Usually it is driver support, band steering, stale pairings, receiver placement, or a device clinging to the wrong network like it pays rent there.',
    primaryProblem: 'Start by separating radio problems from software state. If a device works wired or on another machine, the issue is probably pairing cache, driver, router band, or placement.',
    quickChecks: [
      'Move close to the router or receiver, then retest before changing settings.',
      'Clear stale Bluetooth pairings and reconnect from a clean state.',
      'For smart home devices, force or expose a 2.4 GHz network during setup.',
      'For Wi-Fi adapters, verify driver, USB port mode, band, channel width, and power management.',
    ],
    guides: [
      {
        slug: 'alfa-ac1900-slow-speed-fix',
        kicker: 'Wi-Fi troubleshooting',
        title: 'ALFA AC1900 slow speed fix',
        desc: 'Driver, USB 3.0 port, band selection, and antenna orientation for the RTL8814AU adapter.',
        problem: 'The adapter connects but performs worse than expected.',
      },
      {
        slug: 'sennheiser-momentum-4-wont-pair',
        kicker: 'Bluetooth troubleshooting',
        title: 'Sennheiser Momentum 4 not pairing',
        desc: 'Correct pairing slide, multipoint limits, and reset sequence for clean re-pair.',
        problem: 'The headphones will not enter pairing or keep attaching to another device.',
      },
      {
        slug: 'keychron-v6-max-bluetooth-not-connecting',
        kicker: 'Keyboard troubleshooting',
        title: 'Keychron V6 Max not connecting over Bluetooth',
        desc: 'Mode switch, profile keys, pairing sequence, and factory reset in order.',
        problem: 'Bluetooth pairing fails or the keyboard reconnects unreliably.',
      },
      {
        slug: 'govee-strip-lights-not-connecting-wifi',
        kicker: 'Smart home troubleshooting',
        title: 'Govee strip lights not connecting to Wi-Fi',
        desc: '2.4 GHz-only band, app permissions, and mesh router band-steering fixes.',
        problem: 'The app cannot finish pairing the LED strip to Wi-Fi.',
      },
    ],
    related: [
      { href: '/guides/keyboard-mouse-fit', title: 'Keyboard and mouse fit', desc: 'Input-device placement and fit checks after the connection is stable.' },
      { href: '/gear/networking/alfa-ac1900', title: 'ALFA AC1900 fit guide', desc: 'When an external USB Wi-Fi adapter makes sense and when it does not.' },
      { href: '/gear/audio/sennheiser-momentum-4', title: 'Momentum 4 fit guide', desc: 'Fit notes for battery life, ANC, multipoint, and desk use.' },
    ],
    faqs: [
      {
        question: 'Why does Bluetooth fail after working once?',
        answer: 'Bluetooth devices often keep old pairings, multipoint sessions, or receiver state around after the visible connection is gone. Forget the device on both sides, reboot, and pair from a clean state.',
      },
      {
        question: 'Why do smart lights need 2.4 GHz Wi-Fi?',
        answer: 'Many low-power smart home devices only support 2.4 GHz because it has better range and cheaper radio hardware. Mesh routers with aggressive band steering can hide that network during setup.',
      },
    ],
  },
  {
    slug: 'storage-raspberry-pi-boot-fixes',
    kicker: 'Storage and boot troubleshooting hub',
    title: 'Storage and Raspberry Pi boot fixes',
    seoTitle: 'Storage and Raspberry Pi boot fixes: microSD cards, WD Elements drives, and Pi 5 boot problems | StackGeist',
    description: 'Fix common storage and boot problems: microSD cards not detected, WD Elements drives not showing up, and Raspberry Pi 5 boot failures.',
    lead: 'Storage failures are where panic clicks get expensive. Slow down, do the non-destructive checks first, and do not format anything just because Windows popped up a cursed little suggestion box.',
    primaryProblem: 'With removable storage and Raspberry Pi boot media, the failure can be the reader, cable, USB port, drive letter, partition table, image, power supply, or the card itself. Treat data safety as the first requirement.',
    quickChecks: [
      'Do not format a drive or card until you decide the data is disposable or backed up.',
      'Test a second cable, reader, and USB port before changing partitions.',
      'Use Disk Management or a disk utility to check whether the device exists without a drive letter.',
      'For Raspberry Pi, verify power supply and image integrity before blaming the board.',
    ],
    guides: [
      {
        slug: 'microsd-card-not-detected',
        kicker: 'Card troubleshooting',
        title: 'microSD card not detected',
        desc: 'Reader swap, Disk Management letter assign, read-only clear, and card end-of-life signs.',
        problem: 'A phone, camera, PC, or reader does not see the card.',
      },
      {
        slug: 'wd-elements-not-showing-up',
        kicker: 'Drive troubleshooting',
        title: 'WD Elements not showing up',
        desc: 'Rear USB port, unpowered hub problems, cable swap, and the click that means back up now.',
        problem: 'The external drive spins, clicks, or disappears from File Explorer.',
      },
      {
        slug: 'raspberry-pi-5-wont-boot',
        kicker: 'Boot troubleshooting',
        title: 'Raspberry Pi 5 won’t boot',
        desc: '27W PSU requirement, LED patterns, SD card reflash, and HDMI port order.',
        problem: 'The Pi shows lights but never reaches a usable display or network state.',
      },
    ],
    related: [
      { href: '/gear/storage/wd-elements-portable', title: 'WD Elements fit guide', desc: 'Capacity-first external storage notes and when a portable HDD still makes sense.' },
      { href: '/gear/storage/samsung-evo-select-512gb', title: 'Samsung EVO Select microSD', desc: 'microSD card fit notes for handhelds, cameras, Raspberry Pi, and general storage.' },
      { href: '/gear/sbc/raspberry-pi-5-kit', title: 'Raspberry Pi 5 kit', desc: 'Power, case, cooling, and boot-media fit notes for the Pi 5.' },
    ],
    faqs: [
      {
        question: 'Should I format a card or external drive that is not detected?',
        answer: 'Only if the data does not matter. If there is data you need, first test another reader, cable, and port, then check whether the device appears in Disk Management without a drive letter.',
      },
      {
        question: 'Is a Raspberry Pi boot problem usually the board?',
        answer: 'Usually no. Power supply, bad microSD images, weak cables, HDMI timing, and attached USB devices are more common than a dead Pi board.',
      },
    ],
  },
];

export const troubleshootingHubMap = new Map(troubleshootingHubs.map((hub) => [hub.slug, hub]));
