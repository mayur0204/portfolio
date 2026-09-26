import Reveal from './Reveal.jsx';
import { useInView } from '../hooks/useInView.js';

export default function SectionHead({ num, title, id, note }) {
  const [ref, inView] = useInView();
  return (
    <header ref={ref} className={`sec-head${inView ? ' is-in' : ''}`}>
      <span className="sec-head__rule" aria-hidden="true" />
      <p className="sec-head__num label" aria-hidden="true">
        <span className="accent">{num}</span> / {title}
      </p>
      <Reveal as="h2" variant="line" id={id} className="sec-head__title">
        {title}
      </Reveal>
      {note && <p className="sec-head__note label">{note}</p>}
    </header>
  );
}
