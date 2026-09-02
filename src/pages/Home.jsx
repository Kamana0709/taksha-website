/**
 * Home Page — Primary landing page
 * PRD §9 — 8 sections: Hero, Craft Philosophy, Featured Projects,
 * Services Overview, Process Preview, Why Taksha Nexus, Brand Manifesto, Final CTA
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowDown, Palette, Layout, Code, Bot } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import StructuredData, { localBusinessSchema } from '../components/StructuredData/StructuredData';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import Button from '../components/Button/Button';
import ConceptBadge from '../components/ConceptBadge/ConceptBadge';
import { usePrefersReducedMotion } from '../context/MotionPreferenceContext';
import './Home.css';

/* -----------------------------------------------------------------------
   Featured project data (subset for home page)
   ----------------------------------------------------------------------- */
const FEATURED_PROJECTS = [
  {
    slug: 'novacare',
    name: 'NovaCare',
    tagline: 'Patient-first healthcare platform',
    category: 'HEALTHCARE · UI/UX · BRAND',
    color: 'var(--color-card-mint)',
  },
  {
    slug: 'flowos',
    name: 'FlowOS',
    tagline: 'Workflow automation SaaS dashboard',
    category: 'SAAS · DASHBOARD · UI/UX',
    color: 'var(--color-card-lilac)',
  },
  {
    slug: 'aure-home',
    name: 'Aure Home',
    tagline: 'Boutique hotel booking experience',
    category: 'HOSPITALITY · WEBSITE · BRAND',
    color: 'var(--color-card-yellow)',
  },
  {
    slug: 'finora',
    name: 'Finora',
    tagline: 'Personal finance & budgeting app',
    category: 'FINTECH · APP · UI/UX',
    color: 'var(--color-card-blue)',
  },
];

const SERVICES = [
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Logos, visual systems, and brand foundations built to scale.',
    path: '/services/brand-identity',
  },
  {
    icon: Layout,
    title: 'UI/UX Design',
    description: 'Interfaces designed around clarity, hierarchy, and behavior.',
    path: '/services/ui-ux-design',
  },
  {
    icon: Code,
    title: 'Website Development',
    description: 'Fast, accessible, precision-built React frontends.',
    path: '/services/website-design',
  },
  {
    icon: Bot,
    title: 'AI Automation',
    description: 'Chatbots and workflows that remove friction from your business.',
    path: '/services/ai-automation',
  },
];

const PROCESS_STEPS = [
  { number: '01', label: 'Discover' },
  { number: '02', label: 'Design' },
  { number: '03', label: 'Prototype' },
  { number: '04', label: 'Develop' },
  { number: '05', label: 'Launch' },
];

const MANIFESTO_LINES = [
  'We believe technology means nothing without intention.',
  'We believe design is a form of respect for the people who use it.',
  'We believe simplicity takes more discipline than complexity.',
  'We believe craft is not a phase of a project — it\'s the standard for all of it.',
  'We are Taksha Nexus. We carve, shape, and build — with precision.',
];

/* -----------------------------------------------------------------------
   Animation variants
   ----------------------------------------------------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* -----------------------------------------------------------------------
   Component
   ----------------------------------------------------------------------- */
export default function Home() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <SEO
        title={null}
        description="Taksha Nexus is a digital craft studio blending branding, design, engineering, and AI to build digital experiences ambitious businesses are proud to own."
        canonical="/"
      />
      <StructuredData schema={localBusinessSchema()} />

      {/* 9.1.1 Hero */}
      <HeroSection prefersReducedMotion={prefersReducedMotion} />

      {/* 9.1.2 Craft Philosophy */}
      <CraftPhilosophy />

      {/* 9.1.3 Featured Projects */}
      <FeaturedProjects />

      {/* 9.1.4 Services Overview */}
      <ServicesOverview />

      {/* 9.1.5 Process Preview */}
      <ProcessPreview />

      {/* 9.1.6 Why Taksha Nexus */}
      <WhyTaksha />

      {/* 9.1.7 Brand Manifesto */}
      <BrandManifesto prefersReducedMotion={prefersReducedMotion} />

      {/* 9.1.8 Final CTA */}
      <FinalCTA />
    </>
  );
}

