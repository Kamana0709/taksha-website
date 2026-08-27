/**
 * Button — Primary action element
 * Variants: primary, secondary, ghost, icon
 * Sizes: sm, md, lg
 * PRD §7.9, §7.10
 */
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    href,
    to,
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'right',
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    loading && 'btn--loading',
    disabled && 'btn--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="btn__icon" aria-hidden="true">{icon}</span>
      )}
      {loading ? (
        <>
          <span className="btn__spinner" />
          <span className="sr-only">Loading...</span>
          {children}
        </>
      ) : (
        children
      )}
      {icon && iconPosition === 'right' && (
        <span className="btn__icon" aria-hidden="true">{icon}</span>
      )}
    </>
  );

  // Render as React Router Link
  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  // Render as external anchor
  if (href) {
    return (
      <a ref={ref} href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  // Render as button
  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
});

export default Button;
