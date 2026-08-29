/**
 * Services Content — All 5 service pages data
 * PRD §13
 */
export const allServices = [
  {
    slug: 'brand-identity',
    title: 'Brand Identity',
    tagline: 'Logos, visual systems, and brand foundations built to scale.',
    overview: 'Brand identity at Taksha Nexus means building the foundational visual and verbal system a business will grow into — logo, color, typography, tone of voice, and usage guidelines — designed to remain relevant for years, not seasons.',
    idealClients: [
      'Startups pre-launch needing a credible visual foundation',
      'Businesses rebranding or modernizing their identity',
      'Creative businesses needing a distinct visual voice',
    ],
    deliverables: [
      'Logo suite (primary, secondary, icon/favicon)',
      'Color system with documented usage guidelines',
      'Typography system with scale and pairing specs',
      'Brand guidelines document (PDF)',
      'Basic brand collateral templates (business card, letterhead, social templates)',
    ],
    timeline: '3–5 weeks depending on scope',
    faqs: [
      { question: 'Do you design logos only, or full identity systems?', answer: 'Full systems — logo-only engagements are scoped case-by-case, but our strength is in building cohesive identity systems that scale.' },
      { question: 'Can you work with an existing brand and refine it?', answer: 'Yes, brand refinement and evolution engagements are supported. We can audit your existing identity and recommend targeted improvements.' },
      { question: 'What files do we receive?', answer: 'Source files (vector/AI/SVG), brand guideline PDF, and export-ready assets in all standard formats (PNG, SVG, PDF).' },
      { question: 'How many logo concepts do you present?', answer: 'Typically 2–3 directions in the initial round, refined through structured feedback cycles rather than unlimited revisions.' },
    ],
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    tagline: 'Interfaces designed around clarity, hierarchy, and behavior.',
    overview: 'Interface design grounded in real user behavior and information hierarchy — covering everything from marketing sites to complex dashboards. We design interfaces that are both beautiful and functional.',
    idealClients: [
      'SaaS founders needing dashboard/app UI',
      'Product teams redesigning underperforming interfaces',
      'Businesses needing complex data-dense UIs that remain approachable',
    ],
    deliverables: [
      'UX research and information architecture (sitemap, flows)',
      'Wireframes (low and mid-fidelity)',
      'High-fidelity UI designs for all screens',
      'Interactive prototype (Figma)',
      'Design system / component library',
    ],
    timeline: '4–8 weeks depending on product complexity',
    faqs: [
      { question: 'Do you design in Figma?', answer: 'Yes, Figma is our standard design tool. All files are shared with the client with full access.' },
      { question: 'Can you design without engineering the build?', answer: 'Yes, design-only engagements are available. However, our strength is in design-to-development continuity.' },
      { question: 'Do you conduct user research?', answer: 'We include structured UX thinking (competitive audits, information architecture, user flow analysis). For formal usability testing, this can be scoped separately.' },
      { question: 'How do you handle revisions?', answer: 'We work through structured feedback cycles at defined checkpoints, ensuring clarity and efficiency rather than unlimited open-ended revisions.' },
    ],
  },
  {
    slug: 'website-design',
    title: 'Website Design',
    tagline: 'End-to-end website design — from marketing sites to landing pages.',
    overview: 'End-to-end website design — from marketing sites to landing pages to product dashboards — built with conversion, clarity, and craft in balance. We design websites that communicate your value clearly and convert visitors effectively.',
    idealClients: [
      'Any business needing a new or redesigned website',
      'Premium local businesses wanting to stand out',
      'Startups needing a credible web presence before launch',
    ],
    deliverables: [
      'Full-site UI design across all required pages',
      'Responsive design specs (desktop, tablet, mobile)',
      'Content and copy guidance',
      'Handoff-ready design files (Figma)',
    ],
    timeline: '3–6 weeks for a marketing site; landing pages 1–2 weeks',
    faqs: [
      { question: 'Do you also build the website, or just design it?', answer: 'Both — see our React Development service for the build phase. Many clients engage Taksha Nexus for design + development together for seamless continuity.' },
      { question: 'Can you help with copywriting?', answer: 'We provide content direction and copy guidance. For full copywriting, we can recommend partners or scope it as an add-on.' },
      { question: 'Do you design for WordPress/Webflow?', answer: 'Our primary stack is custom React. If you need a CMS-based solution, we can discuss your specific needs during the discovery phase.' },
      { question: 'What makes your website design different from a template?', answer: 'Every design is custom — no templates, no themes. We design from your brand identity, audience, and goals, resulting in a site that is uniquely yours.' },
    ],
  },
  {
    slug: 'react-development',
    title: 'React Development',
    tagline: 'Performant, accessible, precision-built React applications.',
    overview: 'Frontend engineering built with the same precision as the design — performant, accessible, maintainable React applications, not just "a site that looks right in the browser." We build for quality, not just speed.',
    idealClients: [
      'Businesses needing their designed site/product built in code',
      'SaaS teams needing frontend architecture help',
      'Companies wanting to improve an existing React codebase',
    ],
    deliverables: [
      'Production-ready React codebase',
      'Component documentation',
      'Performance optimization pass (Lighthouse 95+ target)',
      'Deployment setup and guidance',
    ],
    timeline: '3–8 weeks depending on scope, in parallel with or after design phase',
    faqs: [
      { question: 'What tech stack do you use?', answer: 'React, Vite, and a carefully selected set of libraries chosen per project. No unnecessary framework bloat — every dependency earns its place.' },
      { question: 'Can you work with our existing codebase?', answer: 'Yes, codebase audits and incremental improvement engagements are supported. We can assess and improve your existing frontend.' },
      { question: 'Do you handle backend development?', answer: 'Our focus is frontend/UI engineering. For backend needs, we integrate with your team or recommend trusted backend partners.' },
      { question: 'What about hosting and deployment?', answer: 'We set up and configure deployment on modern platforms (Vercel, Netlify, or your preferred infrastructure) with CI/CD pipelines.' },
    ],
  },
  {
    slug: 'ai-automation',
    title: 'AI Automation',
    tagline: 'Chatbots and workflows that remove friction from your business.',
    overview: 'Practical AI integration — chatbots, workflow automation, and business process automation designed to remove friction rather than add novelty for its own sake. We focus on automations that deliver measurable value.',
    idealClients: [
      'Businesses with repetitive manual workflows',
      'Companies with customer support volume suited to AI-assisted triage',
      'Teams needing lightweight internal automation to save time',
    ],
    deliverables: [
      'Automation audit and opportunity map',
      'Chatbot design and integration (where applicable)',
      'Workflow automation setup and configuration',
      'Documentation for ongoing management and maintenance',
    ],
    timeline: '2–6 weeks depending on integration complexity',
    faqs: [
      { question: 'Will an AI chatbot replace our support team?', answer: 'We position AI as augmentation for common/repetitive queries, not a wholesale replacement. The scope is always tailored to your specific needs and team structure.' },
      { question: 'What platforms do you integrate with?', answer: 'Scoped per engagement based on your existing stack — evaluated during the Discover phase to ensure compatibility and value.' },
      { question: 'How do you handle AI accuracy and hallucinations?', answer: 'We implement guardrails, structured prompts, and domain-specific training data to maximize accuracy and minimize unpredictable outputs.' },
      { question: 'What ongoing costs should we expect?', answer: 'We provide transparent breakdowns of any third-party API costs (LLM providers, hosting) so there are no surprises after launch.' },
    ],
  },
];

export function getServiceBySlug(slug) {
  return allServices.find((s) => s.slug === slug);
}
