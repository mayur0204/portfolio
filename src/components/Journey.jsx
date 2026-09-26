import { profile } from '../data/profile.js';
import SectionHead from './SectionHead.jsx';
import Reveal from './Reveal.jsx';
import Field from './Field.jsx';
import './Journey.css';

export default function Journey() {
  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <div className="wrap">
        <SectionHead num="04" title="Journey" id="journey-title" note="Milestones — past, present and next" />
        <ol className="journey__list">
          {profile.journey.map((entry, i) => (
            <Reveal as="li" key={i} className="journey__row" delay={i * 70}>
              <span className="journey__year">
                <Field value={entry.year} />
              </span>
              <span className="journey__tag label">{entry.tag}</span>
              <p className="journey__text">
                <Field value={entry.text} />
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
