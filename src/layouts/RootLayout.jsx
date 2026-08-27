/**
 * RootLayout — Persistent app shell
 * Renders Navbar, Footer, PageTransition, CustomCursor
 * Initializes Lenis smooth scroll once at app shell level
 * PRD §5.3 Developer Note
 */
import { useEffect } from 'react';
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import StructuredData, { organizationSchema } from '../components/StructuredData/StructuredData';
import { usePrefersReducedMotion } from '../context/MotionPreferenceContext';
import CustomCursor from '../components/CustomCursor/CustomCursor';

export default function RootLayout() {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (prefersReducedMotion) return;

    let lenis;
    let rafId;

    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          syncTouch: false,
        });

        // Sync with GSAP ScrollTrigger if loaded
        const gsapModule = await import('gsap').catch(() => null);
        const scrollTriggerModule = await import('gsap/ScrollTrigger').catch(() => null);
        if (gsapModule && scrollTriggerModule) {
          const { ScrollTrigger } = scrollTriggerModule;
          gsapModule.gsap.registerPlugin(ScrollTrigger);
          lenis.on('scroll', ScrollTrigger.update);
          gsapModule.gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
          });
          gsapModule.gsap.ticker.lagSmoothing(0);
        } else {
          function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
          }
          rafId = requestAnimationFrame(raf);
        }
      } catch (e) {
        console.warn('Lenis initialization failed:', e);
      }
    };

    initLenis();

    return () => {
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const pageTransitionVariants = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
        },
        exit: {
          opacity: 0,
          y: -16,
          transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] },
        },
      };

  return (
    <>
      <CustomCursor />
      {/* Sitewide structured data */}
      <StructuredData schema={organizationSchema()} />

      {/* Skip link — first focusable element */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <Navbar />

      <main id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
