import { useEffect, useRef, useState } from 'react';
import { projects, getProject } from '../data/projects.js';
import { profile } from '../data/profile.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import ProjectVisual from './ProjectVisual.jsx';
import './ProjectShowcase.css';

const CLOSE_MS = 420;

function Block({ letter, title, children }) {
  return (
    <section className="case-block">
      <h3 className="case-block__title">
        <span className="case-block__letter" aria-hidden="true">
          {letter}
        </span>
        {title}
      </h3>
      <div className="case-block__body">{children}</div>
    </section>
  );
}

/**
 * Full-screen case study that slides up over the page.
 * `slug` = project to show (null = closed).
 */
export default function ProjectShowcase({ slug, onClose, onNavigate }) {
  const [shown, setShown] = useState(slug); // keeps content while the close animation runs
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (slug) {
      setShown(slug);
      setClosing(false);
    } else if (shown) {
      setClosing(true);
      const t = setTimeout(() => {
        setShown(null);
        setClosing(false);
      }, CLOSE_MS);
      return () => clearTimeout(t);
    }
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = Boolean(shown) && !closing;
  useFocusTrap(dialogRef, open, { initial: closeRef });

  useEffect(() => {
    if (!shown) return;
    document.documentElement.classList.add('is-locked');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [shown, onClose]);

  // Reset scroll when switching between projects.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    if (slug) closeRef.current?.focus({ preventScroll: true });
  }, [slug]);

  const p = shown && getProject(shown);
  if (!p) return null;
  const index = projects.indexOf(p);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <div
      ref={dialogRef}
      className={`case${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
    >
      <div className="case__bar">
        <div className="case__bar-inner wrap">
          <p className="label">
            Case <span className="accent">{p.number}</span> / {String(projects.length).padStart(2, '0')}
          </p>
          <div className="case__controls">
            <button
              type="button"
              className="case__ctrl"
              onClick={() => onNavigate(prev.slug)}
              aria-label={`Previous project: ${prev.title}`}
            >
              ←<span className="case__ctrl-text"> Prev</span>
            </button>
            <button
              type="button"
              className="case__ctrl"
              onClick={() => onNavigate(next.slug)}
              aria-label={`Next project: ${next.title}`}
            >
              <span className="case__ctrl-text">Next </span>→
            </button>
            <button ref={closeRef} type="button" className="case__close" onClick={onClose}>
              Close <span aria-hidden="true">✕</span>
            </button>
          </div>
        </div>
      </div>

      <div className="case__scroll" ref={scrollRef}>
        <article className="case__article wrap" key={p.slug}>
          <header className="case__head">
            <p className="label case__cats">{p.categories.join(' / ')}</p>
            <h2 id="case-title" className="case__title">
              {p.title}
            </h2>
            <p className="case__lede">{p.summary}</p>

            <dl className="case__facts">
              <div>
                <dt className="label">Type</dt>
                <dd>{p.type}</dd>
              </div>
              <div>
                <dt className="label">Technologies</dt>
                <dd>{p.tech.length} listed</dd>
              </div>
              <div>
                <dt className="label">Repository</dt>
                <dd>
                  <a className="u-link" href={p.repo} target="_blank" rel="noopener noreferrer">
                    {p.repo.replace('https://github.com/', '')}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>
          </header>

          <figure className="case__visual">
            <ProjectVisual kind={p.visual} title={p.title} />
            <figcaption className="label">Fig. {p.number} — schematic illustration, not a screenshot</figcaption>
          </figure>

          <div className="case__blocks">
            <Block letter="A" title="Overview">
              <p>{p.overview}</p>
            </Block>
            <Block letter="B" title="Challenge">
              <p>{p.challenge}</p>
            </Block>
            <Block letter="C" title="Approach">
              <ol className="case__approach">
                {p.approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ol>
            </Block>
            <Block letter="D" title="Technologies">
              <ul className="pills case__pills">
                {p.tech.map((t) => (
                  <li key={t} className="pill">
                    {t}
                  </li>
                ))}
              </ul>
            </Block>
            <Block letter="E" title="Features">
              <ul className="case__features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Block>
            <Block letter="F" title="Repository">
              <p className="case__repo-note">
                Source code on GitHub. The repository is hosted at{' '}
                <span className="case__mono">{profile.projectRepositories.host}</span>.
              </p>
              <a className="btn btn--accent" href={p.repo} target="_blank" rel="noopener noreferrer">
                View on GitHub{' '}
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Block>
          </div>

          <button type="button" className="case__next" onClick={() => onNavigate(next.slug)}>
            <span className="label">Next case — {next.number}</span>
            <span className="case__next-title">
              {next.title} <span aria-hidden="true">→</span>
            </span>
          </button>
        </article>
      </div>
    </div>
  );
}
