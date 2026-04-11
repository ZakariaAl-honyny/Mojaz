# Research: Comprehensive Testing Suite

## Decision: Playwright E2E Strategy

### Rationale:
Playwright is the industry standard for modern web apps, especially those built with Next.js (recommended by Vercel). It supports all major browsers out of the box and has built-in support for visual regression and network interception.

### Best Practices:
- **Visual Regression**: Baseline screenshots should be generated in the CI environment (GitHub Actions) to avoid OS-level rendering discrepancies (Windows vs. Linux).
- **Masking**: Use `{ mask: [page.locator('.timestamp')] }` for dynamic data.
- **Animations**: Disable CSS animations during tests to ensure consistent snapshots.
- **Isolation**: Each test project in Playwright will represent a specific browser + locale + theme combination (e.g., `chromium-ar-dark`).

---

## Decision: Performance Monitoring

### Rationale:
While Playwright is not a dedicated load tester, it can capture "Front-end Performance" and "API Latency" during E2E journeys.

### Implementation:
- Use `response.request().timing()` to capture millisecond timings for all API calls.
- Use `performance.mark` and `performance.measure` inside `page.evaluate` for FCP/LCP measurements.
- Assert using `expect.soft()` to track performance regressions without blocking functional CI.

---

## Decision: Internationalization & Theme Toggling

### RTL/LTR:
- Toggle via URL locale prefixes: `/[locale]/dashboard`.
- Verify using `dir="rtl"` attribute checks on the `<html>` tag.

### Dark/Light Mode:
- Programmatic toggle via `localStorage.setItem('theme', 'dark')` or direct DOM manipulation of the `html` class.

---

## Unresolved Items (NEEDS CLARIFICATION):
- None. I have enough information to proceed with the design.