/* =======================================================================
   HERO SECTION
   ======================================================================= */
function HeroSection({ prefersReducedMotion }) {
  const scrollToNext = () => {
    const next = document.querySelector('.craft-section');
    next?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero__inner">
          <motion.div
            className="hero__content"
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span className="hero__eyebrow" variants={fadeUp} custom={0}>
              Digital Craft Studio
            </motion.span>
            <motion.h1 className="hero__headline" variants={fadeUp} custom={1}>
              Crafting Digital Excellence.
            </motion.h1>
            <motion.p className="hero__subhead" variants={fadeUp} custom={2}>
              Taksha Nexus blends branding, design, engineering, and AI to build digital
              experiences ambitious businesses are proud to own.
            </motion.p>
            <motion.div className="hero__ctas" variants={fadeUp} custom={3}>
              <Button to="/work" variant="primary" size="lg" icon={<ArrowRight />}>
                View Our Work
              </Button>
              <Button to="/contact" variant="secondary" size="lg">
                Start a Project
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
            aria-hidden="true"
          >
            <div className="hero__visual-shape">
              <HeroVisualSVG prefersReducedMotion={prefersReducedMotion} />
            </div>
          </motion.div>
        </div>
      </div>

      <button className="hero__scroll-cue" onClick={scrollToNext} aria-label="Scroll to next section">
        <span>Scroll to explore</span>
        <ArrowDown className="hero__scroll-cue-arrow" />
      </button>
    </section>
  );
}

/* Abstract geometric SVG — neo-brutalist decorative hero visual */
function HeroVisualSVG({ prefersReducedMotion }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      {/* Background shadow layer (black hexagon) */}
      <polygon
        points="220,40 380,120 380,300 220,380 60,300 60,120"
        fill="var(--color-ink)"
      />
      
      {/* Foreground layer (yellow hexagon with thick border) */}
      <motion.polygon
        points="200,20 360,100 360,280 200,360 40,280 40,100"
        stroke="var(--color-ink)"
        strokeWidth="6"
        fill="var(--color-accent)"
        animate={prefersReducedMotion ? {} : { y: [-5, 5, -5] }}
        transition={prefersReducedMotion ? {} : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Inner geometric shape */}
      <motion.polygon
        points="200,60 320,120 320,240 200,300 80,240 80,120"
        stroke="var(--color-ink)"
        strokeWidth="3"
        fill="var(--color-surface)"
        animate={prefersReducedMotion ? {} : { y: [5, -5, 5] }}
        transition={prefersReducedMotion ? {} : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center dot/eye */}
      <circle cx="200" cy="180" r="16" fill="var(--color-ink)" />
      
      {/* Decorative neo-brutalist crosses */}
      <path d="M20 20 L40 20 M30 10 L30 30" stroke="var(--color-ink)" strokeWidth="3" />
      <path d="M360 360 L380 360 M370 350 L370 370" stroke="var(--color-ink)" strokeWidth="3" />
      
      {/* Decorative lines sticking out */}
      <line x1="200" y1="20" x2="200" y2="-20" stroke="var(--color-ink)" strokeWidth="3" />
      <line x1="40" y1="280" x2="-10" y2="280" stroke="var(--color-ink)" strokeWidth="3" />
    </svg>
  );
}

/* =======================================================================
   CRAFT PHILOSOPHY
   ======================================================================= */
