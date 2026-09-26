import { useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import './Navigation.css';

export const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'profile', label: 'Profile' },
  { id: 'stack', label: 'Stack' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation({ active, chatOpen, onAsk }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useFocusTrap(menuRef, menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.documentElement.classList.add('is-locked');
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Close the mobile menu if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)');
    const on = () => mq.matches && setMenuOpen(false);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <>
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <div className="nav__inner wrap">
          <a href="#top" className="nav__brand" aria-label="Mayur — back to top">
            <span className="nav__mark" aria-hidden="true" />
            MAYUR
          </a>

          <nav className="nav__links" aria-label="Primary">
            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="nav__link" aria-current={active === s.id ? 'location' : undefined}>
                    <span className="nav__num">0{i + 1}</span>
                    <span className="nav__text">{s.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="nav__actions">
            <button
              type="button"
              className={`nav__ask${chatOpen ? ' is-on' : ''}`}
              onClick={onAsk}
              aria-expanded={chatOpen}
              aria-controls="ask-mayur"
            >
              <span className="nav__ask-dot" aria-hidden="true" />
              Ask Mayur
            </button>
            <button
              type="button"
              className="nav__menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`menu${menuOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!menuOpen}
      >
        <div className="menu__bar wrap">
          <span className="nav__brand" aria-hidden="true">
            <span className="nav__mark" />
            MAYUR
          </span>
          <button type="button" className="nav__menu-btn menu__close" onClick={() => setMenuOpen(false)}>
            Close
          </button>
        </div>
        <nav className="menu__nav wrap" aria-label="Mobile">
          <ol>
            {SECTIONS.map((s, i) => (
              <li key={s.id} style={{ '--i': i }}>
                <a href={`#${s.id}`} onClick={() => setMenuOpen(false)}>
                  <span className="menu__num">0{i + 1}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="menu__foot wrap">
          <button
            type="button"
            className="btn btn--accent"
            onClick={() => {
              setMenuOpen(false);
              onAsk();
            }}
          >
            Ask Mayur{' '}
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
