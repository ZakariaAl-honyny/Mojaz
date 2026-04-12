# Quickstart: Professional Government Landing Page

Since this is exclusively a frontend UI feature, to run and verify the landing page:

## Prerequisites
1. Node.js (v18+)
2. pnpm, yarn, or npm installed
3. The Mojaz frontend application configuration (`next-intl` setup) is intact.

## Running the Application
Navigate to the frontend directory:
```bash
cd src/frontend
```

Install dependencies if you haven't already:
```bash
npm install
```

Run the Next.js development server:
```bash
npm run dev
```

## Verification

1. **View the Layout**: Open your browser to `http://localhost:3000/en` to view the English LTR layout.
2. **View Localization/RTL**: Open `http://localhost:3000/ar` to view the Arabic RTL layout. Verify that all components, including the workflow timeline and grid layouts, cleanly match the Royal Green visual design system constraints.
3. **Animations**: Scroll down manually to trigger Framer Motion staggered reveals in the "Services" and "Workflow" sections.
4. **Performance Check**: Run Lighthouse in Incognito mode against the local production build (`npm run build && npm run start`). Verify a score of 90+ across all metrics with 0.0 CLS.
