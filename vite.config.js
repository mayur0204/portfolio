import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { chatMiddleware } from './server/chat.js';

// Serves POST /api/chat from the local dev/preview server so the AI key
// stays on the server side (in .env, never bundled into the frontend).
function askMayurApi() {
  return {
    name: 'ask-mayur-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', chatMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/chat', chatMiddleware());
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load server-only variables from .env (no VITE_ prefix = not exposed to the client).
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['AI_API_KEY', 'AI_MODEL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }
  return {
    plugins: [react(), askMayurApi()],
  };
});
