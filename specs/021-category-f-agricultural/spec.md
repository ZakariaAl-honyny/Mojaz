# Feature Specification: 021-category-f-agricultural

**Feature Branch**: `021-category-f-agricultural`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "Complete Category F support with specialized settings, UI, and upgrade paths. Use skills for UI like frontend-design and vercel-react-best-practices"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Apply for an Agricultural License (Category F) (Priority: P1)

As a farmer or agricultural worker, I want to apply for a Category F license through a tailored interface so that I can legally operate agricultural equipment.

**Why this priority**: Opening the core workflow for this category is necessary to issue any Category F license, representing the primary business value.

**Independent Test**: Can be tested by starting a new application and successfully selecting Category F, verifying that the appropriate terminology ("Field Test") and icons are presented.

**Acceptance Scenarios**:

1. **Given** a new application is started, **When** the user reaches the license category selection step, **Then** "Category F (Agricultural)" is available as an option with a distinct, high-quality tractor/agricultural icon.
2. **Given** the user selects Category F, **When** they proceed to the requirements overview, **Then** the system displays the F-specific rules (Min Age: 18, Validity: 10 years, Training: 20 hours).

---

### User Story 2 - Automated Enforcement of Category F Regulations (Priority: P1)

As a system administrator, I want the platform to automatically enforce Category F age, training, and testing limits, so that no ineligible applicants proceed.

**Why this priority**: Compliance with strict traffic regulations (e.g., minimum 18 years of age) is critical to the government platform's integrity.

**Independent Test**: Can be tested by attempting to apply as an applicant under 18 years old and verifying the system elegantly blocks the progression.

**Acceptance Scenarios**:

1. **Given** an applicant is 17 years old, **When** they attempt to select Category F, **Then** the selection is disabled or prevents progression with a clear, accessible warning.
2. **Given** a Category F applicant reaches the theory test stage, **When** they are assigned a test, **Then** exactly 20 questions are mandated.

---

### User Story 3 - Upgrade Category F to Private (Category B) (Priority: P2)

As a driver holding a valid Category F license, I want to apply for a Category B (Private Car) license so that I can upgrade my driving privileges without repeating redundant steps.

**Why this priority**: Provides the only valid upgrade path allowed for Category F holders per the PRD, enhancing user convenience.

**Independent Test**: Can be fully tested using an applicant with an active F license applying for a B license and seeing the streamlined upgrade path.

**Acceptance Scenarios**:

1. **Given** a user has an active Category F license, **When** they initiate a Category Upgrade, **Then** "Category B (Private)" is offered as an upgrade option.

### Edge Cases

- What happens when a user with Category F attempts to upgrade to a commercial category (C, D, E)? (System must restrict this per the upgrade paths).
- How does the system handle an applicant applying for Category F whose occupation is not related to agriculture? (The system may present distinct document upload fields like proof of farm employment/ownership, as an optional or conditionally mandatory requirement).
- Given the focus on frontend performance, how does the UI handle switching rapidly between Categories A, B, and F that drastically change the training hour prerequisites displayed? (Must update instantly via efficient state management).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST configure Category F with specific settings: `MinAge=18`, `TrainingHours=20`, `TheoryQuestions=20`, `ValidityYears=10`, `PracticalDuration=30 min`, `MedicalFrequency=Every 10 years`.
- **FR-002**: System MUST render specialized UI elements for Category F applications, utilizing high-quality unique iconography (e.g., agricultural tractors) and tailored terminology (e.g., "Field Test" instead of "Road Test").
- **FR-003**: System MUST enforce the F → B upgrade path, ensuring Category F holders can upgrade to Category B, but blocking upgrades to C, D, or E.
- **FR-004**: System MUST allow configuring specific document requirements for Category F (like farm employment proof) during Stage 02 (Document Review).
- **FR-005**: All UI components for Category F selections MUST adhere to premium design aesthetics, employing efficient re-renders and smooth layout transitions without layout shift.
- **FR-006**: Frontend presentation for F-category dynamic rules MUST be optimized to eliminate layout flickering and ensure perceived instant interaction without data waterfalls.

### Key Entities 

- **LicenseCategory**: Requires new seed data for F category with specific minimum age and validity.
- **Application**: Tracks the lifecycle, correctly mapping to F-specific training hours and test lengths.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of Category F issuances enforce the exactly 20-hour training and 20-question theory limits, verifiable in final approval check.
- **SC-002**: UI efficiently handles F-specific dynamic data, achieving a First Input Delay (FID) and Cumulative Layout Shift (CLS) of near 0.
- **SC-003**: Users upgrading from F to B complete the application process 30% faster than new B applicants.
- **SC-004**: Feedback on the F-category interface yields strong positive ratings for visual distinction and high-quality aesthetic design from user testing.

## Assumptions

- Terminology changes ("Field Test") will be handled via localization JSON files, not hardcoded.
- Design specifications for Category F icons will be provided or generated consistently with the "Royal Green" Mojaz design system.
- Strict performance constraints are enforced in the UI components created for this feature (e.g., avoiding heavy imports for icons, using efficient conditional rendering without layouts shifting).
