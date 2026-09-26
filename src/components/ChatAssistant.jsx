import { useEffect, useRef, useState } from 'react';
import { askAssistant } from '../services/chatbot.js';
import { useMedia } from '../hooks/useMedia.js';
import RichText from './RichText.jsx';
import './ChatAssistant.css';

const SUGGESTIONS = [
  'What has Mayur built?',
  'Tell me about the E-Commerce Chatbot',
  'Show me the Vazraa projects',
  'What technologies are used?',
];

const GREETING = {
  role: 'assistant',
  content:
    "Hi — I'm the portfolio assistant. Ask me about Mayur's projects, the technologies behind them, or how to get in touch. I only answer from what's on this site.",
};

const STORE_KEY = 'ask-mayur:conversation';

function loadConversation() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    /* storage unavailable */
  }
  return [GREETING];
}

export default function ChatAssistant({ open, onClose, onOpenProject }) {
  const [messages, setMessages] = useState(loadConversation);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState(null); // 'ai' | 'local'
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const openerRef = useRef(null);
  const compact = useMedia('(max-width: 640px)');

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Focus the input on open; return focus to the opener on close.
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
      const onKey = (e) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', onKey);
      if (compact) document.documentElement.classList.add('is-locked');
      return () => {
        clearTimeout(t);
        window.removeEventListener('keydown', onKey);
        document.documentElement.classList.remove('is-locked');
      };
    }
    // Closing makes the panel inert, which drops focus to <body>; send it back to the opener.
    const lost = document.activeElement === document.body || panelRef.current?.contains(document.activeElement);
    if (openerRef.current && lost) {
      openerRef.current.focus?.({ preventScroll: true });
      openerRef.current = null;
    }
  }, [open, onClose, compact]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  async function send(text) {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...messages, { role: 'user', content: q.slice(0, 500) }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      // The greeting is UI copy, not part of the conversation sent to the model.
      const history = next.filter(
        (m) => m !== GREETING && !(m.role === GREETING.role && m.content === GREETING.content),
      );
      const reply = await askAssistant(history);
      setMode(reply.source);
      setMessages((m) => [...m, { role: 'assistant', content: reply.text }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus({ preventScroll: true });
    }
  }

  function clear() {
    setMessages([GREETING]);
    setInput('');
    inputRef.current?.focus();
  }

  function onAction(action) {
    if (action.type === 'project') onOpenProject(action.slug);
    if (compact) onClose();
  }

  const showSuggestions = messages.length <= 1 && !busy;

  return (
    <aside
      id="ask-mayur"
      ref={panelRef}
      className={`ask${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal={compact ? 'true' : 'false'}
      aria-labelledby="ask-title"
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <header className="ask__head">
        <div>
          <h2 id="ask-title" className="ask__title">
            Ask Mayur
          </h2>
          <p className="label ask__sub">
            Portfolio assistant
            {mode && <span className="ask__mode">{mode === 'ai' ? 'AI' : 'Local'}</span>}
          </p>
        </div>
        <div className="ask__tools">
          <button type="button" className="ask__tool" onClick={clear} disabled={messages.length <= 1 || busy}>
            Clear
          </button>
          <button type="button" className="ask__tool ask__close" onClick={onClose} aria-label="Close assistant">
            ✕
          </button>
        </div>
      </header>

      <div className="ask__log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions">
        {messages.map((m, i) => (
          <div key={i} className={`ask__msg ask__msg--${m.role}`}>
            <span className="ask__who label">{m.role === 'user' ? 'You' : 'Assistant'}</span>
            <div className="ask__bubble">
              {m.role === 'assistant' ? <RichText text={m.content} onAction={onAction} /> : <p>{m.content}</p>}
            </div>
          </div>
        ))}
        {busy && (
          <div className="ask__msg ask__msg--assistant">
            <span className="ask__who label">Assistant</span>
            <div className="ask__typing" aria-label="Assistant is typing" role="status">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        {showSuggestions && (
          <div className="ask__suggest">
            <p className="label">Try asking</p>
            <ul>
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => send(s)}>
                    {s} <span aria-hidden="true">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form
        className="ask__form"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="ask-input" className="sr-only">
          Ask a question about Mayur's portfolio
        </label>
        <input
          id="ask-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about projects, stack, contact…"
          maxLength={500}
          autoComplete="off"
        />
        <button type="submit" className="ask__send" disabled={!input.trim() || busy}>
          Send
        </button>
      </form>
      <p className="ask__foot label">Answers come from this portfolio’s content only.</p>
    </aside>
  );
}
