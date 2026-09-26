import { useInView } from '../hooks/useInView.js';

/**
 * Scroll-triggered reveal.
 *  variant="up"   → fade + rise
 *  variant="line" → text slides up from behind a mask (for headings)
 */
export default function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant}${inView ? ' is-in' : ''} ${className}`.trim()}
      style={{ '--d': `${delay}ms` }}
      {...rest}
    >
      {variant === 'line' ? (
        <span className="reveal__mask">
          <span className="reveal__inner">{children}</span>
        </span>
      ) : (
        children
      )}
    </Tag>
  );
}
