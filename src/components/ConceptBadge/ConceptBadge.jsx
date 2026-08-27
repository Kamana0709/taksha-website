/**
 * ConceptBadge — Mandatory "Concept Project" / "Studio Original" pill
 * Applied to every project reference sitewide — non-removable
 * Enforces PRD §2.13 transparency mandate
 */
import { Sparkles } from 'lucide-react';
import './ConceptBadge.css';

export default function ConceptBadge({ size = 'default', className = '' }) {
  return (
    <span className={`concept-badge ${size === 'lg' ? 'concept-badge--lg' : ''} ${className}`}>
      <Sparkles className="concept-badge__icon" aria-hidden="true" />
      Concept Project
    </span>
  );
}
