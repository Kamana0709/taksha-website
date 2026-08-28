const COMMON_TASKS = [
  "Clean GitHub repository with README",
  "Desktop + mobile screenshots",
  "Case study write-up (Problem → Research → Solution → Technology → Challenges → Result)",
  "LinkedIn post explaining what was built",
  "30–60 second demo video"
];

const PROJECT_TEMPLATES = [
  {
    key: "business-landing-page",
    name: "Project 1: Business Landing Page",
    description: "UI / Frontend Fundamentals — Turn a real business brief into a polished, responsive website.",
    stack: "HTML, CSS, JavaScript, Responsive Design, Git/GitHub, Figma → Code",
    checklist: [
      "Hero section",
      "About section",
      "Services section",
      "Why Choose Us section",
      "Portfolio / gallery",
      "Testimonials",
      "Contact section",
      "Responsive navbar",
      "Footer",
      "Fully mobile-responsive layout",
      ...COMMON_TASKS
    ]
  },
  {
    key: "internship-discovery-platform",
    name: "Project 2: Internship Discovery Platform",
    description: "JavaScript + API — Build a React app that consumes real (or mock) API data.",
    stack: "React, JavaScript, REST API, Git/GitHub",
    checklist: [
      "Internship cards",
      "Search",
      "Category filter",
      "Location filter",
      "Sort",
      "Internship details view",
      "Application form with validation",
      "Loading state",
      "Error state",
      "Empty state",
      ...COMMON_TASKS
    ]
  },
  {
    key: "business-analytics-dashboard",
    name: "Project 3: Business Analytics Dashboard",
    description: "Final Industry Case Study — Turn an ambiguous business problem into a usable, decision-ready dashboard.",
    stack: "React, JavaScript, Tailwind CSS, API/Data Integration, Chart Library, Git/GitHub, Deployment",
    checklist: [
      "Overview panel",
      "Revenue metrics",
      "Users metrics",
      "Orders metrics",
      "Conversion metrics",
      "Growth metrics",
      "Charts",
      "Tables",
      "Filters",
      "Date range selection",
      "Search",
      "Sorting",
      "Responsive sidebar and dashboard navigation",
      "Loading, empty, and error states",
      ...COMMON_TASKS
    ]
  }
];

module.exports = { PROJECT_TEMPLATES };
