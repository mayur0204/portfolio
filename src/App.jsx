import { useCallback, useEffect, useState } from 'react';
import Navigation, { SECTIONS } from './components/Navigation.jsx';
import Intro from './components/Intro.jsx';
import Work from './components/Work.jsx';
import ProjectShowcase from './components/ProjectShowcase.jsx';
import Profile from './components/Profile.jsx';
import Stack from './components/Stack.jsx';
import Journey from './components/Journey.jsx';
import CodeBand from './components/CodeBand.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ChatAssistant from './components/ChatAssistant.jsx';

/** Tracks which numbered section is currently in view (for nav highlighting). */
function useActiveSection() {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 200 && setActive(null);
    window.addEventListener('scroll', onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onTop);
    };
  }, []);
  return active;
}

export default function App() {
  const [project, setProject] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const active = useActiveSection();

  const openProject = useCallback((slug) => setProject(slug), []);
  const closeProject = useCallback(() => setProject(null), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navigation active={active} chatOpen={chatOpen} onAsk={() => setChatOpen((o) => !o)} />
      <main id="main" tabIndex={-1}>
        <Intro onOpenProject={openProject} />
        <Work onOpenProject={openProject} />
        <Profile />
        <Stack />
        <Journey />
        <CodeBand />
        <Contact />
      </main>
      <Footer />
      <ProjectShowcase slug={project} onClose={closeProject} onNavigate={openProject} />
      <ChatAssistant open={chatOpen} onClose={closeChat} onOpenProject={openProject} />
    </>
  );
}
