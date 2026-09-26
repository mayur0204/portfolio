import { profile } from '../data/profile.js';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner wrap">
        <p className="label">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="label">Built with React &amp; Vite</p>
        <a href="#top" className="label footer__top u-link">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
