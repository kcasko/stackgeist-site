// Gear options surfaced on each gaming setup page.
// Links use Amazon search with the deskrespawn-20 affiliate tag so we never
// promote a specific ASIN we haven't verified. Internal links point at the
// existing in-depth /gear pages when we have one.
//
// Tiers: budget | mid | premium
// Kind: 'internal' (has a verified StackGeist page) | 'search' (Amazon search)

export type PickKind = 'internal' | 'search';
export type Tier = 'budget' | 'mid' | 'premium';

export interface Pick {
  tier: Tier;
  label: string;             // Product / class name
  why: string;               // Short reason it fits this setup
  href: string;              // Internal path or Amazon search URL
  kind: PickKind;
  price?: string;            // Optional rough price band, e.g. "≈ $120"
  note?: string;             // Optional caveat / check-before-buying line
  image?: string;            // Optional /gear/<file>.jpg product photo (from public/)
}

export interface Category {
  slug: string;
  name: string;
  role: string;              // One-line: why this category matters here
  picks: Pick[];
}

export interface SetupOptions {
  slug: string;              // matches /setups/<slug>
  title: string;
  summary: string;           // 1-liner shown above the grid
  categories: Category[];
  // Optional metadata used by the generic setup page + index card
  kicker?: string;           // eyebrow label
  headline?: string;         // hero h1
  lead?: string;             // hero paragraph
  facts?: { label: string; value: string }[];
  family?: 'gaming' | 'creator' | 'workstation' | 'living-room' | 'sim' | 'audio';
}

