// Every published, indexable StackGeist page in one list. Hubs, the homepage,
// related links, the search index, and the RSS feed read from here, so a page's
// listing title and summary are written once. Add new pages here when you publish them.
//
// section: which of the four departments lists the page (independent of its URL).
// type: the editorial format, which picks the label shown in lists.
// updated: the page's last substantive revision (YYYY-MM-DD); empty when unknown.

export type Section = 'fixes' | 'labs' | 'learning' | 'gear';
export type EntryType =
  | 'troubleshooting' | 'topic' | 'buying-guide'
  | 'lab' | 'lab-hardware'
  | 'certification' | 'course-review' | 'study-log'
  | 'product';

export type Entry = {
  href: string;
  section: Section;
  type: EntryType;
  topic: string;
  title: string;
  headline: string;
  dek: string;
  updated: string;
  image?: { src: string; alt: string; width: number; height: number; generated?: boolean };
};

export const CATALOG: Entry[] = [
  {
    href: "/certs/comptia-project-plus-pk0-005-study-guide/",
    section: "learning",
    type: "certification",
    topic: "project-management",
    title: "CompTIA Project+ PK0-005 study guide",
    headline: "CompTIA Project+ PK0-005: the complete exam overview and study guide",
    dek: "All four exam domains explained through scenarios, formulas and project-management distinctions.",
    updated: "2026-11-11",
  },

  {
    href: "/guides/usb-c-dock-only-one-monitor/",
    section: "fixes",
    type: "troubleshooting",
    topic: "usb-c",
    title: "USB-C dock only detecting one monitor",
    headline: "USB-C dock only detecting one monitor: diagnose the display path.",
    dek: "Start here when one external display works and the second does not.",
    updated: "2026-11-06"
  },
  {
    href: "/guides/usb-c-dock-second-monitor-stops-working/",
    section: "fixes",
    type: "troubleshooting",
    topic: "usb-c",
    title: "USB-C dock fails with a second monitor",
    headline: "USB-C dock works until you connect a second monitor: what that tells you.",
    dek: "Use a one-monitor baseline to find stream, bandwidth, or host limits.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/portable-usb-c-monitor-no-signal/",
    section: "fixes",
    type: "troubleshooting",
    topic: "usb-c",
    title: "Portable USB-C monitor showing no signal",
    headline: "Portable USB-C monitor no signal: DisplayPort Alt Mode or cable.",
    dek: "DisplayPort Alt Mode, cables, and hub passthrough checks.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/usb-c-hub-ethernet-works-hdmi-doesnt/",
    section: "fixes",
    type: "troubleshooting",
    topic: "usb-c",
    title: "USB-C hub Ethernet works but HDMI does not",
    headline: "USB-C hub Ethernet works but HDMI doesn’t: the USB side can work while video fails.",
    dek: "USB data can work while the display path fails.",
    updated: "2026-11-08"
  },
  {
    href: "/guides/how-to-tell-if-usb-c-port-supports-video/",
    section: "fixes",
    type: "troubleshooting",
    topic: "usb-c",
    title: "Does this USB-C port support video?",
    headline: "How to tell if your USB-C port supports video without guessing.",
    dek: "Confirm it from the exact host spec instead of the connector shape.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/usb-c-cable-charging-slow/",
    section: "fixes",
    type: "troubleshooting",
    topic: "power",
    title: "USB-C cable charging slow",
    headline: "Why your USB-C cable is charging slow (and how to tell).",
    dek: "Separate cable rating, charger output, and device limits.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/gan-charger-not-charging-laptop-full-speed/",
    section: "fixes",
    type: "troubleshooting",
    topic: "power",
    title: "GaN charger not charging laptop full speed",
    headline: "GaN charger not charging laptop full speed: why wattage drops.",
    dek: "Find USB PD and shared-port wattage limits.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/usb-c-charger-charges-phone-not-laptop/",
    section: "fixes",
    type: "troubleshooting",
    topic: "power",
    title: "USB-C charger charges phone but not laptop",
    headline: "USB-C charger charges your phone but not your laptop.",
    dek: "Missing 20V output, per-port wattage, and cable rating.",
    updated: "2026-11-05"
  },
  {
    href: "/guides/laptop-not-charging-through-usb-c-dock/",
    section: "fixes",
    type: "troubleshooting",
    topic: "power",
    title: "Laptop not charging through a USB-C dock",
    headline: "Laptop not charging through a USB-C dock.",
    dek: "Host charging wattage, brand limits, and firmware.",
    updated: "2026-11-05"
  },
  {
    href: "/guides/laptop-says-slow-charger-with-100w-usb-c-charger/",
    section: "fixes",
    type: "troubleshooting",
    topic: "power",
    title: "100W USB-C charger but Windows says slow charger",
    headline: "Laptop says “slow charger” with a 100W USB-C charger: diagnose the real limit.",
    dek: "Per-port output, cable rating, port choice, and dock losses.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/laptop-charger-wattage/",
    section: "fixes",
    type: "troubleshooting",
    topic: "power",
    title: "How many watts does my laptop charger need?",
    headline: "How many watts does my laptop charger need? Start with the exact laptop, not a generic chart.",
    dek: "Match rated input and plan headroom for docks.",
    updated: "2026-11-08"
  },
  {
    href: "/guides/surge-protector-clicking/",
    section: "fixes",
    type: "troubleshooting",
    topic: "power",
    title: "Surge protector clicking",
    headline: "Surge protector clicking: do not diagnose the protection circuit by sound alone.",
    dek: "When to keep using it and when to replace it.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/extension-cord-getting-hot/",
    section: "fixes",
    type: "troubleshooting",
    topic: "power",
    title: "Extension cord getting hot",
    headline: "Extension cord getting hot: stop using it and find the cause.",
    dek: "When to stop using it, and how to find the cause.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/extension-cord-safety-guide/",
    section: "fixes",
    type: "troubleshooting",
    topic: "power",
    title: "Extension cord safety",
    headline: "Extension cord safety for desk setups: rating, condition, routing, and temporary use.",
    dek: "Desk load, amp rating, gauge, and where surge protectors fit.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/microsd-card-not-detected/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "microSD card not detected",
    headline: "microSD card not detected: separate the reader, host, disk state, and card.",
    dek: "Reader, Disk Management, write protection, and failure checks.",
    updated: "2026-11-08"
  },
  {
    href: "/guides/external-drive-shows-in-disk-management-not-file-explorer/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "Drive in Disk Management but not File Explorer",
    headline: "External drive shows in Disk Management but not File Explorer: do this before formatting.",
    dek: "Safe checks before you initialize or format anything.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/wd-elements-not-showing-up/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "WD Elements not showing up",
    headline: "WD Elements not showing up in Windows: diagnose connection, volume, and drive health.",
    dek: "Cable, power, Disk Management, and drive health triage.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/external-ssd-not-showing-up-windows-11/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "External SSD not showing up in Windows 11",
    headline: "External SSD not showing up in Windows 11.",
    dek: "New drives, missing letters, Mac formats, and data cables.",
    updated: "2026-11-05"
  },
  {
    href: "/guides/external-drive-wrong-partition-size/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "Drive shows the wrong size",
    headline: "External drive shows the wrong size, or a partition bigger than the disk.",
    dek: "A partition bigger than the disk, or capacity that looks wrong.",
    updated: "2026-11-06"
  },
  {
    href: "/guides/external-drive-says-you-need-to-format-it/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "Drive says “You need to format the disk”",
    headline: "External drive says “You need to format the disk”: what to do before you click Format.",
    dek: "Save your files before you click Format.",
    updated: "2026-11-05"
  },
  {
    href: "/guides/recover-deleted-photos-from-sd-card/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "Recover deleted photos from an SD card",
    headline: "How to recover deleted photos from an SD card.",
    dek: "Free and paid recovery tools, step by step.",
    updated: "2026-11-05"
  },
  {
    href: "/guides/how-to-tell-if-ssd-is-failing/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "How to tell if your SSD is failing",
    headline: "How to tell if your SSD is failing.",
    dek: "Symptoms and free health checks in Windows.",
    updated: "2026-11-05"
  },
  {
    href: "/guides/back-up-windows-pc-before-replacing-drive/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "Back up before replacing a drive",
    headline: "How to back up a Windows PC before replacing its drive.",
    dek: "BitLocker key, files, settings, and cloning.",
    updated: "2026-11-05"
  },
  {
    href: "/guides/raspberry-pi-5-wont-boot/",
    section: "fixes",
    type: "troubleshooting",
    topic: "storage",
    title: "Raspberry Pi 5 won’t boot",
    headline: "Raspberry Pi 5 won’t boot: separate power, boot media, EEPROM, and display.",
    dek: "Power, boot media, LED patterns, and HDMI checks.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/sennheiser-momentum-4-wont-pair/",
    section: "fixes",
    type: "troubleshooting",
    topic: "wireless",
    title: "Sennheiser Momentum 4 not pairing",
    headline: "Sennheiser Momentum 4 won’t pair: pairing mode first, reset later.",
    dek: "Correct pairing slide, multipoint limits, and a clean reset sequence.",
    updated: "2026-11-08"
  },
  {
    href: "/guides/keychron-v6-max-bluetooth-not-connecting/",
    section: "fixes",
    type: "troubleshooting",
    topic: "wireless",
    title: "Keychron V6 Max Bluetooth not connecting",
    headline: "Keychron V6 Max Bluetooth not connecting: pairing first, firmware last.",
    dek: "Mode switch, profile keys, pairing, and reset.",
    updated: "2026-11-08"
  },
  {
    href: "/guides/hotel-wifi-login-page-not-showing/",
    section: "fixes",
    type: "troubleshooting",
    topic: "wireless",
    title: "Hotel Wi-Fi connected but no internet",
    headline: "Hotel Wi-Fi connected but no internet? Get the sign-in page to appear.",
    dek: "Open the captive portal on Windows, iPhone, Android or Mac without resetting everything.",
    updated: "2026-11-08",
    image: {
      src: "/illustrations/hotel-wifi-captive-portal-flow.svg",
      alt: "Diagram showing the hotel Wi-Fi connection, login page and internet authorization",
      width: 960,
      height: 510
    }
  },
  {
    href: "/guides/wifi-keeps-disconnecting-router-or-pc/",
    section: "fixes",
    type: "troubleshooting",
    topic: "wireless",
    title: "Wi-Fi keeps disconnecting: router or PC?",
    headline: "Wi-Fi keeps disconnecting: is it the router or your PC?",
    dek: "Two tests to find the cause, then the right fixes.",
    updated: "2026-11-05"
  },
  {
    href: "/guides/alfa-ac1900-slow-speed-fix/",
    section: "fixes",
    type: "troubleshooting",
    topic: "wireless",
    title: "ALFA AC1900 slow speed fix",
    headline: "ALFA AWUS1900 slow speed: isolate USB, driver, band, and signal.",
    dek: "Driver, USB port, band selection, and antenna checks.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/mx-master-3s-scroll-wheel-not-working/",
    section: "fixes",
    type: "troubleshooting",
    topic: "wireless",
    title: "MX Master 3S scroll wheel not working",
    headline: "MX Master 3S scroll wheel not working: separate mode, software, connection, and hardware.",
    dek: "SmartShift, firmware, debris, and hardware triage.",
    updated: "2026-11-08"
  },
  {
    href: "/guides/logitech-brio-not-detected-windows-11/",
    section: "fixes",
    type: "troubleshooting",
    topic: "wireless",
    title: "Logitech Brio not detected on Windows 11",
    headline: "Logitech Brio 500 not detected in Windows 11: isolate Windows from the USB path.",
    dek: "Camera privacy, USB port, driver, and cable checks.",
    updated: "2026-11-08"
  },
  {
    href: "/guides/govee-strip-lights-not-connecting-wifi/",
    section: "fixes",
    type: "troubleshooting",
    topic: "wireless",
    title: "Govee lights not connecting to Wi-Fi",
    headline: "Govee strip lights not connecting to Wi-Fi: isolate the light from the network.",
    dek: "2.4 GHz, permissions, mesh steering, and pairing fixes.",
    updated: "2026-11-08"
  },
  {
    href: "/guides/monitor-arm-sagging-fix/",
    section: "fixes",
    type: "troubleshooting",
    topic: "desk",
    title: "Monitor arm sagging",
    headline: "Monitor arm sagging: check capacity and mounting before adding tension.",
    dek: "Capacity, tension, VESA, and clamp checks.",
    updated: "2026-10-01"
  },
  {
    href: "/guides/benq-screenbar-flickering/",
    section: "fixes",
    type: "troubleshooting",
    topic: "desk",
    title: "BenQ ScreenBar flickering",
    headline: "BenQ ScreenBar flickering: identify the model and power path first.",
    dek: "Model and power checks before you replace it.",
    updated: "2026-11-08"
  },
  {
    href: "/guides/office-chair-gas-cylinder-replacement/",
    section: "fixes",
    type: "troubleshooting",
    topic: "desk",
    title: "Office chair sinking",
    headline: "Office chair sinks: diagnose the control mechanism or gas cylinder first.",
    dek: "Gas cylinder or control mechanism?",
    updated: "2026-11-08"
  },
  {
    href: "/guides/cable-management/",
    section: "fixes",
    type: "troubleshooting",
    topic: "desk",
    title: "Cable management",
    headline: "Hide less. Route better.",
    dek: "Route power and data so cables stop causing faults.",
    updated: "2026-09-04"
  },
  {
    href: "/guides/desk-power-safety-problems/",
    section: "fixes",
    type: "topic",
    topic: "power",
    title: "Desk power safety problems",
    headline: "Desk power safety problems",
    dek: "Troubleshoot desk power problems before they become expensive or unsafe: hot extension cords, clicking surge protectors, GaN charger wattage splits,…",
    updated: "2026-09-12"
  },
  {
    href: "/guides/home-office-peripheral-fixes/",
    section: "fixes",
    type: "topic",
    topic: "desk",
    title: "Home office peripheral fixes",
    headline: "Home office peripheral fixes",
    dek: "Fix common desk peripheral problems: Logitech Brio not detected, MX Master 3S scroll issues, Keychron Bluetooth pairing, monitor arm sagging, and…",
    updated: "2026-09-12"
  },
  {
    href: "/guides/storage-raspberry-pi-boot-fixes/",
    section: "fixes",
    type: "topic",
    topic: "storage",
    title: "Storage and Raspberry Pi boot fixes",
    headline: "Storage and Raspberry Pi boot fixes",
    dek: "Fix common storage and boot problems: microSD cards not detected, WD Elements drives not showing up, and Raspberry Pi 5 boot failures.",
    updated: "2026-09-12"
  },
  {
    href: "/guides/usb-c-charging-display-problems/",
    section: "fixes",
    type: "topic",
    topic: "usb-c",
    title: "USB-C charging and display problems",
    headline: "USB-C charging and display problems",
    dek: "Fix common USB-C charging and display problems: docks that only show one monitor, slow cables, GaN charger wattage limits, and portable monitors with…",
    updated: "2026-09-12"
  },
  {
    href: "/guides/wireless-bluetooth-smart-home-fixes/",
    section: "fixes",
    type: "topic",
    topic: "wireless",
    title: "Wireless, Bluetooth, and smart home fixes",
    headline: "Wireless, Bluetooth, and smart home fixes",
    dek: "Troubleshoot wireless gear: ALFA AC1900 slow speeds, Momentum 4 pairing, Keychron Bluetooth issues, and Govee strip lights that will not connect to…",
    updated: "2026-09-12"
  },
  {
    href: "/labs/active-directory-home-lab/",
    section: "labs",
    type: "lab",
    topic: "labs",
    title: "Active Directory home lab: what I built and what broke",
    headline: "Active Directory home lab: what I built and what broke",
    dek: "Four VMs, verified output, and three faults found during an audit.",
    updated: "2026-11-08"
  },
  {
    href: "/labs/aws-cognito-private-crud-fix/",
    section: "labs",
    type: "lab",
    topic: "labs",
    title: "Fixing anonymous CRUD on an AWS portfolio app",
    headline: "Fixing anonymous CRUD on an AWS portfolio app",
    dek: "How a public demo moved to Cognito, JWT authorization, and owner checks.",
    updated: "2026-11-05"
  },
  {
    href: "/labs/help-desk-practice-without-experience/",
    section: "labs",
    type: "lab",
    topic: "labs",
    title: "Practice help desk work without a help desk job",
    headline: "How to practice help desk work without a help desk job",
    dek: "Where to get real tickets, what to practice, and how to show the work.",
    updated: "2026-11-08"
  },
  {
    href: "/labs/homelab-equipment-for-beginners/",
    section: "labs",
    type: "lab-hardware",
    topic: "labs",
    title: "Beginner IT homelab equipment: what you actually need",
    headline: "Beginner IT homelab equipment: what you actually need.",
    dek: "What to buy first, what to add later, and what to skip, from a working lab.",
    updated: "2026-11-05"
  },
  {
    href: "/labs/network-plus-home-lab/",
    section: "labs",
    type: "lab",
    topic: "labs",
    title: "Network+ home lab: practice on virtual machines before you buy gear",
    headline: "Network+ home lab: practice on virtual machines before you buy gear.",
    dek: "Subnets, DHCP, DNS, ports, and firewall rules, with commands from a working lab.",
    updated: "2026-11-06"
  },
  {
    href: "/labs/osticket-docker-help-desk-lab/",
    section: "labs",
    type: "lab",
    topic: "labs",
    title: "osTicket help desk lab with Docker Compose",
    headline: "osTicket help desk lab with Docker Compose",
    dek: "A local ticket system with captured email and five practice tickets.",
    updated: "2026-11-05"
  },
  {
    href: "/labs/vmware-homelab-hardware/",
    section: "labs",
    type: "lab-hardware",
    topic: "labs",
    title: "What hardware you need for a VMware homelab",
    headline: "What hardware do you need for a VMware homelab?",
    dek: "Real RAM, CPU, and storage numbers from a six-VM lab.",
    updated: "2026-11-05"
  },
  {
    href: "/certs/",
    section: "learning",
    type: "certification",
    topic: "certs",
    title: "Which IT certification first? A+, Network+, Security+, or AWS",
    headline: "Which IT certification first? A+, Network+, Security+, or AWS",
    dek: "Compare entry-level certifications from official exam pages.",
    updated: "2026-11-05"
  },
  {
    href: "/certs/security-plus-v7-vs-v8/",
    section: "learning",
    type: "certification",
    topic: "certs",
    title: "Security+ SY0-701 vs SY0-801: which version should you take?",
    headline: "Security+ SY0-701 vs SY0-801: which version should you take?",
    dek: "Retirement and launch dates from CompTIA.",
    updated: "2026-11-05"
  },
  {
    href: "/certs/wgu-c949-data-structures-and-algorithms-review/",
    section: "learning",
    type: "course-review",
    topic: "wgu",
    title: "WGU C949 Data Structures and Algorithms I review",
    headline: "WGU C949 Data Structures and Algorithms I: what made it hard, and what finally worked.",
    dek: "What made it hard, and what finally worked.",
    updated: "2026-11-08"
  },
  {
    href: "/certs/wgu-d282-cloud-foundations-review/",
    section: "learning",
    type: "course-review",
    topic: "wgu",
    title: "WGU D282 Cloud Foundations and AWS Cloud Practitioner review",
    headline: "WGU D282 Cloud Foundations and AWS Cloud Practitioner: what I studied, and where I was weakest.",
    dek: "What I studied and where I was weakest.",
    updated: "2026-11-08"
  },
  {
    href: "/certs/wgu-d287-java-frameworks-review/",
    section: "learning",
    type: "course-review",
    topic: "wgu",
    title: "WGU D287 Java Frameworks review",
    headline: "WGU D287 Java Frameworks: work through it in small, testable steps.",
    dek: "A Spring Boot project in small, testable steps.",
    updated: "2026-11-08"
  },
  {
    href: "/certs/wgu-software-engineering-degree/",
    section: "learning",
    type: "study-log",
    topic: "wgu",
    title: "My WGU Software Engineering degree: every course I’ve passed, in order",
    headline: "My WGU Software Engineering degree: every course I’ve passed, in order",
    dek: "Real course order, pass dates, and pace.",
    updated: "2026-11-05"
  },
  {
    href: "/guides/usb-c-dock-compatibility/",
    section: "gear",
    type: "buying-guide",
    topic: "usb-c",
    title: "USB-C dock compatibility checklist",
    headline: "A USB-C connector is a shape, not a promise.",
    dek: "Trace host capability, displays, charging, and bandwidth before buying.",
    updated: "2026-11-06"
  },
  {
    href: "/guides/usb-c-cable-buying-guide/",
    section: "gear",
    type: "buying-guide",
    topic: "usb-c",
    title: "USB-C cable buying guide",
    headline: "USB-C cable buying guide: choose power, data, and video separately.",
    dek: "What wattage and USB or Thunderbolt labels actually mean.",
    updated: "2026-10-01"
  },
  {
    href: "/gear/budget-tech/sennheiser-momentum-4-wireless-noise-cancelling-headphones/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "Sennheiser Momentum 4 Wireless",
    headline: "Sennheiser MOMENTUM 4 Wireless",
    dek: "Source-checked Momentum 4 decision page covering Bluetooth codecs, ANC, battery claim, wired options, fit limits, and reasons to skip.",
    updated: ""
  },
  {
    href: "/gear/budget-tech/wd-my-passport-4tb/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "WD My Passport 4TB portable drive",
    headline: "WD My Passport 4TB: notes from owning one.",
    dek: "Ownership notes on the WD My Passport 4TB portable hard drive: what a portable HDD is good for, its tradeoffs, and what to check before trusting it with backups.",
    updated: ""
  },
  {
    href: "/gear/connectivity/anker-553-usb-c-hub/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "Anker 553 8-in-1 USB-C hub",
    headline: "Add ports only after checking what the laptop USB-C port can do.",
    dek: "Check display, charging, port, and operating-system compatibility before buying the Anker 553 8-in-1 USB-C hub.",
    updated: "2026-11-08"
  },
  {
    href: "/gear/connectivity/caldigit-ts4/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "CalDigit TS4 Thunderbolt dock",
    headline: "An excellent dock cannot add display support your laptop never had.",
    dek: "A fit-first CalDigit TS4 guide covering host compatibility, display limits, charging, ports, tradeoffs, and the exact Amazon listing.",
    updated: "2026-11-08"
  },
  {
    href: "/gear/input/logitech-mx-master-3s/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "Logitech MX Master 3S",
    headline: "Buy the workflow controls, not the 8,000-DPI headline.",
    dek: "A fit-first Logitech MX Master 3S guide covering hand fit, multi-device workflow, tradeoffs, and the exact Amazon listing.",
    updated: ""
  },
  {
    href: "/gear/desk-power/anker-nano-a9196/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "Anker Nano Charging Station A9196",
    headline: "Anker Nano Charging Station A9196: one outlet, several ports.",
    dek: "A compact desk power strip with USB-C and AC outlets: what it is, what it can power, and where it fits on a desk.",
    updated: "2026-11-07"
  },
  {
    href: "/gear/desk-lighting/govee-strip-light-2-pro/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "Govee Strip Light 2 Pro",
    headline: "Govee Strip Light 2 Pro: atmosphere for a larger desk or room perimeter.",
    dek: "Decide whether the Govee Strip Light 2 Pro fits a gaming desk, with length, controls, installation tradeoffs, and an exact affiliate link.",
    updated: "2026-11-07"
  },
  {
    href: "/gear/desk-lighting/benq-screenbar-pro/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "BenQ ScreenBar Pro",
    headline: "BenQ ScreenBar Pro: task light that uses no desk surface.",
    dek: "Why the BenQ ScreenBar Pro fits some desks, what to check before buying, and when to skip it.",
    updated: "2026-11-07"
  },
  {
    href: "/gear/desk-surface/steelseries-qck-heavy-xxl/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "SteelSeries QcK Heavy XXL",
    headline: "SteelSeries QcK Heavy XXL: one large stable cloth surface.",
    dek: "Who the SteelSeries QcK Heavy XXL fits, what to measure first, and the exact Amazon affiliate link.",
    updated: "2026-11-07"
  },
  {
    href: "/gear/accessories/razer-base-station-v2-chroma/",
    section: "gear",
    type: "product",
    topic: "products",
    title: "Razer Base Station V2 Chroma",
    headline: "Razer Base Station V2 Chroma: a headset stand with a useful hub.",
    dek: "Who the Razer Base Station V2 Chroma headset stand fits, its useful ports, tradeoffs, and exact Amazon affiliate link.",
    updated: "2026-11-07"
  },
  {
    href: "/gear/monitor-support/amazon-basics-dual-monitor-arm/",
    section: "gear",
    type: "product",
    topic: "desk-hardware",
    title: "Amazon Basics dual monitor arm",
    headline: "Amazon Basics dual monitor arm: what it fits",
    dek: "A researched buying note on the DS-MADDBE gas-spring dual monitor arm: monitor sizes, weight limits, VESA compatibility, and when to skip it.",
    updated: "2026-11-07"
  },
  {
    href: "/tools/usb-c-compatibility/",
    section: "fixes",
    type: "topic",
    topic: "usb-c",
    title: "USB-C dock and monitor compatibility checker",
    headline: "USB-C dock and monitor compatibility checker",
    dek: "Check whether your laptop and USB-C port can drive the external monitors you want, and learn when a Thunderbolt dock, USB-C hub, or DisplayLink adapter is the right fit.",
    updated: "2026-11-07"
  }
];
