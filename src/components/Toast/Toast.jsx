/**
 * Toast — Dismissable notification for form submission feedback
 * PRD §7.9 — success, error variants
 */
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ variant = 'success', title, message, isVisible, onClose, duration = 6000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const Icon = variant === 'success' ? CheckCircle : AlertCircle;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`toast toast--${variant}`}
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        >
          <Icon className="toast__icon" aria-hidden="true" />
          <div className="toast__content">
            {title && <p className="toast__title">{title}</p>}
            {message && <p className="toast__message">{message}</p>}
          </div>
          <button className="toast__close" onClick={onClose} aria-label="Dismiss notification">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
