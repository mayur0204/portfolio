/*
 * "Ask Mayur" — chatbot service.
 *
 * 1. If the server has an AI key configured, questions go to /api/chat,
 *    which calls the LLM with the portfolio knowledge base (the key never
 *    reaches the browser).
 * 2. Otherwise — or if that request fails — questions are answered locally
 *    by a small retrieval engine over src/data/profile.js and projects.js.
 *
 * The local engine does not store question/answer pairs. It works out which
 * project(s) and which topic a question is about, then composes an answer
 * from the data files, so edits to the data update the answers.
 */
import { profile, stack, isPlaceholder } from '../data/profile.js';
import { projects } from '../data/projects.js';

/* ---------------------------------------------------------------- text utils */

const STOP = new Set(
  'a an the is are was were be been of to in on for and or with about me tell what whats which who whom how can could would should does do did i you your he his him it its this that these those there their they please show give some any my we our us has have had from by at as into more much just also show list'.split(
    ' ',
  ),
);

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9#+.'\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (s) =>
  norm(s)
    .replace(/[.'-]/g, ' ')
    .split(' ')
    .filter((t) => t.length > 1 && !STOP.has(t));

/** Cue matching: "multi word" → phrase, "stem*" → prefix, else whole word. */
function hasCue(q, cue) {
  if (cue.includes(' ')) return q.includes(cue);
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (cue.endsWith('*')) return new RegExp(`(?<![a-z0-9])${esc(cue.slice(0, -1))}`).test(q);
  return new RegExp(`(?<![a-z0-9])${esc(cue)}(?![a-z0-9])`).test(q);
}

/* ------------------------------------------------------------- intent vocab */

const TOPICS = {
  greeting: ['hi', 'hello', 'hey', 'hiya', 'namaste', 'good morning', 'good evening', 'good afternoon'],
  thanks: ['thanks', 'thank you', 'thx', 'cheers', 'great', 'cool', 'awesome'],
  help: ['help', 'what can you', 'what can i ask', 'what should i ask'],
  who: ['who is', "who's", 'about mayur', 'about him', 'introduce', 'introduction', 'background', 'bio', 'who are you'],
  projects: [
    'project*',
    'built',
    'build',
    'made',
    'make',
    'worked on',
    'work',
    'portfolio',
    'showcase',
    'created',
    'develop*',
  ],
  tech: [
    'tech*',
    'stack',
    'language*',
    'framework*',
    'tool*',
    'skill*',
    'used',
    'uses',
    'using',
    'built with',
    'made with',
    'library',
    'libraries',
    'database',
  ],
  features: ['feature*', 'what does', 'what can it', 'functionalit*', 'capabilit*', 'do?'],
  how: [
    'how does',
    'how is',
    'how was',
    'how did',
    'architecture',
    'implement*',
    'approach',
    'under the hood',
    'design',
    'flow',
    'state machine',
  ],
  challenge: ['problem', 'challenge', 'why', 'purpose', 'solve*', 'goal of'],
  links: ['link*', 'github', 'repo*', 'code', 'source', 'where can', 'see the', 'view', 'demo', 'url', 'check out'],
  contact: [
    'contact',
    'email',
    'e-mail',
    'mail',
    'reach',
    'linkedin',
    'hire',
    'hiring',
    'connect',
    'get in touch',
    'message him',
    'talk to',
  ],
  education: [
    'education',
    'college',
    'university',
    'degree',
    'study',
    'studies',
    'studying',
    'major',
    'minor',
    'gpa',
    'cgpa',
    'graduat*',
    'school',
    'course',
    'semester',
    'qualification*',
  ],
  experience: [
    'experience',
    'intern*',
    'job',
    'employ*',
    'company',
    'companies',
    'worked at',
    'certif*',
    'award*',
    'achievement*',
    'resume',
    'cv',
    'salary',
    'age',
    'old is',
    'phone',
    'birthday',
    'hobb*',
  ],
  location: ['where is mayur', 'where does', 'located', 'location', 'based', 'city', 'country', 'live'],
  journey: ['journey', 'timeline', 'next', 'future', 'plan', 'plans', 'goals'],
  status: ['available', 'availability', 'open to', 'looking for', 'opportunit*'],
};

const topicsIn = (q) => Object.keys(TOPICS).filter((t) => TOPICS[t].some((c) => hasCue(q, c)));

// Well-known technologies that are NOT part of the portfolio — used to say
// "not listed" instead of guessing.
const OTHER_TECH = [
  'python',
  'django',
  'flask',
  'fastapi',
  'php',
  'laravel',
  'ruby',
  'rails',
  'rust',
  'golang',
  'c++',
  'c#',
  '.net',
  'kotlin',
  'swift',
  'flutter',
  'dart',
  'react native',
  'angular',
  'vue',
  'svelte',
  'next.js',
  'nextjs',
  'mysql',
  'postgres',
  'postgresql',
  'sql',
  'redis',
  'firebase',
  'aws',
  'azure',
  'gcp',
  'kubernetes',
  'graphql',
  'tensorflow',
  'pytorch',
  'machine learning',
  'deep learning',
  'data science',
  'nlp',
  'pandas',
  'numpy',
  'openai',
  'langchain',
];

/* ----------------------------------------------------------- data lookups */

const known = (v) => !isPlaceholder(v);
const P = (n) => projects.find((p) => p.number === n);
const caseLink = (p) => `[Open the ${p.title} case study](#project:${p.slug})`;
const repoLink = (p) => `[${p.repo.replace('https://', '')}](${p.repo})`;

function findProjects(q) {
  const hits = projects.filter((p) => q.includes(norm(p.title)) || p.aliases.some((a) => q.includes(a)));
  if (hits.length) return hits;
  if (/\bvazraa\b|\bvazra\b/.test(q)) return projects.filter((p) => p.slug.startsWith('vazraa'));
  if (/\bchat ?bots\b|\bboth (?:the )?bots\b/.test(q)) return [P('01'), P('03')];
  if (/\bchat ?bot\b/.test(q) && !/\bthis chat ?bot\b|\byou\b/.test(q)) return [P('01'), P('03')];
  const num = q.match(/\bproject\s*(?:no\.?\s*|#\s*)?0?([123])\b/);
  if (num) return [P(`0${num[1]}`)];
  if (/\b(first|1st)\b/.test(q) && /project/.test(q)) return [P('01')];
  if (/\b(second|2nd)\b/.test(q) && /project/.test(q)) return [P('02')];
  if (/\b(third|3rd|last)\b/.test(q) && /project/.test(q)) return [P('03')];
  return [];
}

function findTech(q) {
  const names = new Map();
  for (const g of stack) for (const i of g.items) names.set(norm(i.name), i.used);
  for (const p of projects)
    for (const t of p.tech) {
      const key = norm(t.replace(/\s*\(.*\)$/, '').replace(/\s[\d.]+$/, ''));
      const used = names.get(key) || [];
      if (!used.includes(p.number)) names.set(key, [...used, p.number].sort());
    }
  // Aliases for common short forms.
  const alias = {
    spring: 'spring boot',
    node: 'node.js',
    nodejs: 'node.js',
    mongo: 'mongodb',
    js: 'javascript',
    ts: 'typescript',
    tailwind: 'tailwind css',
    whatsapp: 'aisensy whatsapp api',
    html: 'html css',
    css: 'html css',
    java: 'java',
  };
  const found = [];
  for (const [name, used] of names) {
    if (name.length > 2 && hasCue(q, name)) found.push({ name, used });
  }
  for (const [a, target] of Object.entries(alias)) {
    if (hasCue(q, a) && names.has(target) && !found.some((f) => f.name === target))
      found.push({ name: target, used: names.get(target) });
  }
  const unknown = OTHER_TECH.filter((t) => hasCue(q, t) && !found.some((f) => f.name.includes(t)));
  return { found, unknown };
}

/* ------------------------------------------------------------- composers */

const NOT_AVAILABLE = 'The portfolio does not currently contain that information.';

function answerUnavailable(topic) {
  if (topic === 'education') {
    const e = profile.education;
    const parts = [
      known(e.degree) && `Degree: ${e.degree}`,
      known(e.college) && `College: ${e.college}`,
      known(e.graduation) && `Graduation: ${e.graduation}`,
    ].filter(Boolean);
    if (parts.length) return `Here is what the portfolio lists:\n${parts.map((x) => `- ${x}`).join('\n')}`;
  }
  if (topic === 'location' && known(profile.location)) return `Mayur is based in ${profile.location}.`;
  return `${NOT_AVAILABLE} It focuses on Mayur's projects — you can ask me about the [three projects in Selected Work](#work) or the [technologies they use](#stack).`;
}

function answerWho() {
  const bio = profile.bio.filter(known);
  return [
    `**${profile.name}** is a ${profile.role.toLowerCase()}. ${profile.intro}`,
    bio.length ? bio[0] : '',
    `The portfolio showcases ${projects.length} projects: ${projects.map((p) => `**${p.title}**`).join(', ')}.`,
    'Education and experience details haven’t been added to the portfolio yet.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

function answerProjectList() {
  return [
    `Mayur's portfolio features ${projects.length} projects:`,
    projects.map((p) => `- **${p.number} · ${p.title}** — ${p.summary.split('. ')[0]}.`).join('\n'),
    'Ask about any of them, or open a case study from [Selected Work](#work).',
  ].join('\n\n');
}

function answerStack() {
  return [
    'Technologies used across the three projects:',
    stack.map((g) => `- **${g.group}:** ${g.items.map((i) => i.name).join(', ')}`).join('\n'),
    'Only technologies found in the project repositories are listed. See [03 / Stack](#stack) for which project uses what.',
  ].join('\n\n');
}

function answerTechLookup({ found, unknown }) {
  const out = [];
  for (const f of found.slice(0, 4)) {
    const label = stack.flatMap((g) => g.items).find((i) => norm(i.name) === f.name)?.name || f.name;
    out.push(`- **${label}** — used in ${f.used.map((n) => P(n).title).join(', ')}.`);
  }
  if (unknown.length) {
    out.push(
      `${unknown.map((u) => `**${u[0].toUpperCase() + u.slice(1)}**`).join(', ')} ${unknown.length > 1 ? 'aren’t' : 'isn’t'} part of the showcased projects, so the portfolio does not currently contain information about it.`,
    );
  }
  return out.join('\n');
}

function answerLinks() {
  return [
    'The project source code is on GitHub:',
    projects.map((p) => `- **${p.title}** — ${repoLink(p)}`).join('\n'),
    `These repositories are hosted at ${profile.projectRepositories.host}. Mayur's personal GitHub profile is [github.com/${profile.github.handle}](${profile.github.url}).`,
  ].join('\n\n');
}

function answerContact() {
  const c = profile.contact;
  const rows = [
    known(c.email) ? `- **Email:** [${c.email}](mailto:${c.email})` : null,
    known(c.linkedin) ? `- **LinkedIn:** [${c.linkedin.replace(/^https?:\/\//, '')}](${c.linkedin})` : null,
    `- **GitHub:** [github.com/${profile.github.handle}](${profile.github.url})`,
  ].filter(Boolean);
  const missing = [!known(c.email) && 'email address', !known(c.linkedin) && 'LinkedIn profile'].filter(Boolean);
  return [
    'You can reach Mayur through:',
    rows.join('\n'),
    missing.length
      ? `The ${missing.join(' and ')} ${missing.length > 1 ? 'haven’t' : 'hasn’t'} been added to the portfolio yet.`
      : '',
    'The [Contact section](#contact) has the same details.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

function answerJourney() {
  const rows = profile.journey.map((j) =>
    known(j.text) ? `- **${known(j.year) ? j.year : '—'} · ${j.tag}:** ${j.text}` : `- **${j.tag}:** not added yet`,
  );
  return `From [04 / Journey](#journey):\n\n${rows.join('\n')}`;
}

function answerStatus() {
  if (profile.status.enabled && known(profile.status.label))
    return `Mayur's current status: **${profile.status.label}**. See [Contact](#contact) to get in touch.`;
  return `${NOT_AVAILABLE} For opportunities, see the [Contact section](#contact).`;
}

// Words that only identify a project or phrase a question — ignored when
// looking for a specific detail inside one project.
const GENERIC = new Set(
  'bot chatbot chat project projects website site web vazraa mayur handle handles handled work works working built build made use uses used does did get support supports supported feature features'.split(
    ' ',
  ),
);

function detailIn(p, q) {
  const own = new Set(tokenize(`${p.title} ${p.aliases.join(' ')}`));
  const qt = tokenize(q).filter((t) => !own.has(t) && !GENERIC.has(t));
  if (!qt.length) return [];
  const lines = [p.challenge, ...p.approach, ...p.features];
  return lines
    .map((text) => {
      const toks = tokenize(text);
      const hits = qt.filter((t) => toks.some((x) => x === t || (t.length > 3 && x.startsWith(t.slice(0, -1))))).length;
      return { text, hits };
    })
    .filter((l) => l.hits > 0)
    .sort((a, b) => b.hits - a.hits || a.text.length - b.text.length)
    .slice(0, 3);
}

function answerProject(p, topics, q = '') {
  const detail = detailIn(p, q);
  if (detail.length && !topics.includes('tech') && !topics.includes('links')) {
    return `From the **${p.title}** project:\n\n${detail.map((d) => `- ${d.text}`).join('\n')}\n\n${caseLink(p)}`;
  }
  if (topics.includes('tech')) {
    return `**${p.title}** uses: ${p.tech.join(', ')}.\n\n${caseLink(p)}`;
  }
  if (topics.includes('links')) {
    return `The ${p.title} source code: ${repoLink(p)}\n\n(Hosted at ${profile.projectRepositories.host}.)`;
  }
  if (topics.includes('how')) {
    return `How **${p.title}** is built:\n\n${p.approach.map((a) => `- ${a}`).join('\n')}\n\n${caseLink(p)}`;
  }
  if (topics.includes('challenge')) {
    return `**The problem:** ${p.challenge}\n\n${caseLink(p)}`;
  }
  if (topics.includes('features')) {
    return `**${p.title}** — ${p.summary}\n\nKey features:\n${p.features
      .slice(0, 6)
      .map((f) => `- ${f}`)
      .join('\n')}\n\n${caseLink(p)}`;
  }
  return [
    `**${p.title}** (${p.categories.join(' / ')})`,
    p.overview,
    `**Built with:** ${p.tech.slice(0, 7).join(', ')}${p.tech.length > 7 ? '…' : ''}`,
    `${caseLink(p)} · ${repoLink(p)}`,
  ].join('\n\n');
}

function answerProjects(list, topics, q) {
  if (list.length === 1) return answerProject(list[0], topics, q);
  const body = list.map((p) => {
    if (topics.includes('tech')) return `- **${p.title}:** ${p.tech.slice(0, 8).join(', ')}`;
    if (topics.includes('links')) return `- **${p.title}:** ${repoLink(p)}`;
    return `- **${p.title}** — ${p.summary} ${caseLink(p)}`;
  });
  return `${list.length === 2 && list.every((p) => p.slug.startsWith('vazraa')) ? 'The two Vazraa projects:' : 'Here they are:'}\n\n${body.join('\n\n')}`;
}

/* ---------------------------------------------- retrieval fallback (BM25-lite) */

let INDEX;
function buildIndex() {
  const docs = [];
  for (const p of projects) {
    const add = (field, text) => docs.push({ p, field, text, toks: tokenize(`${p.title} ${text}`) });
    add('summary', p.summary);
    add('overview', p.overview);
    add('challenge', p.challenge);
    p.approach.forEach((a) => add('approach', a));
    p.features.forEach((f) => add('feature', f));
  }
  profile.bio.filter(known).forEach((b) => docs.push({ field: 'bio', text: b, toks: tokenize(b) }));
  const df = new Map();
  docs.forEach((d) => new Set(d.toks).forEach((t) => df.set(t, (df.get(t) || 0) + 1)));
  return { docs, df, N: docs.length };
}

function retrieve(q) {
  INDEX ||= buildIndex();
  const qt = [...new Set(tokenize(q))];
  if (!qt.length) return null;
  let best = null;
  for (const d of INDEX.docs) {
    let score = 0;
    let hits = 0;
    for (const t of qt) {
      const tf = d.toks.filter((x) => x === t || (t.length > 4 && x.startsWith(t))).length;
      if (!tf) continue;
      hits++;
      const idf = Math.log(1 + INDEX.N / (INDEX.df.get(t) || 1));
      score += idf * (tf / (tf + 1));
    }
    score /= Math.sqrt(qt.length);
    if (hits && (!best || score > best.score)) best = { ...d, score, hits };
  }
  return best && best.score > 1.4 && (best.hits >= 2 || qt.length === 1) ? best : null;
}

/* ------------------------------------------------------------------ engine */

export function localAnswer(question, history = []) {
  const q = norm(question);
  if (!q) return answerHelp();
  const topics = topicsIn(q);
  let list = findProjects(q);

  // Follow-ups like "what tech does it use?" refer to the last project discussed.
  if (!list.length && /\b(it|this|that|its|this one|the project)\b/.test(q)) {
    for (let i = history.length - 1; i >= 0 && !list.length; i--) {
      if (history[i].role === 'user') list = findProjects(norm(history[i].content));
    }
  }

  const personal = ['education', 'experience', 'location'].find((t) => topics.includes(t));
  if (personal && !list.length) return answerUnavailable(personal);
  if (topics.includes('contact')) return answerContact();
  if (list.length) return answerProjects(list, topics, q);

  const tech = findTech(q);
  if (tech.found.length || tech.unknown.length) {
    if (
      !tech.found.length &&
      !topics.includes('tech') &&
      !/\b(know|knows|use|uses|used|familiar|work with|worked with)\b/.test(q)
    ) {
      // e.g. a bare "python?" — still answer honestly
    }
    return answerTechLookup(tech);
  }
  if (topics.includes('tech')) return answerStack();
  if (topics.includes('links')) return answerLinks();
  if (topics.includes('who')) return answerWho();
  if (topics.includes('status')) return answerStatus();
  if (topics.includes('journey')) return answerJourney();
  if (topics.includes('projects')) return answerProjectList();
  if (topics.includes('help')) return answerHelp();
  if (topics.includes('greeting'))
    return `Hi! I'm the portfolio assistant. I can tell you about Mayur's projects, the technologies behind them, and where to find the code.\n\nTry asking “What has Mayur built?”`;
  if (topics.includes('thanks')) return 'Glad to help. Anything else you’d like to know about the projects?';
  if (/\bmayur\b/.test(q) && q.split(' ').length <= 3) return answerWho();

  const hit = retrieve(q);
  if (hit) {
    if (hit.p) return `From **${hit.p.title}** (${hit.field}):\n\n${hit.text}\n\n${caseLink(hit.p)}`;
    return hit.text;
  }
  return `${NOT_AVAILABLE}\n\nI can help with Mayur's projects, the technologies they use, where to see the code, and how to get in touch.`;
}

function answerHelp() {
  return [
    'I answer questions using the content of this portfolio. For example:',
    '- What has Mayur built?\n- Tell me about the E-Commerce Chatbot\n- What does the Vazraa Chatbot do?\n- What technologies are used?\n- How can I contact Mayur?',
  ].join('\n\n');
}

/* --------------------------------------------------------------- transport */

let aiDisabled = false;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {{role: 'user'|'assistant', content: string}[]} history — ends with the new user message
 * @returns {Promise<{text: string, source: 'ai'|'local'}>}
 */
export async function askAssistant(history) {
  const question = history[history.length - 1].content;
  if (!aiDisabled) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-12) }),
        signal: AbortSignal.timeout(30000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.configured === false) aiDisabled = true; // no AI key on the server — stay local
        else if (typeof data.reply === 'string' && data.reply.trim()) return { text: data.reply.trim(), source: 'ai' };
      } else if (res.status === 503 || res.status === 404) {
        aiDisabled = true; // key rejected / no API route (e.g. static hosting) — stay local
      }
    } catch {
      /* network error or timeout → fall through to local */
    }
  }
  await wait(380 + Math.random() * 420); // brief, natural typing pause
  return { text: localAnswer(question, history.slice(0, -1)), source: 'local' };
}
