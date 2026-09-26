import { profile, isPlaceholder } from '../data/profile.js';
import SectionHead from './SectionHead.jsx';
import Reveal from './Reveal.jsx';
import Field from './Field.jsx';
import './Profile.css';

export default function Profile() {
  const [lead, ...rest] = profile.bio;
  const { education } = profile;

  return (
    <section id="profile" className="section profile" aria-labelledby="profile-title">
      <div className="wrap">
        <SectionHead num="02" title="Profile" id="profile-title" note="Who Mayur is, in brief" />

        <div className="profile__grid">
          <div className="profile__text">
            <Reveal as="p" className="profile__lead">
              {isPlaceholder(lead) ? <Field value={lead} /> : lead}
            </Reveal>
            {rest.map((para, i) => (
              <Reveal as="p" key={i} delay={80 * (i + 1)} className="profile__para">
                <Field value={para} />
              </Reveal>
            ))}
          </div>

          <Reveal as="dl" className="profile__facts" delay={120}>
            <div className="profile__fact">
              <dt className="label">Role</dt>
              <dd>{profile.role}</dd>
            </div>
            <div className="profile__fact">
              <dt className="label">Education</dt>
              <dd className="profile__stack">
                <Field value={education.degree} />
                <Field value={education.college} />
                <Field value={education.graduation} />
              </dd>
            </div>
            <div className="profile__fact">
              <dt className="label">Location</dt>
              <dd>
                <Field value={profile.location} />
              </dd>
            </div>
            <div className="profile__fact">
              <dt className="label">Focus — from the projects</dt>
              <dd>
                <ul className="profile__focus">
                  {profile.focus.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </Reveal>
        </div>

        {import.meta.env.DEV && (
          <p className="profile__dev label">
            Dev note: dashed fields are placeholders — edit <code>src/data/profile.js</code>. (Hidden in production.)
          </p>
        )}
      </div>
    </section>
  );
}
