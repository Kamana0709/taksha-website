/**
 * MotionPreferenceContext — Central reduced-motion detection
 * Wraps Framer Motion's useReducedMotion, exposed via context
 */
import { createContext, useContext } from 'react';
import { useReducedMotion } from 'framer-motion';

const MotionPreferenceContext = createContext(false);

export function MotionPreferenceProvider({ children }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionPreferenceContext.Provider value={prefersReducedMotion}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

export function usePrefersReducedMotion() {
  return useContext(MotionPreferenceContext);
}