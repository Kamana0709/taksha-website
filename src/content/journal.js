/**
 * Journal Content Database
 * Phase 14: Content Engine
 */

export const JOURNAL_CATEGORIES = [
  'All',
  'Blog',
  'Case Studies',
  'Design Journal',
  'Engineering Notes',
  'AI Experiments',
  'UI Inspirations',
  'Brand Stories',
  'Industry Insights',
  'Tutorials',
  'Open-source Showcases'
];

export const allArticles = [
  {
    slug: 'the-death-of-the-template',
    title: 'The Death of the Template: Why Bespoke Design Wins in 2026',
    category: 'Blog',
    date: 'Oct 15, 2025',
    author: 'Taksha Studio',
    readTime: '4 min read',
    excerpt: 'In a world where AI can generate a generic landing page in 3 seconds, human-crafted bespoke design is the only way to signal premium value.',
    content: `
      <h2>The Age of Artificial Sameness</h2>
      <p>We are entering an era of extreme digital homogeny. As tools like ChatGPT and various no-code builders lower the barrier to entry, the internet is flooding with sites that look exactly the same. The same bento grids, the same rounded sans-serif fonts, the same floating 3D gradients.</p>
      
      <h2>Craft as a Differentiator</h2>
      <p>When everyone has access to 'good enough' design instantly, 'good enough' becomes invisible. To stand out, brands must rely on extreme craft—the tiny, imperfect, tactile details that prove humans were involved.</p>
      
      <blockquote>
        "If you look like a template, customers will assume your product is a template."
      </blockquote>
      
      <h2>Our Approach at Taksha</h2>
      <p>At Taksha, we abandoned templates entirely. We build custom React architectures for every client, ensuring their digital presence is as unique as their fingerprint. We focus on typography-led hierarchy, fluid motion, and rigorous accessibility.</p>
    `
  },
  {
    slug: 'architecting-for-lighthouse-100',
    title: 'Architecting for Lighthouse 100: React Performance Secrets',
    category: 'Engineering Notes',
    date: 'Oct 12, 2025',
    author: 'Engineering Team',
    readTime: '6 min read',
    excerpt: 'How we consistently achieve 100/100 Lighthouse performance scores without sacrificing complex Framer Motion animations.',
    content: `
      <h2>The Myth of Slow React</h2>
      <p>A common misconception is that heavy animation libraries like Framer Motion or GSAP inherently destroy your Lighthouse score. This is false. Poor DOM management and main-thread blocking destroy your score.</p>
      
      <h2>Rule 1: Optimize the Initial Paint</h2>
      <p>The most important metric is LCP (Largest Contentful Paint). If you are animating your hero section, do NOT use JavaScript to fade in the text. By the time React hydrates and Framer Motion kicks in, you've already lost precious milliseconds. Use plain CSS for the initial hero fade-in, and use JS for scroll-triggered events further down the page.</p>
      
      <pre>
// Bad: Blocks LCP until hydration
<motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Hero</motion.h1>

// Good: Uses CSS for initial render
<h1 className="hero-title">Hero</h1>
      </pre>
      
      <h2>Rule 2: Lazy Load the Junk</h2>
      <p>Only load what you need. We heavily utilize React's \`Suspense\` and \`lazy()\` to code-split our routes. If a user never goes to the Case Study page, they should never download the GSAP scroll-trigger code for it.</p>
    `
  },
  {
    slug: 'ai-driven-color-palettes',
    title: 'Generating Accessible Palettes with AI Agents',
    category: 'AI Experiments',
    date: 'Oct 05, 2025',
    author: 'Taksha Labs',
    readTime: '5 min read',
    excerpt: 'An experiment in using LLMs to mathematically generate color scales that guarantee WCAG 2.2 AAA compliance.',
    content: `
      <h2>The Problem with HSL Scaling</h2>
      <p>Traditionally, designers generate palettes by adjusting the Lightness value in an HSL color space. However, human perception of luminance is not linear. A yellow at 50% lightness looks completely different than a blue at 50% lightness.</p>
      
      <h2>Enter the AI Agent</h2>
      <p>We built a custom prompt chain using Claude 3.5 Sonnet to calculate APCA (Accessible Perceptual Contrast Algorithm) values mathematically. We feed it a single primary brand hex code, and it recursively tests millions of combinations until it outputs a 10-step CSS variable scale where steps 100-500 are guaranteed accessible against dark text, and steps 600-900 against light text.</p>
      
      <h2>The Result</h2>
      <p>This completely eliminated the 'contrast check' phase of our design process. Our design system tokens are now generated programmatically and are mathematically guaranteed to be accessible.</p>
    `
  },
  {
    slug: 'designing-for-the-edges',
    title: 'Designing for the Edges: A Look at Empty States',
    category: 'Design Journal',
    date: 'Sep 28, 2025',
    author: 'Design Team',
    readTime: '3 min read',
    excerpt: 'Empty states are often an afterthought. Here is why we treat them as prime real estate.',
    content: `
      <h2>The Neglected Canvas</h2>
      <p>Most designers focus 90% of their time on the 'Happy Path'—what the app looks like when it's fully populated with beautiful data. But what does a new user see? Nothing. A blank screen.</p>
      
      <h2>The Opportunity</h2>
      <p>An empty state is an incredible opportunity for brand personality and user onboarding. Instead of 'No projects found', we use bespoke illustrations, witty copy, and a massive, pulsing primary CTA that tells the user exactly what to do next.</p>
      
      <p>At Taksha, we have a rule: An empty state must be more beautiful than a full state.</p>
    `
  },
  {
    slug: 'rebuilding-taksha',
    title: 'Rebuilding Taksha: Case Study Deep Dive',
    category: 'Case Studies',
    date: 'Sep 20, 2025',
    author: 'Taksha Studio',
    readTime: '8 min read',
    excerpt: 'A behind-the-scenes look at how we built our own studio website in record time.',
    content: `
      <h2>Eating Our Own Dog Food</h2>
      <p>When it came time to launch Taksha, we knew our website had to be our strongest case study. We couldn't just tell clients we build premium, high-performance web apps—we had to show them.</p>
      
      <h2>The Architecture</h2>
      <p>We opted for React 19 and Vite for blazingly fast HMR during development. For styling, we took a radical approach: No Tailwind. We wrote plain, semantic CSS utilizing BEM methodology and extensive CSS variables. This resulted in an incredibly lightweight bundle.</p>
      
      <h2>The Results</h2>
      <p>The site scores 100 across the board on Lighthouse. It features fluid page transitions using Framer Motion, and buttery-smooth scroll hijacking via Lenis. It is the perfect embodiment of our craft.</p>
    `
  },
  {
    slug: 'the-art-of-microcopy',
    title: 'The Art of Microcopy in SaaS Interfaces',
    category: 'UI Inspirations',
    date: 'Sep 15, 2025',
    author: 'Content Team',
    readTime: '4 min read',
    excerpt: 'Why the text on your buttons matters more than the color of your buttons.',
    content: `
      <h2>Words as Design</h2>
      <p>Good design is clear thinking made visual. But no amount of drop shadows or gradients can save a confusing interface. The most powerful design tool is often the keyboard.</p>
      
      <h2>Clarity over Cleverness</h2>
      <p>We collect UI inspirations not just for visuals, but for copy. A button that says "Save Changes" is infinitely better than one that says "Make it so". In SaaS, users are trying to accomplish a task. Your microcopy should get out of their way and guide them with absolute precision.</p>
    `
  },
  {
    slug: 'building-a-sustainable-agency',
    title: 'Building a Sustainable Agency Brand',
    category: 'Brand Stories',
    date: 'Sep 01, 2025',
    author: 'Founder',
    readTime: '5 min read',
    excerpt: 'How we structured Taksha to avoid the typical agency burnout cycle.',
    content: `
      <h2>The Churn and Burn</h2>
      <p>The agency world is notorious for burnout. High turnover, brutal deadlines, and pitch-work that never sees the light of day. We wanted to build something different.</p>
      
      <h2>Quality over Quantity</h2>
      <p>At Taksha, we cap our active projects. By strictly limiting our WIP (Work in Progress), we ensure that every client gets our absolute best, and our team gets to go home at 5 PM. A well-rested designer produces infinitely better work than an exhausted one.</p>
    `
  },
  {
    slug: 'the-future-of-web-animation',
    title: 'The Future of Web Animation',
    category: 'Industry Insights',
    date: 'Aug 25, 2025',
    author: 'Design Engineering',
    readTime: '7 min read',
    excerpt: 'Moving away from scrolljacking and towards meaningful, state-driven motion.',
    content: `
      <h2>The Era of Scroll Fatigue</h2>
      <p>We've all been there. You scroll down a page, and your scroll wheel is hijacked to rotate a 3D model of a shoe for 15 seconds before you can actually read the text. The industry is currently obsessed with "Wow factor" at the expense of usability.</p>
      
      <h2>Meaningful Motion</h2>
      <p>The future of animation is subtle. It's state-driven. It's an animation that fires when you successfully submit a form, providing instant feedback. It's shared-element transitions that help the user maintain spatial awareness when navigating between routes. We predict a massive shift back to purposeful animation.</p>
    `
  },
  {
    slug: 'react-framer-motion-tutorial',
    title: 'Tutorial: Complex Page Transitions in React',
    category: 'Tutorials',
    date: 'Aug 10, 2025',
    author: 'Engineering Team',
    readTime: '10 min read',
    excerpt: 'A step-by-step guide to implementing AnimatePresence for flawless route transitions.',
    content: `
      <h2>The Problem with React Router</h2>
      <p>Out of the box, React Router instantly unmounts the old page and mounts the new one. This feels jarring. To fix this, we use Framer Motion's \`AnimatePresence\`.</p>
      
      <h2>The Setup</h2>
      <p>Wrap your \`Routes\` component in \`AnimatePresence\` (with \`mode="wait"\`). Then, ensure every route component is wrapped in a \`motion.div\` that defines \`initial\`, \`animate\`, and \`exit\` states.</p>
      
      <p>The trick is providing a unique \`key\` (usually the pathname) to the \`Routes\` component so AnimatePresence knows when a route has changed.</p>
    `
  },
  {
    slug: 'taksha-ui-kit-release',
    title: 'Release: The Taksha Open-Source UI Kit',
    category: 'Open-source Showcases',
    date: 'Aug 01, 2025',
    author: 'Taksha Studio',
    readTime: '3 min read',
    excerpt: 'We are open-sourcing our core React component library for the community.',
    content: `
      <h2>Giving Back</h2>
      <p>We stand on the shoulders of open-source giants. React, Vite, Framer Motion—none of our work would be possible without the community. Today, we are releasing the Taksha UI Kit.</p>
      
      <h2>What is it?</h2>
      <p>It's a collection of 50+ headless React components, styled with plain CSS variables. No Tailwind, no bloated dependencies. Just clean, accessible, semantic markup that you can copy and paste directly into your projects.</p>
    `
  }
];

export function getArticleBySlug(slug) {
  return allArticles.find(a => a.slug === slug);
}
