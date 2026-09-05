/**
 * Card — Base surface container
 * Variants: service, value, borderless
 */
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = forwardRef(function Card(
  { children, variant, clickable = false, className = '', as, ...props },
  ref
) {
  const Component = as || (clickable ? motion.div : 'div');
  const classes = [
    'card',
    variant && `card--${variant}`,
    clickable && 'card--clickable',
    className,
  ].filter(Boolean).join(' ');

  const motionProps = clickable ? {
    whileHover: { y: -4 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
  } : {};

  return (
    <Component ref={ref} className={classes} {...motionProps} {...props}>
      {children}
    </Component>
  );
});

export default Card;