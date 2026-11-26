export interface Discipline {
  id: 'systems' | 'graphics' | 'product' | 'performance';
  label: string;
  bg: string;
  fg: string;
  chipBg: string;
  chipFg: string;
  motif: string;
  desc: string;
}

export interface CareerEra {
  id: string;
  years: string;
  shortLabel: string;
  fullLabel: string;
  num: string;
  role: string;
  org: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  client: string;
  year: string;
  city: string;
  track: Discipline['id'];
  summary: string;
  outcome: string;
  stack: string[];
  image?: string;
  liveUrl?: string;
  art: {
    pal: [string, string, string, string];
    rows: string[];
  };
}

export interface ArchiveEntry {
  id: string;
  era: string;
  period: string;
  endPeriod: string;
  space: string;
  kind: 'System' | 'Tool' | 'Product' | 'Essay';
  track: Discipline['id'];
  projects: string[];
  title: string;
  metric: string;
  abstract: string;
}

export interface StudioZone {
  id: string;
  name: string;
  nickname: string;
  spec: string;
  level: number;
  features: string[];
}

export interface EngagementTier {
  id: 'sprint' | 'build' | 'advisory';
  name: string;
  price: number;
  unit: string;
  allocation: number;
  booked: number;
  open: number;
  includes: string;
  color: string;
}

export const TOKENS = {
  sodium: '#171919',
  ink: '#FEFEFF',
  paper: '#FEFEFF',
  blue: '#2E5FCE',
  dark: '#171919',
  light: '#FEFEFF',
  highlight: '#2E5FCE',
  pink: '#D873B3',
  green: '#2BA676',
  lavender: '#A98BF7',
  coral: '#FF5A5A',
  mint: '#22C98A',
};

export const META = {
  brand: 'AKASH',
  fullName: 'Akash Negi',
  role: 'Full Stack Developer',
  city: 'Amsterdam',
  country: 'NL',
  email: 'hello@akashnegi.dev',
  nextWindowUTC: '2027-01-15T08:00:00Z',
  totalWeeks: 36,
  yearsActive: 7,
  shippedCount: 34,
  systemsCount: 12,
  ossCount: 8,
  disciplinesCount: 4,
};

export const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'What I Do', href: '#tracks' },
  { label: 'Projects', href: '#speakers-preview' },
  { label: 'Contact', href: '#home-contact' },
];

