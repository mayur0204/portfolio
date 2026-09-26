/*
 * PROFILE — edit this file to personalise the portfolio.
 *
 * Any value that starts with "YOUR_" or is wrapped in [square brackets]
 * is treated as a PLACEHOLDER:
 *   - the site shows it with a dashed outline so it is easy to spot;
 *   - the "Ask Mayur" assistant treats it as "not provided yet"
 *     and will not present it as fact.
 * Replace the placeholder with real text and both update automatically.
 */

export const profile = {
  name: 'Mayur',
  role: 'Student developer',

  // Intro section
  headline: 'Building digital products with code, data and intelligent systems.',
  intro:
    'Mayur builds practical software — conversational chatbots, booking platforms and the backend services behind them. This site collects that work in one place.',

  // Small status pill in the intro. It is a customisable status, not a claim:
  // write your own label (e.g. "Open to internships") or set enabled: false.
  status: { enabled: true, label: 'YOUR_STATUS_HERE' },

  location: 'YOUR_LOCATION_HERE',

  // 02 / Profile — paragraphs. Add or replace freely.
  bio: [
    'Mayur is a developer interested in building practical digital products and intelligent applications — software that people can use from the tools they already have, like WhatsApp.',
    '[Add personal introduction here]',
  ],

  education: {
    degree: 'YOUR_DEGREE_HERE',
    college: 'YOUR_COLLEGE_HERE',
    graduation: 'YOUR_GRADUATION_YEAR_HERE',
  },

  // Derived from the projects in src/data/projects.js — not extra claims.
  focus: [
    'Conversational interfaces on WhatsApp',
    'REST APIs and data models',
    'Full-stack booking and dashboard systems',
  ],

  // Contact. GitHub is Mayur's personal profile (confirmed).
  contact: {
    email: 'YOUR_EMAIL_HERE',
    linkedin: 'YOUR_LINKEDIN_URL_HERE',
    github: 'https://github.com/mayur0204',
  },

  github: {
    handle: 'mayur0204',
    url: 'https://github.com/mayur0204',
  },

  // Where the three showcased project repositories are hosted.
  // This is NOT Mayur's personal profile — it is labelled as such on the site.
  projectRepositories: {
    host: 'github.com/apeksha0463',
    url: 'https://github.com/apeksha0463',
  },

  // 04 / Journey — the first entry is based on the showcased projects;
  // the rest are placeholders for you to fill in.
  journey: [
    {
      year: '2026',
      tag: 'Projects',
      text: 'Worked on the three projects in Selected Work — two WhatsApp chatbots and a cab-booking platform.',
    },
    { year: 'YYYY', tag: 'Learning', text: '[Add education / training information]' },
    { year: 'YYYY', tag: 'Next', text: '[Add your next goal]' },
  ],
};

/*
 * 03 / Stack — only technologies used in the showcased repositories.
 * `used` lists the project numbers (see projects.js) where each appears.
 */
export const stack = [
  {
    group: 'Languages',
    items: [
      { name: 'Java', used: ['01', '02', '03'] },
      { name: 'JavaScript', used: ['02', '03'] },
      { name: 'TypeScript', used: ['02', '03'] },
      { name: 'HTML & CSS', used: ['02', '03'] },
    ],
  },
  {
    group: 'Backend',
    items: [
      { name: 'Spring Boot', used: ['01', '02', '03'] },
      { name: 'Spring Security', used: ['03'] },
      { name: 'Node.js', used: ['02', '03'] },
      { name: 'Express', used: ['02', '03'] },
      { name: 'JWT auth', used: ['02', '03'] },
      { name: 'Resilience4j', used: ['01'] },
    ],
  },
  {
    group: 'Frontend',
    items: [
      { name: 'React', used: ['02', '03'] },
      { name: 'Vite', used: ['02', '03'] },
      { name: 'Tailwind CSS', used: ['02', '03'] },
      { name: 'Recharts', used: ['03'] },
      { name: 'Leaflet', used: ['03'] },
    ],
  },
  {
    group: 'Data',
    items: [
      { name: 'MongoDB', used: ['02', '03'] },
      { name: 'Mongoose', used: ['02', '03'] },
      { name: 'Spring Data MongoDB', used: ['03'] },
    ],
  },
  {
    group: 'Integrations',
    items: [
      { name: 'AiSensy WhatsApp API', used: ['01', '02', '03'] },
      { name: 'Cashfree Payments', used: ['01', '02', '03'] },
      { name: 'Google Maps API', used: ['03'] },
      { name: 'WebSocket / STOMP', used: ['03'] },
    ],
  },
  {
    group: 'Tooling',
    items: [
      { name: 'Docker & Compose', used: ['01', '02', '03'] },
      { name: 'Nginx', used: ['02'] },
      { name: 'Maven', used: ['01', '02', '03'] },
      { name: 'Swagger / OpenAPI', used: ['02'] },
      { name: 'Git & GitHub', used: ['01', '02', '03'] },
    ],
  },
];

/** True when a value is still a template placeholder. */
export const isPlaceholder = (value) =>
  typeof value !== 'string' ||
  value.trim() === '' ||
  /^YOUR_/.test(value.trim()) ||
  /^\[.*\]$/.test(value.trim()) ||
  value.trim() === 'YYYY';
