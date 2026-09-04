import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SEO from '../components/SEO/SEO';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import './Process.css';

const STAGES = [
  { title: 'Discover', description: 'Understand the business, goals, audience, and constraints through structured conversation and existing-material review.' },
  { title: 'Define', description: 'Translate discovery into a clear problem statement, scope, and success criteria before any design begins.' },
  { title: 'Research', description: 'Study the competitive and industry landscape, accessibility needs, and relevant design/technical patterns.' },
  { title: 'Strategy', description: 'Define the information architecture, content strategy, and technical approach that will guide execution.' },
  { title: 'Design', description: 'Develop wireframes through to high-fidelity UI, grounded in the brand and UX strategy established earlier.' },
  { title: 'Prototype', description: 'Build interactive prototypes to validate flows and interactions before development investment.' },
  { title: 'Develop', description: 'Engineer the approved design into a performant, accessible, production-quality frontend.' },
  { title: 'Test', description: 'QA across devices, browsers, accessibility tools, and performance benchmarks.' },
  { title: 'Launch', description: 'Deploy, verify production behavior, and confirm analytics/SEO foundations are live and correct.' },
  { title: 'Support', description: 'Provide a defined post-launch support window for fixes and minor refinements.' },
];

export default function Process() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      <SEO
        title="Process — Taksha Nexus"
        description="A process built on clarity, not guesswork. Every project moves through the same disciplined 10-stage process."
        canonical="/process"
      />

      <article className="process-page">
        <header className="section section--lg process-hero">
          <div className="container text-center">
            <SectionHeading
              eyebrow="How We Work"
              title="A process built on clarity, not guesswork."
              subtitle="Every project — concept or client — moves through the same disciplined process."
              as="h1"
            />
          </div>
        </header>

        <section className="section" style={{ background: 'var(--color-surface-inset)', position: 'relative', borderTop: 'var(--border-width) solid var(--color-ink)', borderBottom: 'var(--border-width) solid var(--color-ink)' }}>
          <div className="container">
            <div className="timeline-container" ref={containerRef}>
              <div className="timeline-line-bg" aria-hidden="true" />
              <motion.div
                className="timeline-line-active"
                style={{ scaleY, transformOrigin: 'top' }}
                aria-hidden="true"
              />

              <ol className="timeline-list">
                {STAGES.map((stage, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <li key={index} className={`timeline-item ${isEven ? 'timeline-item--left' : 'timeline-item--right'}`}>
                      <div className="timeline-marker" aria-hidden="true">
                        <motion.div
                          className="timeline-dot"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true, margin: '-50% 0px -50% 0px' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      <motion.div
                        className="timeline-content"
                        initial={{ opacity: 0, x: isEven ? -24 : 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-20% 0px' }}
                        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                      >
                        <div className="timeline-number">{(index + 1).toString().padStart(2, '0')}</div>
                        <h2 className="h4 timeline-title">{stage.title}</h2>
                        <p className="timeline-description">{stage.description}</p>
                      </motion.div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
