# MOJAZ SYSTEM - STRICT UI/UX DESIGN GUIDELINES (V3)

## 1. BRAND IDENTITY & COLOR PALETTE (KING BLUE)
- **Vibe:** Governmental, Official, Formal, Trustworthy, Clean.
- **Primary Brand Color:** **King Blue**. This is the absolute primary color for the system (Sidebars, Hero Banners, Primary Buttons). 
  - *Constraint:* DO NOT use dull Navy or Dark Slate (`bg-slate-900`) for primary brand elements. Use a vibrant, official King Blue (e.g., `#2B4C7E`, `#1E3A8A`, or the exact hex extracted from `public/logo.png`).
- **Background:** Light Gray (`bg-slate-50`) for the general app background.
- **Surfaces/Cards:** Pure White (`bg-white`) with subtle borders (`border-slate-200`) and very light shadows (`shadow-sm`).
- **Text:** `text-slate-900` for main headings, `text-slate-500` for subtitles and descriptions.

## 2. LANGUAGE & DIRECTION (100% ARABIC)
- **Primary Language:** Arabic ONLY. No English placeholders or i18n toggles.
- **Direction:** RTL (Right-to-Left) ONLY. 
- **Enforcement:** The root layout MUST have `dir="rtl"`. All flexbox and grid layouts must naturally flow RTL without forced or hacky overrides.

## 3. THEME & MODE (100% LIGHT MODE)
- **Mode:** Light Mode ONLY.
- **Banned Classes:** Any Tailwind class starting with `dark:` (e.g., `dark:bg-black`) is STRICTLY FORBIDDEN. Agents must actively strip these if found.

## 4. LAYOUT & RESPONSIVENESS (MOBILE-FIRST)
- **Mobile-First:** Always design for mobile screens first. Use constraints like `max-w-md mx-auto` for forms and cards on mobile viewports.
- **Scale Up Gracefully:** Use Tailwind breakpoints (`md:`, `lg:`) to adjust widths and padding for desktop.
- **Zero Overflow:** The screen must never scroll horizontally. Ensure large tables or grids are wrapped in responsive overflow containers.

## 5. TYPOGRAPHY & SPACING
- **Scale:** Use moderate, professional text sizes (e.g., `text-sm`, `text-base`, max `text-3xl` for standard headers).
- **Strictly Banned:** Playful designs, massive borders (`rounded-full` on large containers), oversized typography (`text-7xl` or higher), and overlapping unconstrained elements.
- **Corners:** Use formal, institutional border radii (`rounded-md` or `rounded-lg`).