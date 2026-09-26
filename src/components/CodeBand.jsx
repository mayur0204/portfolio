import { profile } from '../data/profile.js';
import { projects } from '../data/projects.js';
import Reveal from './Reveal.jsx';
import './CodeBand.css';

/** "Explore the code" — Mayur's own GitHub profile vs. the project repositories. */
export default function CodeBand() {
  return (
    <section className="code-band" aria-labelledby="code-title">
      <div className="code-band__inner wrap">
        <Reveal as="h2" variant="line" id="code-title" className="code-band__title">
          Explore the code
        </Reveal>

        <Reveal className="code-band__col" delay={60}>
          <p className="label">Mayur on GitHub — personal profile</p>
          <p className="code-band__handle">
            github.com/<strong>{profile.github.handle}</strong>
          </p>
          <a className="btn" href={profile.github.url} target="_blank" rel="noopener noreferrer">
            GitHub{' '}
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
            <span className="sr-only"> — Mayur's profile (opens in a new tab)</span>
          </a>
        </Reveal>

        <Reveal className="code-band__col" delay={140}>
          <p className="label">Project repositories</p>
          <p className="code-band__note">
            The three projects in Selected Work are hosted at{' '}
            <a
              className="u-link code-band__mono"
              href={profile.projectRepositories.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.projectRepositories.host}
            </a>
            .
          </p>
          <ul className="code-band__repos">
            {projects.map((p) => (
              <li key={p.slug}>
                <a href={p.repo} target="_blank" rel="noopener noreferrer">
                  <span className="code-band__num">{p.number}</span>
                  <span className="u-link">{p.repo.split('/').pop()}</span>
                  <span className="code-band__arrow" aria-hidden="true">
                    ↗
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
