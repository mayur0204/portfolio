/*
 * Server-side handler for "Ask Mayur".
 *
 * Runs only on the server (Vite dev/preview middleware or the Vercel function
 * in /api/chat.js). The API key is read from process.env.AI_API_KEY and is
 * never sent to the browser. When no key is configured it answers { configured: false } and the
 * frontend falls back to its local knowledge engine.
 */
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '../src/services/knowledge.js';

const DEFAULT_MODEL = 'claude-opus-5';
const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;
const RATE_LIMIT = { windowMs: 60_000, max: 20 };

const hits = new Map(); // ip -> timestamps (best effort; per server instance)
let client;
let systemPrompt;

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

/** Validate and normalise the conversation sent by the browser. */
function cleanMessages(input) {
  if (!Array.isArray(input)) return null;
  const msgs = input
    .slice(-MAX_MESSAGES)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS).trim() }))
    .filter((m) => m.content);
  // The API expects the conversation to start with a user turn and alternate.
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  const merged = [];
  for (const m of msgs) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.content += `\n\n${m.content}`;
    else merged.push({ ...m });
  }
  if (!merged.length || merged[merged.length - 1].role !== 'user') return null;
  return merged;
}

/**
 * @param {{ body: unknown, ip: string }} req
 * @returns {Promise<{ status: number, json: object }>}
 */
export async function handleChat({ body, ip }) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return { status: 200, json: { configured: false } };
  if (rateLimited(ip || 'unknown')) return { status: 429, json: { error: 'rate_limited' } };

  const messages = cleanMessages(body && body.messages);
  if (!messages) return { status: 400, json: { error: 'invalid_request' } };

  client ||= new Anthropic({ apiKey, timeout: 25_000, maxRetries: 1 });
  systemPrompt ||= buildSystemPrompt();

  try {
    const response = await client.beta.messages.create({
      model: process.env.AI_MODEL || DEFAULT_MODEL,
      max_tokens: 1024, // answers are deliberately short
      output_config: { effort: 'low' }, // simple Q&A over a small knowledge base
      // If a request is declined by a safety classifier, retry it server-side
      // on Anthropic's recommended fallback model.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages,
    });

    if (response.stop_reason === 'refusal') {
      return {
        status: 200,
        json: {
          reply:
            "I can't help with that one. I can answer questions about Mayur's projects, the technologies used, and how to get in touch.",
        },
      };
    }
    const reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    if (!reply) return { status: 502, json: { error: 'empty_reply' } };
    return { status: 200, json: { reply } };
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return { status: 429, json: { error: 'upstream_rate_limited' } };
    if (err instanceof Anthropic.AuthenticationError) {
      console.error('[ask-mayur] AI_API_KEY was rejected by the API.');
      return { status: 503, json: { error: 'not_configured' } };
    }
    if (err instanceof Anthropic.APIError) {
      console.error('[ask-mayur] API error', err.status, err.message);
      return { status: 502, json: { error: 'upstream_error' } };
    }
    console.error('[ask-mayur] request failed', err && err.message);
    return { status: 502, json: { error: 'upstream_unreachable' } };
  }
}

/** Connect-style middleware used by the Vite dev and preview servers. */
export function chatMiddleware() {
  return async (req, res, next) => {
    if (req.method !== 'POST') return next();
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 50_000) break;
    }
    let body = null;
    try {
      body = JSON.parse(raw);
    } catch {
      /* handled as invalid below */
    }
    const { status, json } = await handleChat({ body, ip: req.socket.remoteAddress });
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(json));
  };
}
