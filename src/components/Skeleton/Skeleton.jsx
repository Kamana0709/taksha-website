/**
 * Skeleton — Shimmer loading placeholder
 * PRD §7.9 — Used for image-heavy grids to prevent layout shift
 */
import './Skeleton.css';

export default function Skeleton({ variant = 'text', width, height, style, className = '' }) {
  return (
    <div
      className={`skeleton skeleton--${variant} ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}
