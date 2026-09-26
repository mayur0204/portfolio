/*
 * Vercel serverless function: POST /api/chat
 * Set AI_API_KEY (and optionally AI_MODEL) in the Vercel project settings.
 */
import { handleChat } from '../server/chat.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress;
  const { status, json } = await handleChat({ body: req.body, ip });
  res.status(status).json(json);
}
