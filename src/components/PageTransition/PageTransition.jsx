import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 1, 0.5, 1] 
      }}
      className="page-transition-wrapper"
    >
      {children}
    </motion.div>
  );
}
