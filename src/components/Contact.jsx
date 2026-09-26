import { profile, isPlaceholder } from '../data/profile.js';
import SectionHead from './SectionHead.jsx';
import Reveal from './Reveal.jsx';
import Field from './Field.jsx';
import './Contact.css';

const strip = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

export default function Contact() {
  const { email, linkedin, github } = profile.contact;
  const rows = [
    { label: 'Email', value: email, href: `mailto:${email}`, text: email },
    {
      label: 'LinkedIn',
      value: linkedin,
      href: linkedin,
      text: isPlaceholder(linkedin) ? linkedin : strip(linkedin),
      external: true,
    },
    {
      label: 'GitHub',
      value: github,
      href: github,
      text: isPlaceholder(github) ? github : strip(github),
      external: true,
    },
  ];

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead num="05" title="Contact" id="contact-title" />

        <Reveal as="p" variant="line" className="contact__big" aria-hidden="true">
          Let’s build
        </Reveal>
        <Reveal as="p" variant="line" delay={90} className="contact__big contact__big--2" aria-hidden="true">
          something<span className="accent">.</span>
        </Reveal>
        <p className="sr-only">Let’s build something.</p>

        <dl className="contact__list">
          {rows.map((r, i) => (
            <Reveal key={r.label} className="contact__row" delay={i * 60}>
              <dt className="label">{r.label}</dt>
              <dd>
                {isPlaceholder(r.value) ? (
                  <Field value={r.value} />
                ) : (
                  <a
                    className="contact__link"
                    href={r.href}
                    {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className="u-link">{r.text}</span>
                    <span className="contact__arrow" aria-hidden="true">
                      →
                    </span>
                    {r.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
