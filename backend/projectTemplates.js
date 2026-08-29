const COMMON_TASKS = [
  { title: "Clean GitHub repository with README", skills: ["Version Control", "Documentation"] },
  { title: "Desktop + mobile screenshots", skills: ["Design QA"] },
  { title: "Case study write-up (Problem → Research → Solution → Technology → Challenges → Result)", skills: ["Communication", "Writing"] },
  { title: "LinkedIn post explaining what was built", skills: ["Marketing", "Communication"] },
  { title: "30–60 second demo video", skills: ["Presentation"] }
];

const PROJECT_TEMPLATES = [
  {
    key: "business-landing-page",
    name: "Project 1: Business Landing Page",
    order: 1,
    description: "UI / Frontend Fundamentals — Turn a real business brief into a polished, responsive website.",
    stack: "HTML, CSS, JavaScript, Responsive Design, Git/GitHub, Figma → Code",
    checklist: [
      { title: "Hero section", skills: ["HTML/CSS", "UI Design"] },
      { title: "About section", skills: ["HTML/CSS"] },
      { title: "Services section", skills: ["HTML/CSS"] },
      { title: "Why Choose Us section", skills: ["HTML/CSS"] },
      { title: "Portfolio / gallery", skills: ["HTML/CSS", "UI Design"] },
      { title: "Testimonials", skills: ["HTML/CSS"] },
      { title: "Contact section", skills: ["HTML/CSS", "Forms"] },
      { title: "Responsive navbar", skills: ["HTML/CSS", "JavaScript", "Responsive Design"] },
      { title: "Footer", skills: ["HTML/CSS"] },
      { title: "Fully mobile-responsive layout", skills: ["Responsive Design"] },
      ...COMMON_TASKS
    ]
  },
  {
    key: "internship-discovery-platform",
    name: "Project 2: Internship Discovery Platform",
    order: 2,
    description: "JavaScript + API — Build a React app that consumes real (or mock) API data.",
    stack: "React, JavaScript, REST API, Git/GitHub",
    checklist: [
      { title: "Internship cards", skills: ["React", "UI Design"] },
      { title: "Search", skills: ["React", "State Management"] },
      { title: "Category filter", skills: ["React", "State Management"] },
      { title: "Location filter", skills: ["React", "State Management"] },
      { title: "Sort", skills: ["React", "State Management"] },
      { title: "Internship details view", skills: ["React", "Routing"] },
      { title: "Application form with validation", skills: ["React", "Forms"] },
      { title: "Loading state", skills: ["React", "UX"] },
      { title: "Error state", skills: ["React", "UX"] },
      { title: "Empty state", skills: ["React", "UX"] },
      ...COMMON_TASKS
    ]
  },
  {
    key: "business-analytics-dashboard",
    name: "Project 3: Business Analytics Dashboard",
    order: 3,
    description: "Final Industry Case Study — Turn an ambiguous business problem into a usable, decision-ready dashboard.",
    stack: "React, JavaScript, Tailwind CSS, API/Data Integration, Chart Library, Git/GitHub, Deployment",
    checklist: [
      { title: "Overview panel", skills: ["React", "Data Visualization"] },
      { title: "Revenue metrics", skills: ["Data Integration"] },
      { title: "Users metrics", skills: ["Data Integration"] },
      { title: "Orders metrics", skills: ["Data Integration"] },
      { title: "Conversion metrics", skills: ["Data Integration"] },
      { title: "Growth metrics", skills: ["Data Integration"] },
      { title: "Charts", skills: ["React", "Data Visualization"] },
      { title: "Tables", skills: ["React", "UI Design"] },
      { title: "Filters", skills: ["React", "State Management"] },
      { title: "Date range selection", skills: ["React", "State Management"] },
      { title: "Search", skills: ["React", "State Management"] },
      { title: "Sorting", skills: ["React", "State Management"] },
      { title: "Responsive sidebar and dashboard navigation", skills: ["React", "Routing", "Responsive Design"] },
      { title: "Loading, empty, and error states", skills: ["React", "UX"] },
      ...COMMON_TASKS
    ]
  }
];

module.exports = { PROJECT_TEMPLATES };
