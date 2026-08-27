import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, MapPin, Clock, Code, Database, 
  PenTool, Megaphone, Users, Zap, Heart, 
  Gift, TrendingUp, Globe, X, CheckCircle
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
    btnColor: 'var(--color-card-lilac)',
    responsibilities: [
      'Develop interactive and responsive user interfaces',
      'Collaborate with designers to implement UI/UX designs',
      'Optimize application for maximum speed and scalability'
    ],
    requirements: [
      'Basic knowledge of React and JavaScript (ES6+)',
      'Understanding of HTML5, CSS3, and responsive design',
      'Familiarity with Git and version control',
      'Strong problem-solving skills'
    ]
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
    btnColor: 'var(--color-accent)',
    responsibilities: [
      'Design and develop RESTful APIs',
      'Create dynamic frontend components',
      'Manage database schemas and queries'
    ],
    requirements: [
      'Experience with Node.js and Express',
      'Familiarity with SQL or NoSQL databases',
      'Knowledge of React on the frontend',
      'Eagerness to learn cloud deployment'
    ]
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
    btnColor: 'var(--color-card-mint)',
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity mockups',
      'Conduct user research and usability testing',
      'Maintain and expand the design system'
    ],
    requirements: [
      'Proficiency in Figma or Adobe XD',
      'Strong portfolio demonstrating UI/UX principles',
      'Good understanding of typography and color theory',
      'Empathy for the end-user'
    ]
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
    btnColor: 'var(--color-card-pink)',
    responsibilities: [
      'Manage social media accounts and content calendars',
      'Assist in SEO optimization and content writing',
      'Track and report campaign performance'
    ],
    requirements: [
      'Excellent written and verbal communication',
      'Familiarity with social media analytics tools',
      'Creative mindset with an eye for trends',
      'Basic knowledge of SEO principles'
    ]
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
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [isApplied, setIsApplied] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
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

              <button 
                className="role-card__btn" 
                style={{ background: role.btnColor }}
                onClick={() => {
                  setSelectedRole(role);
                  setIsApplied(false);
                }}
              >
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

      {/* Role Details & Application Modal */}
      {selectedRole && (
        <div className="role-modal-overlay" onClick={() => setSelectedRole(null)}>
          <div className="role-modal" onClick={e => e.stopPropagation()}>
            <button className="role-modal__close" onClick={() => setSelectedRole(null)}>
              <X size={24} />
            </button>
            
            <div className="role-modal__header" style={{ background: selectedRole.categoryColor }}>
              <div className="role-modal__badge">{selectedRole.category} • {selectedRole.id}</div>
              <h2 className="role-modal__title">{selectedRole.title}</h2>
              <div className="role-card__meta">
                <span><MapPin size={14} /> {selectedRole.location}</span>
                <span><Clock size={14} /> {selectedRole.duration}</span>
              </div>
            </div>

            <div className="role-modal__content">
              {!isApplied ? (
                <div className="role-modal__split">
                  <div className="role-modal__details">
                    <p className="role-modal__desc">{selectedRole.desc}</p>
                    
                    <h4 className="role-modal__section-title">Key Responsibilities</h4>
                    <ul className="role-modal__list">
                      {selectedRole.responsibilities.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>

                    <h4 className="role-modal__section-title">Requirements</h4>
                    <ul className="role-modal__list">
                      {selectedRole.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="role-modal__apply">
                    <h3 className="apply-title">Apply Now</h3>
                    <form className="apply-form" onSubmit={async (e) => { 
                      e.preventDefault(); 
                      setIsSubmitting(true);
                      setErrorMsg('');
                      
                      const formData = new FormData(e.target);
                      const data = {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        portfolio: formData.get('portfolio'),
                        message: formData.get('message'),
                        roleId: selectedRole.id,
                        roleTitle: selectedRole.title
                      };

                      try {
                        const response = await fetch('/api/applications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(data)
                        });
                        
                        if (response.ok) {
                          setIsApplied(true);
                        } else {
                          setErrorMsg('Failed to submit application. Please try again later.');
                        }
                      } catch (err) {
                        setErrorMsg('Network error. Please try again.');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}>
                      <input type="text" name="name" placeholder="Full Name" className="form-input" required />
                      <input type="email" name="email" placeholder="Email Address" className="form-input" required />
                      <input type="url" name="portfolio" placeholder="Portfolio / LinkedIn URL" className="form-input" required />
                      <textarea name="message" placeholder="Why are you a good fit?" className="form-textarea" rows="3" required></textarea>
                      {errorMsg && <p style={{ color: 'red', fontSize: '14px', margin: 0 }}>{errorMsg}</p>}
                      <button type="submit" className="btn btn--primary" style={{ background: 'var(--color-ink)', color: 'var(--color-bg)' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : <>Submit Application <ArrowRight size={18} /></>}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="role-modal__success">
                  <CheckCircle size={64} color="var(--color-card-mint)" />
                  <h3>Application Submitted!</h3>
                  <p>Thank you for applying for the <strong>{selectedRole.title}</strong> role. Our team will review your application and get back to you shortly.</p>
                  <button className="btn btn--secondary" onClick={() => setSelectedRole(null)}>
                    Close Window
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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
