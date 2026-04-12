# Implementation Plan: Comprehensive Testing Suite

**Branch**: `031-comprehensive-testing` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Comprehensive E2E testing with Playwright, cross-browser, and performance benchmarks.

## Summary

The goal is to implement a production-grade E2E testing suite using **Playwright** that serves as the final quality gate for the Mojaz platform. The suite will automate the verification of all 8 core services across a matrix of 4 browsers, 2 locales (AR/EN), 2 themes (Dark/Light), and multiple viewports (Mobile/Desktop). 

Approaches:
1. **Matrix Testing**: Using Playwright Projects to run the same tests in different configurations.
2. **Visual Regression**: Baseline-driven snapshot testing with `toHaveScreenshot()`.
3. **Performance Hooks**: Manual timing capturing via `request().timing()` to assert on SLA targets.

## Technical Context

**Language/Version**: TypeScript (Frontend), C# (Backend)  
**Primary Dependencies**: Playwright 1.51+, next-intl, next-themes  
**Storage**: Mocked/Seeded SQL Server for consistent test states  
**Testing**: Playwright (E2E), Jest/RTL (Component), xUnit (Integration)  
**Target Platform**: Desktop (Chrome/FF/Safari/Edge), Mobile Responsive  
**Performance Goals**: API Latency < 2s, Page Load (FCP) < 3s  
**Constraints**: 500+ test assertions, strict RTL/LTR compliance  
**Scale/Scope**: 10 workflow stages, 8 services, 7 roles  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle VI (Test Discipline)**: DIRECTLY ADDRESSED. Establishes the 80%+ logic coverage and E2E requirements.
- **Principle IV (i18n)**: VERIFIED via automated RTL/LTR checks and screenshot comparison.
- **Principle II (Security)**: VERIFIED via RBAC cross-login tests ensuring Applicants cannot access Employee portals.
- **Principle III (Config over Hardcoding)**: SystemSettings like `MIN_AGE` will be verified to trigger correct UI validation errors.

## Project Structure

### Documentation (this feature)

```text
specs/031-comprehensive-testing/
├── plan.md              # This file
├── research.md          # Research findings (Visual Reg, Perf, Parallelism)
├── data-model.md        # Test user mapping and session state
├── quickstart.md        # Guide for running tests locally/CI
├── contracts/           
│   └── ui-selectors.md  # Standardized data-testid attributes
└── tasks.md             # Implementation tasks (Next step)
```

### Source Code (repository root)

```text
frontend/
├── playwright.config.ts # Global test configuration
├── playwright/          # E2E test scripts
│   ├── e2e/             # Functional journeys
│   │   ├── applicant/
│   │   ├── employee/
│   │   └── admin/
│   ├── visual/          # Visual regression snapshots
│   └── perf/            # Performance benchmarking
└── src/
    └── components/      # Updating with data-testid where missing

tests/                   # Backend verification
└── Mojaz.E2E.Tests/     # C# side of automated verification (if needed)
```

**Structure Decision**: Adopting the standard Playwright directory structure within the `frontend/` directory to keep frontend E2E tests close to the UI code they verify.

## Phase 2: Implementation Steps

### Step 1: Base Configuration
- [ ] Initialize `playwright.config.ts` with multi-project matrix (Chrome, Edge, Firefox, WebKit).
- [ ] Configure global setup/teardown for database state seeding.
- [ ] Set up visual regression thresholds and baseline storage.

### Step 2: Core Service Journeys (Applicants)
- [ ] Implement Comprehensive "New License Issuance" flow (10 stages).
- [ ] Implement Renewal, Replacement, Upgrade, and Cancellation flows.
- [ ] Implement Appointment booking and payment simulation tests.

### Step 3: Employee Portals & RBAC
- [ ] Implement login journeys for all 7 roles.
- [ ] Verify Dashboard widgets and application lists for Employees.
- [ ] Verify restricted access (e.g., Doctor trying to view Payment settings).

### Step 4: Visual & Responsive Verification
- [ ] Create visual tests for Landing Page, Dashboards, and Forms.
- [ ] Run tests on Mobile (iPhone 14) and Tablet viewports.
- [ ] Verify RTL/LTR layout transitions for the Navigation Sidebar and Header.

### Step 5: Performance Benchmarking
- [ ] Add performance assertions to all API-response events.
- [ ] Integrate Lighthouse or PageLoad trace reporting.
- [ ] Final audit to ensure 500+ assertions are met and passing.

## Verification Plan

### Automated Tests
- `npx playwright test --project=chromium` (Functional)
- `npx playwright test --project=visual` (Screenshots)
- `npx playwright test --project=performance` (Benchmarks)

### Manual Verification
- Reviewing Playwright HTML reports for failures.
- Checking Visual Diffs in `playwright-report` to confirm styling accuracy.
