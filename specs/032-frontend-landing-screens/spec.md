# Feature Specification: Public Landing Page & Frontend Screens

**Feature Branch**: `032-frontend-landing-screens`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "Public landing page for and everything about all frontend at PRD sections 18, 19, 20"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public Information & Navigation (Priority: P1)

As a visitor (citizen or resident), I want to view a professional landing page that explains the Mojaz platform services, how it works, and license categories so that I can decide to use the platform.

**Why this priority**: First impression of the government system. Critical for user onboarding and accessibility.

**Independent Test**: Can be tested by navigating to the root URL and verifying all 9 sections are present and functional (tabs, accordions, language switch).

**Acceptance Scenarios**:

1. **Given** I am on the landing page, **When** I click the language switch, **Then** the entire layout flips (RTL for Arabic, LTR for English) and all text translates instantly.
2. **Given** I am on the landing page, **When** I click "Start Your Application Now", **Then** I am redirected to the registration page.
3. **Given** I am browsing the "Available Services" section, **When** I view the service cards, **Then** I see 8 core services with relevant icons and descriptions.

---

### User Story 2 - Authenticated Access (Priority: P1)

As an applicant, I want to register or log in using my email or phone number with OTP verification so that I can securely access my private dashboard.

**Why this priority**: Required for any personalized service or application submission.

**Independent Test**: Can be tested by completing a registration flow (with mock/real OTP) and landing on the personal dashboard.

**Acceptance Scenarios**:

1. **Given** I am on the login page, **When** I select "Phone Number" tab, **Then** the input field changes to support phone format and triggers SMS OTP flow.
2. **Given** I have entered my credentials, **When** I provide a valid OTP, **Then** I am successfully logged in and see my applicant dashboard.

---

### User Story 3 - New License Application Flow (Priority: P1)

As an applicant, I want to use a multi-step wizard to submit a new license issuance application so that I can easily navigate the complex 10-stage process.

**Why this priority**: Core business value of the platform.

**Independent Test**: Can be tested by completing the wizard steps (Service -> Category -> Personal Info -> Details -> Review) and verifying the application status is "Submitted".

**Acceptance Scenarios**:

1. **Given** I am in the New Application Wizard, **When** I complete a step and click "Next", **Then** my progress is saved and I see the next relevant section.
2. **Given** I am finishing the application, **When** I confirm data accuracy and submit, **Then** I see a success confirmation and a new application appears in my timeline.

---

### User Story 4 - Multi-Role Dashboard & Permissions (Priority: P2)

As an employee (Receptionist, Doctor, or Examiner), I want to see a dashboard tailored to my role so that I can perform my specific duty (verify docs, record medical result, or record test result).

**Why this priority**: Enables operational workflow across different government entities.

**Independent Test**: Can be tested by logging in with different role credentials and verifying only relevant screens and actions (from Permission Matrix) are available.

**Acceptance Scenarios**:

1. **Given** I am logged in as a "Doctor", **When** I view the application list, **Then** I only see applications referred for medical examination.
2. **Given** I am logged in as a "Receptionist", **When** I view a "Submitted" application, **Then** I have the action button to "Verify Documents" but NO action to "Record Medical Result".

---

### Edge Cases

- **Language Persistence**: If a user switches to English on the landing page and then logs in, the dashboard must also be in English.
- **Session Timeout**: User should be redirected to login with a friendly message if the session expires while in the middle of a multi-step wizard.
- **Unverified Profile**: If an applicant tries to start a service before verifying their email/phone, they must be redirected to the verification screen.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Landing Page MUST implement 9 specific sections: Header, Hero, Services, Timeline Steps, Categories, Features, Stats, FAQ (Accordion), and Footer.
- **FR-002**: Layout MUST support absolute Bi-Directional (BiDi) transitions (RTL for Arabic, LTR for English) using CSS logical properties.
- **FR-003**: System MUST provide Two Separate Portals: Applicant Portal (9 screens) and Employee/Admin Portal (7+4 screens).
- **FR-004**: New Application Wizard MUST be a 5-step form (Wizard) mapping to the first stage of the 10-stage backend workflow.
- **FR-005**: Application Tracking MUST use a Timeline UI component to show the state across the 10 stages.
- **FR-006**: Document Upload MUST support multiple file types (PDF, Image) and show upload progress.
- **FR-007**: Role-Based Authorization MUST hide/show UI elements based on the Permission Matrix in PRD Section 20.
- **FR-008**: System MUST support Dark/Light modes with a seamless toggle in the header.

### Key Entities

- **User Profile**: Represents the authenticated visitor, includes role, preferred language, and verification status.
- **Application**: The core entity being tracked through UI screens (wizard, timeline, details).
- **Service/Category**: Metadata used to populate cards, dropdowns, and informational sections.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: First Contentful Paint (FCP) on landing page is under 1.2 seconds.
- **SC-002**: 100% of text strings are translated and accessible in both Arabic and English.
- **SC-003**: Zero layout breaks when switching from RTL to LTR on any of the 21 pages.
- **SC-004**: Application Wizard completion rate (Form start to Submit) is above 70% in first-run testing.

## Assumptions

- **Mock OTP**: Registration flow will use a mock OTP for initial frontend development until the backend SMS/Email services are fully connected.
- **Shared UI Library**: All components will use the `shadcn/ui` base customized with the `#006C35` Royal Green theme.
- **API Availability**: Frontend components assume corresponding API endpoints (v1) are available or can be easily mocked.
- **Manual Verification**: Some verification steps (e.g. Identity check) are assumed to be "manual approval" by a Receptionist role in the UI.
