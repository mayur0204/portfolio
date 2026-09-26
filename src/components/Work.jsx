import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/projects.js';
import { useMedia, FINE_POINTER, REDUCED_MOTION } from '../hooks/useMedia.js';
import SectionHead from './SectionHead.jsx';
import Reveal from './Reveal.jsx';
import ProjectVisual from './ProjectVisual.jsx';
import './Work.css';

/** Preview card that trails the cursor while a project row is hovered. */
function CursorPreview({ project, visible }) {
  const ref = useRef(null);
  const reduced = useMedia(REDUCED_MOTION);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    let raf;
    const tick = () => {
      const k = reduced ? 1 : 0.18;
      pos.current.x += (target.current.x - pos.current.x) * k;
      pos.current.y += (target.current.y - pos.current.y) * k;
      if (ref.current) {
        const w = ref.current.offsetWidth;
        const h = ref.current.offsetHeight;
        // Keep the card on-screen: flip to the left of the cursor near the right edge.
        const x = pos.current.x + 28 + w > window.innerWidth ? pos.current.x - w - 28 : pos.current.x + 28;
        const y = Math.min(Math.max(pos.current.y - h / 2, 76), window.innerHeight - h - 16);
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={ref} className={`cursor-preview${visible ? ' is-on' : ''}`} aria-hidden="true">
      <div className="cursor-preview__frame">
        {projects.map((p) => (
          <div key={p.slug} className={`cursor-preview__slide${project?.slug === p.slug ? ' is-active' : ''}`}>
            <ProjectVisual kind={p.visual} title={p.title} />
          </div>
        ))}
      </div>
      <p className="cursor-preview__cap label">{project ? `${project.number} — Open case study` : ''}</p>
    </div>
  );
}

function ProjectRow({ project, onOpen, onHover, showInline }) {
  return (
    <li className="work-row" onPointerEnter={() => onHover(project)} onPointerLeave={() => onHover(null)}>
      <Reveal className="work-row__inner">
        <span className="work-row__num" aria-hidden="true">
          {project.number}
        </span>

        <div className="work-row__head">
          <p className="work-row__cats label">{project.categories.join(' / ')}</p>
          <h3 className="work-row__title">
            <button
              type="button"
              className="work-row__open"
              onClick={() => onOpen(project.slug)}
              onFocus={() => onHover(project)}
              onBlur={() => onHover(null)}
            >
              <span className="sr-only">Project {project.number}: </span>
              <span className="work-row__title-text">{project.title}</span>
            </button>
          </h3>
        </div>

        {showInline && (
          <div className="work-row__thumb">
            <ProjectVisual kind={project.visual} title={project.title} />
          </div>
        )}

        <div className="work-row__body">
          <p className="work-row__summary">{project.summary}</p>
          <ul className="pills" aria-label="Technologies">
            {project.tech.slice(0, 6).map((t) => (
              <li key={t} className="pill">
                {t}
              </li>
            ))}
            {project.tech.length > 6 && <li className="pill pill--more">+{project.tech.length - 6}</li>}
          </ul>
          <span className="work-row__cta label" aria-hidden="true">
            View project <span className="work-row__arrow">→</span>
          </span>
        </div>
      </Reveal>
    </li>
  );
}

export default function Work({ onOpenProject }) {
  const fine = useMedia(FINE_POINTER);
  const [hovered, setHovered] = useState(null);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead
          num="01"
          title="Selected Work"
          id="work-title"
          note={`${projects.length} projects — select one to read the case study`}
        />
        <ol className="work__list">
          {projects.map((p) => (
            <ProjectRow
              key={p.slug}
              project={p}
              onOpen={onOpenProject}
              onHover={fine ? setHovered : () => {}}
              showInline={!fine}
            />
          ))}
        </ol>
      </div>
      {fine && <CursorPreview project={hovered} visible={!!hovered} />}
    </section>
  );
}
