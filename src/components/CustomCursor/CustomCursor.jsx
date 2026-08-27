import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only show custom cursor on fine-pointer devices (desktops)
    if (window.matchMedia('(pointer: fine)').matches) {
      const moveCursor = (e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      };

      const handleMouseOver = (e) => {
        const target = e.target;
        // Elements that should trigger the expanded cursor state
        if (
          target.tagName.toLowerCase() === 'a' ||
          target.tagName.toLowerCase() === 'button' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('[role="button"]')
        ) {
          setIsHovering(true);
        } else {
          setIsHovering(false);
        }
      };

      const handleMouseLeave = () => setIsHidden(true);
      const handleMouseEnter = () => setIsHidden(false);

      window.addEventListener('mousemove', moveCursor);
      window.addEventListener('mouseover', handleMouseOver);
      document.body.addEventListener('mouseleave', handleMouseLeave);
      document.body.addEventListener('mouseenter', handleMouseEnter);

      return () => {
        window.removeEventListener('mousemove', moveCursor);
        window.removeEventListener('mouseover', handleMouseOver);
        document.body.removeEventListener('mouseleave', handleMouseLeave);
        document.body.removeEventListener('mouseenter', handleMouseEnter);
      };
    } else {
      setIsHidden(true); // Hide on touch devices
    }
  }, [cursorX, cursorY]);

  if (isHidden) return null;

  return (
    <motion.div
      className="custom-cursor"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
        opacity: isHovering ? 0.5 : 1,
        backgroundColor: isHovering ? 'var(--color-accent)' : 'var(--color-text)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  );
}
