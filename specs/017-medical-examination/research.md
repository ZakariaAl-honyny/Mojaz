# Research Document: Medical Examination System

## Vercel React Best Practices Data Fetching
- **Decision:** Utilize React Server Components for displaying the medical examination status on the Applicant Portal, eliminating client-side waterfalls. For the Doctor's submission side, utilize `useTransition` coupled with Tanstack Query optimistic updates.
- **Rationale:** Minimizes perceived latency, preventing user friction when the doctor inputs multiple applicant results consecutively. Matches the strict Vercel requirements for `async-suspense-boundaries` and `rerender-transitions`.
- **Alternatives considered:** Traditional client-side `onSubmit` blocking with a loading spinner (Rejected due to waterfall and blocky UI, not utilizing Next.js advanced paradigms).

## Premium Interface Implementation
- **Decision:** Use high contrast Tailwind classes driven by `hsl()` tokens configured in `globals.css` ensuring Royal Green aesthetics are prevalent but not overwhelming. Forms will eschew standard borders in favor of soft shadows and structural spacing.
- **Rationale:** Translates the `/frontend-design` requirements of "distinctive aesthetics" and "avoiding AI slop" into actionable CSS utilities.
- **Alternatives considered:** Default shadcn/ui components with primary color modifications (Rejected due to looking too cookie-cutter, lacking deep domain immersion).
