import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './Accordion.css';

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
            <button
              className="accordion-trigger"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span className="accordion-title">{item.title || item.question}</span>
              <motion.span
                className="accordion-icon"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="accordion-content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: 'auto', marginTop: 16 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="accordion-inner">
                    {item.content || item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
