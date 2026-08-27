import { motion } from 'framer-motion';
import SEO from '../components/SEO/SEO';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import './About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
};

export default function About() {
  return (
    <>
      <SEO
        title="About — Taksha"
        description="Taksha is a new, premium Digital Craft Studio building digital experiences for ambitious businesses."
        canonical="/about"
      />

      <article className="about-page">
        <header className="section section--lg about-hero">
          <div className="container text-center">
            <SectionHeading
              eyebrow="About Us"
              title="Technology becomes meaningful only when crafted with intention."
              as="h1"
            />
          </div>
        </header>

        <section className="section">
          <div className="container about-content">
            <motion.div
              className="about-block"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <h2 className="h3">Why Taksha Exists</h2>
              <p>
                Taksha began with a simple frustration: too much of the web feels the same — templated, rushed, indistinct. We started Taksha to slow down and build things with the same care a craftsman brings to their materials. The name comes from the Sanskrit "Takṣ" — to carve, to shape, to build with precision — because that's exactly the standard we hold ourselves to.
              </p>
            </motion.div>

            <motion.div
              className="about-block"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <h2 className="h3">How We Think</h2>
              <p>
                We believe the best digital work sits at the intersection of brand, design, and engineering — not as separate handoffs, but as one continuous act of craft. A beautiful interface that's slow to load isn't beautiful. A fast site with no design intention isn't finished. We build for both.
              </p>
            </motion.div>

            <motion.div
              className="about-block"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <h2 className="h3">Where We're Headed</h2>
              <p>
                Taksha today is concept work and craftsmanship-first thinking. Taksha tomorrow is real client partnerships built on that same standard — plus a growing studio journal, open-source component work, and tools that make great design more accessible to ambitious businesses.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section" style={{ background: 'var(--color-surface)' }}>
          <div className="container about-content">
            <motion.div
              className="honest-note"
              role="note"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <div className="honest-note__header">
                <span className="honest-note__icon" aria-hidden="true">💡</span>
                <h3 className="h5">Honest Studio Note</h3>
              </div>
              <p>
                Taksha is a newly founded studio. The work shown across this site is original concept work created to demonstrate our craft — not client case studies. We're transparent about this because honesty is one of our core values.
              </p>
            </motion.div>
          </div>
        </section>
      </article>
    </>
  );
}
