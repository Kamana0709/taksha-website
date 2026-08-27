/**
 * Tag & FilterPill — Category display and interactive filter pills
 * PRD §7.9 — Work page category filters
 */
import './Tag.css';

export function Tag({ children, className = '' }) {
  return (
    <span className={`tag ${className}`}>{children}</span>
  );
}

export function FilterPill({ children, active = false, onClick, className = '' }) {
  return (
    <button
      className={`filter-pill ${active ? 'filter-pill--active' : ''} ${className}`}
      onClick={onClick}
      aria-pressed={active}
      type="button"
    >
      {children}
    </button>
  );
}
