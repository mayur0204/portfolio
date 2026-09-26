# Portfolio Project Plan & Architecture

## Overview
This is a personal developer portfolio built to showcase my projects, skills, and journey. The main highlight is the "Ask Mayur" AI assistant, which allows visitors to chat with an AI trained on my resume and profile. 

The goal was to keep the UI very clean and minimal, making sure it loads fast and is easy to maintain.

## Tech Stack
- **Frontend**: React (with hooks), Vite
- **Backend / API**: Node.js (Serverless function deployed on Vercel)
- **AI Integration**: Anthropic API (Claude)
- **Styling**: Standard CSS (kept simple and modular)

## Core Features
1. **Dynamic Portfolio Content**: All my details (projects, bio, contact) are stored locally in `src/data/` so I can easily update them without touching the UI code.
2. **AI Chatbot**: 
   - Takes user questions and answers them based on the context provided in my profile data.
   - If the API key is not set (or exhausts), it falls back to a basic local search engine.
3. **Responsive**: Fully responsive for mobile and desktop views.
4. **Free Hosting**: Deployed on Vercel using their free tier, with the API key stored securely in environment variables.

## Folder Structure
- `src/components/` -> Reusable UI parts (Navigation, Projects, Chat Assistant).
- `src/data/` -> Data files containing my bio, tech stack, and project details.
- `src/services/` -> Chatbot logic and API calling functions.
- `server/` / `api/` -> The serverless backend logic (`chat.js`) that safely handles the Anthropic API calls without exposing the key to the frontend.

## Future Plans / To-Do
- [ ] Add a dark mode toggle.
- [ ] Add a blog section for technical write-ups.
- [ ] Implement rate limiting on the chatbot to prevent spam (currently basic tracking exists, but needs improvement).
- [ ] Convert some heavier images to WebP to improve the Lighthouse score.
