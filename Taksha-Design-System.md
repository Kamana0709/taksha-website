# Taksha Design System PRD

**Version:** 1.0.0
**Project:** Taksha Official Website
**Role:** Senior Product Manager, UX Strategist, Creative Director, Senior Frontend Architect
**Target Audience:** Frontend Engineers, UI/UX Designers, Quality Assurance

---

## 1. Design Principles

Taksha represents craftsmanship, thoughtful design, and engineering excellence. Our design system is built on these core tenets:

1. **Precision & Craftsmanship:** Every pixel must have a purpose. Alignment, spacing, and typography must be deliberate. No fabricated content or placeholder design.
2. **Subtle Elevation:** Use micro-animations, layered shadows, and glassmorphism to create a premium, tangible feel.
3. **Clarity & Performance:** The UI must be highly readable and lightning-fast. Form follows function.
4. **Accessible by Default:** All components must meet strict accessibility standards without compromising aesthetics.
5. **Authenticity:** No fake aesthetics. Honest, clean, and transparent visual language.

---

## 2. Design Tokens

Design tokens are the atomic values of the Taksha design system, representing colors, typography, spacing, and sizing. These are maintained globally in `tokens.css` as CSS variables to allow seamless dark/light mode switching.

---

## 3. Color System

The color system is built around a sophisticated **Navy** and **Amber** palette to convey premium engineering and energetic creativity.

### Core Brand Colors
- **Navy (Primary Background/Brand):** `#0F172A` - Used for primary dark surfaces and strong brand presence.
- **Amber (Accent):** `#F59E0B` - Used for call-to-actions, highlights, and micro-interactions.

### Surface Colors
- **Light Theme Background:** `#FFFFFF` (pure white) & `#F8FAFC` (subtle gray)
- **Dark Theme Background:** `#020617` (deepest slate) & `#0F172A` (surface slate)

### Text Colors
- **Primary Text (Light Theme):** `#0F172A`
- **Secondary Text (Light Theme):** `#475569`
- **Primary Text (Dark Theme):** `#F8FAFC`
- **Secondary Text (Dark Theme):** `#94A3B8`

### Status Colors
- **Success:** `#10B981` (Emerald)
- **Error:** `#EF4444` (Red)
- **Warning:** `#F59E0B` (Amber)
- **Info:** `#3B82F6` (Blue)

---

## 4. Typography

We prioritize modern, highly legible sans-serif typography that scales beautifully. 

**Font Families:**
- **Primary/Heading:** `Outfit`, sans-serif (Clean, geometric, premium)
- **Body/System:** `Inter`, sans-serif (Highly legible at small sizes)
- **Monospace:** `JetBrains Mono` or `Fira Code` (For technical references)

**Type Scale (Mobile -> Desktop):**
- **Heading 1:** 2.5rem -> 4rem, Line Height: 1.1, Weight: 600
- **Heading 2:** 2rem -> 3rem, Line Height: 1.2, Weight: 600
- **Heading 3:** 1.5rem -> 2rem, Line Height: 1.2, Weight: 500
- **Heading 4:** 1.25rem -> 1.5rem, Line Height: 1.3, Weight: 500
- **Body Large:** 1.125rem, Line Height: 1.6, Weight: 400
- **Body Regular:** 1rem, Line Height: 1.6, Weight: 400
- **Small Text:** 0.875rem, Line Height: 1.5, Weight: 400

---

## 5. Grid System

A standard 12-column responsive grid system based on modern CSS Grid.

- **Desktop (1024px+):** 12 columns, 24px gutters, max-width: 1280px.
- **Tablet (768px - 1023px):** 8 columns, 16px gutters, fluid width.
- **Mobile (< 768px):** 4 columns, 16px gutters, fluid width.

---

## 6. Spacing Scale

A predictable 4px baseline spacing scale applied via CSS Custom Properties.

- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-12`: 48px
- `--space-16`: 64px
- `--space-24`: 96px
- `--space-32`: 128px

---

## 7. Icons

- **Primary Set:** Custom SVG vectors (stroke-based) for ultimate control and crispness.
- **Stroke Width:** 1.5px to 2px depending on context.
- **Rules:** Avoid filled icons unless representing a selected/active state. Use `<svg>` tags inline or properly cached sprites.

---

## 8. Shadows & Elevation

Used to create depth and establish a z-axis hierarchy.

- **Shadow-Sm:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)` (Cards, Inputs)
- **Shadow-Md:** `0 4px 6px -1px rgba(0, 0, 0, 0.1)` (Dropdowns)
- **Shadow-Lg:** `0 10px 15px -3px rgba(0, 0, 0, 0.1)` (Modals)
- **Shadow-Glow:** `0 0 20px rgba(245, 158, 11, 0.2)` (Amber glow for primary buttons)

---

## 9. Border Radius

- **Radius-Sm:** `4px` (Small inputs, tags)
- **Radius-Md:** `8px` (Buttons, form fields, cards)
- **Radius-Lg:** `16px` (Large media elements, modals)
- **Radius-Full:** `9999px` (Pills, circular avatars)

---

## 10. Components: Actions & Inputs

### Buttons
- **Variants:** Primary (Solid Amber), Secondary (Outline Navy/White), Ghost (Transparent with hover background).
- **Sizes:** Small (32px height), Medium (48px height), Large (56px height).
- **States:** Default, Hover (Scale 1.02 + shadow), Active (Scale 0.98), Disabled (Opacity 50%, unclickable).

### Forms & Inputs
- **Inputs:** Height 48px, 8px radius. 1px border (`#CBD5E1` light / `#334155` dark).
- **Focus State:** 2px solid Amber border, no default browser outline.
- **Labels:** Positioned above inputs, `0.875rem` font size, Medium weight.

