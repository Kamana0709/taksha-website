/**
 * MotionPreferenceContext — Central reduced motion detection
 * Uses Framer Motion's useReducedMotion hook, propagated via context
 * PRD §8.2, §22.5
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
