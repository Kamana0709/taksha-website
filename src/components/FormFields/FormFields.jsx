/**
 * FormFields — Input, Textarea, Select components
 * Full validation states: default, focused, error, success, disabled
 * PRD §7.11, §16.2–16.4
 */
import { useState, forwardRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import './FormFields.css';

/* -----------------------------------------------------------------------
   Input
   ----------------------------------------------------------------------- */
export const Input = forwardRef(function Input(
  { label, name, type = 'text', required, error, helper, className = '', ...props },
  ref
) {
  const [focused, setFocused] = useState(false);
  const fieldClass = [
    'field',
    focused && 'field--focused',
    error && 'field--error',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={fieldClass}>
      {label && (
        <label htmlFor={name} className="field__label">
          {label}
          {required && <span className="field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        className="field__input"
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helper ? `${name}-helper` : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && (
        <p className="field__error" id={`${name}-error`} role="alert">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
      {!error && helper && (
        <p className="field__helper" id={`${name}-helper`}>{helper}</p>
      )}
    </div>
  );
});

/* -----------------------------------------------------------------------
   Textarea
   ----------------------------------------------------------------------- */
export const Textarea = forwardRef(function Textarea(
  { label, name, required, error, helper, maxLength, value = '', className = '', ...props },
  ref
) {
  const [focused, setFocused] = useState(false);
  const charCount = value.length;
  const fieldClass = [
    'field',
    focused && 'field--focused',
    error && 'field--error',
    className,
  ].filter(Boolean).join(' ');

  const countClass = [
    'field__char-count',
    maxLength && charCount > maxLength * 0.9 && charCount <= maxLength && 'field__char-count--warning',
    maxLength && charCount > maxLength && 'field__char-count--error',
  ].filter(Boolean).join(' ');

  return (
    <div className={fieldClass}>
      {label && (
        <label htmlFor={name} className="field__label">
          {label}
          {required && <span className="field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={name}
        name={name}
        className="field__textarea"
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helper ? `${name}-helper` : undefined}
        maxLength={maxLength}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {maxLength && (
        <p className={countClass}>{charCount}/{maxLength}</p>
      )}
      {error && (
        <p className="field__error" id={`${name}-error`} role="alert">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
      {!error && helper && (
        <p className="field__helper" id={`${name}-helper`}>{helper}</p>
      )}
    </div>
  );
});

/* -----------------------------------------------------------------------
   Select
   ----------------------------------------------------------------------- */
export const Select = forwardRef(function Select(
  { label, name, required, error, helper, options = [], placeholder, className = '', ...props },
  ref
) {
  const [focused, setFocused] = useState(false);
  const fieldClass = [
    'field',
    focused && 'field--focused',
    error && 'field--error',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={fieldClass}>
      {label && (
        <label htmlFor={name} className="field__label">
          {label}
          {required && <span className="field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="field__select-wrapper">
        <select
          ref={ref}
          id={name}
          name={name}
          className="field__select"
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helper ? `${name}-helper` : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="field__select-icon" aria-hidden="true" />
      </div>
      {error && (
        <p className="field__error" id={`${name}-error`} role="alert">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
      {!error && helper && (
        <p className="field__helper" id={`${name}-helper`}>{helper}</p>
      )}
    </div>
  );
});