### Dropdowns
- **Trigger:** Button or caret icon.
- **Menu:** Elevated (`Shadow-Md`), blurred background (`backdrop-filter: blur(8px)`), rounded corners (`8px`).
- **Items:** Hover state with subtle background tint.

---

## 11. Components: Data Display

### Cards
- **Usage:** Project showcases, service features.
- **Styling:** Subtle border, `Radius-Md` or `Radius-Lg`.
- **Interaction:** On hover, lift up (`transform: translateY(-4px)`) and increase shadow (`Shadow-Md`).

### Tables
- **Usage:** Data grids, comparative specs.
- **Styling:** Clean horizontal dividers (1px solid), no vertical borders. Zebra striping optional but usually avoided for premium feel.
- **Header:** Sticky, bold text, subtle background.

### Badges & Chips
- **Usage:** Status indicators, categories, tags.
- **Styling:** `Radius-Full`, small text, background tint based on color system (e.g., Green tint for success).

---

## 12. Components: Navigation

### Navigation (Navbar)
- **Desktop:** Sticky top, glassmorphism effect (`backdrop-filter`), logo left, links center, CTA right.
- **Mobile:** Small, concise dropdown menu with a full-screen invisible backdrop click-to-close functionality. Clean close animations using Framer Motion.

### Tabs
- **Usage:** Switching views without routing.
- **Styling:** Underline indicator for active state (Animated using Framer Motion `layoutId`).

### Accordions
- **Usage:** FAQs, dense information.
- **Styling:** Clean border-bottom per item. Plus/Minus or Chevron icons that rotate 180deg on open. Smooth height transition.

---

## 13. Components: Feedback

### Modals
- **Backdrop:** `rgba(15, 23, 42, 0.8)` with `backdrop-filter: blur(4px)`.
- **Container:** Centered, `Radius-Lg`, max-width applied.
- **Animation:** Fade in + slight scale up (0.95 -> 1).

### Toasts
- **Usage:** Non-blocking success/error notifications.
- **Position:** Bottom-Right or Top-Center.
- **Animation:** Slide in and fade out after 3-5 seconds.

---

## 14. UI States

- **Empty States:** Beautiful, simple SVG illustration with a clear message and a primary CTA to resolve the emptiness.
- **Loading States:** Avoid full-page spinners. Use Skeleton Screens where structure is known.
- **Skeleton Screens:** Pulse animation (`opacity 0.5 to 1`), colored slightly darker than background.
- **Error States:** Clear, descriptive error messages. Red (`#EF4444`) accents, input borders turn red, inline error text below input.
- **Success States:** Green (`#10B981`) icons, toast notifications.

---

## 15. Responsive Rules

- **Mobile First:** CSS must be written mobile-first (`min-width` media queries).
- **Touch Targets:** Minimum 48x48px for all clickable elements on touch devices.
- **Fluid Typography:** Use `clamp()` for responsive font sizes to reduce media query complexity.

---

## 16. Motion Tokens

Animations should feel snappy, physics-based, and non-blocking. (Powered by GSAP & Framer Motion)
- **Duration Fast:** `150ms` (Color changes, hover states)
- **Duration Normal:** `300ms` (Modals, accordions, page transitions)
- **Duration Slow:** `500ms` (Complex staggers, hero reveals)
- **Easing (Spring):** `type: "spring", stiffness: 300, damping: 30` (Natural, physical feel)
- **Easing (Ease-out):** `cubic-bezier(0.16, 1, 0.3, 1)` (UI elements entering screen)

---

## 17. Accessibility & WCAG Compliance

- **Contrast:** All text must meet WCAG AA (4.5:1) contrast ratio.
- **Keyboard Navigation:** Every interactive element must be reachable via `Tab`. `:focus-visible` styles are mandatory.
- **Screen Readers:** Appropriate `aria-labels`, `aria-hidden` on decorative SVGs, and semantic HTML (`<nav>`, `<main>`, `<article>`).
- **Reduced Motion:** Respect `prefers-reduced-motion: reduce` by disabling heavy GSAP/Framer animations for users who request it.

---

## 18. CSS Architecture

- **Methodology:** BEM (Block Element Modifier) strictly enforced for vanilla CSS (e.g., `.button`, `.button__icon`, `.button--primary`).
- **Global Tokens:** Variables defined in `tokens.css` under `:root` and `[data-theme="dark"]`.
- **Scoping:** CSS modules or strictly scoped BEM class names per component file (e.g., `Navbar.css` only contains `.navbar` blocks).
- **No Tailwind:** Tailwind is avoided per brand guidelines; highly crafted vanilla CSS is required.

---

## 19. Component Naming Convention

- **Files:** PascalCase (e.g., `PrimaryButton.jsx`, `PrimaryButton.css`).
- **Classes:** BEM lowercase with hyphens (e.g., `.primary-button__label`).
- **Props:** camelCase (e.g., `isLoading`, `onClick`).

---

## 20. Folder Structure

```
src/
├── components/
│   ├── ui/               # Generic UI atoms/molecules (Button, Card, Input)
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.css
│   │   └── Card/
│   ├── Navbar/           # Specific complex organisms
│   └── Footer/
├── styles/
│   ├── reset.css         # Baseline reset
│   ├── tokens.css        # Design tokens & color system
│   └── global.css        # Global layout & utility classes
├── hooks/
│   └── useTheme.js       # Theme management
└── utils/
    └── cn.js             # Classname concatenation utility
```

---

*This document serves as the absolute source of truth for all UI design and frontend implementation at Taksha.*
