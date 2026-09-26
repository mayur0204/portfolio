/*
 * Minimal, safe renderer for assistant replies.
 * Supports paragraphs, "- " bullet lists, **bold** and [label](href).
 * Never uses innerHTML. Only #anchors, #project:<slug>, https:// and
 * mailto: links are rendered as links; anything else stays plain text.
 */

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function Inline({ text, onAction }) {
  const out = [];
  let last = 0;
  let m;
  let k = 0;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(<strong key={k++}>{m[1]}</strong>);
    } else {
      const [label, href] = [m[2], m[3]];
      if (href.startsWith('#project:')) {
        out.push(
          <button
            key={k++}
            type="button"
            className="rt-link"
            onClick={() => onAction({ type: 'project', slug: href.slice(9) })}
          >
            {label}
          </button>,
        );
      } else if (/^#[a-z-]+$/.test(href)) {
        out.push(
          <a key={k++} className="rt-link" href={href} onClick={() => onAction({ type: 'section', id: href.slice(1) })}>
            {label}
          </a>,
        );
      } else if (/^https:\/\//.test(href) || /^mailto:[^\s]+$/.test(href)) {
        out.push(
          <a key={k++} className="rt-link" href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>,
        );
      } else {
        out.push(label);
      }
    }
    last = INLINE.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function RichText({ text, onAction }) {
  const blocks = text.trim().split(/\n{2,}/);
  return blocks.map((block, bi) => {
    const lines = block.split('\n');
    if (lines.every((l) => /^\s*[-•*]\s+/.test(l))) {
      return (
        <ul key={bi}>
          {lines.map((l, li) => (
            <li key={li}>
              <Inline text={l.replace(/^\s*[-•*]\s+/, '')} onAction={onAction} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={bi}>
        {lines.map((l, li) => (
          <span key={li}>
            {li > 0 && <br />}
            <Inline text={l} onAction={onAction} />
          </span>
        ))}
      </p>
    );
  });
}