function CraftPhilosophy() {
  const pillars = [
    { icon: Palette, title: 'Branding', description: 'Identity systems built to last, not trend-chase.' },
    { icon: Layout, title: 'Design', description: 'Interfaces shaped around real user behavior.' },
    { icon: Code, title: 'Engineering', description: 'Fast, accessible, precisely built frontends.' },
    { icon: Bot, title: 'AI', description: 'Automation that removes friction, not adds noise.' },
  ];

  return (
    <section className="section section--lg craft-section">
      <div className="container">
        <SectionHeading
          eyebrow="The Meaning Behind Taksha Nexus"
          title="To carve. To shape. To craft — with precision."
          subtitle={
            <>
              Taksha Nexus comes from the Sanskrit "<span lang="sa">Takṣ</span>" — the act of shaping
              something with intention and skill. We apply that same philosophy to digital products:
              nothing is default, nothing is templated. Every interface, every interaction, every
              line of code is considered.
            </>
          }
          align="center"
        />

        <motion.div
          className="craft__pillars"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {pillars.map((pillar, i) => (
            <motion.div key={pillar.title} className="card card--value" variants={fadeUp} custom={i}>
              <pillar.icon className="card__icon" aria-hidden="true" />
              <h3 className="card__title">{pillar.title}</h3>
              <p className="card__description">{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* =======================================================================
   FEATURED PROJECTS
   ======================================================================= */
function FeaturedProjects() {
  return (
    <section className="section section--lg">
      <div className="container">
        <SectionHeading
          eyebrow="Studio Originals"
          title="Concept work. Real craft."
          subtitle="Taksha Nexus is a new studio — every project below is a self-initiated exploration, not a client engagement. It's how we prove our craft before we're hired for yours."
        />

        <motion.div
          className="featured-projects__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {FEATURED_PROJECTS.map((project, i) => (
            <motion.div key={project.slug} variants={fadeUp} custom={i}>
              <ProjectCardHome project={project} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Button to="/work" variant="secondary" size="md" icon={<ArrowRight />}>
            View All Work
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* Simplified project card for home page featured grid */
function ProjectCardHome({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="card card--clickable project-card-home" aria-label={`View ${project.name} case study`}>
      <div className="project-card-home__image" style={{ background: project.color, borderBottom: 'var(--border-thick) solid var(--color-ink)' }}>
        <div className="project-card-home__header">
          <ConceptBadge className="project-card-home__badge" />
        </div>
        <div className="project-card-home__image-inner" style={{ background: 'transparent' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '100px', color: 'var(--color-ink)', fontWeight: 600 }}>
            {project.name.charAt(0)}
          </span>
        </div>
      </div>
      <div className="project-card-home__info" style={{ padding: 'var(--space-4)', background: 'var(--color-surface)' }}>
        <h3 className="project-card-home__name" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{project.name}</h3>
        <p className="project-card-home__tagline" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', marginBottom: 'var(--space-4)' }}>{project.tagline}</p>
        <span className="project-card-home__category" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{project.category}</span>
      </div>
    </Link>
  );
}

/* =======================================================================
   SERVICES OVERVIEW
   ======================================================================= */
function ServicesOverview() {
  return (
    <section className="section section--lg" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title="Four disciplines. One studio."
          align="center"
        />

        <motion.div
          className="services-overview__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {SERVICES.map((service, i) => (
            <motion.div key={service.title} variants={fadeUp} custom={i}>
              <Link to={service.path} className="service-card">
                <service.icon className="service-card__icon" aria-hidden="true" />
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
                <ArrowRight className="service-card__arrow" size={18} />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Button to="/services" variant="secondary" size="md" icon={<ArrowRight />}>
            Explore All Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* =======================================================================
   PROCESS PREVIEW
   ======================================================================= */
function ProcessPreview() {
  return (
    <section className="section section--lg">
      <div className="container">
        <SectionHeading
          eyebrow="How We Work"
          title="A process built on clarity, not guesswork."
          align="center"
        />

        <div style={{ position: 'relative' }}>
          <div className="process-preview__line" aria-hidden="true" />
          <motion.ol
            className="process-preview__steps"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {PROCESS_STEPS.map((step, i) => (
              <motion.li key={step.number} className="process-preview__step" variants={fadeUp} custom={i}>
                <span className="process-preview__step-number">{step.number}</span>
                <span className="process-preview__step-label">{step.label}</span>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        <motion.div
          style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Button to="/process" variant="secondary" size="md" icon={<ArrowRight />}>
            See Our Full Process
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* =======================================================================
   WHY TAKSHA
   ======================================================================= */
function WhyTaksha() {
  return (
    <section className="section section--lg" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <div className="why-taksha__inner">
          <motion.div
            className="why-taksha__body"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.span className="text-eyebrow" variants={fadeUp} style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
              Why Taksha Nexus
            </motion.span>
            <motion.h2 className="h2" variants={fadeUp} style={{ marginBottom: 'var(--space-6)' }}>
              A new studio. An honest one.
            </motion.h2>
            <motion.p variants={fadeUp}>
              We won't show you fabricated testimonials or invented client logos — because we don't
              have any yet, and pretending otherwise isn't craftsmanship. What we do have is original,
              self-initiated work built to the same standard we'd bring to yours.
            </motion.p>
            <motion.p variants={fadeUp}>
              Taksha Nexus isn't a web development agency. We're a Digital Craft Studio — branding, design,
              engineering, and AI, combined with intention.
            </motion.p>
          </motion.div>

          <motion.div
            className="why-taksha__stats"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div className="stat-callout" variants={fadeUp} custom={0}>
              <CountUp target={9} className="stat-callout__number" />
              <p className="stat-callout__label">
                Self-initiated concept projects across healthcare, SaaS, hospitality, real estate, and fintech
              </p>
            </motion.div>
            <motion.div className="stat-callout" variants={fadeUp} custom={1}>
              <CountUp target={95} suffix="+" className="stat-callout__number" />
              <p className="stat-callout__label">
                Target Lighthouse score on every build we ship
              </p>
            </motion.div>
            <motion.div className="stat-callout" variants={fadeUp} custom={2}>
              <span className="stat-callout__number" style={{ fontSize: 'var(--text-2xl)' }}>WCAG 2.2</span>
              <p className="stat-callout__label">
                AA accessibility as a baseline, not an afterthought
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Counter animation for stat numbers */
function CountUp({ target, suffix = '', className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setCount(target);
      return;
    }

    let start = 0;
    const duration = 1200;
    const startTime = Date.now();

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, target, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}

/* =======================================================================
   BRAND MANIFESTO
   ======================================================================= */
function BrandManifesto({ prefersReducedMotion }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-20%' });
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) {
      setActiveIndex(MANIFESTO_LINES.length - 1);
      return;
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - rect.top) / (sectionHeight + viewportHeight * 0.5)
      ));
      const index = Math.floor(scrollProgress * MANIFESTO_LINES.length) - 1;
      setActiveIndex(Math.min(index, MANIFESTO_LINES.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion, isInView]);

  return (
    <section className="manifesto" ref={sectionRef}>
      <div className="container">
        <div className="manifesto__lines">
          {MANIFESTO_LINES.map((line, i) => (
            <p
              key={i}
              className={`manifesto__line ${i <= activeIndex ? 'manifesto__line--visible' : ''}`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =======================================================================
   FINAL CTA
   ======================================================================= */
function FinalCTA() {
  return (
    <section className="section section--lg final-cta">
      <div className="final-cta__bg-pattern" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="cta-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <line x1="0" y1="30" x2="60" y2="30" stroke="var(--color-border)" strokeWidth="0.5" />
            <line x1="30" y1="0" x2="30" y2="60" stroke="var(--color-border)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
      </div>
      <div className="container">
        <motion.div
          className="final-cta__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.h2 className="final-cta__heading" variants={fadeUp}>
            Have a project worth crafting well?
          </motion.h2>
          <motion.p className="final-cta__subhead" variants={fadeUp}>
            Tell us what you're building. We'll tell you how we'd approach it.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button to="/contact" variant="primary" size="lg" icon={<ArrowRight />}>
              Start a Project
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
