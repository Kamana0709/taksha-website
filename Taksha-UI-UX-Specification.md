# Taksha UI/UX Specification

**Version:** 1.0.0
**Brand:** Taksha
**Objective:** Define the complete UI/UX paradigm for the Taksha digital presence.

---

## 1. User Flows & Navigation

### 1.1 Primary User Flows
1. **The Discovery Flow:** Homepage -> Services -> Service Detail -> Contact (Goal: Lead Generation)
2. **The Validation Flow:** Homepage -> Work -> Project Case Study -> Contact (Goal: Trust Building)
3. **The Educational Flow:** Journal -> Article -> Service Link -> Contact (Goal: Authority & Lead Generation)

### 1.2 Navigation Paradigm
- **Desktop (1024px+):** Fixed, sticky glassmorphic top navigation bar. Left-aligned logo, center-aligned primary links (`Work`, `Services`, `Studio`, `Journal`), right-aligned primary CTA (`Let's Talk`).
- **Mobile (<1024px):** Hamburger menu triggering a full-screen, blurred overlay. Menu items are large, vertically stacked, and animated in via a staggered fade-up. The backdrop must be clickable to close the menu.

---

## 2. Wireframes & Page Layouts

### 2.1 General Layout Rules
- **Hero Sections:** Full viewport height (`100vh`) for the homepage, `70vh` for internal pages. Content vertically and horizontally centered or locked to a strict 12-column grid.
- **Content Sections:** Defined by alternating background subtle shifts (e.g., `#0F172A` to `#020617`) to establish visual rhythm.

### 2.2 Wireframe Archetypes
- **Homepage:** Hero Video/Graphic -> 3-Pillar Service Grid -> Featured Work Carousel -> Social Proof/Manifesto -> Massive Footer CTA.
- **Case Study:** Hero Image (Full Bleed) -> Project Metadata Grid (Client, Role, Year) -> Context Text -> Image Grid -> Technical Deep Dive -> Next Project Link.
- **Service Page:** Hero Text -> Problem/Solution -> Taksha Methodology -> Related Case Studies -> CTA.

---

## 3. Responsive Behaviour & Grid System

### 3.1 The Grid System
- **Desktop (1024px+):** 12 columns, `24px` gutters, maximum container width of `1280px`.
- **Tablet (768px - 1023px):** 8 columns, `16px` gutters. Fluid container width.
- **Mobile (< 768px):** 4 columns, `16px` gutters. Fluid container width with `16px` outer padding.

### 3.2 Responsive Rules
- **Typography:** Uses `clamp()` functions to fluidly scale from mobile to desktop sizes without relying on breakpoints.
- **Stacking:** Multi-column layouts (e.g., a 3-column service grid) collapse to a 2-column grid on tablets, and a 1-column stack on mobile.
- **Touch Targets:** All interactive elements must have a minimum `48x48px` hit area on touch devices.

---

## 4. Design Tokens & Component Library

### 4.1 Design Tokens
- **Colors:** Navy (`#0F172A`), Amber (`#F59E0B`), Obsidian (`#020617`), Slate (`#475569`), White (`#FFFFFF`).
- **Typography:** Primary `Outfit`, Secondary `Inter`. Base size `16px` (`1rem`).
- **Spacing Scale (Base 4px):** `--space-1` (4px) to `--space-32` (128px).
- **Border Radius:** `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (16px), `--radius-full` (9999px).

### 4.2 Core Component Library
- **Buttons:** 
  - *Primary:* Solid Amber background, Navy text.
  - *Secondary:* Transparent background, 1px solid Navy/White border.
  - *Ghost:* No border, subtle background on hover.
- **Cards:** Used for Project showcases. Subtle `1px` border, `--radius-md`, with an inner padding of `--space-6`.
- **Inputs:** Minimalist underlines or full-bordered rectangles (`--radius-md`). Active state turns border Amber.

---

## 5. Motion Design & Micro Interactions

### 5.1 Motion Principles
- **Physics-Based:** Animations use spring physics (mass, stiffness, damping) rather than linear easing for a natural, tactile feel.
- **Purposeful:** Motion directs the eye. Only animate elements that require attention or provide feedback.

### 5.2 Micro Interactions
- **Hover States:** Buttons scale up slightly (`1.02`), shadows increase. Text links feature an animated underline that draws in from left to right.
- **Click/Tap:** Buttons scale down (`0.98`) immediately upon `mousedown` or `touchstart` to provide instant tactile feedback.
- **Form Focus:** Input borders transition to Amber smoothly over `150ms`. A subtle glow (`box-shadow`) may apply.

### 5.3 Page-Level Animations
- **Initial Load:** Staggered fade-ups. Hero text fades in while translating slightly upward.
- **Scroll Triggers (GSAP):** Elements reveal themselves as they enter the viewport. Images utilize a subtle parallax effect (moving slower than the scroll speed).

---

## 6. System States

### 6.1 Loading States
- **Avoid Full-Page Spinners.** Use skeleton screens for content blocks (e.g., project grids). Skeletons should pulse gently (`opacity: 0.5` to `1`) using a color slightly lighter than the background.
- **Initial Route Load:** Use a subtle, branded loading overlay (e.g., the Taksha "T" mark) that fades out seamlessly via Framer Motion when the route is ready.

### 6.2 Empty States
- If a dynamic list (like a blog category or project filter) yields zero results, display a cleanly formatted Empty State component:
  - Icon: Custom stroke SVG indicating emptiness (e.g., an open box or a search magnifying glass with a slash).
  - Headline: "No results found."
  - Body text: "Try adjusting your filters or search terms."
  - CTA: "Clear Filters" (Primary button).

---

## 7. Accessibility (A11y)

### 7.1 Visual Accessibility
- **Contrast:** Ensure all text passes WCAG AA guidelines (4.5:1 ratio). Amber text on Navy backgrounds must be checked rigorously.
- **Focus Rings:** Native browser focus rings (`outline`) must be customized but never hidden without a clear fallback (e.g., `2px solid #F59E0B`).

### 7.2 Semantic & Structural Accessibility
- **ARIA Attributes:** Use `aria-expanded` on accordions and dropdowns, `aria-hidden="true"` on decorative SVGs.
- **Keyboard Navigation:** The entire site must be fully navigable using the `Tab` and `Enter` keys.
- **Reduced Motion:** Wrap all complex GSAP and Framer Motion animations in a `prefers-reduced-motion` media query hook to disable them for users with vestibular disorders.
