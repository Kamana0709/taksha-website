import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import ConceptBadge from '../components/ConceptBadge/ConceptBadge';
import Button from '../components/Button/Button';
import StructuredData, { breadcrumbSchema, creativeWorkSchema } from '../components/StructuredData/StructuredData';
import { getProjectBySlug, allProjects } from '../content/projects';
import './CaseStudy.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
};

export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <NotFoundFallback />;
  }

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
  const cs = project.caseStudy; // The Phase 13 data

  return (
    <>
      <SEO
        title={`${project.name} — Case Study`}
        description={cs.brief}
        canonical={`/work/${project.slug}`}
      />
      <StructuredData
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: project.name, path: `/work/${project.slug}` },
        ])}
      />
      <StructuredData schema={creativeWorkSchema(project.name, project.tagline, `/work/${project.slug}`)} />

      {/* Hero Section */}
      <section className="cs-hero" style={{ '--project-accent': project.accentColor }}>
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol className="breadcrumb__list">
              <li><Link to="/" className="breadcrumb__link">Home</Link></li>
              <li><Link to="/work" className="breadcrumb__link">Work</Link></li>
              <li className="breadcrumb__current" aria-current="page">{project.name}</li>
            </ol>
          </nav>

          <motion.div className="cs-hero__content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
            <motion.div variants={fadeUp}>
              <ConceptBadge size="lg" />
            </motion.div>
            <motion.h1 className="cs-hero__title" variants={fadeUp}>{project.name}</motion.h1>
            <motion.p className="cs-hero__tagline" variants={fadeUp}>{project.tagline}</motion.p>
          </motion.div>

          <motion.div
            className="cs-hero__visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="cs-hero__visual-glow" style={{ background: project.accentColor }}></div>
            <span className="cs-hero__visual-letter" style={{ color: project.accentColor }}>
              {project.name.charAt(0)}
            </span>
          </motion.div>
        </div>
      </section>

      {/* 1. Brief & 2. Challenge */}
      <div style={{ '--project-accent': project.accentColor }}>
        <CSSection title="01. The Brief">
          <p className="cs-text-lead">{cs.brief}</p>
        </CSSection>
        <CSSection title="02. The Challenge" bg>
          <p className="cs-text-body">{cs.challenge}</p>
        </CSSection>

        {/* 3. Research */}
        <CSSection title="03. Research & Discovery">
          <p className="cs-text-body">{cs.research.summary}</p>
          <div className="cs-insights">
            <h4 className="cs-eyebrow">Key Insights</h4>
            <ul className="cs-list">
              {cs.research.keyInsights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>
        </CSSection>

        {/* 4. User Personas */}
        <CSSection title="04. User Personas" bg>
          <div className="cs-persona-grid">
            {cs.personas.map((persona, i) => (
              <div key={i} className="cs-persona-card" style={{ '--project-accent': project.accentColor }}>
                <div className="cs-persona-header">
                  <div className="cs-persona-avatar" style={{ color: project.accentColor }}>
                    {persona.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="cs-persona-name">{persona.name}</h4>
                    <span className="cs-persona-role">{persona.role}</span>
                  </div>
                </div>
                <div className="cs-persona-body">
                  <div className="cs-persona-group">
                    <strong>Goals</strong> <p>{persona.goals}</p>
                  </div>
                  <div className="cs-persona-group">
                    <strong>Frustrations</strong> <p>{persona.frustrations}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CSSection>

        {/* 5. Info Arch & 6. User Flows */}
        <CSSection title="05. Information Architecture">
          <p className="cs-text-body">{cs.informationArchitecture}</p>
          <div className="cs-visual-placeholder">IA Diagram Placeholder</div>
        </CSSection>
        <CSSection title="06. User Flows" bg>
          <p className="cs-text-body">{cs.userFlows}</p>
          <div className="cs-visual-placeholder">User Flow Diagram Placeholder</div>
        </CSSection>

        {/* 7. Wireframes & 8. UI Design */}
        <CSSection title="07. Wireframes">
          <p className="cs-text-body">{cs.wireframes}</p>
          <div className="cs-visual-placeholder">Wireframes Placeholder</div>
        </CSSection>
        <CSSection title="08. UI Design" bg>
          <p className="cs-text-body">{cs.uiDesign}</p>
          <div className="cs-visual-placeholder" style={{ height: '500px' }}>
            High-Fidelity Render Placeholder
          </div>
        </CSSection>

        {/* 9. Component System & 10. Motion Design */}
        <CSSection title="09. Component System">
          <p className="cs-text-body">{cs.componentSystem}</p>
        </CSSection>
        <CSSection title="10. Motion Design" bg>
          <p className="cs-text-body">{cs.motionDesign}</p>
        </CSSection>

        {/* 11. Accessibility & 12. Performance */}
        <CSSection title="11. Accessibility">
          <div className="cs-metrics-grid">
            <div className="cs-metric-card">
              <span className="cs-metric-value" style={{ color: project.accentColor }}>WCAG AA</span>
              <span className="cs-metric-label">Compliance Target</span>
            </div>
            <div className="cs-metric-text">
              <p className="cs-text-body">{cs.accessibility}</p>
            </div>
          </div>
        </CSSection>
        <CSSection title="12. Performance" bg>
          <div className="cs-metrics-grid">
            <div className="cs-metric-card">
              <span className="cs-metric-value" style={{ color: '#10B981' }}>{cs.performance.score}</span>
              <span className="cs-metric-label">Lighthouse Score</span>
            </div>
            <div className="cs-metric-text">
              <p className="cs-text-body">{cs.performance.details}</p>
            </div>
          </div>
        </CSSection>

        {/* 13. Lessons Learned */}
        <CSSection title="13. Lessons Learned">
          <ul className="cs-list cs-list--numbered">
            {cs.lessonsLearned.map((lesson, i) => (
              <li key={i}>{lesson}</li>
            ))}
          </ul>
        </CSSection>
      </div>

      {/* Next Project Nav */}
      <section className="section case-study-next">
        <div className="container">
          <span className="text-eyebrow" style={{ marginBottom: 'var(--space-4)', display: 'block' }}>Next Project</span>
          <Link to={`/work/${nextProject.slug}`} className="case-study-next__card">
            <div className="case-study-next__visual" style={{ background: `linear-gradient(135deg, ${nextProject.accentColor}20, ${nextProject.accentColor}40)` }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', color: nextProject.accentColor, opacity: 0.5 }}>
                {nextProject.name.charAt(0)}
              </span>
            </div>
            <div className="case-study-next__info">
              <ConceptBadge />
              <h3 className="case-study-next__name">{nextProject.name}</h3>
              <p className="case-study-next__tagline">{nextProject.tagline}</p>
              <span className="case-study-next__arrow"><ArrowRight /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section section--lg" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="h2" style={{ marginBottom: 'var(--space-4)' }}>Ready for your own case study?</h2>
          <Button to="/contact" variant="primary" size="lg" icon={<ArrowRight />}>
            Start a Project
          </Button>
        </div>
      </section>
    </>
  );
}

/* Reusable Section Wrapper */
function CSSection({ title, children, bg }) {
  return (
    <motion.section
      className={`section cs-section ${bg ? 'cs-section--alt' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="container content-narrow">
        <motion.h2 className="cs-section-title" variants={fadeUp}>{title}</motion.h2>
        <motion.div variants={fadeUp}>{children}</motion.div>
      </div>
    </motion.section>
  );
}

/* Fallback Component */
function NotFoundFallback() {
  return (
    <section className="section section--lg" style={{ textAlign: 'center', paddingTop: 'calc(var(--space-24) + 64px)' }}>
      <div className="container">
        <h1 className="h2">Project not found</h1>
        <p style={{ marginBlock: 'var(--space-6)' }}>This case study doesn't exist.</p>
        <Button to="/work" variant="primary" icon={<ArrowLeft />} iconPosition="left">Back to Work</Button>
      </div>
    </section>
  );
}
