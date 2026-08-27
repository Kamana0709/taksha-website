import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, MapPin, Clock, Code, Database, 
  PenTool, Megaphone, Users, Zap, Heart, 
  Gift, TrendingUp, Globe
} from 'lucide-react';
import SEO from '../components/SEO/SEO';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import './Careers.css';

const ROLES = [
  {
    id: 'DEV001',
    category: 'DEVELOPMENT',
    categoryColor: 'var(--color-card-lilac)',
    title: 'Frontend Developer Intern',
    desc: 'Work on modern web interfaces using React, Tailwind CSS and building amazing user experiences.',
    location: 'Remote',
    duration: '3 Months',
    icon: Code,
    btnColor: 'var(--color-card-lilac)'
  },
  {
    id: 'DEV002',
    category: 'DEVELOPMENT',
    categoryColor: 'var(--color-accent)',
    title: 'Full-Stack Developer Intern',
    desc: 'Build end-to-end features, integrate APIs, and work with databases and cloud services.',
    location: 'Remote',
    duration: '3 Months',
    icon: Database,
    btnColor: 'var(--color-accent)'
  },
  {
    id: 'DES001',
    category: 'DESIGN',
    categoryColor: 'var(--color-card-mint)',
    title: 'UI/UX Designer Intern',
    desc: 'Design intuitive user interfaces and create delightful experiences for our users.',
    location: 'Remote',
    duration: '3 Months',
    icon: PenTool,
    btnColor: 'var(--color-card-mint)'
  },
  {
    id: 'MKT001',
    category: 'MARKETING',
    categoryColor: 'var(--color-card-pink)',
    title: 'Digital Marketing Intern',
    desc: 'Plan and execute campaigns, manage social media, and drive meaningful engagement.',
    location: 'Remote',
    duration: '3 Months',
    icon: Megaphone,
    btnColor: 'var(--color-card-pink)'
  }
];

const BENEFITS = [
  { title: 'Learn & Grow', desc: 'Continuous learning with mentorship and real-world projects.', icon: Users, color: 'var(--color-card-lilac)' },
  { title: 'Flexible Work', desc: 'Remote-first culture with flexible hours that work for you.', icon: Zap, color: 'var(--color-accent)' },
  { title: 'Impact Driven', desc: 'Build products that make a difference in people\'s lives.', icon: Heart, color: 'var(--color-card-mint)' },
  { title: 'Perks & Rewards', desc: 'Exciting perks, recognition and performance rewards.', icon: Gift, color: 'var(--color-card-pink)' },
  { title: 'Career Growth', desc: 'Clear growth path and leadership opportunities.', icon: TrendingUp, color: 'var(--color-card-purple)' },
  { title: 'Inclusive Culture', desc: 'A diverse, inclusive and supportive environment.', icon: Globe, color: 'var(--color-accent)' }
];