export const GLYPHS: Record<string, string[]> = {
  '0': ['.#####.', '#.....#', '#....##', '#...#.#', '#..#..#', '#.#...#', '##....#', '#.....#', '.#####.'],
  '1': ['...#...', '..##...', '.#.#...', '...#...', '...#...', '...#...', '...#...', '...#...', '.#####.'],
  '2': ['.#####.', '#.....#', '......#', '.....#.', '...##..', '..#....', '.#.....', '#......', '#######'],
  '3': ['.#####.', '#.....#', '......#', '......#', '..####.', '......#', '......#', '#.....#', '.#####.'],
  '4': ['....##.', '...#.#.', '..#..#.', '.#...#.', '#....#.', '#######', '.....#.', '.....#.', '.....#.'],
  '5': ['#######', '#......', '#......', '######.', '......#', '......#', '......#', '#.....#', '.#####.'],
  '6': ['..####.', '.#.....', '#......', '#......', '######.', '#.....#', '#.....#', '#.....#', '.#####.'],
  '7': ['#######', '......#', '.....#.', '....#..', '...#...', '...#...', '..#....', '..#....', '..#....'],
  '8': ['.#####.', '#.....#', '#.....#', '#.....#', '.#####.', '#.....#', '#.....#', '#.....#', '.#####.'],
  '9': ['.#####.', '#.....#', '#.....#', '#.....#', '.######', '......#', '......#', '.....#.', '.####..'],
  '/': ['....##', '....#.', '....#.', '...#..', '...#..', '..#...', '..#...', '.#....', '##....'],
  '-': ['.....', '.....', '.....', '.....', '#####', '.....', '.....', '.....', '.....'],
  '+': ['.....', '.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....', '.....'],
  ':': ['.', '.', '#', '.', '.', '.', '#', '.', '.'],
  '.': ['.', '.', '.', '.', '.', '.', '.', '.', '#'],
  "'": ['.#', '.#', '#.', '..', '..', '..', '..', '..', '..'],
  ' ': ['...', '...', '...', '...', '...', '...', '...', '...', '...'],
  A: ['..###..', '.#...#.', '#.....#', '#.....#', '#.....#', '#######', '#.....#', '#.....#', '#.....#'],
  B: ['######.', '#.....#', '#.....#', '#.....#', '######.', '#.....#', '#.....#', '#.....#', '######.'],
  C: ['.#####.', '#.....#', '#......', '#......', '#......', '#......', '#......', '#.....#', '.#####.'],
  D: ['#####..', '#....#.', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '#....#.', '#####..'],
  E: ['#######', '#......', '#......', '#......', '######.', '#......', '#......', '#......', '#######'],
  F: ['#######', '#......', '#......', '#......', '######.', '#......', '#......', '#......', '#......'],
  G: ['.#####.', '#.....#', '#......', '#......', '#..####', '#.....#', '#.....#', '#.....#', '.#####.'],
  H: ['#.....#', '#.....#', '#.....#', '#.....#', '#######', '#.....#', '#.....#', '#.....#', '#.....#'],
  I: ['.#####.', '...#...', '...#...', '...#...', '...#...', '...#...', '...#...', '...#...', '.#####.'],
  J: ['..#####', '.....#.', '.....#.', '.....#.', '.....#.', '.....#.', '#....#.', '#....#.', '.####..'],
  K: ['#.....#', '#....#.', '#...#..', '#..#...', '###....', '#..#...', '#...#..', '#....#.', '#.....#'],
  L: ['#......', '#......', '#......', '#......', '#......', '#......', '#......', '#......', '#######'],
  M: ['#.....#', '##...##', '#.#.#.#', '#..#..#', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#'],
  N: ['#.....#', '##....#', '#.#...#', '#..#..#', '#...#.#', '#....##', '#.....#', '#.....#', '#.....#'],
  O: ['.#####.', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '.#####.'],
  P: ['######.', '#.....#', '#.....#', '#.....#', '######.', '#......', '#......', '#......', '#......'],
  Q: ['.#####.', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '#..#..#', '#...#.#', '.####.#'],
  R: ['######.', '#.....#', '#.....#', '#.....#', '######.', '#...#..', '#....#.', '#.....#', '#.....#'],
  S: ['.#####.', '#.....#', '#......', '#......', '.#####.', '......#', '......#', '#.....#', '.#####.'],
  T: ['#######', '...#...', '...#...', '...#...', '...#...', '...#...', '...#...', '...#...', '...#...'],
  U: ['#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '.#####.'],
  V: ['#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '.#...#.', '.#...#.', '..#.#..', '...#...'],
  W: ['#.....#', '#.....#', '#.....#', '#.....#', '#..#..#', '#.#.#.#', '##...##', '#.....#', '#.....#'],
  X: ['#.....#', '.#...#.', '..#.#..', '...#...', '...#...', '...#...', '..#.#..', '.#...#.', '#.....#'],
  Y: ['#.....#', '#.....#', '.#...#.', '..#.#..', '...#...', '...#...', '...#...', '...#...', '...#...'],
  Z: ['#######', '......#', '.....#.', '....#..', '...#...', '..#....', '.#.....', '#......', '#######'],
};

export const GLYPHS_BOLD: Record<string, string[]> = {
  '0': ['.#####.', '#######', '##...##', '##..###', '##.#.##', '###..##', '##...##', '#######', '.#####.'],
  '1': ['...##..', '..###..', '.####..', '...##..', '...##..', '...##..', '...##..', '#######', '#######'],
  '2': ['.#####.', '#######', '##...##', '....###', '..####.', '.###...', '##.....', '#######', '#######'],
  '3': ['.#####.', '#######', '.....##', '..####.', '..####.', '.....##', '##...##', '#######', '.#####.'],
  '4': ['....##.', '...###.', '..####.', '.##.##.', '##..##.', '#######', '#######', '....##.', '....##.'],
  '5': ['#######', '#######', '##.....', '######.', '#######', '.....##', '##...##', '#######', '.#####.'],
  '6': ['..####.', '.######', '##.....', '######.', '#######', '##...##', '##...##', '#######', '.#####.'],
  '7': ['#######', '#######', '.....##', '....##.', '...##..', '..##...', '..##...', '..##...', '..##...'],
  '8': ['.#####.', '#######', '##...##', '.#####.', '.#####.', '##...##', '##...##', '#######', '.#####.'],
  '9': ['.#####.', '#######', '##...##', '##...##', '#######', '.######', '.....##', '######.', '.#####.'],
  '/': ['....##', '....##', '...##.', '...##.', '..##..', '..##..', '.##...', '##....', '##....'],
  '-': ['.....', '.....', '.....', '#####', '#####', '.....', '.....', '.....', '.....'],
  '+': ['.....', '.....', '..##.', '..##.', '######', '..##.', '..##.', '.....', '.....'],
  ':': ['.', '.', '#', '#', '.', '.', '#', '#', '.'],
  '.': ['.', '.', '.', '.', '.', '.', '.', '#', '#'],
  "'": ['.##', '.##', '##.', '...', '...', '...', '...', '...', '...'],
  ' ': ['...', '...', '...', '...', '...', '...', '...', '...', '...'],
  A: ['..###..', '.#####.', '##...##', '##...##', '#######', '#######', '##...##', '##...##', '##...##'],
  B: ['######.', '#######', '##...##', '######.', '######.', '##...##', '##...##', '#######', '######.'],
  C: ['.#####.', '#######', '##.....', '##.....', '##.....', '##.....', '##.....', '#######', '.#####.'],
  D: ['#####..', '######.', '##...##', '##...##', '##...##', '##...##', '##...##', '######.', '#####..'],
  E: ['#######', '#######', '##.....', '######.', '######.', '##.....', '##.....', '#######', '#######'],
  F: ['#######', '#######', '##.....', '######.', '######.', '##.....', '##.....', '##.....', '##.....'],
  G: ['.#####.', '#######', '##.....', '##.....', '##..###', '##...##', '##...##', '#######', '.#####.'],
  H: ['##...##', '##...##', '##...##', '#######', '#######', '##...##', '##...##', '##...##', '##...##'],
  I: ['.#####.', '.#####.', '..###..', '..###..', '..###..', '..###..', '..###..', '.#####.', '.#####.'],
  J: ['..#####', '.....##', '.....##', '.....##', '.....##', '##...##', '##...##', '#######', '.#####.'],
  K: ['##...##', '##..##.', '##.##..', '####...', '####...', '##.##..', '##..##.', '##...##', '##...##'],
  L: ['##.....', '##.....', '##.....', '##.....', '##.....', '##.....', '##.....', '#######', '#######'],
  M: ['##...##', '###.###', '#######', '##.#.##', '##...##', '##...##', '##...##', '##...##', '##...##'],
  N: ['##...##', '###..##', '####.##', '##.####', '##..###', '##...##', '##...##', '##...##', '##...##'],
  O: ['.#####.', '#######', '##...##', '##...##', '##...##', '##...##', '##...##', '#######', '.#####.'],
  P: ['######.', '#######', '##...##', '#######', '######.', '##.....', '##.....', '##.....', '##.....'],
  Q: ['.#####.', '#######', '##...##', '##...##', '##...##', '##.#.##', '##..###', '#######', '.####.#'],
  R: ['######.', '#######', '##...##', '##...##', '#######', '##.##..', '##..##.', '##...##', '##...##'],
  S: ['.#####.', '#######', '##.....', '.#####.', '..#####', '.....##', '##...##', '#######', '.#####.'],
  T: ['#######', '#######', '..###..', '..###..', '..###..', '..###..', '..###..', '..###..', '..###..'],
  U: ['##...##', '##...##', '##...##', '##...##', '##...##', '##...##', '##...##', '#######', '.#####.'],
  V: ['##...##', '##...##', '##...##', '##...##', '.##.##.', '.##.##.', '..###..', '..###..', '...#...'],
  W: ['##...##', '##...##', '##...##', '##...##', '##.#.##', '#######', '###.###', '##...##', '##...##'],
  X: ['##...##', '##...##', '.##.##.', '..###..', '..###..', '..###..', '.##.##.', '##...##', '##...##'],
  Y: ['##...##', '##...##', '.##.##.', '..###..', '..###..', '..###..', '..###..', '..###..', '..###..'],
  Z: ['#######', '#######', '....##.', '...##..', '..##...', '.##....', '##.....', '#######', '#######'],
};

export const DISCIPLINES: Discipline[] = [
  {
    id: 'systems',
    label: 'Frontend Development',
    bg: '#171919',
    fg: '#2E5FCE',
    chipBg: '#2E5FCE',
    chipFg: '#FEFEFF',
    motif: 'plus weave',
    desc: 'Crafting performant, responsive, and highly interactive user interfaces using modern frameworks.',
  },
  {
    id: 'graphics',
    label: 'Backend Development',
    bg: '#18B47E',
    fg: '#2E5FCE',
    chipBg: '#2BA676',
    chipFg: '#FEFEFF',
    motif: 'cross weave',
    desc: 'Designing secure, scalable APIs and database architectures that form the backbone of complex applications.',
  },
  {
    id: 'product',
    label: 'Apps Development',
    bg: '#F5B700',
    fg: '#FF5A36',
    chipBg: '#A98BF7',
    chipFg: '#FEFEFF',
    motif: 'basket weave',
    desc: 'Building powerful, user-friendly mobile and web applications with modern technologies, seamless functionality, and intuitive designs to deliver engaging digital experiences across all devices.',
  },
  {
    id: 'performance',
    label: 'DevOps & Deployment',
    bg: '#A98BF7',
    fg: '#2E5FCE',
    chipBg: '#2E5FCE',
    chipFg: '#FEFEFF',
    motif: 'tartan weave',
    desc: 'Implementing CI/CD pipelines and cloud infrastructure to ensure reliable and fast software delivery.',
  },
];

export const ERAS: CareerEra[] = [
  {
    id: 'e1',
    years: '2024–2026',
    shortLabel: '2024–26',
    fullLabel: '2024–2026 · Independent Practice',
    num: '01',
    role: 'Principal Full Stack Developer',
    org: 'Independent Studio, Amsterdam',
  },
  {
    id: 'e2',
    years: '2021–2024',
    shortLabel: '2021–24',
    fullLabel: '2021–2024 · Vektor Systems',
    num: '02',
    role: 'Staff Frontend Architect',
    org: 'Vektor Systems, Rotterdam',
  },
  {
    id: 'e3',
    years: '2019–2021',
    shortLabel: '2019–21',
    fullLabel: '2019–2021 · Studio Noord',
    num: '03',
    role: 'Creative Technologist',
    org: 'Studio Noord, Utrecht',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'bserc',
    name: 'BSERC',
    client: 'Next.js, Full-Stack',
    year: '2026',
    city: 'Full-Stack Education',
    track: 'systems',
    summary: 'Educational platform for space research and education.',
    outcome: 'Unified course discovery, space-research resources, and interactive student learning modules in a fast Next.js full-stack portal.',
    stack: ['Next.js', 'TypeScript', 'Full-Stack', 'PostgreSQL', 'Tailwind CSS'],
    image: '/projects/bserc.webp',
    liveUrl: 'https://bserc.in/',
    art: {
      pal: ['#2370E8', '#FF5A5A', '#0A0A0A', '#FFFFFF'],
      rows: [
        '00000000000000000000000000000000',
        '00000000000000033000000000000000',
        '00000300000000000000000000300000',
        '00000000000022222222000000000000',
        '00000000002222222222220000000000',
        '00000000222233333333222200000000',
        '00000002223311111111332220000000',
        '00000022231111111111113222000000',
        '00000222311111333311111322200000',
        '00002223111113333331111132220000',
        '00002231111133111133111113220000',
        '00022231111131122113111113222000',
        '00022311111131222213111111322000',
        '00022311111131222213111111322000',
        '00022231111131122113111113222000',
        '00002231111133111133111113220000',
        '00002223111113333331111132220000',
        '00000222311111333311111322200000',
        '00000022231111111111113222000000',
        '00000002223311111111332220000000',
        '00000000222233333333222200000000',
        '00000000002222222222220000000000',
        '00030000000022222222000000003000',
        '00000000000000000000000000000000',
        '00000000111111111111111100000000',
        '00000000113333333333331100000000',
        '00000000113322222222331100000000',
        '00000000113333333333331100000000',
        '00000000111111111111111100000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
      ],
    },
  },
  {
    id: 'callories',
    name: 'Callories',
    client: 'Next.js, UI&UX',
    year: '2026',
    city: 'Health & Fitness Platform',
    track: 'product',
    summary:
      'Lose or gain weight through sports, fitness, yoga & expert coaching — with personalized diet plans and a community.',
    outcome:
      'End-to-end health-tech application combining goal-based nutrition plans, fitness tracking, coaching workflows, and community engagement.',
    stack: ['Next.js', 'TailwindCSS', 'UI&UX'],
    image: '/projects/callories.webp',
    liveUrl: 'https://callories.com/',
    art: {
      pal: ['#2BA676', '#FFCC19', '#0A0A0A', '#FFFFFF'],
      rows: [
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00002222222222222222222222220000',
        '00002222222222222222222222220000',
        '00002233333333333333333333220000',
        '00002233333333333333333333220000',
        '00002233111111333311111133220000',
        '00002233111111333311111133220000',
        '00002233112211333311221133220000',
        '00002233112211333311221133220000',
        '00002233111111333311111133220000',
        '00002233111111333311111133220000',
        '00002233333333333333333333220000',
        '00002233333333222233333333220000',
        '00002233333332211223333333220000',
        '00002233333322111122333333220000',
        '00002233332211111111223333220000',
        '00002233322111111111122333220000',
        '00002233221111333311112233220000',
        '00002233221111333311112233220000',
        '00002233333333333333333333220000',
        '00002233000000333311111133220000',
        '00002233000000333311111133220000',
        '00002233000000333333333333220000',
        '00002233111111111111111133220000',
        '00002233111111111111111133220000',
        '00002233333333333333333333220000',
        '00002233333333333333333333220000',
        '00002222222222222222222222220000',
        '00002222222222222222222222220000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
      ],
    },
  },
  {
    id: 'aura-learn',
    name: 'Aura Learn',
    client: 'Next.js 15, FastAPI',
    year: '2026',
    city: 'EdTech Study Engine',
    track: 'graphics',
    summary:
      'Built a full-stack platform that turns uploaded PDFs/DOCX into interactive flashcards and quizzes.',
    outcome:
      'Automated document extraction pipeline in FastAPI paired with a responsive Next.js 15 workspace for instant flashcard decks and adaptive quizzes.',
    stack: ['Next.js 15', 'FastAPI', 'Python', 'TypeScript', 'PDF/DOCX'],
    image: '/projects/aura-learn.webp',
    liveUrl: 'https://aura-learn-beta.vercel.app/',
    art: {
      pal: ['#A98BF7', '#2370E8', '#0A0A0A', '#FFFFFF'],
      rows: [
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00022222222222222200000000000000',
        '00022333333333332200000000000000',
        '00022331111111332200000000000000',
        '00022333333333332200000000000000',
        '00022331111111332200000000000000',
        '00022333333333332200000000000000',
        '00022331111111332200000000000000',
        '00022333333333332200000000000000',
        '00022333332222222222222222220000',
        '00022333332211111111111111220000',
        '00022333332211333333333311220000',
        '00022333332211332222223311220000',
        '00022333332211332200223311220000',
        '00022222222211332200223311220000',
        '00000000002211332222223311220000',
        '00000000002211333333333311220000',
        '00000000002211111111111111220000',
        '00000000002211333333333311220000',
        '00000000002211332222223311220000',
        '00000000002211333333333311220000',
        '00000000002211111111111111220000',
        '00000000002222222222222222220000',
        '00000000000000000000000000000000',
        '00011111111111111111111111110000',
        '00011333333333333333333333110000',
        '00011332222223333222222333110000',
        '00011333333333333333333333110000',
        '00011111111111111111111111110000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
      ],
    },
  },
  {
    id: 'chatsphere',
    name: 'ChatSphere',
    client: 'Next.js, Supabase',
    year: '2026',
    city: 'Conversational Platform',
    track: 'graphics',
    summary:
      'Built an AI-powered chatbot platform from scratch, handling real-time conversational interaction end-to-end.',
    outcome:
      'Low-latency streaming conversational platform built end-to-end with session persistence, live token streaming, and responsive chat UI.',
    stack: ['Next.js', 'TypeScript', 'Supabase'],
    image: '/projects/chatsphere.webp',
    liveUrl: 'https://chatsphere-user.vercel.app/',
    art: {
      pal: ['#D873B3', '#2370E8', '#0A0A0A', '#FFFFFF'],
      rows: [
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00022222222222222222220000000000',
        '00022333333333333333220000000000',
        '00022331111111111133220000000000',
        '00022333333333333333220000000000',
        '00022331111111333333220000000000',
        '00022333333333333333220000000000',
        '00022222222222222222220000000000',
        '00022220000000000000000000000000',
        '00022000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000022222222222222222222000',
        '00000000022111111111111111122000',
        '00000000022113333333333331122000',
        '00000000022113322332233221122000',
        '00000000022113333333333331122000',
        '00000000022111111111111111122000',
        '00000000022222222222222222222000',
        '00000000000000000000000002222000',
        '00000000000000000000000000022000',
        '00000000000000000000000000000000',
        '00022222222222222222222222222000',
        '00022333333333333333333111122000',
        '00022332222222222333333111122000',
        '00022333333333333333333111122000',
        '00022222222222222222222222222000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
      ],
    },
  },
  {
    id: 'mandarin-vacations',
    name: 'MandarinVacations',
    client: 'Next.js, Full-Stack',
    year: '2026',
    city: 'Travel & Hospitality',
    track: 'systems',
    summary:
      'Built a responsive travel agency website end-to-end, showcasing vacation packages, destinations, and booking inquiries.',
    outcome:
      'Responsive destination discovery platform with curated vacation packages, itinerary previews, and full-stack booking inquiry handling.',
    stack: ['Next.js', 'TypeScript', 'Full-Stack'],
    image: '/projects/mandarin-vacations.webp',
    liveUrl: 'https://mandarinworldwidevacations.com/',
    art: {
      pal: ['#FF5A5A', '#FFCC19', '#0A0A0A', '#FFFFFF'],
      rows: [
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000001111110000000000000',
        '00000000000111111111100000000000',
        '00000000001111111111110000000000',
        '00000000011111111111111000000000',
        '00000000011111111111111000000000',
        '00000000011111111111111000000000',
        '00000000001111111111110000000000',
        '00000000000111111111100000000000',
        '00000000000000000000000000000000',
        '00000000220000000000002200000000',
        '00000002222000000000022220000000',
        '00000022332200000000223322000000',
        '00000223333220022002233332200000',
        '00002233333322222222333333220000',
        '00022333333332233223333333322000',
        '00022222222222222222222222222000',
        '00000000000000000000000000000000',
        '00033330000333300003333000033000',
        '00000003333000033330000333300000',
        '00022222222222222222222222222000',
        '00022333333333333333333333322000',
        '00022331111113333111111113322000',
        '00022333333333333333333333322000',
        '00022222222222222222222222222000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
      ],
    },
  },
  {
    id: 'watnidea',
    name: 'Watnidea',
    client: 'Next.js, UI&UX',
    year: '2026',
    city: 'Brand & Digital Studio',
    track: 'performance',
    summary:
      "We don't just design logos, we architect the Aura that makes your brand the Main Character of your industry.",
    outcome:
      'High-impact brand storytelling and studio platform engineered for sharp motion, sub-second page loads, and automated deployment.',
    stack: ['Next.js', 'TailwindCSS', 'UI&UX'],
    image: '/projects/watnidea.webp',
    liveUrl: 'https://watnidea.vercel.app/',
    art: {
      pal: ['#FFCC19', '#D873B3', '#0A0A0A', '#FFFFFF'],
      rows: [
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
        '00000000000000022000000000000000',
        '00000000000000222200000000000000',
        '00000000000002233220000000000000',
        '00000000000022333322000000000000',
        '00000000000223311332200000000000',
        '00000000002233111133220000000000',
        '00000000022331122113322000000000',
        '00000000223311222211332200000000',
        '00000002233112233221133220000000',
        '00000022331122333322113322000000',
        '00000223311223311332211332200000',
        '00002233112233111133221133220000',
        '00002233112233111133221133220000',
        '00000223311223311332211332200000',
        '00000022331122333322113322000000',
        '00000002233112233221133220000000',
        '00000000223311222211332200000000',
        '00000000022331122113322000000000',
        '00000000002233111133220000000000',
        '00000000000223311332200000000000',
        '00000000000022333322000000000000',
        '00000000000002233220000000000000',
        '00000000000000222200000000000000',
        '00000000000000022000000000000000',
        '00002222222222222222222222220000',
        '00002233333333333333333333220000',
        '00002233111111111111111133220000',
        '00002222222222222222222222220000',
        '00000000000000000000000000000000',
        '00000000000000000000000000000000',
      ],
    },
  },
];

export const ARCHIVE_ITEMS: ArchiveEntry[] = [
  {
    id: 'a01',
    era: 'e1',
    period: '09:00',
    endPeriod: '11:00',
    space: 'systems-desk',
    kind: 'Product',
    track: 'systems',
    projects: ['bserc'],
    title: 'BSERC space research & education portal',
    metric: 'Next.js Full-Stack',
    abstract:
      'Designed and built an educational platform for space research and education, uniting structured curricula, research archives, and responsive frontend flows.',
  },
  {
    id: 'a02',
    era: 'e1',
    period: '11:00',
    endPeriod: '12:30',
    space: 'build-bench',
    kind: 'Product',
    track: 'product',
    projects: ['callories'],
    title: 'Callories health & coaching platform',
    metric: 'Health Tech',
    abstract:
      'Built a comprehensive fitness, sports, yoga, and coaching platform supporting weight loss or gain goals with personalized diet plans and a community.',
  },
  {
    id: 'a03',
    era: 'e1',
    period: '13:30',
    endPeriod: '15:00',
    space: 'systems-desk',
    kind: 'Product',
    track: 'graphics',
    projects: ['aura-learn'],
    title: 'Aura Learn PDF/DOCX to flashcards engine',
    metric: 'Next.js 15 + FastAPI',
    abstract:
      'Engineered an automated study pipeline that parses uploaded PDFs and DOCX files via FastAPI into interactive flashcard decks and quizzes.',
  },
  {
    id: 'a04',
    era: 'e1',
    period: '15:00',
    endPeriod: '16:30',
    space: 'build-bench',
    kind: 'Product',
    track: 'graphics',
    projects: ['chatsphere'],
    title: 'ChatSphere real-time AI chatbot platform',
    metric: 'Real-time AI',
    abstract:
      'Architected an AI-powered chatbot platform from scratch, handling real-time streaming conversational interaction, state persistence, and responsive UI.',
  },
  {
    id: 'a05',
    era: 'e2',
    period: '09:30',
    endPeriod: '11:30',
    space: 'systems-desk',
    kind: 'Product',
    track: 'systems',
    projects: ['mandarin-vacations'],
    title: 'MandarinVacations end-to-end travel web app',
    metric: 'Responsive Web',
    abstract:
      'Built a responsive travel agency website end-to-end, showcasing vacation packages, curated destinations, and seamless booking inquiries.',
  },
  {
    id: 'a06',
    era: 'e2',
    period: '11:30',
    endPeriod: '13:00',
    space: 'build-bench',
    kind: 'System',
    track: 'performance',
    projects: ['watnidea'],
    title: 'Watnidea brand & digital aura architecture',
    metric: 'Full-Stack',
    abstract:
      'Architected a high-impact brand and digital flagship designed to make brands stand out with sharp visual craft and fast full-stack delivery.',
  },
  {
    id: 'a07',
    era: 'e2',
    period: '13:30',
    endPeriod: '15:00',
    space: 'systems-desk',
    kind: 'Tool',
    track: 'graphics',
    projects: ['aura-learn', 'chatsphere'],
    title: 'FastAPI & streaming AI backend patterns',
    metric: 'Sub-100ms API',
    abstract:
      'Structured document extraction, streaming responses, and type-safe API contracts shared across AI-assisted learning and chat products.',
  },
  {
    id: 'a08',
    era: 'e3',
    period: '10:00',
    endPeriod: '12:00',
    space: 'build-bench',
    kind: 'System',
    track: 'systems',
    projects: ['bserc', 'mandarin-vacations'],
    title: 'Responsive full-stack UI & booking flows',
    metric: 'WCAG AA',
    abstract:
      'Accessible multi-breakpoint layouts, predictable keyboard navigation, and fast server-rendered routes for education and travel portals.',
  },
];

export const STUDIO_ZONES: StudioZone[] = [
  {
    id: 'systems-desk',
    name: 'Systems Desk',
    nickname: 'Token Foundry',
    spec: 'Design Tokens & Components',
    level: 0,
    features: ['Figma variable sync', 'CSS custom property architecture', 'WCAG 2.2 AA contrast suite', 'Automated visual regression'],
  },
  {
    id: 'build-bench',
    name: 'Build Bench',
    nickname: 'Shader & Canvas Rig',
    spec: 'Graphics & Prototyping',
    level: 0,
    features: ['Canvas 2D & WebGL2 profiling', '120 Hz ProMotion & 60 Hz throttle tests', 'WASM & SVG geometric exporters', 'Zero-dependency micro-bundles'],
  },
  {
    id: 'a11y-rig',
    name: 'Audit Rig',
    nickname: 'Keyboard & Screen Reader',
    spec: 'Accessibility Lab',
    level: 0,
    features: ['VoiceOver & NVDA test scripts', 'Keyboard-only navigation checks', '200% & 400% reflow verification', 'Prefers-reduced-motion parity'],
  },
  {
    id: 'plotter',
    name: 'Print Corner',
    nickname: 'Pen Plotter & Riso',
    spec: 'Physical Artifacts',
    level: 1,
    features: ['A3 pen plotter', 'Generative Truchet poster proofs', 'Physical type specimen archive'],
  },
  {
    id: 'library',
    name: 'Reference Shelf',
    nickname: 'Type & Manuals',
    spec: '320+ Volumes',
    level: 0,
    features: ['Swiss grid manuals', 'Bitmap type specimens', 'Hardware UI field guides', 'Quiet reading table'],
  },
  {
    id: 'call-booth',
    name: 'Client Booth',
    nickname: 'Pairing & Reviews',
    spec: 'CET / UTC+1',
    level: 1,
    features: ['Weekly architecture syncs', 'Live browser pairing', 'Recorded Loom walkthroughs'],
  },
];

export const STUDIO_PLAN = [
  { id: 'systems-desk', label: 'Systems Desk', x: 1, y: 1, w: 22, h: 14, fill: '#2E5FCE', text: '#FEFEFF' },
  { id: 'build-bench', label: 'Build Bench', x: 24, y: 1, w: 15, h: 9, fill: '#D873B3', text: '#FEFEFF' },
  { id: 'plotter', label: 'Plotter', chip: 'L1', x: 24, y: 11, w: 7, h: 4, fill: '#A98BF7', text: '#FEFEFF' },
  { id: 'call-booth', label: 'Pairing', x: 32, y: 11, w: 7, h: 4, fill: '#FF5A5A', text: '#FEFEFF' },
  { id: 'library', label: 'Reference Library', x: 1, y: 16, w: 38, h: 7, fill: '#2BA676', text: '#FEFEFF' },
  { id: 'a11y-rig', label: 'Audit Rig', chip: 'A11y', x: 30, y: 17, w: 8, h: 5, fill: '#22C98A', text: '#FEFEFF' },
];

export const ENGAGEMENT_TIERS: EngagementTier[] = [
  {
    id: 'sprint',
    name: 'Design System Sprint',
    price: 4800,
    unit: 'per week',
    allocation: 16,
    booked: 12,
    open: 4,
    includes: 'Token architecture, accessible component library, Figma-to-code handoff, documentation',
    color: '#2E5FCE',
  },
  {
    id: 'build',
    name: 'Product & Graphics Build',
    price: 5400,
    unit: 'per week',
    allocation: 12,
    booked: 9,
    open: 3,
    includes: 'End-to-end TypeScript frontend, Canvas/WebGL tools, 120 Hz performance tuning',
    color: '#D873B3',
  },
  {
    id: 'advisory',
    name: 'Architecture & Audit Day',
    price: 1400,
    unit: 'per day',
    allocation: 8,
    booked: 5,
    open: 3,
    includes: 'Full performance & WCAG 2.2 AA audit, bundle teardown, actionable engineering roadmap',
    color: '#2BA676',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'What kind of work do you take on?',
    a: 'I partner with product teams, studios, and founders on design systems, interactive browser tools, Canvas/WebGL experiences, and frontend performance overhauls.',
  },
  {
    q: 'Do you work embedded with internal engineering teams?',
    a: 'Yes. Most engagements run directly inside your repository, PR workflow, and design files so nothing gets lost in a static handoff PDF.',
  },
  {
    q: 'What is your typical project length?',
    a: 'Focused audits take 1 to 3 days. Design system sprints and zero-to-one product builds usually run 2 to 6 weeks.',
  },
  {
    q: 'Are you available for remote collaboration?',
    a: 'Yes. I work out of Amsterdam (CET/CEST) and collaborate regularly with teams across Europe and the US East Coast with overlapping pairing hours.',
  },
  {
    q: 'How is accessibility handled in deliverables?',
    a: 'WCAG 2.2 AA contrast, semantic markup, full keyboard navigation, and prefers-reduced-motion parity are built into every component from day one.',
  },
  {
    q: 'Can we book a short discovery call first?',
    a: 'Yes. Use the scope estimator above or send a brief note below—I reply within two working days with honest availability.',
  },
];

export const COPY = {
  siteTitleSuffix: ' — Akash Negi',
  homeTitle: 'Akash Negi — Full Stack Developer',
  heroH1:
    'Akash Negi, Full Stack Developer. Building resilient web applications, APIs, design systems, and interactive products.',
  heroAddress: ['Akash Negi', 'Full Stack Developer', 'Systems & Interfaces'],
  heroDate: '2019–2026 · OPEN Q1',
  heroCycle: [
    {
      desktop: ['AKASH NEGI'],
      mobile: ['AKASH', 'NEGI'],
      caption: 'Akash Negi — Full Stack Developer',
    },
    {
      desktop: ['FULL STACK', 'DEVELOPER'],
      mobile: ['FULL', 'STACK', 'DEV'],
      caption: 'Full Stack Developer — End-to-end web architecture',
    },
  ],
  contactCycle: [
    {
      desktop: ["LET'S BUILD"],
      mobile: ["LET'S", 'BUILD'],
    },
    {
      desktop: ['SOMETHING', 'REAL.'],
      mobile: ['SOMETHING', 'REAL.'],
    },
  ],
  heroSplit: [
    { left: '', right: 'Engineering complete web products,' },
    { left: 'from crisp pixel interfaces', right: 'to resilient backend systems' },
    { left: 'AKASH NEGI', right: '' },
    { left: 'builds full-stack apps, APIs,', right: 'and systems that hold 120 Hz' },
    { left: 'working worldwide', right: 'for teams shipping craft-led software' },
  ],
  heroFinal: 'booking Q1 2027.',
  aboutLead:
    'I build end-to-end web products, scalable APIs, and interactive user experiences.',
  aboutP1:
    'Working across Next.js, React, FastAPI, and Node.js, I turn complex ideas into responsive interfaces backed by clean database and API architectures.',
  aboutP2:
    'From real-time AI platforms and health-tech apps to brand flagships and CI/CD cloud pipelines, every build is engineered for speed, clarity, and scale.',
  tracksLead:
    'I turn ideas into impactful digital experiences through modern development, thoughtful design, and reliable technology — from concept to deployment.',
  daysLead: 'Seven years across independent practice, product architecture, and studio labs.',
  speakersLead:
    'A showcase of my work, where creativity meets code to build modern, functional, and impactful digital experiences.',
  posterLeftHead: ['2026', 'AKASH NEGI', 'Full Stack Developer', 'Selected works on', '«Systems & Pixels»'],
  posterRightHead: [
    'Full Stack Developer · Remote worldwide',
    'Frontend, Backend, Apps & DevOps',
    'TypeScript, Node.js, Canvas 2D, WebGL2',
    '34 shipped projects · 8 open-source tools',
    'Press any tile to cycle the weave',
  ],
  scheduleTitle: 'Seven years, twelve milestones.',
  scheduleLead:
    'Explore career chapters by era and discipline, or bookmark case studies into your review list and export a brief.',
  speakersTitle: 'Selected case studies.',
  speakersLeadPage:
    'Hover any artwork to swap its palette. Click through to inspect metrics, deliverables, and scrub the resolution grid.',
  talksTitle: 'Complete work & notes index.',
  talksLead: 'Search by title, stack, or outcome. Expand any row to read the full technical summary.',
  venueTitle: 'Studio & Workflow',
  venueLead:
    'How projects move from early visual sketches and API architecture to audited, production-ready code.',
  venueGettingThere:
    'Collaborating remotely worldwide with daily overlap for European, APAC, and US East Coast teams. Available for remote sprints and on-site workshops.',
  venueAccess: [
    'Keyboard-first interactive architecture from day one',
    'Measured WCAG 2.2 AA contrast on every colour token',
    'Prefers-reduced-motion parity on all canvas and CSS motion',
    'Sub-8.3 ms frame budgets tested on mid-range hardware',
    'Clean TypeScript & zero-bloat repository handoff',
  ],
  badgeTitle: 'Pixel Lab',
  badgeLead:
    'Draw a 16 × 16 pixel stamp, sign your name, and download a crisp SVG studio keepsake card.',
  colophon:
    'Set in Inter Tight and a custom 7×9 geometric bitmap drawn as crisp SVG rectangles. Built with zero runtime frameworks.',
  honesty:
    'Akash Negi — Independent Full Stack Developer. Available for select Q1–Q2 2027 engagements.',
  version: '© 2026 Akash Negi',
  countdownOver: 'Q1 2027 booking window is now open.',
};
