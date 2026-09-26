# Mayur — Developer Portfolio

Editorial-style portfolio built with React + Vite, with an "Ask Mayur" assistant.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the build (includes /api/chat)
```

## Personalise

| What | Where |
| --- | --- |
| Bio, education, location, status, journey | `src/data/profile.js` |
| Email / LinkedIn | `profile.contact` in `src/data/profile.js` |
| GitHub profile | `profile.github` + `profile.contact.github` (set to github.com/mayur0204) |
| Projects | `src/data/projects.js` |
| Stack list | `stack` in `src/data/profile.js` |

Values starting with `YOUR_`, `YYYY` or wrapped in `[brackets]` are placeholders: the site shows them with a dashed outline and the assistant treats them as "not provided".

## Ask Mayur (chatbot)

- Without a key, it answers from `src/data/*` with a built-in local engine (`src/services/chatbot.js`).
- With a key, it sends questions to `POST /api/chat` (`server/chat.js`), which calls Claude with the portfolio knowledge base. The key stays on the server.

```bash
cp .env.example .env   # then set AI_API_KEY (Anthropic API key); optional AI_MODEL
```

## Deploy (Vercel)

Import the repo in Vercel (framework preset: Vite), then add `AI_API_KEY` under Project → Settings → Environment Variables. `api/chat.js` is deployed as a serverless function automatically. On static-only hosts (e.g. Netlify without functions, GitHub Pages), the site still works and the assistant uses local mode.