export default function Careers() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <main className="careers-page pt-32 pb-32">
      <SEO 
        title="Careers | Taksha Internship Platform" 
        description="Join Taksha and be part of a mission to empower learners and build impactful products." 
      />

      {/* Hero Section */}
      <section className="careers-hero container">
        <div className="careers-hero__content">
          <div className="badge badge--pink">CAREERS</div>
          <h1 className="careers-hero__title">
            Build the Future.<br/>
            Together<span className="dot">.</span>
          </h1>
          <p className="careers-hero__desc">
            Join Taksha and be part of a mission to empower learners, build impactful products, and create meaningful change.
          </p>
          <div className="careers-hero__actions">
            <a href="#roles" className="btn btn--primary">
              View Open Roles <ArrowRight size={20} />
            </a>
            <a href="#benefits" className="btn btn--secondary">
              Life at Taksha <ArrowRight size={20} />
            </a>
          </div>
        </div>

        <div className="careers-hero__visual">
          <div className="illustration-wrapper">
            {/* Sticky Note */}
            <div className="sticky-note">
              {/* ID Card */}
              <div className="id-card">
                <div className="id-card__clip"></div>
                <div className="id-card__lanyard"></div>
                <div className="id-card__photo">
                  <UserIcon />
                </div>
                <div className="id-card__lines">
                  <div className="id-card__line id-card__line--long"></div>
                  <div className="id-card__line id-card__line--short"></div>
                  <div className="id-card__line id-card__line--medium"></div>
                </div>
                <div className="id-card__corner"></div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="deco deco--zigzag">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10" stroke="var(--color-card-purple)" strokeWidth="4" strokeLinejoin="miter" strokeLinecap="square" />
              </svg>
            </div>
            <div className="deco deco--circle-green"></div>
            <div className="deco deco--circle-purple"></div>
            <div className="deco deco--steps">
              <div className="step-block step-block--3"></div>
              <div className="step-block step-block--2"></div>
              <div className="step-block step-block--1"></div>
            </div>
            <div className="deco deco--cross">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4 L20 20 M20 4 L4 20" stroke="var(--color-card-mint)" strokeWidth="6" strokeLinecap="square" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="roles" className="careers-roles container section-padding">
        <div className="roles-header">
          <div className="roles-header__left">
            <div className="badge badge--lilac">OPEN ROLES</div>
            <h2 className="section-title">Find Your Opportunity</h2>
            <p className="section-desc">Explore exciting opportunities and build your career with us.</p>
          </div>
          <a href="#" className="view-all-link">View All Roles <ArrowRight size={16} /></a>
        </div>

        <motion.div 
          className="roles-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {ROLES.map((role) => (
            <motion.div key={role.id} className="role-card" variants={fadeUp}>
              <div className="role-card__header">
                <span className="role-card__tag" style={{ background: role.categoryColor }}>{role.category}</span>
                <span className="role-card__id">{role.id}</span>
              </div>
              <div className="role-card__icon" style={{ background: role.categoryColor }}>
                <role.icon size={24} />
              </div>
              <h3 className="role-card__title">{role.title}</h3>
              <p className="role-card__desc">{role.desc}</p>
              
              <div className="role-card__meta">
                <span><MapPin size={14} /> {role.location}</span>
                <span><Clock size={14} /> {role.duration}</span>
              </div>

              <button className="role-card__btn" style={{ background: role.btnColor }}>
                View Details & Apply <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="careers-benefits container section-padding">
        <div className="benefits-header">
          <div className="badge badge--purple">WHY JOIN US</div>
          <h2 className="section-title">Benefits That Matter</h2>
          <p className="section-desc">We care for our team and empower them to do their best work.</p>
        </div>

        <motion.div 
          className="benefits-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {BENEFITS.map((benefit, i) => (
            <motion.div key={i} className="benefit-card" variants={fadeUp}>
              <div className="benefit-card__icon-wrap" style={{ background: benefit.color }}>
                <benefit.icon size={28} strokeWidth={2.5} color="var(--color-ink)" />
              </div>
              <h3 className="benefit-card__title">{benefit.title}</h3>
              <p className="benefit-card__desc">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Application Form Section */}
      <section className="careers-apply container section-padding">
        <div className="apply-box">
          <div className="apply-box__left">
            <div className="badge badge--mint">BE PART OF OUR JOURNEY</div>
            <h2 className="apply-box__title">Ready to Build Something Amazing?</h2>
            <p className="apply-box__desc">Send us your details and we'll get in touch when the right opportunity opens up.</p>
            <button className="btn btn--primary" style={{ marginTop: 'var(--space-6)' }}>
              Send Your Profile <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="apply-box__right">
            <form className="apply-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <input type="text" placeholder="Full Name" className="form-input" required />
                <input type="email" placeholder="Email Address" className="form-input" required />
              </div>
              <div className="form-row">
                <select className="form-input form-select" required defaultValue="">
                  <option value="" disabled>Role of Interest</option>
                  <option value="frontend">Frontend Developer Intern</option>
                  <option value="fullstack">Full-Stack Developer Intern</option>
                  <option value="design">UI/UX Designer Intern</option>
                  <option value="marketing">Digital Marketing Intern</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-row">
                <textarea placeholder="Message" className="form-textarea" rows="4" required></textarea>
              </div>
              <button type="submit" className="btn btn--mint apply-form__submit">
                Submit Application <ArrowRight size={20} />
              </button>
            </form>
          </div>
          
          {/* Decorative steps */}
          <div className="apply-deco apply-deco--steps">
            <div className="step-block step-block--1" style={{ background: 'var(--color-accent)' }}></div>
            <div className="step-block step-block--2" style={{ background: 'var(--color-accent)' }}></div>
            <div className="step-block step-block--3" style={{ background: 'var(--color-accent)' }}></div>
          </div>
          <div className="apply-deco apply-deco--cross">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M4 4 L28 28 M28 4 L4 28" stroke="var(--color-card-pink)" strokeWidth="6" strokeLinecap="square" />
            </svg>
          </div>
        </div>
      </section>
      
      {/* Portal Access Section */}
      <section className="container section-padding" style={{ borderTop: '2px dashed var(--color-ink)', marginTop: 'var(--space-12)', textAlign: 'center' }}>
        <p style={{ fontWeight: '700', marginBottom: 'var(--space-4)' }}>Already part of the team?</p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/login" className="btn btn--secondary" style={{ background: 'var(--color-bg)' }}>
            Taksha Workspace Login <ArrowRight size={18} />
          </a>
        </div>
      </section>

    </main>
  );
}

// Simple internal icon for ID card photo
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: 'var(--color-bg)' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
