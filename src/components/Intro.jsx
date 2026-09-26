import { useEffect, useState } from 'react';
import { profile } from '../data/profile.js';
import { projects } from '../data/projects.js';
import { useMedia, REDUCED_MOTION } from '../hooks/useMedia.js';
import Field from './Field.jsx';
import './Intro.css';

// Every keyword appears in the verified stack (src/data/profile.js).
const KEYWORDS = ['Spring Boot', 'Node.js', 'React', 'MongoDB', 'WhatsApp APIs', 'Docker'];

function Rotator() {
  const reduced = useMedia(REDUCED_MOTION);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % KEYWORDS.length), 2200);
    return () => clearInterval(t);
  }, [reduced]);
  return (
    <span className="rotator">
      <span className="sr-only">{KEYWORDS.join(', ')}</span>
      <span className="rotator__word" key={i} aria-hidden="true">
        {KEYWORDS[i]}
      </span>
    </span>
  );
}

export default function Intro({ onOpenProject }) {
  const count = String(projects.length).padStart(2, '0');
  return (
    <section id="top" className="intro" aria-labelledby="intro-title">
      <div className="intro__grid wrap">
        <div className="intro__meta">
          <p className="label">Portfolio · Index</p>
          <p className="label">{profile.role}</p>
          <p className="label">
            <span className="accent">{count}</span> selected projects
          </p>
          {profile.status.enabled && (
            <p className="label intro__status">
              <span className="intro__status-dot" aria-hidden="true" />
              <Field value={profile.status.label} />
            </p>
          )}
        </div>

        <h1 id="intro-title" className="intro__name" aria-label={profile.name}>
          {profile.name
            .toUpperCase()
            .split('')
            .map((ch, i) => (
              <span key={i} className="intro__char" style={{ '--i': i }} aria-hidden="true">
                {ch}
              </span>
            ))}
          <span className="intro__square" aria-hidden="true" />
        </h1>

        <span className="intro__line" aria-hidden="true" />

        <p className="intro__headline">{profile.headline}</p>

        <div className="intro__aside">
          <p className="intro__text">{profile.intro}</p>
          <p className="intro__now">
            <span className="label">Working with</span>
            <Rotator />
          </p>
        </div>

        <nav className="intro__index" aria-label="Project index">
          <p className="label">Index of work</p>
          <ol>
            {projects.map((p) => (
              <li key={p.slug}>
                <button type="button" onClick={() => onOpenProject(p.slug)}>
                  <span className="intro__index-num">{p.number}</span>
                  <span className="u-link">{p.title}</span>
                  <span className="intro__index-cat label">{p.categories[0]}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <a href="#work" className="intro__scroll">
          <span className="intro__scroll-track" aria-hidden="true">
            <span className="intro__scroll-bar" />
          </span>
          <span className="label">Scroll to selected work</span>
        </a>
      </div>
    </section>
  );
}
