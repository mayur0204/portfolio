/*
 * Builds the assistant's knowledge base from src/data/*.
 * Shared by the browser (offline answers) and the server (/api/chat),
 * so both always read from the same portfolio data.
 */
import { profile, stack, isPlaceholder } from '../data/profile.js';
import { projects } from '../data/projects.js';

export const SYSTEM_INSTRUCTION = `You are Mayur's portfolio assistant.

Answer questions using only information available in Mayur's portfolio knowledge base.

Never invent education, experience, companies, qualifications, achievements, technologies, or personal information.

If the information is unavailable, clearly say that the portfolio does not currently contain that information.

Help visitors understand Mayur's projects and navigate the portfolio.`;

const RESPONSE_STYLE = `Style rules:
- Keep answers short: 2–6 sentences or a brief list.
- Plain text only. You may use **bold** and markdown links [label](url).
- To let the visitor open a project's case study on this page, link to "#project:<slug>", e.g. [Open case study](#project:vazraa-chatbot).
- To point to a section, link to "#work", "#profile", "#stack", "#journey" or "#contact".
- Fields marked "(not provided)" are placeholders. Say the portfolio does not currently contain that information.
- The project repositories are hosted at github.com/apeksha0463; describe them as the project repositories, not as Mayur's personal account. Mayur's personal GitHub profile is github.com/mayur0204.`;

const show = (v) => (isPlaceholder(v) ? '(not provided)' : v);

export function buildKnowledgeText() {
  const lines = [];
  lines.push('# PROFILE');
  lines.push(`Name: ${profile.name}`);
  lines.push(`Role: ${profile.role}`);
  lines.push(`Headline: ${profile.headline}`);
  lines.push(`Intro: ${profile.intro}`);
  lines.push(`Location: ${show(profile.location)}`);
  lines.push(`Bio: ${profile.bio.map(show).join(' ')}`);
  lines.push(
    `Education: degree ${show(profile.education.degree)}; college ${show(profile.education.college)}; graduation ${show(profile.education.graduation)}`,
  );
  lines.push('Work experience, internships, companies, certifications, awards: (not provided)');
  lines.push(`Focus areas (derived from the projects): ${profile.focus.join('; ')}`);
  lines.push(`Email: ${show(profile.contact.email)}`);
  lines.push(`LinkedIn: ${show(profile.contact.linkedin)}`);
  lines.push(`Personal GitHub profile: ${profile.github.url}`);
  lines.push(`Project repositories host: ${profile.projectRepositories.url} (not Mayur's personal account)`);
  lines.push(`Journey: ${profile.journey.map((j) => `${show(j.year)} ${j.tag} — ${show(j.text)}`).join(' | ')}`);

  lines.push('\n# STACK (only technologies used in the showcased projects)');
  for (const g of stack) {
    lines.push(`${g.group}: ${g.items.map((i) => `${i.name} [projects ${i.used.join(', ')}]`).join('; ')}`);
  }

  for (const p of projects) {
    lines.push(`\n# PROJECT ${p.number} — ${p.title} (slug: ${p.slug})`);
    lines.push(`Categories: ${p.categories.join(', ')}`);
    lines.push(`Type: ${p.type}`);
    lines.push(`Repository: ${p.repo}`);
    lines.push(`Summary: ${p.summary}`);
    lines.push(`Overview: ${p.overview}`);
    lines.push(`Challenge: ${p.challenge}`);
    lines.push(`Approach:\n- ${p.approach.join('\n- ')}`);
    lines.push(`Features:\n- ${p.features.join('\n- ')}`);
    lines.push(`Technologies: ${p.tech.join(', ')}`);
  }

  lines.push('\n# SITE SECTIONS');
  lines.push(
    '01 Work (#work), 02 Profile (#profile), 03 Stack (#stack), 04 Journey (#journey), 05 Contact (#contact).',
  );
  return lines.join('\n');
}

export function buildSystemPrompt() {
  return `${SYSTEM_INSTRUCTION}\n\n${RESPONSE_STYLE}\n\n<knowledge_base>\n${buildKnowledgeText()}\n</knowledge_base>`;
}
