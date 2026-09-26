import { useState } from 'react';
import { stack } from '../data/profile.js';
import { projects } from '../data/projects.js';
import SectionHead from './SectionHead.jsx';
import Reveal from './Reveal.jsx';
import './Stack.css';

export default function Stack() {
  const [filter, setFilter] = useState(null); // project number or null
  const active = projects.find((p) => p.number === filter);
  const count = filter ? stack.flatMap((g) => g.items).filter((i) => i.used.includes(filter)).length : null;

  return (
    <section id="stack" className="section stack" aria-labelledby="stack-title">
      <div className="wrap">
        <SectionHead
          num="03"
          title="Stack"
          id="stack-title"
          note="Only technologies found in the project repositories"
        />

        <div className="stack__filter" role="group" aria-label="Highlight technologies by project">
          <span className="label">Filter by project</span>
          <button type="button" className="stack__chip" aria-pressed={!filter} onClick={() => setFilter(null)}>
            All
          </button>
          {projects.map((p) => (
            <button
              key={p.number}
              type="button"
              className="stack__chip"
              aria-pressed={filter === p.number}
              onClick={() => setFilter(filter === p.number ? null : p.number)}
            >
              <span className="stack__chip-num">{p.number}</span> {p.title}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {active ? `Highlighting ${count} technologies used in ${active.title}.` : 'Showing all technologies.'}
        </p>

        <div className="stack__grid">
          {stack.map((group, gi) => (
            <Reveal key={group.group} className="stack__group" delay={gi * 60}>
              <h3 className="stack__group-title label">
                {group.group} <span className="stack__count">({String(group.items.length).padStart(2, '0')})</span>
              </h3>
              <ul>
                {group.items.map((item) => {
                  const dim = filter && !item.used.includes(filter);
                  return (
                    <li key={item.name} className={`stack__item${dim ? ' is-dim' : ''}`}>
                      <span className="stack__name">{item.name}</span>
                      <span className="sr-only">, used in projects {item.used.join(', ')}</span>
                      <span className="stack__used" aria-hidden="true">
                        {item.used.map((n) => (
                          <span key={n} className={filter === n ? 'is-hit' : ''}>
                            {n}
                          </span>
                        ))}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>

        <p className="stack__legend label">
          Numbers refer to projects:{' '}
          {projects.map((p, i) => (
            <span key={p.number}>
              {p.number} {p.title}
              {i < projects.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
