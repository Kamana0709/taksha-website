/**
 * SectionHeading — Reusable eyebrow + heading + optional subhead
 * Used consistently across all page sections
 * PRD §7.9
 */
import { motion } from 'framer-motion';
import './SectionHeading.css';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  as: Tag = 'h2',
  className = '',
}) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <motion.div
      className={`section-heading ${align === 'center' ? 'section-heading--center' : ''} ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {eyebrow && (
        <motion.span className="section-heading__eyebrow" variants={childVariants}>
          {eyebrow}
        </motion.span>
      )}
      <motion.div variants={childVariants}>
        <Tag className="section-heading__title">{title}</Tag>
      </motion.div>
      {subtitle && (
        <motion.p className="section-heading__subtitle" variants={childVariants}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
