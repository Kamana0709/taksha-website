# Taksha Frontend Architecture Document

**Version:** 1.0.0
**Project:** Taksha Official Website
**Tech Stack:** React 19, Vite, Plain CSS (BEM), React Router, Framer Motion, GSAP, Lenis, React Helmet Async

---

## 1. Core Philosophy
The Taksha codebase must reflect the brand's core values: precision, craftsmanship, and extreme performance. We do not use bloated utility frameworks. We write clean, semantic React, orchestrated with highly optimized Vanilla CSS and advanced animation libraries.

---

## 2. Folder Structure
```text
src/
├── assets/            # Static assets (fonts, raw SVGs, unoptimized images)
├── components/        # Reusable UI components
│   ├── ui/            # Generic atoms/molecules (Button, Card, Input)
│   ├── layout/        # Layout wrappers (Section, Grid)
│   └── shared/        # Complex organisms (Navbar, Footer)
├── pages/             # Route-level components (Home, Work, Services)
├── hooks/             # Custom React hooks (useLenis, useTheme)
├── utils/             # Helper functions (cn.js, formatters)
├── styles/            # Global stylesheets
│   ├── reset.css
│   ├── tokens.css     # CSS Variables (Colors, Typography, Spacing)
│   └── global.css     # Global layout rules
├── routes/            # React Router configurations
├── App.jsx            # Root application component
└── main.jsx           # Vite entry point
```

---

## 3. Component Hierarchy & Standards

### 3.1 Architecture
- **Pages (`src/pages`):** Handle data fetching, SEO (Helmet), and assembling generic UI components.
- **Components (`src/components`):** Must be purely presentational ("dumb"). They accept props and emit events. They should not fetch their own data or manage global state.

### 3.2 Naming Conventions
- **Files/Folders:** `PascalCase` for React components (`Navbar.jsx`, `Button/Button.jsx`). `camelCase` for utilities and hooks (`useTheme.js`, `cn.js`).
- **CSS Classes:** Strict BEM methodology in lowercase with hyphens (`.navbar`, `.navbar__logo`, `.button--primary`).
- **Props:** `camelCase` (e.g., `isLoading`, `onClick`). Boolean props should start with `is`, `has`, or `should`.

---

## 4. State Management
Given the marketing nature of the site, global state needs are minimal.
- **Local State:** Use `useState` and `useReducer` for component-level UI state (e.g., dropdowns, toggles).
- **Global UI State:** Use React Context sparingly (e.g., ThemeContext for light/dark mode, or MenuContext for mobile navigation state).

---

## 5. Hooks & Utilities

### 5.1 Core Hooks
- `useLenis`: Manages the lifecycle of the Lenis smooth scroll instance.
- `useScrollTo`: Helper to smoothly scroll to specific DOM nodes.
- `useTheme`: Exposes the current theme and a toggle function.
- `useIsomorphicLayoutEffect`: Safe layout effect for SSR/Client hydration consistency.

### 5.2 Core Utilities
- `cn.js`: A utility (similar to `clsx` or `classnames`) to conditionally join CSS class names cleanly.

---

## 6. Routing & SEO (Helmet)

### 6.1 React Router Setup
- Use `createBrowserRouter` for modern data-router capabilities (if data loading is needed) or standard `<Routes>` within `<BrowserRouter>`.
- **Code Splitting:** All routes inside `src/pages` must be lazy-loaded using `React.lazy()` to ensure the initial bundle size remains minimal.

### 6.2 React Helmet Async
- A `<HelmetProvider>` must wrap the application in `main.jsx`.
- Every page component must render a `<Helmet>` block containing a unique `<title>` and `<meta name="description">`.

---

## 7. Motion Design (Framer Motion, GSAP, Lenis)

### 7.1 Separation of Concerns
- **Framer Motion:** Used exclusively for component-level, state-driven animations (e.g., AnimatePresence for modals, route transitions, and UI micro-interactions).
- **GSAP:** Used exclusively for complex, timeline-based scroll animations (e.g., ScrollTrigger reveals, parallax, pinning).
- **Lenis:** Handles the global smooth scrolling math, overriding native scroll behavior. GSAP ScrollTrigger must be hooked into Lenis's ticker for synchronized animations.

---

## 8. Performance Strategy

### 8.1 Asset Organization
- **Images:** Must be compressed to WebP/AVIF formats. Large imagery belongs in `public/` and should be referenced via absolute paths to utilize browser caching effectively.
- **SVGs:** Simple icons should be inlined as React components to save HTTP requests. Complex SVGs should be used via `<img>` tags.

### 8.2 Rendering Optimization
- Use React 19 concurrent rendering features.
- Avoid unnecessary re-renders by aggressively pushing state down the component tree. Use `React.memo` only on heavy, pure visual components.

---

## 9. Code Standards & Git Workflow

### 9.1 CSS Architecture (Plain CSS)
- No CSS-in-JS or Tailwind.
- Design tokens reside in `:root` inside `tokens.css`.
- Every component folder has its own CSS file (e.g., `Button.css`). These are imported directly into the `.jsx` file. BEM naming prevents global collisions.

### 9.2 Git Workflow
- **Branching:** Use feature branches (`feature/add-hero-section`, `fix/navbar-mobile-bug`).
- **Commits:** Follow Conventional Commits format (`feat: added primary button`, `fix: corrected grid alignment on mobile`).
- **Merging:** PRs must be squash-merged to `main` to maintain a clean, linear history.