const TAG = 'deskrespawn-20';
const search = (q: string) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${TAG}`;

// ---------------------------------------------------------------------------
// Shared category building blocks. Each setup composes from these + overrides.
// ---------------------------------------------------------------------------

const desk = (extras: Partial<Category> = {}): Category => ({
  slug: 'desk',
  name: 'Desk',
  role: 'The surface everything else has to fit on. Measure the room before the desk.',
  picks: [
    { tier: 'budget', label: 'IKEA LAGKAPTEN + ADILS legs', why: 'Cheap, wide, easy to reroute cables under. Common gaming-desk starting point.', href: 'https://www.ikea.com/us/en/p/lagkapten-adils-desk-black-brown-black-s89417151/', kind: 'search', price: '≈ $70' },
    { tier: 'mid', label: 'Flexispot / VIVO electric standing desk (48–60")', why: 'Sit-stand adds working posture options without a huge price jump. Confirm depth against your monitor arm reach.', href: search('electric standing desk 48 inch'), kind: 'search', price: '$250–$400' , image: '/gear/amz/7569e9701515.jpg' },
    { tier: 'premium', label: 'Uplift V2 or Secretlab Magnus Pro', why: 'Better frame stability, larger tops, integrated cable trays. Worth it if the setup is permanent.', href: search('uplift v2 standing desk'), kind: 'search', price: '$600+' , image: '/gear/amz/f111bab80050.jpg' },
  ],
  ...extras,
});

const chair = (extras: Partial<Category> = {}): Category => ({
  slug: 'chair',
  name: 'Chair',
  role: 'Where you actually spend the hours. Fit beats brand and RGB.',
  picks: [
    { tier: 'budget', label: 'Staples Hyken / used Herman Miller', why: 'Mesh back, adjustable arms, headrest. Used enterprise chairs punch far above their price.', href: search('staples hyken mesh chair'), kind: 'search', price: '$150–$250' , image: '/gear/amz/f1bc244fc908.jpg' },
    { tier: 'mid', label: 'Secretlab Titan Evo / Vertagear SL5000', why: 'Well-reviewed gaming chairs with real lumbar and 4D arms. Match seat size to your height/weight.', href: search('secretlab titan evo'), kind: 'search', price: '$450–$550' , image: '/gear/amz/f0d6a0374f46.jpg' },
    { tier: 'premium', label: 'Herman Miller Embody / Steelcase Leap V2', why: 'Ergonomic seating built for 8+ hour days. Try before buying if possible.', href: search('herman miller embody'), kind: 'search', price: '$1,000+' , image: '/gear/amz/6019e72b30ac.jpg' },
  ],
  ...extras,
});

const monitor = (extras: Partial<Category> = {}): Category => ({
  slug: 'monitor',
  name: 'Monitor',
  role: 'Refresh rate and panel size drive the rest of the desk more than any other purchase.',
  picks: [
    { tier: 'budget', label: '24" 1080p 144Hz IPS (LG / AOC / KTC)', why: 'Fast enough for competitive play, small enough to fit a shallow desk.', href: search('24 inch 1080p 144hz ips monitor'), kind: 'search', price: '$120–$180' },
    { tier: 'mid', label: '27" 1440p 165–180Hz IPS (LG 27GP83B, Gigabyte M27Q)', why: 'The current sweet spot for mixed gaming and work. Verify the arm/stand supports its weight.', href: search('27 inch 1440p 165hz ips monitor'), kind: 'search', price: '$250–$350' },
    { tier: 'premium', label: '32" 4K OLED / 34" ultrawide (LG 32GS95UE, Alienware AW3423DWF)', why: 'Immersion + workspace. Confirm GPU can drive it and desk depth supports viewing distance.', href: search('32 inch 4k oled gaming monitor'), kind: 'search', price: '$700+' },
  ],
  ...extras,
});

const monitorMount = (extras: Partial<Category> = {}): Category => ({
  slug: 'monitor-mount',
  name: 'Monitor mount',
  role: 'Reclaims the deepest usable strip of the desk and fixes bad viewing height.',
  picks: [
    { tier: 'budget', label: 'HUANUO / VIVO single-monitor arm', why: 'Cheap gas-spring arm that handles most 24–27" panels. Check VESA + desk edge thickness.', href: search('huanuo single monitor arm'), kind: 'search', price: '$30–$50' , image: '/gear/amz/9147801274db.jpg' },
    { tier: 'mid', label: 'Amazon Basics dual gas-spring arm', why: 'For two 15–27" VESA monitors, 4.4–15.4 lb each. Check monitor weight and desk thickness before buying.', href: '/gear/monitor-support/amazon-basics-dual-monitor-arm', kind: 'internal', price: '≈ $110', image: '/gear/amazon-basics-dual-monitor-arm.jpg' },
    { tier: 'premium', label: 'Ergotron LX Tall Pole', why: 'Adjustable monitor support after display weight, VESA pattern, depth, desk construction and clamp geometry pass.', href: '/gear/monitor-support/ergotron-lx', kind: 'internal', price: '≈ $200', image: '/gear/ergotron-lx.jpg' },
  ],
  ...extras,
});

const keyboard = (extras: Partial<Category> = {}): Category => ({
  slug: 'keyboard',
  name: 'Keyboard',
  role: 'Layout width dictates mouse arm angle. Pick the size before the switches.',
  picks: [
    { tier: 'budget', label: 'Redragon K552 / Royal Kludge RK61', why: 'Cheap TKL or 60% mechanical to reclaim mouse space. Skip if you actually use the numpad.', href: search('redragon k552 mechanical keyboard'), kind: 'search', price: '$35–$60' , image: '/gear/amz/bddf99e3c8ae.jpg' },
    { tier: 'mid', label: 'Keychron K2 / V-series wireless', why: 'Hot-swap switches, wired or Bluetooth, sensible 75%/TKL layouts.', href: search('keychron k2 wireless mechanical keyboard'), kind: 'search', price: '$80–$130' , image: '/gear/amz/492329663f74.jpg' },
    { tier: 'premium', label: 'Keychron V6 Max (full-size)', why: 'A full-size wireless mechanical board whose numpad, height, switches, and 447.9 mm width all need to earn their space.', href: '/gear/input/keychron-v6-max', kind: 'internal', price: '≈ $200', image: '/gear/keychron-v6-max.jpg' },
  ],
  ...extras,
});

const mouse = (extras: Partial<Category> = {}): Category => ({
  slug: 'mouse',
  name: 'Mouse',
  role: 'Shape has to match your hand and grip style before sensor specs matter.',
  picks: [
    { tier: 'budget', label: 'Logitech G203 / Glorious Model O-', why: 'Well-shaped, light, honest sensor. Fine for competitive play at a low price.', href: search('logitech g203 lightsync mouse'), kind: 'search', price: '$25–$40' , image: '/gear/amz/4fcbdd84aff7.jpg' },
    { tier: 'mid', label: 'Razer DeathAdder V3 / Logitech G Pro X Superlight 2', why: 'Wireless, low weight, top sensors. Match shape to grip: claw vs palm.', href: search('razer deathadder v3 wireless'), kind: 'search', price: '$80–$160' , image: '/gear/amz/ca8a74a019ab.jpg' },
    { tier: 'premium', label: 'Logitech MX Master 3S (workflow)', why: 'Workflow controls for right-handed desk work when the setup is mostly work with some gaming.', href: '/gear/input/logitech-mx-master-3s', kind: 'internal', price: '≈ $100', image: '/gear/logitech-mx-master-3s.png' },
  ],
  ...extras,
});

const mousepad = (extras: Partial<Category> = {}): Category => ({
  slug: 'mousepad',
  name: 'Desk surface / mousepad',
  role: 'A large deskmat unifies keyboard, mouse and wrist support. Measure usable depth first.',
  picks: [
    { tier: 'budget', label: 'Generic XXL cloth pad (36×12")', why: 'Cheap way to lock down keyboard, mouse and cables in one flat zone.', href: search('xxl gaming mousepad 36 x 12'), kind: 'search', price: '$15–$25' },
    { tier: 'mid', label: 'SteelSeries QcK Heavy XXL', why: 'Verified extended cloth surface for keyboard-and-mouse setups. Measure your usable desk area first.', href: '/gear/desk-surface/steelseries-qck-heavy-xxl', kind: 'internal', price: '≈ $40', image: '/gear/steelseries-qck-heavy-xxl.jpg' },
    { tier: 'premium', label: 'Logitech G840 XL / Corsair MM700 RGB', why: 'Larger, thicker, harder-wearing surfaces. RGB adds no aim, only ambience.', href: search('logitech g840 xl mousepad'), kind: 'search', price: '$50–$80' , image: '/gear/amz/5678ce637d6c.jpg' },
  ],
  ...extras,
});

const audio = (extras: Partial<Category> = {}): Category => ({
  slug: 'audio',
  name: 'Headset / speakers',
  role: 'Pick around your room. Closed-back cans if you share space, speakers if you don\'t.',
  picks: [
    { tier: 'budget', label: 'HyperX Cloud Stinger 2 / Corsair HS55', why: 'Comfortable, honest sound, working mic. Fine starting point.', href: search('hyperx cloud stinger 2'), kind: 'search', price: '$40–$70' , image: '/gear/amz/f41dbb81ca9b.jpg' },
    { tier: 'mid', label: 'SteelSeries Arctis Nova 7 / Sennheiser HD 560S + boom mic', why: 'Wireless multi-device or open-back audiophile route with a separate mic.', href: search('steelseries arctis nova 7 wireless'), kind: 'search', price: '$130–$180' , image: '/gear/amz/8bbb79ba7d2e.jpg' },
    { tier: 'premium', label: 'Audeze Maxwell / Focal Bathys', why: 'Planar or premium wireless with real audio quality. Overkill unless you already care about sound.', href: search('audeze maxwell wireless headset'), kind: 'search', price: '$300+' , image: '/gear/amz/83f0627cca99.jpg' },
  ],
  ...extras,
});

const mic = (extras: Partial<Category> = {}): Category => ({
  slug: 'mic',
  name: 'Microphone',
  role: 'Only add a standalone mic if you stream, record, or take a lot of calls.',
  picks: [
    { tier: 'budget', label: 'FIFINE K669 / Tonor Q9', why: 'USB condenser that sounds much better than a headset mic. Add a cheap boom arm.', href: search('fifine k669 usb microphone'), kind: 'search', price: '$30–$50' , image: '/gear/amz/b1b63b4cadf3.jpg' },
    { tier: 'mid', label: 'Elgato Wave:3', why: 'USB microphone decision page that treats distance, room noise, mounting, software and current availability as part of the product.', href: '/gear/audio/elgato-wave-3', kind: 'internal', price: '≈ $150', image: '/gear/elgato-wave-3.jpg' },
    { tier: 'premium', label: 'Shure SM7B / MV7+', why: 'Broadcast-grade dynamic mics. Only worth it if you already have or plan an interface.', href: search('shure sm7b microphone'), kind: 'search', price: '$300+' , image: '/gear/amz/b23025567c6d.jpg' },
  ],
  ...extras,
});

const lighting = (extras: Partial<Category> = {}): Category => ({
  slug: 'lighting',
  name: 'Lighting',
  role: 'One controlled light source before adding several accent lights.',
  picks: [
    { tier: 'budget', label: 'Luminoodle bias light', why: 'Lower-cost ambient route: violet or white backlight behind the display.', href: '/gear/desk-lighting/luminoodle', kind: 'internal', price: '≈ $20', image: '/gear/luminoodle.jpg' },
    { tier: 'mid', label: 'Govee Strip Light 2 Pro', why: 'Room-scale smart RGBIC when you want zoned, controllable color rather than a lamp.', href: '/gear/desk-lighting/govee-strip-light-2-pro', kind: 'internal', price: '≈ $60', image: '/gear/govee-strip-light-2-pro.jpg' },
    { tier: 'premium', label: 'BenQ ScreenBar Pro', why: 'Functional task-light route: useful work light without consuming desk surface.', href: '/gear/desk-lighting/benq-screenbar-pro', kind: 'internal', price: '≈ $190', image: '/gear/benq-screenbar-pro.jpg' },
  ],
  ...extras,
});

const platform = (extras: Partial<Category> = {}): Category => ({
  slug: 'platform',
  name: 'PC / console / handheld',
  role: 'Decide what runs the games before what displays them. Budget stack usually leans handheld or console.',
  picks: [
    { tier: 'budget', label: 'Console (PS5 Slim / Xbox Series S) or used mini PC', why: 'Cheapest path to modern games without a GPU market. Series S needs a 1440p-capable display.', href: search('playstation 5 slim console'), kind: 'search', price: '$300–$500' , image: '/gear/amz/1e73a1efdd16.jpg' },
    { tier: 'mid', label: 'Mid-range gaming PC (RTX 4060 / 4060 Ti class)', why: 'Comfortably drives 1440p 144Hz. Prebuilts are competitive with self-build in this range.', href: search('rtx 4060 gaming pc'), kind: 'search', price: '$900–$1,300' , image: '/gear/amz/ee1a9fbe4aba.jpg' },
    { tier: 'premium', label: 'High-end gaming PC (RTX 4080 / 4090)', why: 'Only worth it if you actually play at 4K or with heavy RT. Confirm PSU and case airflow.', href: search('rtx 4080 gaming pc'), kind: 'search', price: '$2,000+' , image: '/gear/amz/9c3d4b3daca8.jpg' },
  ],
  ...extras,
});

const power = (extras: Partial<Category> = {}): Category => ({
  slug: 'power',
  name: 'Power + cable management',
  role: 'Plan the route before buying trays or clips. Bad power is the one thing that hurts every session.',
  picks: [
    { tier: 'budget', label: 'Velcro straps + adhesive clips', why: 'A $10 pack solves most desk cable chaos. Do this before buying a tray.', href: search('velcro cable ties adhesive clips'), kind: 'search', price: '$8–$15' },
    { tier: 'mid', label: 'Anker 525 or flat surge-protector power strip', why: 'Consolidate wall-warts and reduce daisy-chained strips. Check total watts per outlet.', href: '/gear/desk-power/anker-525', kind: 'internal', price: '≈ $30', image: '/gear/anker-525.jpg' },
    { tier: 'premium', label: 'Under-desk cable tray + IKEA SIGNUM channel', why: 'Get every cable off the floor. Best done before the desk is fully loaded.', href: search('under desk cable management tray'), kind: 'search', price: '$40–$80' , image: '/gear/amz/b1ba59de1ff6.jpg' },
  ],
  ...extras,
});

// ---------------------------------------------------------------------------
// Per-setup composition
// ---------------------------------------------------------------------------

export const SETUPS: Record<string, SetupOptions> = {
  'midnight-shift': {
    slug: 'midnight-shift',
    title: 'Midnight Shift · gear options',
    summary: 'Dark mixed-use gaming + work desk. Priorities: protected desk surface, controlled lighting, gear that earns its footprint.',
    kicker: 'Featured · gaming + work',
    headline: 'Midnight Shift',
    lead: 'A dark setup for people who want atmosphere without turning the room into an RGB carnival.',
    family: 'gaming',
    facts: [
      { label: 'Good for', value: 'Gaming · work · console' },
      { label: 'Room', value: 'Small-room friendly' },
      { label: 'Look', value: 'Dark with selective violet' },
    ],
    categories: [
      desk({ role: 'Wide enough for two-monitor work, dark finish to keep the room mood consistent.' }),
      chair({ role: 'Long-session comfort matters more than gamer-chair looks in a mixed work setup.' }),
      monitor({ role: 'Anti-glare panels behave better in dim rooms. Avoid super-glossy displays.' }),
      monitorMount(),
      keyboard(),
      mouse(),
      audio({ role: 'Closed-back or wireless keeps the room quiet late at night.' }),
      lighting({ role: 'ScreenBar for real work light + one accent (Govee or Luminoodle) for atmosphere. Not both bright.' }),
      power(),
    ],
  },
  'small-bedroom-gaming': {
    slug: 'small-bedroom-gaming',
    title: 'Small bedroom · gear options',
    summary: 'One clear path through the room, one usable desk surface, storage that goes upward instead of across the floor.',
    kicker: 'Small spaces',
    headline: 'Small bedroom gaming',
    lead: 'Protect walking space, door clearance, chair movement, and desk depth first. Then use vertical space and selective lighting to make the room feel intentional.',
    family: 'gaming',
    facts: [
      { label: 'Good for', value: 'Bedroom · shared use' },
      { label: 'Room', value: 'Under 5 ft desk depth' },
      { label: 'Priority', value: 'Low visual clutter' },
    ],
    categories: [
      desk({
        role: 'Depth is the enemy in a small bedroom. Stay 24–28" deep unless you actually need more.',
        picks: [
          { tier: 'budget', label: 'IKEA LINNMON 47" (or narrower)', why: 'Cheap, shallow, fits along one wall without stealing floor space.', href: search('ikea linnmon 47 inch desk'), kind: 'search', price: '$60–$90' , image: '/gear/amz/bbca8e1b3471.jpg' },
          { tier: 'mid', label: 'Flexispot EN1 48"×24" standing desk', why: 'Sit/stand in a small footprint. Confirm cable route reaches your wall outlet.', href: search('flexispot en1 48 inch standing desk'), kind: 'search', price: '$220–$300' },
          { tier: 'premium', label: 'Uplift V2 42"×30" (compact frame)', why: 'Best small-desk stability if the room is a permanent setup.', href: search('uplift v2 42 inch standing desk'), kind: 'search', price: '$550+' , image: '/gear/amz/918ba44e8959.jpg' },
        ],
      }),
      chair({
        role: 'Compact footprint and quiet casters keep the chair from dominating the room.',
        picks: [
          { tier: 'budget', label: 'Compact task chair with mesh back', why: 'Small footprint, no headrest, moves easily. Fine for shorter sessions.', href: search('compact mesh task chair'), kind: 'search', price: '$90–$150' , image: '/gear/amz/2fb720e5ef29.jpg' },
          { tier: 'mid', label: 'Branch Ergonomic Chair (compact)', why: 'Real ergonomic adjustments in a smaller form factor.', href: search('branch ergonomic chair'), kind: 'search', price: '$300–$450' , image: '/gear/amz/9ff7d4e14ad5.jpg' },
          { tier: 'premium', label: 'Herman Miller Sayl', why: 'Slim profile, real ergonomics, doesn\'t visually dominate a small room.', href: search('herman miller sayl chair'), kind: 'search', price: '$700+' , image: '/gear/amz/cad1a23add11.jpg' },
        ],
      }),
      monitor({
        role: 'A single 24–27" panel usually beats dual monitors in tight rooms.',
        picks: [
          { tier: 'budget', label: '24" 1080p 144Hz IPS', why: 'Small enough that a shallow desk still gives correct viewing distance.', href: search('24 inch 1080p 144hz ips monitor'), kind: 'search', price: '$120–$180' },
          { tier: 'mid', label: '27" 1440p 165Hz IPS', why: 'Only if the desk is at least 24" deep, otherwise you\'ll sit too close.', href: search('27 inch 1440p 165hz ips monitor'), kind: 'search', price: '$250–$350' },
          { tier: 'premium', label: '32" 4K OLED (arm-mounted)', why: 'Big single panel replaces a dual setup. Requires a wall or clamp arm.', href: search('32 inch 4k oled monitor'), kind: 'search', price: '$700+' },
        ],
      }),
      monitorMount({ role: 'Reclaims the deepest strip of a shallow desk. A single-arm mount is usually enough here.' }),
      keyboard({ role: 'TKL or 60% opens up mouse space and works better with a shallow desk.' }),
      mouse(),
      mousepad({ role: 'A single XL deskmat controls where keyboard, mouse, and cables live.' }),
      audio({ role: 'A closed-back headset avoids upsetting anyone else sharing the room or wall.' }),
      lighting({
        role: 'One controlled light source. Small rooms reflect light quickly.',
        picks: [
          { tier: 'budget', label: 'Luminoodle bias light', why: 'Cheap violet/white backlight behind the display without a lamp base.', href: '/gear/desk-lighting/luminoodle', kind: 'internal', price: '≈ $20', image: '/gear/luminoodle.jpg' },
          { tier: 'mid', label: 'BenQ ScreenBar Pro', why: 'Useful work light without adding a lamp base or shadow.', href: '/gear/desk-lighting/benq-screenbar-pro', kind: 'internal', price: '≈ $190', image: '/gear/benq-screenbar-pro.jpg' },
          { tier: 'premium', label: 'Govee Strip Light 2 Pro (room accent)', why: 'Add only after task light is solved. Zoned room accent, not desk light.', href: '/gear/desk-lighting/govee-strip-light-2-pro', kind: 'internal', price: '≈ $60', image: '/gear/govee-strip-light-2-pro.jpg' },
        ],
      }),
      platform({ role: 'Consoles and mini/handheld PCs fit small rooms better than a full tower.' }),
      power({ role: 'Cables and power routing decide whether the wall looks clean or crowded.' }),
    ],
  },
  'budget-gaming-desk': {
    slug: 'budget-gaming-desk',
    title: 'Budget setup · gear options',
    summary: 'Spend on the bottleneck, keep working gear, and leave decorative accessories until the functional setup is stable.',
    kicker: 'Budget',
    headline: 'Budget gaming desk',
    lead: 'The cheapest useful component is the one you already own. A budget build starts by identifying what is actually limiting the desk, then spends in that order.',
    family: 'gaming',
    facts: [
      { label: 'Target', value: 'Under $500 total' },
      { label: 'Room', value: 'Existing furniture reused' },
      { label: 'Look', value: 'Honest, unfussy' },
    ],
    categories: [
      desk({
        role: 'Keep the desk you already have if it\'s flat, stable and the right depth. Only replace if it\'s the bottleneck.',
        picks: [
          { tier: 'budget', label: 'IKEA LAGKAPTEN + ADILS', why: 'Cheap, wide, easy to fix wobble with felt pads and a wall bracket.', href: 'https://www.ikea.com/us/en/p/lagkapten-adils-desk-black-brown-black-s89417151/', kind: 'search', price: '≈ $70' },
          { tier: 'mid', label: 'Used solid-wood door + trestles', why: 'Free-to-cheap "wirecutter door desk" trick if you can source the parts.', href: search('sawhorse desk legs'), kind: 'search', price: '$40–$100' },
          { tier: 'premium', label: 'Flexispot E7 (when the budget appears)', why: 'Save for this rather than a decorative desk. Sit-stand pays back over years.', href: search('flexispot e7 standing desk'), kind: 'search', price: '$400+' , image: '/gear/amz/16423202a136.jpg' },
        ],
      }),
      chair({
        role: 'A used $150 enterprise chair beats a new $200 gaming chair almost every time.',
        picks: [
          { tier: 'budget', label: 'Used Herman Miller Aeron / Steelcase Leap', why: 'Craigslist and office liquidators list these constantly. Inspect casters and gas cylinder.', href: search('used aeron chair'), kind: 'search', price: '$150–$300' },
          { tier: 'mid', label: 'Staples Hyken mesh chair', why: 'Consistent budget favorite: mesh back, headrest, adjustable arms.', href: search('staples hyken mesh chair'), kind: 'search', price: '≈ $180' , image: '/gear/amz/f1bc244fc908.jpg' },
          { tier: 'premium', label: 'Big & Tall high-back office chair (400 lb)', why: 'Higher weight rating and headrest for taller frames on a budget.', href: '/gear/budget-tech/big-tall-high-back-office-chair-400lb-capacity', kind: 'internal', price: '≈ $180', image: '/gear/big-tall-office-chair.jpg' },
        ],
      }),
      monitor({
        role: 'A working 1080p 60–75Hz panel is fine. Do not replace it just because 144Hz exists.',
        picks: [
          { tier: 'budget', label: 'Existing 1080p monitor / used 24" 144Hz IPS', why: 'Free is the best price. Second-hand 144Hz panels are cheap and plentiful.', href: search('used 24 inch 144hz monitor'), kind: 'search', price: '$0–$100' },
          { tier: 'mid', label: '27" 1080p 144Hz VA', why: 'The cheapest new "feels smooth" jump. Skip if your GPU won\'t push it.', href: search('27 inch 1080p 144hz monitor'), kind: 'search', price: '$120–$180' },
          { tier: 'premium', label: '27" 1440p 165Hz IPS', why: 'Real upgrade for both gaming and desk work. Not a budget purchase — save for it.', href: search('27 inch 1440p 165hz ips monitor'), kind: 'search', price: '$250–$350' },
        ],
      }),
      keyboard({
        role: 'A working membrane keyboard is not the bottleneck. Only upgrade if the current one actively annoys you.',
      }),
      mouse({
        role: 'Cheap mice with good sensors exist. Fit matters more than DPI.',
      }),
      mousepad(),
      audio({ role: 'A $50 headset with a working mic covers 95% of use cases. Skip until the current one dies.' }),
      lighting({
        role: 'A clip-on desk lamp is often the highest-impact cheap upgrade.',
        picks: [
          { tier: 'budget', label: 'Clamp-on LED desk lamp', why: 'Cheapest way to fix bad room light without eating desk space.', href: '/gear/budget-tech/clamp-on-led-desk-lamp', kind: 'internal', price: '$20–$30', image: '/gear/clamp-on-led-desk-lamp.jpg' },
          { tier: 'mid', label: 'Luminoodle bias light', why: 'Low-cost violet or white monitor backlight. Real setup upgrade for very little money.', href: '/gear/desk-lighting/luminoodle', kind: 'internal', price: '≈ $20', image: '/gear/luminoodle.jpg' },
          { tier: 'premium', label: 'BenQ ScreenBar Pro (when working from home)', why: 'Only if you actually need task light and value the desk space it saves.', href: '/gear/desk-lighting/benq-screenbar-pro', kind: 'internal', price: '≈ $190', image: '/gear/benq-screenbar-pro.jpg' },
        ],
      }),
      power({
        role: 'Fixing a daisy-chained power strip is often the highest-impact $30 upgrade on the desk.',
        picks: [
          { tier: 'budget', label: 'Flat-plug surge protector (8 outlets, USB)', why: 'Consolidate wall-warts and stop the daisy-chained strips.', href: '/gear/budget-tech/flat-plug-surge-protector-power-strip-8-outlets-usb', kind: 'internal', price: '≈ $25', image: '/gear/flat-plug-surge-protector.jpg' },
          { tier: 'mid', label: 'Anker 525 charging strip', why: 'Cleaner desk power for laptop, phone and tablet without three separate bricks.', href: '/gear/desk-power/anker-525', kind: 'internal', price: '≈ $30', image: '/gear/anker-525.jpg' },
          { tier: 'premium', label: 'Under-desk cable tray + IKEA SIGNUM', why: 'Complete under-desk cleanup. Do this before any decorative upgrade.', href: search('under desk cable management tray'), kind: 'search', price: '$40–$60' , image: '/gear/amz/b1ba59de1ff6.jpg' },
        ],
      }),
    ],
  },
};

const webcam = (extras: Partial<Category> = {}): Category => ({
  slug: 'webcam',
  name: 'Webcam',
  role: 'Camera height and front light matter more than resolution. Get to eye level first.',
  picks: [
    { tier: 'budget', label: 'Logitech C920x HD', why: 'Long-running 1080p standard. Fix the angle before spending more on optics.', href: '/gear/budget-tech/logitech-c920x-hd-webcam', kind: 'internal', price: '≈ $70', image: '/gear/logitech-c920x.jpg' },
    { tier: 'mid', label: 'Logitech Brio 500', why: '1080p meeting camera for privacy, framing, and Show Mode — not a substitute for camera height and front light.', href: '/gear/video/logitech-brio-500', kind: 'internal', price: '≈ $130', image: '/gear/logitech-brio-500.png' },
    { tier: 'premium', label: 'Sony ZV-1 II / Sony a6400 + capture card', why: 'Mirrorless / vlog cam is a real jump. Only worth it if lighting and framing are already solved.', href: search('sony zv-1 ii camera'), kind: 'search', price: '$800+' , image: '/gear/amz/136afee6bd3f.jpg' },
  ],
  ...extras,
});

const keyLight = (extras: Partial<Category> = {}): Category => ({
  slug: 'key-light',
  name: 'Key light',
  role: 'One even light on your face beats three background lights. Aim for soft, diffuse, and slightly above eye level.',
  picks: [
    { tier: 'budget', label: 'Neewer bi-color LED panel + softbox', why: 'Cheap, bright, adjustable color temp. Add a stand tall enough to clear the monitor.', href: search('neewer bi-color led panel softbox'), kind: 'search', price: '$40–$70' , image: '/gear/amz/31a69397154e.jpg' },
    { tier: 'mid', label: 'Elgato Key Light Mini / Air', why: 'Clean desk-mount form factor with software control. Wattage is modest — needs to be close.', href: search('elgato key light air'), kind: 'search', price: '$100–$200' , image: '/gear/amz/4fc4c7b703f9.jpg' },
    { tier: 'premium', label: 'Aputure Amaran 100x + softbox', why: 'Bicolor COB with much more output for larger rooms or off-camera setups.', href: search('aputure amaran 100x'), kind: 'search', price: '$250+' , image: '/gear/amz/081e904e7120.jpg' },
  ],
  ...extras,
});

const capture = (extras: Partial<Category> = {}): Category => ({
  slug: 'capture',
  name: 'Streaming / capture',
  role: 'Dedicated capture removes CPU load from the main PC. Not needed for single-PC 1080p streams.',
  picks: [
    { tier: 'budget', label: 'OBS on the same PC (no capture card)', why: 'Free. Fine for single-PC 1080p60 if your GPU has NVENC/AV1.', href: 'https://obsproject.com/', kind: 'search', price: 'Free' },
    { tier: 'mid', label: 'Elgato HD60 X', why: '1080p60 / 4K30 passthrough capture card for console or dual-PC streaming.', href: search('elgato hd60 x capture card'), kind: 'search', price: '≈ $180' , image: '/gear/amz/6a4971bacbb7.jpg' },
    { tier: 'premium', label: 'Elgato 4K X + Stream Deck', why: 'Full 4K60 HDR passthrough and hardware macros. Warranted only for dedicated streamers.', href: search('elgato 4k x capture card'), kind: 'search', price: '$400+' , image: '/gear/amz/46da0bf9209d.jpg' },
  ],
  ...extras,
});

const micArm = (extras: Partial<Category> = {}): Category => ({
  slug: 'mic-arm',
  name: 'Mic arm / mount',
  role: 'A boom arm gets the mic close to your mouth without eating desk space.',
  picks: [
    { tier: 'budget', label: 'InnoGear boom arm', why: 'Basic scissor arm that fits most desks and USB mics. Check clamp thickness.', href: search('innogear microphone boom arm'), kind: 'search', price: '$25–$40' , image: '/gear/amz/b121ef615793.jpg' },
    { tier: 'mid', label: 'Rode PSA1+', why: 'Quiet, damped springs that don\'t creak on stream. Fits most dynamic and USB mics.', href: search('rode psa1 plus boom arm'), kind: 'search', price: '≈ $130' , image: '/gear/amz/419ba100c4a5.jpg' },
    { tier: 'premium', label: 'Elgato Wave Mic Arm LP', why: 'Low-profile arm that hides cable routing. Good for camera framing.', href: search('elgato wave mic arm lp'), kind: 'search', price: '≈ $150' , image: '/gear/amz/8e11df60d68a.jpg' },
  ],
  ...extras,
});

const dock = (extras: Partial<Category> = {}): Category => ({
  slug: 'dock',
  name: 'USB-C / Thunderbolt dock',
  role: 'The dock decides how many displays and how fast your storage runs. Match to your host.',
  picks: [
    { tier: 'budget', label: 'Anker 553 USB-C hub', why: 'Cheap 8-in-1 for a single laptop with HDMI and a few USB-A ports.', href: '/gear/connectivity/anker-553-usb-c-hub', kind: 'internal', price: '≈ $50', image: '/gear/anker-553-usb-c-hub.jpg' },
    { tier: 'mid', label: 'Acodot 9-in-1 USB-C hub', why: 'Extra ports, dual video output. Verify your host supports the display modes.', href: '/gear/budget-tech/acodot-9-in-1-usb-c-hub', kind: 'internal', price: '≈ $40' },
    { tier: 'premium', label: 'CalDigit TS4', why: '18-port Thunderbolt desk dock for hosts that can actually use its displays, bandwidth, and 98W charging.', href: '/gear/connectivity/caldigit-ts4', kind: 'internal', price: '≈ $370', image: '/gear/caldigit-ts4.jpg' },
  ],
  ...extras,
});

const tv = (extras: Partial<Category> = {}): Category => ({
  slug: 'tv',
  name: 'TV / display',
  role: 'HDMI 2.1, VRR, and ALLM matter more than nits for console gaming. Verify the exact ports.',
  picks: [
    { tier: 'budget', label: 'TCL Q6 / Hisense U6 (55–65")', why: 'Solid 4K60 QLED with low input lag. Fine for PS5 / Series X at 60Hz.', href: search('tcl q6 55 inch qled tv'), kind: 'search', price: '$400–$550' , image: '/gear/amz/bf6dd4195c73.jpg' },
    { tier: 'mid', label: 'Hisense U8 / TCL QM7 (65")', why: 'Mini-LED with real HDR and 120Hz. Enable Game Mode + VRR in settings.', href: search('hisense u8 65 inch mini-led tv'), kind: 'search', price: '$800–$1,100' , image: '/gear/amz/fcba55dd53ff.jpg' },
    { tier: 'premium', label: 'LG C4 / Samsung S90D OLED (55–65")', why: 'OLED with 4K120, VRR, ALLM. Watch for burn-in only if you leave the same HUD on for hours daily.', href: search('lg c4 oled 65 inch'), kind: 'search', price: '$1,400+' , image: '/gear/amz/3e1961873423.jpg' },
  ],
  ...extras,
});

const soundbar = (extras: Partial<Category> = {}): Category => ({
  slug: 'soundbar',
  name: 'Soundbar / speakers',
  role: 'Even a cheap soundbar beats TV speakers. Confirm HDMI eARC on both sides.',
  picks: [
    { tier: 'budget', label: 'Vizio V-Series 2.1', why: 'Under-$150 bar with a real subwoofer. Enough for TV, movies, and casual games.', href: search('vizio v-series 2.1 soundbar'), kind: 'search', price: '$120–$180' , image: '/gear/amz/7cf33581a917.jpg' },
    { tier: 'mid', label: 'Sonos Beam Gen 2 / Samsung Q800D', why: 'Real Atmos, HDMI eARC, streaming built in. No separate sub needed for medium rooms.', href: search('sonos beam gen 2'), kind: 'search', price: '$450–$700' , image: '/gear/amz/471e63a2150d.jpg' },
    { tier: 'premium', label: 'Sonos Arc + Sub Mini + One SL rears', why: 'A proper 5.1.2 Atmos system without receiver hassle. Room-filling and coherent.', href: search('sonos arc soundbar'), kind: 'search', price: '$1,500+' , image: '/gear/amz/e2a99de13430.jpg' },
  ],
  ...extras,
});

const controllerCharging = (extras: Partial<Category> = {}): Category => ({
  slug: 'controller-charging',
  name: 'Controller charging + storage',
  role: 'A dock keeps controllers off the coffee table and ready to grab.',
  picks: [
    { tier: 'budget', label: 'Generic dual charge dock (PS5 / Xbox)', why: 'Cheap magnetic or contact dock. Confirm the platform match before buying.', href: search('ps5 controller charging dock'), kind: 'search', price: '$15–$25' },
    { tier: 'mid', label: 'PowerA Duo Charging Station', why: 'Reliable dual-controller dock with spare battery packs for Xbox.', href: search('powera duo charging station xbox'), kind: 'search', price: '≈ $30' , image: '/gear/amz/6fa9697636b7.jpg' },
    { tier: 'premium', label: 'Razer Base Station V2 Chroma (headset + acc.)', why: 'Combines headset stand, USB hub, and RGB. Real "hub" for a console living room.', href: '/gear/accessories/razer-base-station-v2-chroma', kind: 'internal', price: '≈ $100', image: '/gear/razer-base-station-v2-chroma.jpg' },
  ],
  ...extras,
});

const network = (extras: Partial<Category> = {}): Category => ({
  slug: 'network',
  name: 'Network / switch',
  role: 'Wired matters more than fast wireless for anything server-adjacent. Get a switch before a mesh upgrade.',
  picks: [
    { tier: 'budget', label: 'TP-Link TL-SG108 (8-port 1GbE)', why: 'Silent, fanless, dead-simple. Enough for most home labs.', href: search('tp-link tl-sg108 gigabit switch'), kind: 'search', price: '≈ $25' , image: '/gear/amz/ef6f6f46efd7.jpg' },
    { tier: 'mid', label: 'MikroTik CRS305 / QNAP QSW-2104 (2.5/10GbE)', why: 'Cheap multi-gig. Pair with a NAS that has 2.5/10GbE. Verify your NIC actually supports it.', href: search('qnap qsw-2104 10gbe switch'), kind: 'search', price: '$180–$300' , image: '/gear/amz/63357dd590c4.jpg' },
    { tier: 'premium', label: 'UniFi Pro Max 24 PoE + Cloud Gateway', why: 'Managed 2.5GbE PoE with real dashboards. Only if you also plan cameras or APs.', href: search('unifi pro max 24 poe switch'), kind: 'search', price: '$700+' , image: '/gear/amz/0f185487932b.jpg' },
  ],
  ...extras,
});

const nas = (extras: Partial<Category> = {}): Category => ({
  slug: 'nas',
  name: 'NAS / storage',
  role: 'Buy for capacity + rebuild speed, not marketing. Two drives is the minimum for real redundancy.',
  picks: [
    { tier: 'budget', label: 'Synology BeeStation / DIY N100 mini + JBOD', why: 'Cheapest way to get network storage that isn\'t just a USB drive.', href: search('synology beestation nas'), kind: 'search', price: '$220–$300' , image: '/gear/amz/3f6fc16fca67.jpg' },
    { tier: 'mid', label: 'Synology DS224+ / UGREEN DXP2800 (2-bay)', why: 'Real NAS with apps, snapshots, and 2.5GbE. Add two matching 4–8TB drives.', href: search('synology ds224+ nas'), kind: 'search', price: '$300–$450' , image: '/gear/amz/cb8714204eaf.jpg' },
    { tier: 'premium', label: 'Synology DS925+ / TrueNAS Mini (4+ bay)', why: 'Real capacity + parity for media, backups, and self-hosting. Budget for the drives separately.', href: search('synology ds925+ nas'), kind: 'search', price: '$650+' , image: '/gear/amz/dc6dc21da559.jpg' },
  ],
  ...extras,
});

const miniPC = (extras: Partial<Category> = {}): Category => ({
  slug: 'mini-pc',
  name: 'Mini PC / server host',
  role: 'Low-idle wattage matters more than peak performance for anything left on 24/7.',
  picks: [
    { tier: 'budget', label: 'Beelink SER5 / GMKtec N100', why: '$200–$300 box for Home Assistant, Plex/Jellyfin, Docker labs. 8–16GB RAM.', href: search('beelink ser5 mini pc'), kind: 'search', price: '$200–$350' , image: '/gear/amz/b7bcc17cebaa.jpg' },
    { tier: 'mid', label: 'Minisforum UM790 Pro / MS-01', why: 'Ryzen 7 / Core i9 mini with 10GbE and dual NVMe. Proxmox-friendly.', href: search('minisforum ms-01 mini pc'), kind: 'search', price: '$700–$1,000' , image: '/gear/amz/93c916b946af.jpg' },
    { tier: 'premium', label: 'Refurb Dell / HP mini tower + ECC RAM', why: 'Enterprise Xeon workstation cheap on the used market. Overkill for most but great for labs.', href: search('refurbished dell precision tower workstation'), kind: 'search', price: '$400–$800' , image: '/gear/amz/0dabef608bdd.jpg' },
  ],
  ...extras,
});

const gpu = (extras: Partial<Category> = {}): Category => ({
  slug: 'gpu',
  name: 'GPU (AI / compute)',
  role: 'VRAM is the constraint that actually blocks work. Buy more VRAM before more cores.',
  picks: [
    { tier: 'budget', label: 'Used RTX 3060 12GB', why: 'The cheapest way to run local 7–13B LLMs and mid-size diffusion models. 12GB VRAM matters more than the tier.', href: search('used rtx 3060 12gb'), kind: 'search', price: '$200–$280' },
    { tier: 'mid', label: 'RTX 4070 Ti Super 16GB / RTX 5070 Ti 16GB', why: '16GB VRAM comfortably runs quantized 30B models and full-precision SDXL.', href: search('rtx 4070 ti super 16gb'), kind: 'search', price: '$750–$900' , image: '/gear/amz/670dbb35c3ca.jpg' },
    { tier: 'premium', label: 'RTX 4090 / 5090 (24–32GB) or dual 3090', why: 'Real workstation tier. Confirm PSU wattage and case airflow before ordering.', href: search('rtx 5090 24gb'), kind: 'search', price: '$1,600+' , image: '/gear/amz/b0dd761e652b.jpg' },
  ],
  ...extras,
});

const cooling = (extras: Partial<Category> = {}): Category => ({
  slug: 'cooling',
  name: 'Case + cooling',
  role: 'A GPU-loaded box needs airflow more than aesthetics. Mesh front + push-pull first.',
  picks: [
    { tier: 'budget', label: 'Fractal Pop Air + stock fans', why: 'Cheap mesh case with room for large GPUs. Add one extra intake fan.', href: search('fractal pop air atx case'), kind: 'search', price: '$70–$100' , image: '/gear/amz/d24682612a8b.jpg' },
    { tier: 'mid', label: 'Fractal North XL + Noctua NF-A14 fans', why: 'Quiet, roomy, GPU-friendly. Real cable management channels.', href: search('fractal north xl case'), kind: 'search', price: '$180–$250' , image: '/gear/amz/fa9cfb7e1818.jpg' },
    { tier: 'premium', label: 'Phanteks NV9 / Lian Li O11 XL + 360mm AIO', why: 'Full-tower for dual GPUs or long AI cards + serious radiator space.', href: search('lian li o11 dynamic xl'), kind: 'search', price: '$250+' , image: '/gear/amz/592b5d3bdafe.jpg' },
  ],
  ...extras,
});

const wheelBase = (extras: Partial<Category> = {}): Category => ({
  slug: 'wheel-base',
  name: 'Wheel base + wheel',
  role: 'Direct-drive is the jump that actually changes how the car feels. Belt is a fine starting point.',
  picks: [
    { tier: 'budget', label: 'Logitech G923 (belt/gear)', why: 'Well-supported entry wheel with pedals. Force feedback is limited but consistent.', href: search('logitech g923 racing wheel'), kind: 'search', price: '$300–$400' , image: '/gear/amz/06fb275f6f92.jpg' },
    { tier: 'mid', label: 'Moza R5 / Fanatec CSL DD (5Nm)', why: 'Entry-level direct-drive. Big jump in feel over belt/gear wheels.', href: search('moza r5 direct drive wheel bundle'), kind: 'search', price: '$500–$700' , image: '/gear/amz/a8a47bbe3b95.jpg' },
    { tier: 'premium', label: 'Simucube 2 Sport / Moza R12 (12Nm+)', why: 'Real sim-racing torque. Requires a rig — do not clamp to a desk.', href: search('moza r12 direct drive wheel base'), kind: 'search', price: '$1,000+' , image: '/gear/amz/b5cb5f2893a4.jpg' },
  ],
  ...extras,
});

const pedals = (extras: Partial<Category> = {}): Category => ({
  slug: 'pedals',
  name: 'Pedals',
  role: 'A load-cell brake is the single biggest lap-time upgrade in sim racing.',
  picks: [
    { tier: 'budget', label: 'Included wheel pedals (G923 / T248)', why: 'Fine while you learn. Upgrade the brake first when you plateau.', href: search('logitech g923 pedals'), kind: 'search', price: 'Included' },
    { tier: 'mid', label: 'Moza SR-P Lite / Fanatec CSL LC', why: 'Load-cell brake, adjustable stiffness. Massive upgrade in braking consistency.', href: search('moza sr-p lite pedals'), kind: 'search', price: '$250–$400' , image: '/gear/amz/c4aadbfb100a.jpg' },
    { tier: 'premium', label: 'Heusinkveld Sprint / Simagic P2000', why: 'Full hydraulic-feel load-cell pedals. Investment tier — outlast several wheels.', href: search('heusinkveld sprint pedals'), kind: 'search', price: '$900+' , image: '/gear/amz/81d682645adc.jpg' },
  ],
  ...extras,
});

const rig = (extras: Partial<Category> = {}): Category => ({
  slug: 'rig',
  name: 'Cockpit / mount',
  role: 'A wobbly desk mount fights every input. Even a wheel stand is a real upgrade.',
  picks: [
    { tier: 'budget', label: 'Wheel stand (Playseat Challenge X / Next Level GTLite)', why: 'Foldable, cheap, works with belt wheels. Skip for direct-drive.', href: search('playseat challenge x wheel stand'), kind: 'search', price: '$200–$300' , image: '/gear/amz/95b679ddfd83.jpg' },
    { tier: 'mid', label: 'Next Level Racing GTtrack / F-GT Elite', why: 'Rigid aluminum-profile rig that handles direct-drive up to ~10Nm.', href: search('next level racing gttrack rig'), kind: 'search', price: '$700–$1,000' , image: '/gear/amz/c5953f636d51.jpg' },
    { tier: 'premium', label: 'Sim-Lab P1-X / Trak Racer TR160', why: 'Full 80/20 aluminum rig that handles 20Nm+ bases and hydraulic pedals.', href: search('sim-lab p1-x sim rig'), kind: 'search', price: '$1,200+' , image: '/gear/amz/5b2c6c0f8e8c.jpg' },
  ],
  ...extras,
});

const audioInterface = (extras: Partial<Category> = {}): Category => ({
  slug: 'audio-interface',
  name: 'Audio interface',
  role: 'Preamp gain and clean monitoring matter more than channel count for one or two mics.',
  picks: [
    { tier: 'budget', label: 'Focusrite Scarlett Solo (4th gen)', why: 'One-mic USB interface with clean gain. Fine for a solo podcast or streamer.', href: search('focusrite scarlett solo 4th gen'), kind: 'search', price: '≈ $130' , image: '/gear/amz/15fc00d1f66f.jpg' },
    { tier: 'mid', label: 'Focusrite Scarlett 2i2 / MOTU M2', why: 'Two clean preamps, real monitoring. MOTU M2 has the better meters and converters.', href: search('motu m2 audio interface'), kind: 'search', price: '$180–$250' , image: '/gear/amz/2518ed9713a7.jpg' },
    { tier: 'premium', label: 'RME Babyface Pro FS / UAD Apollo Solo', why: 'Broadcast-tier converters and drivers. Only worth it if you can hear the difference.', href: search('rme babyface pro fs'), kind: 'search', price: '$800+' , image: '/gear/amz/cda817960a94.jpg' },
  ],
  ...extras,
});

const podcastMic = (extras: Partial<Category> = {}): Category => ({
  slug: 'podcast-mic',
  name: 'Podcast microphone',
  role: 'Dynamic mics reject room noise. Almost always the right choice at home.',
  picks: [
    { tier: 'budget', label: 'Samson Q2U / Rode PodMic USB', why: 'USB + XLR dynamic. Grows with you when you add an interface later.', href: search('samson q2u microphone'), kind: 'search', price: '$70–$100' , image: '/gear/amz/068226b14f7d.jpg' },
    { tier: 'mid', label: 'Shure MV7+ / Rode PodMic', why: 'Broadcast-style dynamic that\'s forgiving with mic technique.', href: search('shure mv7+ microphone'), kind: 'search', price: '$250–$300' , image: '/gear/amz/0c37f3c4102e.jpg' },
    { tier: 'premium', label: 'Shure SM7B / Electro-Voice RE20', why: 'Broadcast standard. Needs strong preamp gain — pair with a Cloudlifter or MV7+.', href: search('shure sm7b microphone'), kind: 'search', price: '$400+' , image: '/gear/amz/b23025567c6d.jpg' },
  ],
  ...extras,
});

const monitorsPair = (extras: Partial<Category> = {}): Category => ({
  slug: 'studio-monitors',
  name: 'Studio monitors / headphones',
  role: 'Nearfield monitors reveal problems headphones hide. Pick around the room.',
  picks: [
    { tier: 'budget', label: 'PreSonus Eris E3.5 + Audio-Technica ATH-M20x', why: 'Cheap starter pair. Enough to hear the mix problems.', href: search('presonus eris e3.5 monitors'), kind: 'search', price: '$150 (pair) + $60' , image: '/gear/amz/e32cfd23a202.jpg' },
    { tier: 'mid', label: 'Kali Audio LP-6 v2 + Beyerdynamic DT 770 Pro', why: 'Widely-recommended entry monitors and closed-back reference cans.', href: search('kali audio lp-6 v2'), kind: 'search', price: '$400 (pair) + $170' , image: '/gear/amz/847d976793ab.jpg' },
    { tier: 'premium', label: 'Genelec 8010A / Adam A7V + Sennheiser HD 600', why: 'Professional-grade nearfields with real bass response.', href: search('adam audio a7v studio monitor'), kind: 'search', price: '$1,000+' , image: '/gear/amz/9242c8cdcd2d.jpg' },
  ],
  ...extras,
});

const roomTreatment = (extras: Partial<Category> = {}): Category => ({
  slug: 'room-treatment',
  name: 'Room treatment',
  role: 'Absorb early reflections at first, then bass-trap the corners. Foam alone is a myth.',
  picks: [
    { tier: 'budget', label: 'Rugs, thick curtains, a couch behind you', why: 'Free acoustic treatment. Do this before spending a dollar on panels.', href: search('acoustic curtain thick blackout'), kind: 'search', price: '$0–$100' , image: '/gear/amz/77679b2256b1.jpg' },
    { tier: 'mid', label: 'GIK 242 panels + Auralex bass traps', why: 'Real rockwool absorbers at first-reflection points and corners.', href: search('gik 242 acoustic panels'), kind: 'search', price: '$400–$700' , image: '/gear/amz/3f2a0fd711f7.jpg' },
    { tier: 'premium', label: 'Full GIK / Vicoustic package + diffusion', why: 'Professional room tuning. Only worth it for a dedicated recording room.', href: search('gik acoustics broadband treatment package'), kind: 'search', price: '$1,500+' , image: '/gear/amz/42ac6dc3de61.jpg' },
  ],
  ...extras,
});

const handheldDock = (extras: Partial<Category> = {}): Category => ({
  slug: 'handheld-dock',
  name: 'Handheld dock',
  role: 'The dock decides your max resolution and refresh rate. Match to the display you\'ll use.',
  picks: [
    { tier: 'budget', label: 'JSAUX HB0603 / generic USB-C dock', why: 'HDMI + USB-A + charge passthrough. Fine for 1080p60 on any handheld.', href: search('jsaux steam deck dock'), kind: 'search', price: '$30–$50' },
    { tier: 'mid', label: 'JSAUX 6-in-1 / Anker 655 dock', why: 'Gigabit Ethernet, 4K60 HDMI, multiple USB-A. Good compromise for TV + monitor.', href: search('jsaux 6-in-1 steam deck dock'), kind: 'search', price: '$70–$100' , image: '/gear/amz/8b96731caec4.jpg' },
    { tier: 'premium', label: 'Official Steam Deck Dock / ROG Ally dock', why: 'First-party firmware compatibility. Worth it if you swap between docked and portable daily.', href: search('official steam deck docking station'), kind: 'search', price: '$80–$100' , image: '/gear/amz/771ae2b4d27a.jpg' },
  ],
  ...extras,
});

const handheld = (extras: Partial<Category> = {}): Category => ({
  slug: 'handheld',
  name: 'Handheld',
  role: 'Screen and battery matter more than raw TDP for a device you actually carry.',
  picks: [
    { tier: 'budget', label: 'Steam Deck LCD 256GB', why: 'The best library and community. LCD version is a great value on sale.', href: search('steam deck lcd 256gb'), kind: 'search', price: '$400' , image: '/gear/amz/f1a7e4b10f31.jpg' },
    { tier: 'mid', label: 'Steam Deck OLED 512GB / Lenovo Legion Go S', why: 'OLED and better battery. The OLED\'s screen alone is worth the jump.', href: search('steam deck oled 512gb'), kind: 'search', price: '$550–$650' , image: '/gear/amz/3227293d4b91.jpg' },
    { tier: 'premium', label: 'ASUS ROG Ally X / MSI Claw 8 AI+', why: 'Windows handhelds with more RAM and better SSDs. Requires more setup than Deck.', href: search('asus rog ally x'), kind: 'search', price: '$800+' , image: '/gear/amz/9c1065bb27d6.jpg' },
  ],
  ...extras,
});

const kbTray = (extras: Partial<Category> = {}): Category => ({
  slug: 'keyboard-tray',
  name: 'Keyboard tray / ergonomics',
  role: 'A tray drops the keyboard to elbow height — often more posture help than a fancy chair.',
  picks: [
    { tier: 'budget', label: 'Under-desk clamp-on keyboard tray', why: 'Cheap fix for a too-tall desk. Verify desk-thickness compatibility.', href: search('under desk keyboard tray clamp'), kind: 'search', price: '$40–$70' , image: '/gear/amz/ce55f7c67c1b.jpg' },
    { tier: 'mid', label: 'Uplift or Fully adjustable keyboard tray', why: 'Height + tilt adjustment. Solid enough for daily typing.', href: search('uplift keyboard tray'), kind: 'search', price: '$140–$200' , image: '/gear/amz/1e4ed6c1f7d7.jpg' },
    { tier: 'premium', label: 'Humanscale 6G tray + palm rest', why: 'Enterprise-grade adjustment and durability. Investment tier for full-time desk work.', href: search('humanscale 6g keyboard tray'), kind: 'search', price: '$400+' , image: '/gear/amz/6c0759d75388.jpg' },
  ],
  ...extras,
});

// Sub-appends for the SETUPS dict
Object.assign(SETUPS, {
  'streaming-content-creator': {
    slug: 'streaming-content-creator',
    title: 'Streaming / creator · gear options',
    summary: 'Face-cam, controlled key light, close mic, and a stream flow that doesn\'t tank your gaming PC.',
    kicker: 'Streaming + content',
    headline: 'Streaming / content creator',
    lead: 'Streams live or die on audio and framing, not GPU. Fix camera height, front light, and mic distance before spending on a second PC.',
    family: 'creator',
    facts: [
      { label: 'Good for', value: 'Twitch · YouTube · TikTok' },
      { label: 'Room', value: 'Desk + one wall of framing' },
      { label: 'Priority', value: 'Audio + light before GPU' },
    ],
    categories: [
      platform({ role: 'Single-PC works up to 1080p60 on modern GPUs. Only go dual-PC when the main PC actually chokes.' }),
      monitor({ role: 'Second monitor for chat + OBS. Keep the main gaming panel color-accurate for facecam framing.' }),
      webcam(),
      keyLight(),
      capture(),
      mic({ role: 'Broadcast-style dynamic beats condenser at home. Rejects keyboard clack.' }),
      micArm(),
      audio({ role: 'Closed-back over-ears prevent mic bleed. Wireless is only fine if latency is low.' }),
      lighting({ role: 'Background accents (Govee / Nanoleaf) frame the shot. Key light comes first.' }),
      power({ role: 'PC + monitor + capture + lights + camera adds up fast. Watch total wattage.' }),
    ],
  },
  'console-living-room': {
    slug: 'console-living-room',
    title: 'Console living room · gear options',
    summary: 'A couch-play setup where the TV, sound, and controller storage do the heavy lifting.',
    kicker: 'Living room',
    headline: 'Console living room',
    lead: 'The couch, TV height, and speaker placement decide more than the console does. Get eye-line and audio right first.',
    family: 'living-room',
    facts: [
      { label: 'Good for', value: 'PS5 · Xbox · Switch' },
      { label: 'Room', value: 'Couch-play' },
      { label: 'Priority', value: 'TV + sound + storage' },
    ],
    categories: [
      platform({
        role: 'Pick around your TV. Series S is fine for 1080p/1440p; PS5 / Series X for 4K.',
        picks: [
          { tier: 'budget', label: 'Xbox Series S / Switch OLED', why: 'Cheapest current-gen paths. Series S is 1440p-native — do not pair with a 4K-only TV.', href: search('xbox series s console'), kind: 'search', price: '$300–$350' , image: '/gear/amz/dd91f29664ac.jpg' },
          { tier: 'mid', label: 'PS5 Slim / Xbox Series X', why: 'Full 4K console with real HDR. Pair with an HDMI 2.1 TV.', href: search('playstation 5 slim console'), kind: 'search', price: '$450–$550' , image: '/gear/amz/1e73a1efdd16.jpg' },
          { tier: 'premium', label: 'PS5 Pro', why: 'Justified only for enthusiasts on a great OLED. Otherwise buy a better TV first.', href: search('playstation 5 pro console'), kind: 'search', price: '$700' , image: '/gear/amz/6fc554634009.jpg' },
        ],
      }),
      tv(),
      soundbar(),
      controllerCharging(),
      audio({
        role: 'Wireless gaming headset for late-night couch play without waking the house.',
        picks: [
          { tier: 'budget', label: 'Sony PULSE Explore / Xbox Wireless Headset', why: 'First-party wireless headsets that pair without dongles.', href: search('xbox wireless headset'), kind: 'search', price: '$100–$180' , image: '/gear/amz/935d55fd7653.jpg' },
          { tier: 'mid', label: 'SteelSeries Arctis Nova 7P / 7X', why: 'Multi-platform wireless with real battery life.', href: search('steelseries arctis nova 7p'), kind: 'search', price: '$150–$200' , image: '/gear/amz/cb94db273cf8.jpg' },
          { tier: 'premium', label: 'Audeze Maxwell (PS5 / Xbox)', why: 'Planar drivers in a wireless console headset. Overkill unless you already know sound.', href: search('audeze maxwell wireless'), kind: 'search', price: '$300+' , image: '/gear/amz/13e506922fb2.jpg' },
        ],
      }),
      network({ role: 'Wired the console if downloads or online multiplayer feel unreliable. A 20 ft cat6 is $10.' }),
      power({ role: 'A flat-plug surge strip behind the TV keeps the cable box, console, and soundbar on one clean line.' }),
    ],
  },
  'handheld-steam-deck': {
    slug: 'handheld-steam-deck',
    title: 'Handheld / Steam Deck · gear options',
    summary: 'A handheld that docks to a TV or monitor without turning into a mess of dongles.',
    kicker: 'Handheld · Steam Deck',
    headline: 'Handheld / Steam Deck dock setup',
    lead: 'A handheld earns its keep when the dock, storage, and display path are frictionless. Match the dock to the display you actually own.',
    family: 'gaming',
    facts: [
      { label: 'Good for', value: 'Deck · ROG Ally · Legion Go' },
      { label: 'Room', value: 'Desk or TV, swappable' },
      { label: 'Priority', value: 'Dock + storage + display' },
    ],
    categories: [
      handheld(),
      handheldDock(),
      monitor({ role: 'A 1080p or 1440p monitor at 40–60Hz suits handheld APUs better than a 4K panel.' }),
      tv({ role: 'For docked play, prioritize low input lag Game Mode over resolution.' }),
      audio({ role: 'Bluetooth is fine for Deck; wired 3.5mm has lower latency. USB-C headsets need a dock passthrough.' }),
      { slug: 'storage', name: 'Storage / microSD', role: 'Bigger is not always better — install speed matters most.', picks: [
        { tier: 'budget', label: 'SanDisk Ultra 512GB microSD', why: 'Cheap and reliable. Fine for most handheld libraries.', href: search('sandisk ultra 512gb microsd'), kind: 'search', price: '$40–$50' , image: '/gear/amz/090bd2b8eb5e.jpg' },
        { tier: 'mid', label: 'Samsung EVO Select 512GB microSD', why: 'Slightly faster read speeds and consistent quality.', href: '/gear/budget-tech/samsung-evo-select-512gb-microsd-card', kind: 'internal', price: '≈ $45', image: '/gear/samsung-evo-select-512gb.jpg' },
        { tier: 'premium', label: '2TB NVMe SSD upgrade (Deck OLED / Ally)', why: 'Real fix for install size. Requires opening the device — check warranty.', href: search('2tb 2230 nvme ssd steam deck'), kind: 'search', price: '$150–$220' , image: '/gear/amz/f600eb4d502d.jpg' },
      ] },
      { slug: 'case', name: 'Case / travel', role: 'A hard case is the difference between "carry it everywhere" and "leave it home".', picks: [
        { tier: 'budget', label: 'Included Deck / Ally carry case', why: 'Ships in the box on most units. Fine for backpack use.', href: search('steam deck carry case'), kind: 'search', price: 'Included' },
        { tier: 'mid', label: 'JSAUX hard shell case with accessory storage', why: 'Room for dock, cable, and controller. Actually protects the screen.', href: search('jsaux steam deck hard case'), kind: 'search', price: '$25–$40' , image: '/gear/amz/a1f87fecbf66.jpg' },
        { tier: 'premium', label: 'tomtoc FancyCase / Waterfield Deck case', why: 'Premium build and warranty. Overkill unless you travel weekly.', href: search('waterfield steam deck case'), kind: 'search', price: '$70+' , image: '/gear/amz/8be2a62ae401.jpg' },
      ] },
      power({ role: 'A 65–100W USB-C GaN charger covers Deck, Ally, phone, and laptop from one brick.' }),
    ],
  },
  'work-from-home-pro': {
    slug: 'work-from-home-pro',
    title: 'Work-from-home · gear options',
    summary: 'A desk that treats calls, focus work, and ergonomics as the main event — not gaming with a laptop bolted on.',
    kicker: 'Work-from-home',
    headline: 'Work-from-home pro',
    lead: 'Full-time desk work is an ergonomics problem first. Get seating, screen height, and lighting right before the peripherals get fancy.',
    family: 'workstation',
    facts: [
      { label: 'Good for', value: 'Remote · hybrid · consulting' },
      { label: 'Priority', value: 'Ergonomics + video calls' },
      { label: 'Look', value: 'Quiet, camera-safe background' },
    ],
    categories: [
      desk({ role: 'Sit-stand is the highest-impact ergonomic upgrade for full-time desk work.' }),
      chair({ role: 'This is the single most-used piece of gear in the room. Buy accordingly.' }),
      monitor({ role: 'A 27" 1440p or ultrawide covers most work without a dual-monitor cable mess.' }),
      monitorMount(),
      keyboard({ role: 'TKL or 75% keeps mouse close, reduces reach fatigue. Numpad only if you use it.' }),
      mouse({ role: 'A vertical or workflow mouse can end wrist pain that no other change fixes.' }),
      kbTray(),
      dock(),
      webcam({ role: 'Camera at eye level is the single biggest video-call upgrade.' }),
      keyLight({ role: 'Even front light beats every webcam sensor upgrade. Aim it slightly above.' }),
      audio({ role: 'A meeting headset with a boom mic sounds better than any AirPod for calls.' }),
      lighting({ role: 'Real desk task light reduces eye strain during long documents.' }),
      power({ role: 'One good surge strip + a UPS if you drop calls when power flickers.' }),
    ],
  },
  'home-lab-dev-workstation': {
    slug: 'home-lab-dev-workstation',
    title: 'Home lab / dev workstation · gear options',
    summary: 'A dev desk plus a small home lab: mini PCs, a NAS, wired networking, and a KVM path so it stays quiet.',
    kicker: 'Home lab · dev',
    headline: 'Home lab / dev workstation',
    lead: 'A lab lives or dies on network, power, and idle wattage. Get wired networking and a NAS before adding more hosts.',
    family: 'workstation',
    facts: [
      { label: 'Good for', value: 'Homelab · self-hosting · dev' },
      { label: 'Priority', value: 'Network + NAS + power' },
      { label: 'Look', value: 'Quiet, wired, boring' },
    ],
    categories: [
      desk({ role: 'Deep desk with room for two monitors and a small server shelf under or beside it.' }),
      chair(),
      monitor({ role: 'Dual 27" 1440p is the productivity sweet spot. Ultrawide if you dislike bezels.' }),
      monitorMount(),
      keyboard(),
      mouse(),
      miniPC(),
      nas(),
      network(),
      dock({ role: 'A Thunderbolt dock hides the mess of a dev laptop that docks to a full monitor + peripheral setup.' }),
      audio({ role: 'Fan noise is the real issue here — treat closed-back cans as normal work gear.' }),
      power({
        role: 'A UPS is not optional once the NAS holds your only copy of something. Aim for 10+ minute runtime.',
        picks: [
          { tier: 'budget', label: 'CyberPower CP1500PFCLCD UPS', why: 'Well-reviewed line-interactive UPS. Enough for a NAS + router + one mini PC.', href: search('cyberpower cp1500pfclcd ups'), kind: 'search', price: '$180–$220' , image: '/gear/amz/33cfc1e17e65.jpg' },
          { tier: 'mid', label: 'APC Back-UPS Pro 1500', why: 'Pure sine wave for sensitive PSUs. Real management software.', href: search('apc back-ups pro 1500'), kind: 'search', price: '$200–$260' , image: '/gear/amz/5093a8c5d15b.jpg' },
          { tier: 'premium', label: 'Eaton 5S 1500 + rack shelf', why: 'Rack-friendly form factor. Room to expand runtime with an external battery pack.', href: search('eaton 5s 1500 ups'), kind: 'search', price: '$300+' , image: '/gear/amz/2096a5cdb108.jpg' },
        ],
      }),
    ],
  },
  'dual-monitor-productivity': {
    slug: 'dual-monitor-productivity',
    title: 'Dual monitor productivity · gear options',
    summary: 'Two 27" panels done properly: correct arm reach, matched height, and cabling that doesn\'t look like spaghetti.',
    kicker: 'Productivity · dual monitor',
    headline: 'Dual monitor productivity',
    lead: 'A dual-monitor desk fails on arm geometry more often than on the monitors themselves. Plan the arm and cable path before ordering the second panel.',
    family: 'workstation',
    facts: [
      { label: 'Good for', value: 'Analyst · engineer · writer' },
      { label: 'Room', value: '60"+ desk recommended' },
      { label: 'Priority', value: 'Arm geometry + cable path' },
    ],
    categories: [
      desk({ role: '60"+ width lets both panels sit without overlap. Depth needs to fit the arm behind them.' }),
      chair(),
      monitor({
        role: 'Match resolution + panel size across both. Different heights or PPI is a real ergonomic tax.',
        picks: [
          { tier: 'budget', label: '2× 24" 1080p 75Hz IPS', why: 'Cheapest matched pair. Fine for docs, code, and browser work.', href: search('24 inch 1080p ips monitor'), kind: 'search', price: '$200–$300 total' },
          { tier: 'mid', label: '2× 27" 1440p 75–100Hz IPS', why: 'The most-recommended productivity pair. Sharp text without going 4K.', href: search('27 inch 1440p ips monitor'), kind: 'search', price: '$500–$700 total' },
          { tier: 'premium', label: '2× Dell U2723QE / LG 32UN880 4K USB-C', why: 'USB-C daisy-chain from one cable. Real workstation-tier displays.', href: search('dell u2723qe 4k monitor'), kind: 'search', price: '$1,200+' , image: '/gear/amz/922484aabb4d.jpg' },
        ],
      }),
      monitorMount({
        role: 'A dual-arm is the only way to actually reclaim the desk. Verify max panel width + weight.',
        picks: [
          { tier: 'budget', label: 'HUANUO / VIVO dual monitor arm', why: 'Cheap gas-spring dual arm. Fine for 24–27" panels up to 15 lb each.', href: search('vivo dual monitor arm'), kind: 'search', price: '$60–$90' , image: '/gear/amz/fbc14fe84ea6.jpg' },
          { tier: 'mid', label: 'Amazon Basics dual gas-spring arm', why: 'For two 15–27" VESA monitors, 4.4–15.4 lb each. Check desk thickness.', href: '/gear/monitor-support/amazon-basics-dual-monitor-arm', kind: 'internal', price: '≈ $110', image: '/gear/amazon-basics-dual-monitor-arm.jpg' },
          { tier: 'premium', label: 'Ergotron LX Dual Side-by-Side', why: 'Real workstation-grade arm with proper adjustment range.', href: search('ergotron lx dual side by side'), kind: 'search', price: '$300+' , image: '/gear/amz/6e85f53dd953.jpg' },
        ],
      }),
      keyboard(),
      mouse(),
      dock(),
      audio({ role: 'A quiet closed-back or set of nearfield speakers keeps focus during long documents.' }),
      lighting({ role: 'ScreenBar mounts work with two panels if you pick the wider Halo or two units.' }),
      power({ role: 'Two monitors + dock + laptop is where daisy-chained strips start to trip. Consolidate.' }),
    ],
  },
  'sim-racing-flight': {
    slug: 'sim-racing-flight',
    title: 'Sim racing / flight · gear options',
    summary: 'A dedicated rig that stays rigid, so the wheel or stick isn\'t fighting the mount.',
    kicker: 'Sim rig',
    headline: 'Sim racing / flight sim',
    lead: 'Rigidity beats brand. A cheap rig with a good wheel base beats a great wheel bolted to a wobbly desk.',
    family: 'sim',
    facts: [
      { label: 'Good for', value: 'Racing · flight · truck sim' },
      { label: 'Room', value: 'Dedicated corner or room' },
      { label: 'Priority', value: 'Rigidity + FFB + pedals' },
    ],
    categories: [
      rig(),
      wheelBase(),
      pedals(),
      { slug: 'shifter-handbrake', name: 'Shifter / handbrake', role: 'Optional. Only add when you actually race cars that use them.', picks: [
        { tier: 'budget', label: 'Logitech Driving Force Shifter', why: 'Cheap H-pattern that works with G-series wheels. No handbrake.', href: search('logitech driving force shifter'), kind: 'search', price: '$50–$70' , image: '/gear/amz/28be8678c948.jpg' },
        { tier: 'mid', label: 'Moza HGP shifter + HBP handbrake', why: 'Real load-cell handbrake and a solid H-pattern shifter.', href: search('moza hbp handbrake'), kind: 'search', price: '$250 each' , image: '/gear/amz/e051e8168244.jpg' },
        { tier: 'premium', label: 'Simucube Active Pedal / VNM sequential', why: 'Enthusiast-tier gear for serious league racing.', href: search('vnm sequential shifter'), kind: 'search', price: '$500+' , image: '/gear/amz/51f6eeb4c90c.jpg' },
      ] },
      monitor({
        role: 'Single ultrawide is the practical answer. Triple-monitor is next-level but demands the GPU.',
        picks: [
          { tier: 'budget', label: '27" 1440p 165Hz IPS (single)', why: 'Fine starting point. Focus budget on the wheel base first.', href: search('27 inch 1440p 165hz ips monitor'), kind: 'search', price: '$250–$350' },
          { tier: 'mid', label: '34" 1440p ultrawide 165Hz', why: 'Wide field of view without the GPU tax of triples.', href: search('34 inch 1440p ultrawide monitor'), kind: 'search', price: '$400–$600' },
          { tier: 'premium', label: '49" 32:9 super-ultrawide / triple 27"', why: 'Full peripheral vision. Needs a strong GPU and a wide rig.', href: search('samsung odyssey g9 49 inch monitor'), kind: 'search', price: '$1,000+' },
        ],
      }),
      audio({ role: 'Butt-kickers and 5.1 add real immersion once the wheel and pedals are dialed in.' }),
      platform({ role: 'A single strong GPU matters more than a high-end CPU for iRacing / ACC.' }),
      power({ role: 'Rig, PC, wheel base, and buttkickers add up. Do not daisy-chain strips at these currents.' }),
    ],
  },
  'ai-ml-workstation': {
    slug: 'ai-ml-workstation',
    title: 'AI / ML workstation · gear options',
    summary: 'A local ML box: enough VRAM to run real models, cooling that survives sustained load, and storage that keeps up.',
    kicker: 'AI / ML',
    headline: 'AI / ML workstation',
    lead: 'Local ML lives or dies on VRAM and thermals. Buy the most VRAM you can, then plan cooling and power around it.',
    family: 'workstation',
    facts: [
      { label: 'Good for', value: 'Local LLM · diffusion · fine-tune' },
      { label: 'Priority', value: 'VRAM · thermals · fast storage' },
      { label: 'Look', value: 'Boring, quiet, always-on' },
    ],
    categories: [
      gpu(),
      cooling(),
      { slug: 'psu', name: 'PSU', role: 'ATX 3.1 12V-2×6 connector matters for modern GPUs. Get 20% headroom over rated load.', picks: [
        { tier: 'budget', label: 'Corsair RM750x (2024)', why: 'Cygnett-quality 80+ Gold with 12V-2×6. Fine for 1× RTX 4070 Ti class.', href: search('corsair rm750x 2024 psu'), kind: 'search', price: '$120–$140' , image: '/gear/amz/959983dc7343.jpg' },
        { tier: 'mid', label: 'Corsair RM1000x / Seasonic Vertex GX-1000', why: 'Comfortable for single high-end GPU + high-core CPU.', href: search('corsair rm1000x psu'), kind: 'search', price: '$180–$220' , image: '/gear/amz/beb957e1c729.jpg' },
        { tier: 'premium', label: 'Seasonic PRIME TX-1600 / Corsair AX1600i', why: 'Dual-GPU territory. Only necessary for real training rigs.', href: search('seasonic prime tx-1600'), kind: 'search', price: '$500+' , image: '/gear/amz/3b7af369a4e8.jpg' },
      ] },
      { slug: 'ram', name: 'RAM', role: 'System RAM has to be ≥ 2× VRAM if you offload layers to CPU.', picks: [
        { tier: 'budget', label: '32GB DDR5-6000', why: 'Minimum for comfortable 7–13B LLM work.', href: search('32gb ddr5 6000 kit'), kind: 'search', price: '$90–$120' , image: '/gear/amz/950b0fb3ebed.jpg' },
        { tier: 'mid', label: '64GB DDR5-6000 CL30', why: 'Real headroom for 30B quant + everything else running.', href: search('64gb ddr5 6000 cl30'), kind: 'search', price: '$180–$240' , image: '/gear/amz/890ea7b923aa.jpg' },
        { tier: 'premium', label: '128–192GB DDR5 (ECC or non-ECC)', why: 'Only worth it for CPU-offload of very large models.', href: search('128gb ddr5 kit'), kind: 'search', price: '$400+' , image: '/gear/amz/a372fcda8f22.jpg' },
      ] },
      { slug: 'storage', name: 'Storage', role: 'Model weights are big and read-heavy. NVMe on a real Gen4 lane matters.', picks: [
        { tier: 'budget', label: '2TB WD SN770 / Crucial P3 Plus NVMe', why: 'Cheap Gen4 SSD with enough speed for local model loading.', href: search('2tb wd sn770 nvme ssd'), kind: 'search', price: '$120–$150' , image: '/gear/amz/7aeb51046b6d.jpg' },
        { tier: 'mid', label: '4TB Samsung 990 Pro / WD SN850X', why: 'Faster sustained speeds and better endurance for training data.', href: search('4tb samsung 990 pro nvme'), kind: 'search', price: '$280–$340' , image: '/gear/amz/fa922480d8d4.jpg' },
        { tier: 'premium', label: '8TB NVMe or dual-drive RAID', why: 'Real capacity for datasets + checkpoints. Add a NAS instead of ever-bigger local drives.', href: search('8tb nvme ssd'), kind: 'search', price: '$700+' , image: '/gear/amz/bffae7b89e6c.jpg' },
      ] },
      monitor({ role: 'One good 27" 4K is enough. Save GPU frames for compute, not pixels.' }),
      chair({ role: 'You will sit here while jobs run. Do not skimp.' }),
      network({ role: 'A wired 2.5GbE link to the NAS makes dataset loads sane.' }),
      power({ role: 'A UPS + PSU-side surge protection is not optional for a $2k+ GPU.' }),
    ],
  },
  'podcasting-audio': {
    slug: 'podcasting-audio',
    title: 'Podcasting / audio · gear options',
    summary: 'A quiet room, a close dynamic mic, and an interface that gets loud without hissing.',
    kicker: 'Podcast · audio',
    headline: 'Podcasting / audio production',
    lead: 'Podcasts are made by mic technique and room treatment, not by the microphone brand. Get within a fist of the mic and treat the wall behind you.',
    family: 'audio',
    facts: [
      { label: 'Good for', value: 'Solo · interview · streaming' },
      { label: 'Priority', value: 'Room + close mic + interface' },
      { label: 'Look', value: 'Quiet, dead-sounding room' },
    ],
    categories: [
      podcastMic(),
      audioInterface(),
      micArm(),
      { slug: 'monitors', name: 'Monitor headphones', role: 'Closed-back cans for tracking, open-back for editing/mixing.', picks: [
        { tier: 'budget', label: 'Audio-Technica ATH-M20x / Sony MDR-7506', why: 'Well-known closed-back tracking cans. Cheap and reliable.', href: search('sony mdr-7506 headphones'), kind: 'search', price: '$60–$100' , image: '/gear/amz/0374fa82d9b3.jpg' },
        { tier: 'mid', label: 'Beyerdynamic DT 770 Pro (80Ω)', why: 'Comfortable, isolating, honest sound. Long editing sessions.', href: search('beyerdynamic dt 770 pro 80 ohm'), kind: 'search', price: '≈ $170' , image: '/gear/amz/6d88919158e0.jpg' },
        { tier: 'premium', label: 'Sennheiser HD 600 / Focal Bathys', why: 'Reference-grade open-backs. Only for editing rooms with treatment.', href: search('sennheiser hd 600'), kind: 'search', price: '$400+' , image: '/gear/amz/2f4b8f510f53.jpg' },
      ] },
      monitorsPair(),
      roomTreatment(),
      { slug: 'recorder', name: 'Portable recorder / backup', role: 'A field recorder saves the day when the interface dies mid-record.', picks: [
        { tier: 'budget', label: 'Zoom H1essential / H1n', why: 'Cheap stereo recorder for backups and field use.', href: search('zoom h1essential recorder'), kind: 'search', price: '$100–$120' , image: '/gear/amz/13948289c0a3.jpg' },
        { tier: 'mid', label: 'Zoom H4essential / Tascam Portacapture X6', why: 'Multi-track with XLR inputs. Real backup recorder.', href: search('zoom h4essential recorder'), kind: 'search', price: '$250–$300' },
        { tier: 'premium', label: 'Zoom F3 / Sound Devices MixPre-3 II', why: 'Broadcast-grade 32-bit float. Never clips, saves takes you\'d otherwise lose.', href: search('zoom f3 32-bit float recorder'), kind: 'search', price: '$350+' , image: '/gear/amz/6ee7286e7eb1.jpg' },
      ] },
      webcam({ role: 'Optional. Podcasts on YouTube need at least the C920x.' }),
      keyLight({ role: 'Only if you\'re shooting video. Even one soft key beats overhead room lights.' }),
      power({ role: 'A quiet UPS keeps mics + interface from popping during power dips.' }),
    ],
  },
});

export const SETUP_LIST = Object.values(SETUPS);

// Only the original 3 have their own hand-written page + hero art. Others
// render through /setups/[slug].astro.
const DEDICATED_PAGES = new Set(['midnight-shift', 'small-bedroom-gaming', 'budget-gaming-desk']);
export const GENERATED_SETUPS = SETUP_LIST.filter((s) => !DEDICATED_PAGES.has(s.slug));
