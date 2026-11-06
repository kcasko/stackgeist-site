// Labs and certification pages, shared by the labs index and the RSS feed.
export type ContentLink = { href: string; title: string; note: string };

export const LABS: ContentLink[] = [
  { href: '/labs/help-desk-practice-without-experience/', title: 'Practice help desk work without a help desk job', note: 'Where to get real tickets, what to practice, and how to show the work.' },
  { href: '/labs/active-directory-home-lab/', title: 'Active Directory home lab: what I built and what broke', note: 'Four VMs, verified output, and three faults found during an audit.' },
  { href: '/labs/homelab-equipment-for-beginners/', title: 'Beginner IT homelab equipment: what you actually need', note: 'What to buy first, what to add later, and what to skip, from a working lab.' },
  { href: '/labs/network-plus-home-lab/', title: 'Network+ home lab: practice on virtual machines before you buy gear', note: 'Subnets, DHCP, DNS, ports, and firewall rules, with commands from a working lab.' },
  { href: '/labs/vmware-homelab-hardware/', title: 'What hardware you need for a VMware homelab', note: 'Real RAM, CPU, and storage numbers from a six-VM lab.' },
  { href: '/labs/osticket-docker-help-desk-lab/', title: 'osTicket help desk lab with Docker Compose', note: 'A local ticket system with captured email and five practice tickets.' },
  { href: '/labs/aws-cognito-private-crud-fix/', title: 'Fixing anonymous CRUD on an AWS portfolio app', note: 'How a public demo moved to Cognito, JWT authorization, and owner checks.' },
];

export const CERT_PAGES: ContentLink[] = [
  { href: '/certs/', title: 'Which IT certification first? A+, Network+, Security+, or AWS', note: 'Compare entry-level certifications from official exam pages.' },
  { href: '/certs/security-plus-v7-vs-v8/', title: 'Security+ SY0-701 vs SY0-801: which version should you take?', note: 'Retirement and launch dates from CompTIA.' },
  { href: '/certs/wgu-c949-data-structures-and-algorithms-review/', title: 'WGU C949 Data Structures and Algorithms I review', note: 'What made it hard, and what finally worked.' },
  { href: '/certs/wgu-d287-java-frameworks-review/', title: 'WGU D287 Java Frameworks review', note: 'A Spring Boot project in small, testable steps.' },
  { href: '/certs/wgu-d282-cloud-foundations-review/', title: 'WGU D282 Cloud Foundations and AWS Cloud Practitioner review', note: 'What I studied and where I was weakest.' },
  { href: '/certs/wgu-software-engineering-degree/', title: 'My WGU Software Engineering degree: every course I’ve passed, in order', note: 'Real course order, pass dates, and pace.' },
];
