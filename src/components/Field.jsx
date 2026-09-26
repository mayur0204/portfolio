import { isPlaceholder } from '../data/profile.js';

/** Renders a profile value; placeholders get a dashed "to edit" style. */
export default function Field({ value, className = '' }) {
  if (isPlaceholder(value)) {
    return (
      <span className={`ph ${className}`} title="Placeholder — edit in src/data/profile.js">
        {value || 'NOT_SET'}
      </span>
    );
  }
  return <span className={className}>{value}</span>;
}
