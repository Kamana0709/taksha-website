import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { allArticles, JOURNAL_CATEGORIES } from '../content/journal';
import './Journal.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } }
};

export default function JournalIndex() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredArticles = activeCategory === 'All'
    ? allArticles
    : allArticles.filter(a => a.category === activeCategory);

  return (
    <>
      <SEO
        title="Journal — Taksha Nexus"
        description="Insights, tutorials, and thoughts on design, engineering, and digital craft."
        canonical="/journal"
      />

      <section className="journal-hero section">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h1 className="h1" variants={fadeUp}>Journal.</motion.h1>
            <motion.p className="journal-hero__subtitle" variants={fadeUp}>
              Thoughts, experiments, and technical deep-dives from the Taksha Nexus team. 
              We write about design craft, React architecture, and the future of digital.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="journal-content section">
        <div className="container">
          
          {/* Filters */}
          <div className="journal-filters">
            {JOURNAL_CATEGORIES.map(category => (
              <button
                key={category}
                className={`journal-filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Article Grid */}
          <motion.div layout className="journal-grid">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map(article => (
                <motion.article 
                  key={article.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="journal-card"
                >
                  <Link to={`/journal/${article.slug}`} className="journal-card__link">
                    <div className="journal-card__meta">
                      <span className="journal-card__category">{article.category}</span>
                      <span className="journal-card__dot">•</span>
                      <span className="journal-card__date">{article.date}</span>
                    </div>
                    <h2 className="journal-card__title">{article.title}</h2>
                    <p className="journal-card__excerpt">{article.excerpt}</p>
                    <div className="journal-card__footer">
                      <span className="journal-card__readtime">{article.readTime}</span>
                      <ArrowRight size={18} className="journal-card__icon" />
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredArticles.length === 0 && (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              No articles found for this category.
            </div>
          )}

        </div>
      </section>
    </>
  );
}
