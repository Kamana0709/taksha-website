/**
 * Footer — Global site footer
 * PRD §6.2 — 4-column: Brand, Sitemap, Services, Contact
 * Responsive: 4→2→1 column collapse
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../Button/Button';
import './Footer.css';

const LinkedinIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const COMPANY_LINKS = [
  { label: 'About', path: '/about' },
  { label: 'Work', path: '/work' },
  { label: 'Process', path: '/process' },
  { label: 'Journal', path: '/journal' },
  { label: 'Contact', path: '/contact' },
  { label: 'Careers', path: '/careers', badge: 'HIRING' },
];

const SERVICE_LINKS = [
  { label: 'Brand Identity', path: '/services/brand-identity' },
  { label: 'UI/UX Design', path: '/services/ui-ux-design' },
  { label: 'Website Design', path: '/services/website-design' },
  { label: 'React Development', path: '/services/react-development' },
  { label: 'AI Automation', path: '/services/ai-automation' },
];

const SOCIAL_LINKS = [
  { label: 'LinkedIn', icon: LinkedinIcon, href: 'https://www.linkedin.com/company/taksha' },
  { label: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/taksha.studio' },
  { label: 'X / Twitter', icon: TwitterIcon, href: 'https://twitter.com/taksha_studio' },
];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Column 1: Brand */}
          <motion.div
            className="footer__column footer__brand"
            variants={fadeUpVariants}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <Link to="/" className="footer__brand-logo" aria-label="Taksha — Home">
              <img src="/taksha-logo.svg" alt="Taksha" className="footer__logo-image" />
            </Link>
            <p className="footer__tagline">Crafting Digital Excellence.</p>
            <p className="footer__mission">
              Helping ambitious businesses communicate their value through thoughtful digital experiences.
            </p>
            <div className="footer__social">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Company */}
          <motion.div
            className="footer__column"
            variants={fadeUpVariants}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <h3 className="footer__column-title">Company</h3>
            <ul className="footer__links">
              {COMPANY_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer__link" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {link.label}
                    {link.badge && (
                      <span className="footer__badge">{link.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Services */}
          <motion.div
            className="footer__column"
            variants={fadeUpVariants}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <h3 className="footer__column-title">Services</h3>
            <ul className="footer__links">
              {SERVICE_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div
            className="footer__column"
            variants={fadeUpVariants}
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <h3 className="footer__column-title">Contact</h3>
            <a href="mailto:hello@taksha.studio" className="footer__email">
              hello@taksha.studio
            </a>
            <Button to="/contact" variant="secondary" size="sm">
              Start a Project
            </Button>
            <p className="footer__response-note">
              We reply within 1–2 business days.
            </p>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Taksha. All rights reserved.
          </p>
          <div className="footer__legal">
            <Link to="/privacy-policy" className="footer__legal-link">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="footer__legal-link">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
