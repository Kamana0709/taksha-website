import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import Button from '../components/Button/Button';
import { getArticleBySlug } from '../content/journal';
import './Journal.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
};

export default function Article() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <section className="section section--lg" style={{ textAlign: 'center', paddingTop: 'calc(var(--space-24) + 64px)' }}>
        <div className="container">
          <h1 className="h2">Article not found</h1>
          <p style={{ marginBlock: 'var(--space-6)' }}>This post doesn't exist or has been removed.</p>
          <Button to="/journal" variant="primary" icon={<ArrowLeft />} iconPosition="left">Back to Journal</Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <SEO
        title={`${article.title} — Taksha Nexus Journal`}
        description={article.excerpt}
        canonical={`/journal/${article.slug}`}
      />

      <article className="article">
        <header className="article-header section">
          <div className="container article-container">
            
            <Link to="/journal" className="article-back-link">
              <ArrowLeft size={16} /> Back to Journal
            </Link>

            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.div className="article-meta" variants={fadeUp}>
                <span className="article-category">{article.category}</span>
                <span className="article-date">{article.date}</span>
                <span className="article-readtime">{article.readTime}</span>
              </motion.div>
              
              <motion.h1 className="article-title" variants={fadeUp}>
                {article.title}
              </motion.h1>
              
              <motion.p className="article-excerpt" variants={fadeUp}>
                {article.excerpt}
              </motion.p>
            </motion.div>
          </div>
        </header>

        <section className="article-body-section">
          <div className="container article-container">
            {/* The article body rendered from static HTML strings */}
            <motion.div 
              className="article-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            <div className="article-author">
              <div className="article-author-avatar">T</div>
              <div>
                <span className="article-author-name">Written by {article.author}</span>
                <p className="article-author-bio">Digital Craft Studio based in California, specializing in high-performance web architecture.</p>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
