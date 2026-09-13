import type { IncomeKit } from './incomeKits';

const TAG = 'deskrespawn-20';
const search = (q: string) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${TAG}`;

export const EXTRA_KITS: IncomeKit[] = [
  {
    slug: 'mechanical-keyboard-starter-kit',
    title: 'Mechanical keyboard starter kit',
    seoTitle: 'Mechanical keyboard starter kit: switches, keycaps, and accessories for daily typing | StackGeist',
    description: 'A mechanical keyboard starter kit for trying switches, fixing keycaps, adding foam, and learning what makes a keyboard comfortable for long sessions.',
    audience: 'People tired of mushy laptop keyboards and ready to try mechanical switches without the hobby rabbit hole.',
    promise: 'Find a typing feel that works before collecting fifty switch variants.',
    summary: 'A starter kit is one solid board, a switch tester, basic keycaps, and minimal mods. The rest is preference, not performance.',
    buyingOrder: [
      'Try a switch tester before buying any keyboard.',
      'Buy one solid entry board with hot-swap sockets.',
      'Add better keycaps only after the switches feel right.',
      'Add foam or stabilizer mods if rattle and ping bother you.',
      'Skip the custom builds until you know what you actually type on daily.'
    ],
    items: [
      { label: 'Switch tester with 9 or 12 switches', role: 'Try linear, tactile, and clicky switches before committing.', href: search('mechanical keyboard switch tester 12 switches'), kind: 'search', tier: 'must-have', check: 'A tester does not replace typing paragraphs on the real board.' },
      { label: 'Keychron V series or similar hot-swap board', role: 'Entry mechanical keyboard with hot-swap sockets and decent build.', href: search('keychron v3 hot swap mechanical keyboard'), kind: 'search', tier: 'must-have', check: 'Hot-swap sockets let you change switches without soldering.' },
      { label: 'PBT keycap set', role: 'Replace thin stock keycaps for better sound and texture.', href: search('pbt keycap set cherry profile'), kind: 'search', tier: 'nice-next', check: 'Match keycap stem to your switch type before buying.' },
      { label: 'Keyboard foam and stabilizer lube kit', role: 'Reduce case ping and stabilizer rattle on bigger keys.', href: search('keyboard case foam stabilizer lube kit'), kind: 'search', tier: 'nice-next', check: 'Modding is optional. Use the board stock first.' },
      { label: 'Wrist rest', role: 'Cushion for long sessions when the desk edge digs in.', href: search('mechanical keyboard wrist rest wood'), kind: 'search', tier: 'skip-until-needed', check: 'Only buy if wrist angle or contact pressure is a daily issue.' }
    ],
    related: [
      { href: '/guides/keyboard-mouse-fit', title: 'Keyboard and mouse fit', desc: 'Fix reach and wrist angle before blaming the switches.' },
      { href: '/gear/input/keychron-v6-max', title: 'Keychron V6 Max', desc: 'Full-size wireless mechanical board with hot-swap and QMK support.' },
      { href: '/guides/mechanical-keyboard-buying-guide', title: 'Mechanical keyboard buying guide', desc: 'Switch types, sizes, layouts, and when to skip the hobby entirely.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Mechanical keyboard starter kit', hook: 'Switch tester, hot-swap board, better keycaps. The hobby can wait in the garage.', utmContent: 'mechanical_keyboard_starter' },
      { channel: 'tiktok', title: 'Start with a switch tester', hook: 'Do not buy a mechanical keyboard until you try linear, tactile, and clicky switches on a real tester.', utmContent: 'switch_tester_first' },
      { channel: 'reddit', title: 'Hot-swap starter board path', hook: 'A Keychron V or similar hot-swap board beats spending $300 on a custom build before you know what switches you like.', utmContent: 'reddit_hotswap_starter' }
    ],
    faqs: [
      { question: 'What mechanical switch type should I start with?', answer: 'Try a switch tester first. Most beginners like tactile switches (Browns, Boba U4T) for typing and linear switches (Reds, Yellows) for gaming, but preference beats groupthink.' },
      { question: 'Do I need to mod a mechanical keyboard?', answer: 'No. Foam, lube, and stabilizer mods can reduce noise and rattle, but use the stock board first to know what actually bothers you.' }
    ]
  },
  {
    slug: 'gaming-headset-comm-kit',
    title: 'Gaming headset and comm kit',
    seoTitle: 'Gaming headset and comm kit: audio, mic, and wireless gear for calls and play | StackGeist',
    description: 'A gaming headset and comm kit for voice clarity, wireless range, audio quality, and backup options when the main headset battery dies mid-raid.',
    audience: 'Gamers and remote workers who need reliable voice, decent audio, and one backup option.',
    promise: 'Clear voice and working audio beat the most expensive wireless headset with a dead battery.',
    summary: 'One solid wireless headset, one wired backup, mic boom or desktop option, and USB audio for when motherboard sound fails.',
    buyingOrder: [
      'Start with a wired headset or the headset you already own.',
      'Add a wireless headset only after battery life and range match your use.',
      'Add a desktop mic if you already own good headphones.',
      'Keep one wired backup or earbuds for when wireless fails.',
      'Add a USB DAC or soundcard only when onboard audio has interference or failures.'
    ],
    items: [
      { label: 'SteelSeries Arctis Nova 7 Wireless', role: 'Solid wireless headset with USB dongle and long battery life.', href: search('steelseries arctis nova 7 wireless'), kind: 'search', tier: 'must-have', check: 'Wireless adds charging friction. Keep a wired backup.' },
      { label: 'HyperX Cloud II wired headset', role: 'Reliable wired backup or starter headset with USB soundcard.', href: search('hyperx cloud ii wired gaming headset'), kind: 'search', tier: 'must-have', check: 'The USB soundcard can bypass motherboard audio issues.' },
      { label: 'Antlion ModMic Wireless', role: 'Attach a wireless mic boom to any headphones you already own.', href: search('antlion modmic wireless'), kind: 'search', tier: 'nice-next', check: 'Only useful if you prefer standalone headphones over headsets.' },
      { label: 'FiiO K7 or similar USB DAC', role: 'External USB audio with more power and less motherboard interference.', href: search('fiio k7 usb dac amp'), kind: 'search', tier: 'skip-until-needed', check: 'Only buy when onboard sound has static, hum, or driver issues.' },
      { label: 'Replacement ear cushions', role: 'Fix flattened or cracked pads instead of replacing the whole headset.', href: search('replacement ear cushions arctis'), kind: 'search', tier: 'skip-until-needed', check: 'Match cushion size and mounting style to your headset model.' }
    ],
    related: [
      { href: '/guides/headset-mic-troubleshooting', title: 'Headset mic troubleshooting', desc: 'Fix muted, quiet, or static headset mics before replacing gear.' },
      { href: '/gear/audio/elgato-wave-3', title: 'Elgato Wave:3', desc: 'Desktop mic option for streaming and calls.' },
      { href: '/guides/usb-audio-vs-onboard', title: 'USB audio vs onboard', desc: 'When to use a USB soundcard or DAC instead of motherboard audio.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Gaming headset and comm kit', hook: 'Wireless for convenience, wired for backup, and clear voice before expensive drivers.', utmContent: 'gaming_headset_comm_kit' },
      { channel: 'tiktok', title: 'Keep a wired headset backup', hook: 'Wireless headsets die mid-game. Keep a wired backup in the drawer.', utmContent: 'wired_headset_backup' },
      { channel: 'reddit', title: 'Gaming audio path', hook: 'SteelSeries or HyperX for the main headset, wired backup for when the battery dies, USB DAC only when onboard audio fails.', utmContent: 'reddit_gaming_audio_path' }
    ],
    faqs: [
      { question: 'Should I buy a wireless or wired gaming headset?', answer: 'Wireless is convenient until the battery dies. Start wired or buy both: wireless for daily use, wired for backup.' },
      { question: 'Do I need a separate microphone for gaming?', answer: 'No. A decent headset mic works for most gaming and calls. Add a desktop mic only if you stream or record often.' }
    ]
  },
  {
    slug: 'streaming-mic-arm-kit',
    title: 'Streaming mic and arm kit',
    seoTitle: 'Streaming mic and arm kit: boom arm, shock mount, and audio gear for clean recording | StackGeist',
    description: 'A streaming mic and arm kit for XLR or USB mics, boom arms, shock mounts, cables, and desk mounting without drilling holes.',
    audience: 'Streamers and content creators who need consistent mic placement and less desk clutter.',
    promise: 'Stable mic position and clean cable paths beat the most expensive mic with a wobbly stand.',
    summary: 'One solid boom arm, proper shock mount, the right mic for your room, and cable management that keeps the setup from drifting every week.',
    buyingOrder: [
      'Pick the mic type (USB or XLR) based on your audio interface situation.',
      'Add a boom arm that clamps to your desk without drilling.',
      'Add a shock mount matched to your specific mic model.',
      'Add an audio interface only if you chose XLR and need phantom power.',
      'Add acoustic treatment only when room echo actually ruins recordings.'
    ],
    items: [
      { label: 'Shure SM7B or Shure MV7', role: 'Popular dynamic mic for voice with XLR or USB+XLR hybrid.', href: search('shure mv7 usb xlr microphone'), kind: 'search', tier: 'must-have', check: 'SM7B needs an audio interface and preamp. MV7 works USB or XLR.' },
      { label: 'Rode PSA1+ boom arm', role: 'Solid desk-clamp boom arm with cable routing and reach.', href: search('rode psa1+ boom arm'), kind: 'search', tier: 'must-have', check: 'Measure desk edge clearance before buying a clamp-style arm.' },
      { label: 'Shure A7WS windscreen', role: 'Foam windscreen for plosive reduction on SM7B and similar mics.', href: search('shure a7ws windscreen'), kind: 'search', tier: 'must-have', check: 'Mic technique matters more than any foam windscreen.' },
      { label: 'GoXLR Mini or Wave XLR', role: 'USB audio interface with mic preamp, routing, and effects.', href: search('tc helicon goxlr mini'), kind: 'search', tier: 'nice-next', check: 'Only needed if you chose an XLR mic without built-in USB.' },
      { label: 'Acoustic foam panels', role: 'Reduce room echo and slap reflections behind the mic.', href: search('acoustic foam panels wedge 12 pack'), kind: 'search', tier: 'skip-until-needed', check: 'Only treat the room after confirming echo is the actual problem.' }
    ],
    related: [
      { href: '/gear/audio/elgato-wave-3', title: 'Elgato Wave:3', desc: 'Simpler USB mic option with software mixing and decent sound.' },
      { href: '/guides/mic-preamp-gain-setup', title: 'Mic preamp and gain setup', desc: 'Set proper gain and avoid clipping or noise floor issues.' },
      { href: '/guides/acoustic-treatment-basics', title: 'Acoustic treatment basics', desc: 'When and where to add foam or panels without overdoing it.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Streaming mic and arm kit', hook: 'Boom arm, shock mount, windscreen, and stable placement. Room treatment can wait.', utmContent: 'streaming_mic_arm_kit' },
      { channel: 'tiktok', title: 'Mic arm vs desktop stand', hook: 'Boom arms clear desk space, control mic distance, and keep cables off the mousepad.', utmContent: 'mic_arm_vs_stand' },
      { channel: 'reddit', title: 'SM7B or MV7 for streaming', hook: 'MV7 works USB or XLR. SM7B sounds great but needs a preamp and interface.', utmContent: 'reddit_sm7b_vs_mv7' }
    ],
    faqs: [
      { question: 'Should I buy a USB or XLR microphone?', answer: 'USB is simpler and works without an audio interface. XLR offers more flexibility and upgrade paths but needs phantom power and a preamp.' },
      { question: 'Do I need acoustic foam for streaming?', answer: 'Only if your room has obvious echo or slap. Start with mic technique and placement before treating walls.' }
    ]
  },
  {
    slug: 'ergonomic-mouse-wrist-fix-kit',
    title: 'Ergonomic mouse and wrist fix kit',
    seoTitle: 'Ergonomic mouse and wrist fix kit: vertical mice, pads, and reach fixes | StackGeist',
    description: 'An ergonomic mouse and wrist fix kit for wrist pain, forearm tension, and desk reach problems from long mouse sessions.',
    audience: 'Anyone with wrist or forearm pain after daily mouse work.',
    promise: 'Fix reach and wrist angle before blaming the mouse shape.',
    summary: 'One vertical or angled mouse, a supportive pad, proper desk height, and less reach to the mousepad.',
    buyingOrder: [
      'Fix desk height, chair armrest height, and mouse reach first.',
      'Try a vertical or angled mouse if neutral wrist posture helps.',
      'Add a wrist rest or gel pad only if contact pressure is the issue.',
      'Keep the old mouse for when the new shape feels wrong.',
      'Skip the trackball or pen tablet unless standard mice all fail.'
    ],
    items: [
      { label: 'Logitech MX Vertical', role: 'Wireless vertical mouse with thumb rest and neutral wrist angle.', href: search('logitech mx vertical ergonomic mouse'), kind: 'search', tier: 'must-have', check: 'Vertical mice feel weird for a week. Give it time.' },
      { label: 'Anker vertical ergonomic mouse', role: 'Budget vertical mouse for testing the shape before expensive options.', href: search('anker vertical ergonomic optical mouse'), kind: 'search', tier: 'must-have', check: 'Try a cheap vertical mouse before committing to $100 models.' },
      { label: 'Memory foam wrist rest for mouse', role: 'Soft pad for wrist contact when the desk edge digs in.', href: search('memory foam wrist rest mouse pad'), kind: 'search', tier: 'nice-next', check: 'The pad does not fix bad desk or chair height.' },
      { label: 'Kensington SlimBlade trackball', role: 'Trackball option for stationary hand and finger-based cursor control.', href: search('kensington slimblade trackball'), kind: 'search', tier: 'skip-until-needed', check: 'Trackballs take weeks to learn. Keep a standard mouse nearby.' },
      { label: 'XP-Pen drawing tablet', role: 'Pen input for design work or as a last resort for severe wrist issues.', href: search('xp-pen graphics tablet pen'), kind: 'search', tier: 'skip-until-needed', check: 'Tablets work for drawing and design, not general desktop use.' }
    ],
    related: [
      { href: '/guides/keyboard-mouse-fit', title: 'Keyboard and mouse fit', desc: 'Fix reach, desk height, and chair height before buying new gear.' },
      { href: '/guides/wrist-pain-desk-checklist', title: 'Wrist pain desk checklist', desc: 'Identify the real cause before replacing the mouse.' },
      { href: '/gear/input/logitech-mx-master-3s', title: 'Logitech MX Master 3S', desc: 'Contoured wireless mouse with thumb rest and horizontal scroll.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Ergonomic mouse and wrist fix kit', hook: 'Vertical mouse, wrist rest, proper reach. The shape alone does not fix bad desk height.', utmContent: 'ergonomic_mouse_wrist_fix' },
      { channel: 'tiktok', title: 'Try a vertical mouse', hook: 'Wrist pain from pronation? Vertical mice put your hand in neutral rotation.', utmContent: 'try_vertical_mouse' },
      { channel: 'reddit', title: 'Wrist pain mouse path', hook: 'Fix desk and chair height first, then try a vertical mouse. MX Vertical or cheap Anker to test the shape.', utmContent: 'reddit_wrist_pain_mouse' }
    ],
    faqs: [
      { question: 'Will a vertical mouse fix wrist pain?', answer: 'It can help if wrist pronation (palm-down rotation) is the issue. Fix desk height, chair height, and mouse reach first.' },
      { question: 'How long does it take to adjust to a vertical mouse?', answer: 'Most people adjust in a few days to a week. Keep the old mouse nearby for tasks that feel awkward at first.' }
    ]
  },
  {
    slug: 'laptop-cooling-fix-kit',
    title: 'Laptop cooling fix kit',
    seoTitle: 'Laptop cooling fix kit: stands, pads, fans, and thermal fixes for hot laptops | StackGeist',
    description: 'A laptop cooling fix kit for thermal throttling, hot keyboards, fan noise, and desk airflow problems from long sessions.',
    audience: 'Laptop users with loud fans, hot palm rests, or performance drops from heat.',
    promise: 'Fix airflow and dust before replacing the laptop.',
    summary: 'One simple stand or riser, compressed air for vents, a cooling pad for extreme cases, and thermal paste replacement only when the laptop is old enough.',
    buyingOrder: [
      'Raise the laptop off the desk for better airflow.',
      'Clean the vents and fans with compressed air.',
      'Add a cooling pad only if raising and cleaning did not help.',
      'Replace thermal paste only on laptops over three years old.',
      'Consider undervolting or repasting before replacing the whole machine.'
    ],
    items: [
      { label: 'Adjustable aluminum laptop stand', role: 'Raise the laptop for airflow and better screen height.', href: search('adjustable aluminum laptop stand'), kind: 'search', tier: 'must-have', check: 'Match stand angle and height to your external keyboard setup.' },
      { label: 'Compressed air duster', role: 'Blow dust out of vents and fans without opening the case.', href: search('compressed air duster electronics'), kind: 'search', tier: 'must-have', check: 'Short bursts. Do not spin fans at full speed with air pressure.' },
      { label: 'Laptop cooling pad with fans', role: 'Active cooling for extreme heat or gaming laptops.', href: search('laptop cooling pad rgb fans'), kind: 'search', tier: 'nice-next', check: 'Cooling pads help most when the laptop already has bad airflow design.' },
      { label: 'Thermal paste and toolkit', role: 'Replace dried thermal paste on CPUs and GPUs in older laptops.', href: search('thermal paste arctic mx-4 kit'), kind: 'search', tier: 'skip-until-needed', check: 'Only repaste if the laptop is 3+ years old and already disassembled.' },
      { label: 'Thermal pads for memory and VRM', role: 'Improve contact between hot chips and heat spreaders.', href: search('thermal pads laptop memory vrm'), kind: 'search', tier: 'skip-until-needed', check: 'Advanced mod. Only useful if you are already inside the laptop.' }
    ],
    related: [
      { href: '/guides/laptop-overheating-checklist', title: 'Laptop overheating checklist', desc: 'Diagnose thermal throttling before buying cooling gear.' },
      { href: '/guides/laptop-repasting-guide', title: 'Laptop repasting guide', desc: 'When and how to replace thermal paste on laptops.' },
      { href: '/guides/desk-airflow-basics', title: 'Desk airflow basics', desc: 'Prevent heat buildup around the laptop and monitors.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Laptop cooling fix kit', hook: 'Laptop stand, compressed air, cooling pad. Thermal paste is the last step, not the first.', utmContent: 'laptop_cooling_fix_kit' },
      { channel: 'tiktok', title: 'Fix laptop heat first', hook: 'Raise the laptop, clean the vents, then consider a cooling pad. Do not repaste until you try the easy fixes.', utmContent: 'fix_laptop_heat_first' },
      { channel: 'reddit', title: 'Laptop thermal throttling path', hook: 'Stand, dust cleaning, cooling pad, undervolting. Repasting is only worth it on laptops over three years old.', utmContent: 'reddit_laptop_thermal_path' }
    ],
    faqs: [
      { question: 'Do laptop cooling pads actually work?', answer: 'They help most on gaming laptops with bad airflow. Raising the laptop and cleaning vents should come first.' },
      { question: 'When should I replace laptop thermal paste?', answer: 'After 3 to 5 years, or when the laptop runs hot and slow despite cleaning. Repasting requires disassembly and voids some warranties.' }
    ]
  },
  {
    slug: 'wifi-6-mesh-upgrade-kit',
    title: 'WiFi 6 mesh upgrade kit',
    seoTitle: 'WiFi 6 mesh upgrade kit: routers, nodes, and wireless fixes for whole-home coverage | StackGeist',
    description: 'A WiFi 6 mesh upgrade kit for dead zones, slow wireless, buffering, and devices that fight for bandwidth across floors.',
    audience: 'Homeowners tired of dead zones, dropouts, and devices that lose connection across rooms.',
    promise: 'Cover the house with stable wireless before buying faster internet plans.',
    summary: 'One solid WiFi 6 mesh system, Ethernet backhaul where possible, and placement that covers problem areas instead of hiding nodes in closets.',
    buyingOrder: [
      'Map current dead zones and connection issues.',
      'Replace the ISP router with a mesh system or add mesh nodes.',
      'Use Ethernet backhaul between nodes when you can run cable.',
      'Add more nodes only after testing placement with two or three.',
      'Save WiFi 6E or WiFi 7 for when WiFi 6 proves insufficient.'
    ],
    items: [
      { label: 'TP-Link Deco X55 or X60 mesh', role: 'Affordable WiFi 6 mesh system with good range and app control.', href: search('tp-link deco x55 wifi 6 mesh 3-pack'), kind: 'search', tier: 'must-have', check: 'Start with a 2 or 3-pack and add nodes only where needed.' },
      { label: 'Netgear Orbi WiFi 6 mesh', role: 'Higher-end mesh with dedicated backhaul band and faster speeds.', href: search('netgear orbi wifi 6 mesh rbk752'), kind: 'search', tier: 'nice-next', check: 'Orbi costs more but handles more devices and faster internet plans.' },
      { label: 'Ethernet cable for backhaul', role: 'Wire mesh nodes together for stable backhaul instead of wireless repeating.', href: search('cat6 ethernet cable 50ft outdoor rated'), kind: 'search', tier: 'must-have', check: 'Wired backhaul beats wireless mesh whenever you can run cable.' },
      { label: 'PoE injector or switch', role: 'Power mesh nodes over Ethernet for ceiling or wall mounting.', href: search('poe injector gigabit 802.3af'), kind: 'search', tier: 'skip-until-needed', check: 'Only useful for ceiling-mount nodes or wired access points.' },
      { label: 'WiFi analyzer app or tool', role: 'Map signal strength, channel congestion, and node placement.', href: search('wifi analyzer netgear nighthawk app'), kind: 'search', tier: 'skip-until-needed', check: 'Free phone apps work for basic signal and channel checks.' }
    ],
    related: [
      { href: '/guides/mesh-wifi-vs-router-extender', title: 'Mesh WiFi vs router and extender', desc: 'When to use mesh instead of range extenders or access points.' },
      { href: '/guides/ethernet-backhaul-setup', title: 'Ethernet backhaul setup', desc: 'Wire mesh nodes for stable connections and better speed.' },
      { href: '/guides/wifi-dead-zone-checklist', title: 'WiFi dead zone checklist', desc: 'Diagnose coverage issues before buying new gear.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'WiFi 6 mesh upgrade kit', hook: 'Mesh system, Ethernet backhaul, smart placement. More nodes is not always the answer.', utmContent: 'wifi_6_mesh_upgrade' },
      { channel: 'tiktok', title: 'Fix WiFi dead zones', hook: 'Mesh nodes beat range extenders. Wire the backhaul when you can.', utmContent: 'fix_wifi_dead_zones' },
      { channel: 'reddit', title: 'Mesh WiFi upgrade path', hook: 'TP-Link Deco or Netgear Orbi, Ethernet backhaul, and placement that covers problem areas instead of hiding nodes.', utmContent: 'reddit_mesh_wifi_path' }
    ],
    faqs: [
      { question: 'Should I buy WiFi 6 or WiFi 6E mesh?', answer: 'WiFi 6 is enough for most homes. WiFi 6E adds a 6GHz band for less interference but costs more and needs compatible devices.' },
      { question: 'How many mesh nodes do I need?', answer: 'Start with 2 or 3 nodes and test coverage. Add more only where signal strength actually drops.' }
    ]
  },
  {
    slug: 'old-pc-revival-kit',
    title: 'Old PC revival kit',
    seoTitle: 'Old PC revival kit: SSD, RAM, cleanup, and tweaks for slow computers | StackGeist',
    description: 'An old PC revival kit for slow boot times, low RAM, spinning hard drives, and software clutter that makes daily tasks painful.',
    audience: 'Anyone with a working but slow PC that could run better with simple upgrades and cleanup.',
    promise: 'Extend the useful life before replacing the whole machine.',
    summary: 'One SSD for the boot drive, more RAM if the system swaps constantly, driver updates, dust cleaning, and software cleanup.',
    buyingOrder: [
      'Back up important files before any hardware changes.',
      'Replace the spinning hard drive with an SSD.',
      'Add RAM if the system uses swap or page file heavily.',
      'Update drivers and BIOS if stability issues exist.',
      'Clean dust, uninstall bloatware, and disable startup clutter.'
    ],
    items: [
      { label: 'Samsung 870 EVO SATA SSD', role: 'Replace the old spinning hard drive for faster boot and file access.', href: search('samsung 870 evo 500gb sata ssd'), kind: 'search', tier: 'must-have', check: 'Clone the old drive instead of reinstalling Windows when possible.' },
      { label: 'Crucial DDR4 or DDR3 RAM', role: 'Add more memory if the system page-faults or swaps constantly.', href: search('crucial 16gb ddr4 ram'), kind: 'search', tier: 'must-have', check: 'Match RAM type, speed, and slot configuration to your motherboard.' },
      { label: 'SATA to USB adapter', role: 'Clone the old drive or recover files before swapping to the SSD.', href: search('sabrent sata to usb 3.0 adapter'), kind: 'search', tier: 'must-have', check: 'Useful for cloning or testing the old drive after replacement.' },
      { label: 'Compressed air and cleaning kit', role: 'Remove dust from fans, vents, and heatsinks.', href: search('compressed air duster electronics cleaning kit'), kind: 'search', tier: 'nice-next', check: 'Dust buildup causes thermal throttling and fan noise.' },
      { label: 'Thermal paste', role: 'Replace dried CPU paste if the PC is over 5 years old and runs hot.', href: search('arctic mx-4 thermal paste'), kind: 'search', tier: 'skip-until-needed', check: 'Only repaste if the CPU temperature is high and throttling.' }
    ],
    related: [
      { href: '/guides/ssd-upgrade-clone-guide', title: 'SSD upgrade and clone guide', desc: 'Clone a hard drive to SSD without reinstalling Windows.' },
      { href: '/guides/old-pc-performance-checklist', title: 'Old PC performance checklist', desc: 'Diagnose slow PCs before buying new parts.' },
      { href: '/guides/windows-bloatware-removal', title: 'Windows bloatware removal', desc: 'Uninstall startup junk and pre-installed clutter safely.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Old PC revival kit', hook: 'SSD, RAM, driver updates, dust cleaning. The old PC can run fine if you fix the bottlenecks.', utmContent: 'old_pc_revival_kit' },
      { channel: 'tiktok', title: 'Revive a slow PC', hook: 'Swap the hard drive for an SSD. Add RAM. Clean the dust. The CPU is rarely the problem.', utmContent: 'revive_slow_pc' },
      { channel: 'reddit', title: 'Old PC upgrade path', hook: 'SSD first, RAM second, dust and bloatware cleanup third. CPU and motherboard replacement is the last resort.', utmContent: 'reddit_old_pc_upgrade' }
    ],
    faqs: [
      { question: 'What is the best upgrade for a slow old PC?', answer: 'Replace the hard drive with an SSD. That single change fixes most boot and file access slowdowns.' },
      { question: 'How much RAM does an old PC need?', answer: 'For Windows 10 or 11, 8GB is the minimum and 16GB is comfortable. Check Task Manager memory usage before buying.' }
    ]
  },
  {
    slug: 'mac-mini-desk-kit',
    title: 'Mac mini desk kit',
    seoTitle: 'Mac mini desk kit: monitor, hub, storage, and accessories for Apple Silicon | StackGeist',
    description: 'A Mac mini desk kit for external displays, USB-C hubs, storage, keyboard, mouse, and the desk layout that keeps the mini cool.',
    audience: 'Mac mini owners building a desk setup without buying redundant Apple gear.',
    promise: 'Build around the mini without overbuying dongles and adapters.',
    summary: 'One good monitor, USB-C or Thunderbolt hub, external storage, desk stand or mount, and keyboard and mouse that match your typing style.',
    buyingOrder: [
      'Pick the monitor and display cable path first.',
      'Add a hub only after you know what peripherals connect.',
      'Add external storage for backups and large files.',
      'Add a stand or VESA mount to clear desk space.',
      'Use the keyboard and mouse you already own until they block work.'
    ],
    items: [
      { label: 'Dell U2723DE or LG 27UP850', role: '27-inch 4K monitor with USB-C DisplayPort and daisy-chain support.', href: search('dell u2723de 27 inch 4k usb-c monitor'), kind: 'search', tier: 'must-have', check: 'Confirm USB-C alt mode works with your Mac mini generation.' },
      { label: 'CalDigit TS4 Thunderbolt dock', role: 'High-end Thunderbolt dock with display, power, and many ports.', href: search('caldigit ts4 thunderbolt 4 dock'), kind: 'search', tier: 'nice-next', check: 'TS4 is expensive but handles multiple displays and high-speed storage.' },
      { label: 'Anker USB-C hub with HDMI and USB-A', role: 'Budget hub for keyboard, mouse, drives, and one HDMI display.', href: search('anker usb-c hub hdmi 4k 5-in-1'), kind: 'search', tier: 'must-have', check: 'Cheaper hubs limit display resolution and refresh rate.' },
      { label: 'Samsung T7 or SanDisk Extreme portable SSD', role: 'Fast external SSD for Time Machine backups or large media files.', href: search('samsung t7 portable ssd 1tb'), kind: 'search', tier: 'must-have', check: 'Format as APFS or exFAT depending on macOS vs cross-platform use.' },
      { label: 'Twelve South HiRise stand for Mac mini', role: 'Desk stand with storage drawer underneath the mini.', href: search('twelve south hirise mac mini stand'), kind: 'search', tier: 'skip-until-needed', check: 'Only useful if desk space is tight and you need vertical stacking.' }
    ],
    related: [
      { href: '/guides/mac-mini-display-setup', title: 'Mac mini display setup', desc: 'Thunderbolt, USB-C, and HDMI display paths for Apple Silicon.' },
      { href: '/guides/usb-c-dock-compatibility', title: 'USB-C dock compatibility', desc: 'Match dock capabilities to Mac mini ports and display needs.' },
      { href: '/setups/apple-silicon-dev-desk', title: 'Apple Silicon dev desk', desc: 'Full desk build around Mac mini or Mac Studio for development work.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Mac mini desk kit', hook: 'Monitor, hub, storage, and stand. Skip the overpriced Apple peripherals unless you want them.', utmContent: 'mac_mini_desk_kit' },
      { channel: 'tiktok', title: 'Mac mini setup path', hook: '4K monitor, USB-C hub, external SSD. The rest is optional.', utmContent: 'mac_mini_setup_path' },
      { channel: 'reddit', title: 'Apple Silicon Mac mini desk', hook: 'Dell or LG USB-C monitor, CalDigit or Anker hub, Samsung T7 storage. The mini is silent when not buried under clutter.', utmContent: 'reddit_mac_mini_desk' }
    ],
    faqs: [
      { question: 'What monitor should I buy for Mac mini M2?', answer: 'A 27-inch 4K display with USB-C alt mode works well. Dell U2723DE or LG 27UP850 are solid choices.' },
      { question: 'Do I need a Thunderbolt dock for Mac mini?', answer: 'Not always. A cheaper USB-C hub works for basic peripherals. Thunderbolt docks help when you need multiple 4K displays or high-speed storage.' }
    ]
  },
  {
    slug: 'security-plus-study-desk-kit',
    title: 'Security+ study desk kit',
    seoTitle: 'Security+ study desk kit: lab gear, study tools, and practice exams for CompTIA | StackGeist',
    description: 'A Security+ study desk kit for hands-on practice, virtual labs, note-taking, flashcards, and exam readiness without overbuying gear.',
    audience: 'CompTIA Security+ candidates who need focused study gear and lab practice.',
    promise: 'Study smarter with the right tools instead of collecting study guides and never using them.',
    summary: 'One decent study setup, virtual lab access or home lab gear, quality practice exams, and note-taking tools that work for you.',
    buyingOrder: [
      'Use the desk and computer you already have.',
      'Buy one quality study book or course and commit to it.',
      'Add virtual lab access or build a small home lab for hands-on practice.',
      'Use free flashcard apps before buying physical cards or paid tools.',
      'Add practice exams only after finishing most of the study material.'
    ],
    items: [
      { label: 'Professor Messer Security+ videos and notes', role: 'Free video course and downloadable study notes.', href: search('professor messer security+ sy0-701'), kind: 'search', tier: 'must-have', check: 'Free and high-quality. Pair with a practice exam tool.' },
      { label: 'Dion Training Security+ practice exams', role: 'Realistic practice tests with detailed explanations.', href: search('jason dion security+ practice exams udemy'), kind: 'search', tier: 'must-have', check: 'Practice exams show weak areas before exam day.' },
      { label: 'VirtualBox or VMware Workstation', role: 'Run virtual machines for Linux, Windows Server, and security tools.', href: search('vmware workstation pro license'), kind: 'search', tier: 'nice-next', check: 'VirtualBox is free. VMware has better snapshot and networking tools.' },
      { label: 'Anki or Quizlet flashcard app', role: 'Spaced repetition flashcards for ports, acronyms, and concepts.', href: search('anki flashcard app security+'), kind: 'search', tier: 'nice-next', check: 'Free Anki works great. Paid Quizlet adds more shared decks.' },
      { label: 'CompTIA Security+ official study guide', role: 'Dense reference book for deep dives on exam objectives.', href: search('comptia security+ sy0-701 official study guide'), kind: 'search', tier: 'skip-until-needed', check: 'Only buy if you prefer reading over videos and need a reference.' }
    ],
    related: [
      { href: '/kits/network-plus-home-lab-kit', title: 'Network+ home lab kit', desc: 'Build a wired lab for networking and security practice.' },
      { href: '/guides/comptia-exam-voucher-discounts', title: 'CompTIA exam voucher discounts', desc: 'Save on exam fees with academic or bundle vouchers.' },
      { href: '/guides/virtual-lab-vs-home-lab', title: 'Virtual lab vs home lab', desc: 'When to use VMs versus physical network gear for studying.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Security+ study desk kit', hook: 'Professor Messer videos, Dion practice exams, VirtualBox labs, flashcards. No overpriced study bundles.', utmContent: 'security_plus_study_kit' },
      { channel: 'tiktok', title: 'Pass Security+ on a budget', hook: 'Free Messer videos, cheap Dion practice tests, virtual labs. Skip the $500 bootcamps.', utmContent: 'pass_security_plus_budget' },
      { channel: 'reddit', title: 'Security+ study path', hook: 'Messer for content, Dion for practice exams, VirtualBox for labs. Physical gear is optional.', utmContent: 'reddit_security_plus_path' }
    ],
    faqs: [
      { question: 'Do I need a home lab for Security+?', answer: 'No. Virtual labs with VirtualBox or cloud sandboxes work fine. A home lab helps but is not required.' },
      { question: 'What are the best Security+ study resources?', answer: 'Professor Messer videos (free), Dion practice exams (cheap), and hands-on practice with VMs or labs.' }
    ]
  },
  {
    slug: 'aws-cloud-practitioner-study-kit',
    title: 'AWS Cloud Practitioner study kit',
    seoTitle: 'AWS Cloud Practitioner study kit: free tier practice, study guides, and labs | StackGeist',
    description: 'An AWS Cloud Practitioner study kit for hands-on free tier practice, quality courses, flashcards, and exam preparation without wasting money.',
    audience: 'AWS Cloud Practitioner candidates who need practical study tools and free tier labs.',
    promise: 'Learn AWS services with hands-on practice instead of memorizing slides.',
    summary: 'One solid course, AWS free tier account, practice exams, and flashcards for services, pricing, and support plans.',
    buyingOrder: [
      'Sign up for AWS free tier and explore the console.',
      'Pick one quality course and finish it before buying more.',
      'Build simple projects with EC2, S3, RDS, and Lambda.',
      'Use flashcards for service names, use cases, and pricing models.',
      'Add practice exams only after covering all exam domains.'
    ],
    items: [
      { label: 'AWS free tier account', role: 'Hands-on practice with real AWS services without cost.', href: search('aws free tier account signup'), kind: 'search', tier: 'must-have', check: 'Monitor usage to avoid surprise charges outside free tier limits.' },
      { label: 'Stephane Maarek AWS CCP course', role: 'Popular Udemy course with lectures, slides, and practice questions.', href: search('stephane maarek aws cloud practitioner udemy'), kind: 'search', tier: 'must-have', check: 'Wait for Udemy sales and pay under $15 instead of full price.' },
      { label: 'Tutorials Dojo CCP practice exams', role: 'Realistic timed practice tests with detailed answer explanations.', href: search('tutorials dojo aws cloud practitioner practice exams'), kind: 'search', tier: 'must-have', check: 'Practice exams reveal weak areas before the real test.' },
      { label: 'Anki AWS flashcard deck', role: 'Spaced repetition for service names, features, pricing, and limits.', href: search('anki aws cloud practitioner flashcards'), kind: 'search', tier: 'nice-next', check: 'Free Anki decks exist. Make custom cards for services you forget.' },
      { label: 'AWS Skill Builder free courses', role: 'Official AWS training with modules, quizzes, and sandboxes.', href: search('aws skill builder cloud practitioner essentials'), kind: 'search', tier: 'skip-until-needed', check: 'Skill Builder is free but slower than third-party courses.' }
    ],
    related: [
      { href: '/guides/aws-free-tier-safety', title: 'AWS free tier safety', desc: 'Avoid surprise charges when learning AWS services.' },
      { href: '/guides/aws-cloud-practitioner-exam-tips', title: 'AWS Cloud Practitioner exam tips', desc: 'Focus areas, time management, and question strategies.' },
      { href: '/kits/cloud-support-study-desk-kit', title: 'Cloud support study desk kit', desc: 'General cloud support and help desk lab setup.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'AWS Cloud Practitioner study kit', hook: 'Free tier account, Stephane course, Tutorials Dojo exams, flashcards. Learn by doing, not just reading.', utmContent: 'aws_ccp_study_kit' },
      { channel: 'tiktok', title: 'Pass AWS CCP on a budget', hook: 'AWS free tier, $15 Udemy course, practice exams. Skip the overpriced bootcamps.', utmContent: 'pass_aws_ccp_budget' },
      { channel: 'reddit', title: 'AWS CCP study path', hook: 'Stephane Maarek course, Tutorials Dojo practice tests, hands-on free tier labs. Finish in 2 to 4 weeks.', utmContent: 'reddit_aws_ccp_path' }
    ],
    faqs: [
      { question: 'Is AWS free tier enough for Cloud Practitioner study?', answer: 'Yes. Free tier covers EC2, S3, RDS, Lambda, and other core services. Just monitor usage to avoid charges.' },
      { question: 'What is the best AWS Cloud Practitioner course?', answer: 'Stephane Maarek on Udemy is popular and affordable. AWS Skill Builder is free but slower.' }
    ]
  },
  {
    slug: 'docker-homelab-kit',
    title: 'Docker homelab kit',
    seoTitle: 'Docker homelab kit: containers, compose, networks, and self-hosted services | StackGeist',
    description: 'A Docker homelab kit for learning containers, Docker Compose, networking, volumes, and running self-hosted services without Kubernetes complexity.',
    audience: 'Developers and IT learners who want hands-on Docker practice at home.',
    promise: 'Learn containers with real services instead of following tutorials and forgetting them.',
    summary: 'One machine or VM running Docker, Docker Compose for multi-container apps, persistent volumes, reverse proxy, and simple self-hosted services to practice on.',
    buyingOrder: [
      'Install Docker on a spare machine, VM, or WSL2.',
      'Learn basic container and image commands before Compose.',
      'Deploy a simple service like Nginx or Pi-hole with Docker Compose.',
      'Add persistent volumes and networks for realistic multi-container setups.',
      'Add a reverse proxy like Traefik or Nginx Proxy Manager when you run multiple web services.'
    ],
    items: [
      { label: 'Docker Desktop or Docker CE', role: 'Container runtime for Windows, Mac, or Linux.', href: search('docker desktop windows install'), kind: 'search', tier: 'must-have', check: 'Docker Desktop works on Windows and Mac. Use Docker CE on Linux.' },
      { label: 'Portainer Community Edition', role: 'Web UI for managing containers, images, volumes, and networks.', href: search('portainer docker install compose'), kind: 'search', tier: 'must-have', check: 'Portainer simplifies container management but learn the CLI first.' },
      { label: 'Nginx Proxy Manager', role: 'Reverse proxy with SSL and domain routing for multiple web services.', href: search('nginx proxy manager docker compose'), kind: 'search', tier: 'nice-next', check: 'Only useful when you run multiple web apps on one host.' },
      { label: 'Docker Compose reference guide', role: 'Official docs and examples for writing compose files.', href: search('docker compose documentation'), kind: 'search', tier: 'nice-next', check: 'Compose simplifies multi-container apps. Start with simple examples.' },
      { label: 'Awesome-Selfhosted list', role: 'Curated list of self-hosted services to practice deploying.', href: search('awesome selfhosted github'), kind: 'search', tier: 'skip-until-needed', check: 'Pick beginner-friendly services like Pi-hole, Jellyfin, or Uptime Kuma.' }
    ],
    related: [
      { href: '/kits/proxmox-mini-pc-starter-kit', title: 'Proxmox mini PC starter kit', desc: 'Run Docker inside Proxmox VMs for isolated lab environments.' },
      { href: '/guides/docker-compose-basics', title: 'Docker Compose basics', desc: 'Write compose files for multi-container apps.' },
      { href: '/guides/docker-volume-and-network-guide', title: 'Docker volume and network guide', desc: 'Persist data and connect containers safely.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Docker homelab kit', hook: 'Docker, Compose, Portainer, reverse proxy. Deploy real services instead of just running hello-world.', utmContent: 'docker_homelab_kit' },
      { channel: 'tiktok', title: 'Learn Docker at home', hook: 'Install Docker, deploy Pi-hole or Jellyfin, learn volumes and networks. Skip Kubernetes until you need it.', utmContent: 'learn_docker_home' },
      { channel: 'reddit', title: 'Docker homelab path', hook: 'Docker Compose for multi-container apps, Portainer for management, Nginx Proxy Manager for reverse proxy. Real services beat tutorials.', utmContent: 'reddit_docker_homelab' }
    ],
    faqs: [
      { question: 'Do I need Kubernetes to learn containers?', answer: 'No. Start with Docker and Docker Compose. Kubernetes adds orchestration complexity that most homelabs do not need.' },
      { question: 'What self-hosted services should I run first?', answer: 'Start with simple apps like Pi-hole, Nginx, or Uptime Kuma. Avoid complex services until you understand volumes and networks.' }
    ]
  },
  {
    slug: 'self-hosted-media-server-kit',
    title: 'Self-hosted media server kit',
    seoTitle: 'Self-hosted media server kit: Plex, Jellyfin, storage, and streaming gear | StackGeist',
    description: 'A self-hosted media server kit for Plex or Jellyfin, large storage, network streaming, transcoding, and backup without subscription fees.',
    audience: 'Anyone tired of streaming service fees and fragmentation who owns media files.',
    promise: 'Stream your own library without monthly fees or licensing drama.',
    summary: 'One media server app, enough storage for your library, a capable host for transcoding, and backups before the drive dies.',
    buyingOrder: [
      'Pick Plex or Jellyfin based on features and client support.',
      'Use an existing PC or NAS before buying dedicated hardware.',
      'Add large storage for movies, shows, and music.',
      'Add a transcoding-capable CPU or GPU when remote streaming stutters.',
      'Back up the media library to external storage or cloud.'
    ],
    items: [
      { label: 'Plex or Jellyfin media server', role: 'Self-hosted streaming server with library organization and remote access.', href: search('plex media server download'), kind: 'search', tier: 'must-have', check: 'Plex is easier but has paid tiers. Jellyfin is free and open-source.' },
      { label: 'WD Red Plus or Seagate IronWolf NAS drive', role: 'Large reliable storage for media files.', href: search('wd red plus 8tb nas hard drive'), kind: 'search', tier: 'must-have', check: 'NAS drives are rated for 24/7 operation. Avoid desktop drives for servers.' },
      { label: 'QNAP or Synology 2-bay NAS', role: 'Dedicated NAS with RAID and remote access for media and backups.', href: search('qnap ts-264 2-bay nas'), kind: 'search', tier: 'nice-next', check: 'NAS simplifies storage and backups but costs more than a PC with drives.' },
      { label: 'Intel N100 or Ryzen mini PC', role: 'Low-power always-on server for Plex or Jellyfin with hardware transcoding.', href: search('n100 mini pc 16gb ram 512gb'), kind: 'search', tier: 'nice-next', check: 'Check CPU for Intel Quick Sync or AMD VCE transcoding support.' },
      { label: 'External backup drive', role: 'Offline backup for the media library when the main drive fails.', href: search('wd elements 14tb external hard drive'), kind: 'search', tier: 'must-have', check: 'Back up irreplaceable media. Replaceable rips can be redone.' }
    ],
    related: [
      { href: '/kits/nas-starter-kit', title: 'NAS starter kit', desc: 'Build or buy a NAS for media, backups, and file shares.' },
      { href: '/guides/plex-vs-jellyfin', title: 'Plex vs Jellyfin', desc: 'Feature comparison and client support for self-hosted media.' },
      { href: '/guides/media-server-transcoding-guide', title: 'Media server transcoding guide', desc: 'CPU and GPU requirements for smooth remote streaming.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Self-hosted media server kit', hook: 'Plex or Jellyfin, NAS drives, backup storage. Own your library instead of renting it monthly.', utmContent: 'self_hosted_media_server' },
      { channel: 'tiktok', title: 'Ditch streaming subscriptions', hook: 'Run Plex or Jellyfin, store your media, stream from anywhere. No monthly fees.', utmContent: 'ditch_streaming_subs' },
      { channel: 'reddit', title: 'Media server path', hook: 'Jellyfin for free or Plex for polish, WD Red drives, backup before the drive fails. Transcoding needs Quick Sync or VCE.', utmContent: 'reddit_media_server_path' }
    ],
    faqs: [
      { question: 'Should I use Plex or Jellyfin?', answer: 'Plex is easier with better apps and hardware transcoding. Jellyfin is free, open-source, and has no paid tiers.' },
      { question: 'What CPU do I need for a media server?', answer: 'For transcoding, use Intel with Quick Sync or AMD with VCE. For direct play only, any low-power CPU works.' }
    ]
  },
  {
    slug: 'nas-starter-kit',
    title: 'NAS starter kit',
    seoTitle: 'NAS starter kit: storage, RAID, backups, and network shares for home labs | StackGeist',
    description: 'A NAS starter kit for centralized storage, RAID redundancy, automated backups, file shares, and media serving without cloud subscription fees.',
    audience: 'Anyone with files scattered across multiple drives who needs centralized storage and backups.',
    promise: 'Centralize storage before losing files to a single drive failure.',
    summary: 'One NAS or DIY file server, RAID for redundancy, backup strategy, and network access for all devices.',
    buyingOrder: [
      'Decide between a pre-built NAS or DIY file server.',
      'Pick RAID level based on capacity and redundancy needs.',
      'Add backup strategy with external drives or cloud sync.',
      'Configure network shares for Windows, Mac, and Linux clients.',
      'Add services like media server or Docker only after storage works.'
    ],
    items: [
      { label: 'Synology DS224+ or QNAP TS-264', role: 'Pre-built 2-bay NAS with RAID, backups, and apps.', href: search('synology ds224+ 2-bay nas'), kind: 'search', tier: 'must-have', check: 'Synology has better software. QNAP offers more hardware for the price.' },
      { label: 'WD Red Plus NAS drives', role: 'Reliable 24/7-rated drives for RAID and always-on storage.', href: search('wd red plus 8tb nas drive'), kind: 'search', tier: 'must-have', check: 'Match drive count to NAS bays. Start with 2 drives for RAID 1.' },
      { label: 'Fractal Design Node 304 case and TrueNAS', role: 'DIY NAS with mini-ITX case, motherboard, and TrueNAS CORE or SCALE.', href: search('fractal design node 304 mini itx case'), kind: 'search', tier: 'nice-next', check: 'DIY NAS costs less but requires building and configuring yourself.' },
      { label: 'External backup drive', role: 'Offline backup for the NAS when drives fail or data gets deleted.', href: search('wd elements 14tb external hard drive'), kind: 'search', tier: 'must-have', check: 'RAID is not a backup. Always keep offline copies of important data.' },
      { label: 'UPS for NAS', role: 'Battery backup to shut down the NAS cleanly during power loss.', href: search('cyberpower cp1500pfclcd ups'), kind: 'search', tier: 'skip-until-needed', check: 'Only necessary when the NAS stores critical data or runs 24/7 services.' }
    ],
    related: [
      { href: '/kits/self-hosted-media-server-kit', title: 'Self-hosted media server kit', desc: 'Run Plex or Jellyfin on the NAS for streaming.' },
      { href: '/guides/raid-vs-backup', title: 'RAID vs backup', desc: 'Understand redundancy and backup before losing files.' },
      { href: '/guides/truenas-vs-synology', title: 'TrueNAS vs Synology', desc: 'Compare DIY and pre-built NAS options.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'NAS starter kit', hook: 'Synology or DIY TrueNAS, RAID drives, backup strategy. Centralize storage before the drives fail.', utmContent: 'nas_starter_kit' },
      { channel: 'tiktok', title: 'Stop using cloud storage', hook: 'Build a NAS, own your files, automate backups. No monthly fees.', utmContent: 'stop_cloud_storage' },
      { channel: 'reddit', title: 'NAS buying path', hook: 'Synology for ease, TrueNAS for DIY, WD Red drives, RAID 1 for 2-bay. Backup to external drives or cloud.', utmContent: 'reddit_nas_path' }
    ],
    faqs: [
      { question: 'Should I buy a pre-built NAS or build my own?', answer: 'Pre-built NAS (Synology, QNAP) is easier with better software. DIY TrueNAS costs less but needs building and configuration.' },
      { question: 'Is RAID enough for backups?', answer: 'No. RAID protects against drive failure but not accidental deletion, corruption, or ransomware. Always keep offline backups.' }
    ]
  },
  {
    slug: 'smart-home-starter-kit',
    title: 'Smart home starter kit',
    seoTitle: 'Smart home starter kit: lights, switches, sensors, and hub for automation | StackGeist',
    description: 'A smart home starter kit for smart lights, switches, sensors, hub, and simple automation without vendor lock-in or subscription fees.',
    audience: 'Homeowners or renters who want voice control and automation without rebuilding the house.',
    promise: 'Start with a few devices and expand without replacing everything when you switch platforms.',
    summary: 'One hub or platform, smart bulbs or switches, motion sensors, and automation rules that actually save time.',
    buyingOrder: [
      'Pick a platform or hub (Home Assistant, SmartThings, Alexa, HomeKit).',
      'Start with smart bulbs or switches in the most-used room.',
      'Add motion sensors for automation instead of manual voice control.',
      'Expand to other rooms only after the first room proves useful.',
      'Avoid proprietary ecosystems that lock you into one brand forever.'
    ],
    items: [
      { label: 'Philips Hue starter kit with bridge', role: 'Reliable smart bulbs and hub with wide platform support.', href: search('philips hue white and color starter kit bridge'), kind: 'search', tier: 'must-have', check: 'Hue works with most platforms but costs more than budget bulbs.' },
      { label: 'TP-Link Kasa smart plugs', role: 'Control lamps, fans, and appliances with app or voice.', href: search('tp-link kasa smart plug 4 pack'), kind: 'search', tier: 'must-have', check: 'Smart plugs work with dumb bulbs and devices. No hub needed.' },
      { label: 'Aqara motion and door sensors', role: 'Trigger lights, alarms, or scenes based on movement or entry.', href: search('aqara motion sensor zigbee hub'), kind: 'search', tier: 'nice-next', check: 'Aqara needs a hub but offers cheap Zigbee sensors.' },
      { label: 'Home Assistant on Raspberry Pi', role: 'Open-source hub for controlling and automating all smart devices.', href: search('home assistant raspberry pi 4 install'), kind: 'search', tier: 'nice-next', check: 'Home Assistant avoids vendor lock-in but needs more setup than Alexa or HomeKit.' },
      { label: 'SmartThings hub', role: 'Samsung hub for Zigbee and Z-Wave devices with cloud automation.', href: search('samsung smartthings hub v3'), kind: 'search', tier: 'skip-until-needed', check: 'SmartThings works but relies on cloud. Consider Home Assistant for local control.' }
    ],
    related: [
      { href: '/guides/smart-home-platform-comparison', title: 'Smart home platform comparison', desc: 'Compare Alexa, Google, HomeKit, SmartThings, and Home Assistant.' },
      { href: '/guides/zigbee-vs-wifi-smart-devices', title: 'Zigbee vs WiFi smart devices', desc: 'Pick the right wireless protocol for your home.' },
      { href: '/kits/openhue', title: 'OpenHue control', desc: 'Control Philips Hue lights without the official app.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Smart home starter kit', hook: 'Hue bulbs, Kasa plugs, motion sensors, Home Assistant. Automate without vendor lock-in.', utmContent: 'smart_home_starter_kit' },
      { channel: 'tiktok', title: 'Start a smart home', hook: 'Pick a platform, add smart bulbs or plugs, automate with sensors. Expand one room at a time.', utmContent: 'start_smart_home' },
      { channel: 'reddit', title: 'Smart home automation path', hook: 'Home Assistant for local control, Hue or Kasa for devices, Aqara sensors for automation. Avoid cloud-only hubs.', utmContent: 'reddit_smart_home_path' }
    ],
    faqs: [
      { question: 'What smart home platform should I start with?', answer: 'Alexa or Google for simplicity, HomeKit for Apple users, Home Assistant for local control and no vendor lock-in.' },
      { question: 'Should I buy smart bulbs or smart switches?', answer: 'Smart bulbs work in rentals and offer color. Smart switches work with dumb bulbs and control ceiling fixtures.' }
    ]
  },
  {
    slug: 'thermal-paste-repair-kit',
    title: 'Thermal paste and repair kit',
    seoTitle: 'Thermal paste and repair kit: CPU repasting, thermal pads, and heat fixes | StackGeist',
    description: 'A thermal paste and repair kit for CPU and GPU repasting, thermal pad replacement, cleaning, and heat troubleshooting on PCs and laptops.',
    audience: 'PC builders and repair techs who need proper thermal paste, pads, cleaners, and tools.',
    promise: 'Fix overheating with proper paste and technique instead of replacing working hardware.',
    summary: 'Quality thermal paste, isopropyl alcohol, lint-free wipes, thermal pads, and plastic tools for safe disassembly.',
    buyingOrder: [
      'Clean old paste with isopropyl alcohol and lint-free wipes.',
      'Apply new thermal paste in the correct pattern for the chip.',
      'Replace thermal pads only when they are cracked or missing.',
      'Test temperatures before and after to confirm improvement.',
      'Keep paste and tools for future builds and repairs.'
    ],
    items: [
      { label: 'Arctic MX-4 or MX-6 thermal paste', role: 'Reliable non-conductive thermal paste for CPUs and GPUs.', href: search('arctic mx-4 thermal paste 4g'), kind: 'search', tier: 'must-have', check: 'MX-4 is proven and affordable. MX-6 offers slightly better performance.' },
      { label: 'Isopropyl alcohol 90% or higher', role: 'Clean old thermal paste and oils before applying new paste.', href: search('isopropyl alcohol 99% electronics'), kind: 'search', tier: 'must-have', check: 'Use 90% or higher. Lower concentrations leave residue.' },
      { label: 'Lint-free microfiber or coffee filters', role: 'Wipe surfaces clean without leaving fibers on the chip.', href: search('lint free microfiber cleaning cloths'), kind: 'search', tier: 'must-have', check: 'Coffee filters work in a pinch but microfiber is reusable.' },
      { label: 'Thermal pad assortment', role: 'Replace missing or degraded pads on VRMs, memory, and chips.', href: search('thermal pad assortment 0.5mm 1mm 1.5mm'), kind: 'search', tier: 'nice-next', check: 'Match pad thickness to the original gap. Too thick or thin ruins contact.' },
      { label: 'Plastic spudger and pry tool set', role: 'Open laptop cases and remove clips without damaging plastic.', href: search('plastic spudger pry tool set laptop'), kind: 'search', tier: 'nice-next', check: 'Metal tools scratch and short components. Use plastic for safe disassembly.' }
    ],
    related: [
      { href: '/guides/how-to-apply-thermal-paste', title: 'How to apply thermal paste', desc: 'Application patterns, amount, and common mistakes.' },
      { href: '/guides/laptop-repasting-guide', title: 'Laptop repasting guide', desc: 'Disassemble and repaste laptops safely.' },
      { href: '/guides/thermal-pad-replacement', title: 'Thermal pad replacement', desc: 'When and how to replace thermal pads on GPUs and laptops.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Thermal paste and repair kit', hook: 'Arctic paste, isopropyl alcohol, lint-free wipes, thermal pads. Fix heat before replacing parts.', utmContent: 'thermal_paste_repair_kit' },
      { channel: 'tiktok', title: 'Repaste a CPU', hook: 'Clean with isopropyl, apply a pea-sized dot, spread evenly. Do not use too much paste.', utmContent: 'repaste_cpu' },
      { channel: 'reddit', title: 'PC thermal paste path', hook: 'Arctic MX-4 or MX-6, 99% isopropyl, microfiber wipes. Thermal pads only when cracked or missing.', utmContent: 'reddit_thermal_paste_path' }
    ],
    faqs: [
      { question: 'How much thermal paste should I use?', answer: 'A pea-sized dot in the center for most CPUs. Spread evenly or let the heatsink spread it. Too much paste hurts cooling.' },
      { question: 'When should I replace thermal paste?', answer: 'Every 3 to 5 years, or when temps rise and throttling occurs. New builds need paste immediately.' }
    ]
  },
  {
    slug: 'laptop-repair-toolkit',
    title: 'Laptop repair toolkit',
    seoTitle: 'Laptop repair toolkit: screwdrivers, pry tools, and parts for DIY fixes | StackGeist',
    description: 'A laptop repair toolkit for opening cases, replacing screens, swapping batteries, upgrading storage, and fixing common laptop hardware issues.',
    audience: 'DIY repair techs and laptop owners tired of expensive repair shop fees.',
    promise: 'Fix common laptop problems yourself instead of paying $150 for a $20 part.',
    summary: 'Precision screwdrivers, plastic pry tools, anti-static gear, thermal paste, replacement parts, and patience.',
    buyingOrder: [
      'Research the specific repair before buying tools or parts.',
      'Buy a precision screwdriver set with magnetic tips.',
      'Add plastic pry tools and spudgers for safe case opening.',
      'Buy OEM or high-quality replacement parts, not the cheapest option.',
      'Test the repair before fully reassembling the laptop.'
    ],
    items: [
      { label: 'iFixit Mako precision screwdriver set', role: 'Comprehensive bit set for laptop screws and electronics.', href: search('ifixit mako precision screwdriver set'), kind: 'search', tier: 'must-have', check: 'Magnetic tips and good quality bits prevent stripped screws.' },
      { label: 'Plastic spudger and pry tool set', role: 'Open laptop cases and remove clips without scratching or cracking.', href: search('plastic spudger pry tool set laptop'), kind: 'search', tier: 'must-have', check: 'Metal tools damage cases and short components. Use plastic only.' },
      { label: 'Anti-static wrist strap', role: 'Prevent static discharge from damaging laptop components.', href: search('anti-static wrist strap grounding'), kind: 'search', tier: 'must-have', check: 'Clip to grounded metal before touching internal parts.' },
      { label: 'Replacement laptop battery', role: 'Swap worn batteries that no longer hold charge.', href: search('replacement laptop battery model number'), kind: 'search', tier: 'nice-next', check: 'Match exact model number. Cheap knockoff batteries swell or fail.' },
      { label: 'Laptop screen replacement', role: 'Replace cracked or dim screens yourself.', href: search('laptop screen replacement panel model number'), kind: 'search', tier: 'skip-until-needed', check: 'Match screen size, resolution, and connector type exactly.' }
    ],
    related: [
      { href: '/guides/laptop-disassembly-guide', title: 'Laptop disassembly guide', desc: 'Safely open and repair laptops without breaking clips.' },
      { href: '/guides/laptop-battery-replacement', title: 'Laptop battery replacement', desc: 'Swap laptop batteries and recalibrate charge reporting.' },
      { href: '/kits/thermal-paste-repair-kit', title: 'Thermal paste and repair kit', desc: 'Repaste CPUs and GPUs in laptops.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Laptop repair toolkit', hook: 'Precision screwdrivers, pry tools, anti-static strap. Fix laptops yourself instead of paying repair shops.', utmContent: 'laptop_repair_toolkit' },
      { channel: 'tiktok', title: 'DIY laptop repair', hook: 'iFixit screwdrivers, plastic spudgers, anti-static strap. Research first, then repair.', utmContent: 'diy_laptop_repair' },
      { channel: 'reddit', title: 'Laptop repair path', hook: 'iFixit Mako set, plastic tools, OEM parts. Watch teardown videos before opening the case.', utmContent: 'reddit_laptop_repair_path' }
    ],
    faqs: [
      { question: 'What tools do I need to open a laptop?', answer: 'Precision screwdrivers (often PH0 or PH1), plastic pry tools, and patience. Check iFixit or YouTube for your specific model.' },
      { question: 'Can I replace a laptop screen myself?', answer: 'Yes, if you have the right tools and replacement panel. Match screen size, resolution, and connector type exactly.' }
    ]
  },
  {
    slug: 'drawing-tablet-desk-kit',
    title: 'Drawing tablet desk kit',
    seoTitle: 'Drawing tablet desk kit: pen displays, stands, and accessories for digital art | StackGeist',
    description: 'A drawing tablet desk kit for pen displays, screen protectors, stands, gloves, and software for digital illustration and design work.',
    audience: 'Digital artists and designers setting up a drawing tablet workspace.',
    promise: 'Comfortable drawing setup before blaming the tablet for wrist pain.',
    summary: 'One solid pen display or tablet, proper stand angle, screen protector, drawing glove, and software that matches your workflow.',
    buyingOrder: [
      'Decide between a pen display (with screen) or graphics tablet (no screen).',
      'Add a stand or arm to angle the tablet for wrist comfort.',
      'Add a matte screen protector for texture and less glare.',
      'Add a drawing glove to reduce friction and palm rejection issues.',
      'Test free software before buying expensive illustration apps.'
    ],
    items: [
      { label: 'XP-Pen Artist 13.3 or 15.6 pen display', role: 'Affordable pen display with screen for direct drawing.', href: search('xp-pen artist 15.6 pro pen display'), kind: 'search', tier: 'must-have', check: 'Pen displays are easier to learn than screenless tablets.' },
      { label: 'Wacom One or Intuos graphics tablet', role: 'Screenless tablet for illustration with hand-eye coordination practice.', href: search('wacom intuos medium graphics tablet'), kind: 'search', tier: 'must-have', check: 'Graphics tablets cost less but require learning to draw without looking at the pen.' },
      { label: 'Adjustable tablet stand or VESA arm', role: 'Angle the pen display for neutral wrist posture.', href: search('adjustable tablet stand pen display'), kind: 'search', tier: 'must-have', check: 'Flat tablets cause wrist strain. Angle the screen to 15 to 30 degrees.' },
      { label: 'Matte screen protector', role: 'Add texture and reduce glare on glossy pen displays.', href: search('matte screen protector xp-pen artist'), kind: 'search', tier: 'nice-next', check: 'Match screen size exactly. Matte texture mimics paper feel.' },
      { label: 'Artist drawing glove', role: 'Reduce hand friction and prevent accidental palm touches.', href: search('artist drawing glove two finger'), kind: 'search', tier: 'nice-next', check: 'Two-finger gloves let the pen hand glide while leaving other fingers free.' }
    ],
    related: [
      { href: '/guides/pen-display-vs-graphics-tablet', title: 'Pen display vs graphics tablet', desc: 'Compare screen and screenless tablets for digital art.' },
      { href: '/guides/drawing-tablet-wrist-setup', title: 'Drawing tablet wrist setup', desc: 'Fix wrist angle and reduce strain from long drawing sessions.' },
      { href: '/gear/creative/wacom-cintiq-pro', title: 'Wacom Cintiq Pro', desc: 'High-end pen display for professional illustration and design.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Drawing tablet desk kit', hook: 'Pen display, adjustable stand, screen protector, drawing glove. Fix wrist angle before blaming the tablet.', utmContent: 'drawing_tablet_desk_kit' },
      { channel: 'tiktok', title: 'Set up a drawing tablet', hook: 'Angle the screen, add a matte protector, use a glove. Flat tablets wreck wrists.', utmContent: 'setup_drawing_tablet' },
      { channel: 'reddit', title: 'Digital art tablet path', hook: 'XP-Pen or Wacom for the tablet, adjustable stand, matte screen protector. Test Krita or GIMP before buying Clip Studio or Photoshop.', utmContent: 'reddit_digital_art_tablet' }
    ],
    faqs: [
      { question: 'Should I buy a pen display or graphics tablet?', answer: 'Pen displays (with screen) are easier to learn. Graphics tablets (no screen) cost less but require hand-eye coordination practice.' },
      { question: 'Do I need a screen protector on a pen display?', answer: 'Matte screen protectors add texture and reduce glare. They are optional but many artists prefer the paper-like feel.' }
    ]
  },
  {
    slug: 'python-data-science-desk-kit',
    title: 'Python data science desk kit',
    seoTitle: 'Python data science desk kit: study gear, tools, and practice resources | StackGeist',
    description: 'A Python data science desk kit for Jupyter notebooks, courses, practice datasets, desk setup, and learning resources for analytics and machine learning.',
    audience: 'Students and career changers learning Python, pandas, and data science.',
    promise: 'Learn by doing with real datasets instead of watching endless tutorial videos.',
    summary: 'One solid course, Jupyter or VSCode setup, practice datasets, study desk gear, and hands-on projects that build a portfolio.',
    buyingOrder: [
      'Pick one quality Python course and commit to finishing it.',
      'Set up Jupyter, VSCode, or Google Colab for notebooks.',
      'Practice with real datasets from Kaggle or public sources.',
      'Build simple projects and share them on GitHub.',
      'Add study desk gear only after the learning workflow proves consistent.'
    ],
    items: [
      { label: 'Python for Data Analysis book', role: 'Wes McKinney pandas guide and reference for data manipulation.', href: search('python for data analysis wes mckinney'), kind: 'search', tier: 'must-have', check: 'The official pandas creator guide. Dense but comprehensive.' },
      { label: 'Kaggle Learn courses and datasets', role: 'Free courses and real datasets for hands-on practice.', href: search('kaggle learn python data science'), kind: 'search', tier: 'must-have', check: 'Kaggle offers free courses, datasets, and competitions for practice.' },
      { label: 'Jupyter Notebook or VSCode with extensions', role: 'Interactive coding environment for data analysis and visualization.', href: search('jupyter notebook install python'), kind: 'search', tier: 'must-have', check: 'Jupyter is standard for data science. VSCode works with Jupyter extensions.' },
      { label: 'Dual monitor or large single display', role: 'Code on one screen, docs or output on the other.', href: search('dell 27 inch 4k monitor usb-c'), kind: 'search', tier: 'nice-next', check: 'Screen space helps but is not required. Start with one good monitor.' },
      { label: 'Quality keyboard for long coding sessions', role: 'Comfortable typing for data cleaning scripts and analysis notebooks.', href: search('keychron mechanical keyboard hot swap'), kind: 'search', tier: 'skip-until-needed', check: 'Only upgrade if keyboard discomfort blocks daily practice.' }
    ],
    related: [
      { href: '/kits/wgu-software-engineering-desk-kit', title: 'WGU software engineering desk kit', desc: 'Study desk setup for coding and school.' },
      { href: '/guides/jupyter-vs-vscode-data-science', title: 'Jupyter vs VSCode for data science', desc: 'Pick the right coding environment for notebooks and analysis.' },
      { href: '/guides/kaggle-competitions-beginner', title: 'Kaggle competitions for beginners', desc: 'Start with simple competitions to build portfolio projects.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Python data science desk kit', hook: 'Wes McKinney book, Kaggle datasets, Jupyter setup. Learn by doing, not watching.', utmContent: 'python_data_science_kit' },
      { channel: 'tiktok', title: 'Learn Python data science', hook: 'Take a course, code in Jupyter, practice on Kaggle datasets. Build projects, not just notes.', utmContent: 'learn_python_data_science' },
      { channel: 'reddit', title: 'Data science learning path', hook: 'Python for Data Analysis book, Kaggle for practice, Jupyter or VSCode for coding. Projects beat tutorials.', utmContent: 'reddit_data_science_path' }
    ],
    faqs: [
      { question: 'What is the best way to learn Python for data science?', answer: 'Take one course, practice with real datasets on Kaggle, and build projects. Books like Python for Data Analysis help as references.' },
      { question: 'Do I need Jupyter Notebook or can I use VSCode?', answer: 'Both work. Jupyter is standard for data science. VSCode supports Jupyter notebooks and offers better version control.' }
    ]
  },
  {
    slug: 'cert-exam-remote-proctor-kit',
    title: 'Cert exam remote proctor kit',
    seoTitle: 'Cert exam remote proctor kit: webcam, lighting, and room setup for online tests | StackGeist',
    description: 'A cert exam remote proctor kit for online certification exams with webcam, lighting, room rules, ID check, and troubleshooting proctoring software.',
    audience: 'Certification candidates taking remote proctored exams at home.',
    promise: 'Pass the proctor room check without buying new furniture or gear.',
    summary: 'Working webcam, front lighting, clear desk, quiet room, valid ID, and proctor software prep before exam day.',
    buyingOrder: [
      'Read the exam proctor requirements from the testing company.',
      'Test your webcam, microphone, and internet connection.',
      'Clear the desk and room of prohibited items.',
      'Add front lighting if your face is dark or backlit on camera.',
      'Run the proctor software system check days before the exam.'
    ],
    items: [
      { label: 'Logitech C920x or C922 webcam', role: 'Reliable webcam for proctor software and ID verification.', href: search('logitech c920x hd webcam'), kind: 'search', tier: 'must-have', check: 'Test the camera with the proctor software before exam day.' },
      { label: 'Clamp-on LED desk lamp', role: 'Front light for face visibility during proctored exam.', href: search('clamp on led desk lamp'), kind: 'search', tier: 'must-have', check: 'Backlit faces fail proctor checks. Light your face from the front.' },
      { label: 'Wired headset with microphone', role: 'Backup audio option when laptop mic fails or picks up noise.', href: search('wired headset with microphone usb'), kind: 'search', tier: 'nice-next', check: 'Some proctors allow headsets, others ban them. Check exam rules.' },
      { label: 'Ethernet cable for wired connection', role: 'Stable internet connection during the exam without WiFi dropouts.', href: search('cat6 ethernet cable 25ft'), kind: 'search', tier: 'nice-next', check: 'Wired Ethernet beats WiFi for exam stability.' },
      { label: 'Whiteboard or scratch paper and marker', role: 'Allowed scratch work tools for some exams.', href: search('small whiteboard erasable exam scratch'), kind: 'search', tier: 'skip-until-needed', check: 'Check exam rules. Some allow whiteboards, others ban all scratch materials.' }
    ],
    related: [
      { href: '/kits/budget-video-call-kit', title: 'Budget video call kit', desc: 'Webcam, lighting, and audio fixes for calls and interviews.' },
      { href: '/guides/remote-proctor-room-setup', title: 'Remote proctor room setup', desc: 'Pass the proctor room scan without surprises.' },
      { href: '/guides/pearson-vue-proctor-troubleshooting', title: 'Pearson VUE proctor troubleshooting', desc: 'Fix proctor software and check-in issues.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Cert exam remote proctor kit', hook: 'Webcam, front light, clear desk, wired internet. Pass the proctor check before the exam starts.', utmContent: 'cert_exam_proctor_kit' },
      { channel: 'tiktok', title: 'Pass the proctor room check', hook: 'Clear the desk, light your face, test the webcam, wire the internet. Do not wait until exam day.', utmContent: 'pass_proctor_room_check' },
      { channel: 'reddit', title: 'Remote exam proctor path', hook: 'Logitech webcam, front lighting, clear desk, Ethernet connection. Run the system check days early.', utmContent: 'reddit_remote_exam_proctor' }
    ],
    faqs: [
      { question: 'What should I do before a remote proctored exam?', answer: 'Run the system check, test webcam and mic, clear the desk and room, light your face, and use wired internet if possible.' },
      { question: 'Can I use a second monitor during a proctored exam?', answer: 'Most proctors ban second monitors. Check your exam rules and disconnect extra displays before check-in.' }
    ]
  },
  {
    slug: 'portable-power-station-desk-kit',
    title: 'Portable power station desk kit',
    seoTitle: 'Portable power station desk kit: battery backup, solar, and mobile power | StackGeist',
    description: 'A portable power station desk kit for battery backup during outages, remote work, outdoor setups, solar charging, and emergency power.',
    audience: 'Remote workers and desk users who need backup power during outages or off-grid setups.',
    promise: 'Keep working when the power fails instead of losing hours to outages.',
    summary: 'One portable power station with enough capacity, solar panel option, charging cables, and power strip for desk gear.',
    buyingOrder: [
      'Calculate total wattage of desk gear you want to run during an outage.',
      'Buy a portable power station with capacity and output to match.',
      'Add solar panels only if you plan off-grid use or multi-day outages.',
      'Keep charging cables and adapters organized for quick setup.',
      'Test the power station before an actual outage.'
    ],
    items: [
      { label: 'Anker 767 or EcoFlow Delta 2', role: 'Portable power station with AC outlets, USB, and USB-C for desk gear.', href: search('anker 767 portable power station 2048wh'), kind: 'search', tier: 'must-have', check: 'Match capacity (Wh) to your runtime needs. 1000Wh runs a laptop and monitor for hours.' },
      { label: 'Jackery SolarSaga 100W panel', role: 'Foldable solar panel for recharging the power station off-grid.', href: search('jackery solarsaga 100w solar panel'), kind: 'search', tier: 'nice-next', check: 'Solar panels recharge slowly. Only useful for extended outages or camping.' },
      { label: 'Surge protector power strip', role: 'Connect multiple devices to the power station safely.', href: search('surge protector power strip 6 outlets'), kind: 'search', tier: 'must-have', check: 'Do not daisy-chain power strips or overload the power station output.' },
      { label: 'Extension cable for AC output', role: 'Reach desk gear from the power station on the floor.', href: search('extension cord 10ft grounded'), kind: 'search', tier: 'nice-next', check: 'Keep the extension short to avoid voltage drop on high-wattage devices.' },
      { label: 'USB-C to USB-C cable for laptop charging', role: 'Charge USB-C laptops directly from the power station USB-C port.', href: search('usb-c to usb-c cable 100w 6ft'), kind: 'search', tier: 'must-have', check: 'Check power station USB-C wattage. Some ports are low-power and will not charge laptops.' }
    ],
    related: [
      { href: '/guides/portable-power-station-sizing', title: 'Portable power station sizing', desc: 'Calculate wattage and runtime for your desk gear.' },
      { href: '/guides/solar-panel-power-station-guide', title: 'Solar panel and power station guide', desc: 'Recharge power stations with solar panels effectively.' },
      { href: '/kits/backup-recovery-desk-kit', title: 'Backup and recovery desk kit', desc: 'UPS and backup strategies for desk gear and data.' }
    ],
    socialAngles: [
      { channel: 'pinterest', title: 'Portable power station desk kit', hook: 'Battery backup, solar option, power strip. Keep working when the grid fails.', utmContent: 'portable_power_station_kit' },
      { channel: 'tiktok', title: 'Desk power during outages', hook: 'Portable power station runs laptop, monitor, router. Solar panels extend runtime.', utmContent: 'desk_power_outages' },
      { channel: 'reddit', title: 'Power station desk backup', hook: 'Anker or EcoFlow for capacity, solar panels for off-grid. Calculate wattage before buying.', utmContent: 'reddit_power_station_backup' }
    ],
    faqs: [
      { question: 'What size portable power station do I need for a desk setup?', answer: 'Calculate total wattage of laptop, monitor, router, and accessories. A 1000Wh station runs a typical desk for 2 to 4 hours.' },
      { question: 'Should I add solar panels to a portable power station?', answer: 'Only if you plan off-grid use or multi-day outages. Solar recharge is slow and weather-dependent.' }
    ]
  }
];
