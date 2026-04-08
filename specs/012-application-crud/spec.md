# Feature Specification: Application Creation, Management, and Status Tracking

**Feature Branch**: `012-application-crud`  
**Created**: 2026-04-08  
**Status**: Ready for Planning  
**Input**: Complete backend for application lifecycle: create, read, update, submit, cancel, and status tracking with Gate 1 pre-creation validation.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Applicant Creates a Draft Application (Priority: P1)

As an Applicant, I need to start a new driving license application, choose a license category, and save it as a draft so that I can complete it at my own pace without losing progress.

**Why this priority**: Application creation is the entry point to the entire platform workflow. Without it, no downstream stage (medical exam, tests, payment) can begin.

**Independent Test**: Can be fully tested by an authenticated Applicant calling the Create endpoint — the system generates a unique application number in `MOJ-{YEAR}-{8 digits}` format, passes Gate 1 validation, and stores a `Draft` record. All Gate 1 rejection cases (underage, existing active application, security block, missing profile) are independently verifiable.

**Acceptance Scenarios**:

1. **Given** a valid Applicant profile with age ≥ minimum for the requested category and no existing active application, **When** they POST to `/api/v1/applications`, **Then** a new application is created in `Draft` status with a unique `MOJ-{YEAR}-{8 digits}` number and an `ExpiresAt` calculated from `APPLICATION_VALIDITY_MONTHS`.
2. **Given** an Applicant who is under the minimum age for the requested category, **When** they attempt to create an application, **Then** the system blocks creation with a clear eligibility error (Gate 1 failure).
3. **Given** an Applicant who already has an active application in any non-terminal status, **When** they attempt to create another application, **Then** the system rejects the request (Gate 1 — one active application rule).
4. **Given** an Applicant with a security or judicial block on record, **When** they attempt to create an application, **Then** the system blocks creation and returns an appropriate error (Gate 1 failure).

---

### User Story 2 — Applicant Updates a Draft and Submits (Priority: P1)

As an Applicant, I need to update my draft application with all required fields and submit it so that it enters the formal review workflow.

**Why this priority**: The transition from Draft to Submitted is the critical moment that drives the entire downstream workflow and triggers the first set of notifications and audit events.

**Independent Test**: Can be fully tested by updating a draft (partial data accepted), then submitting (all required fields enforced by FluentValidation). The timeline endpoint should reflect the `Submitted` transition event.

**Acceptance Scenarios**:

1. **Given** an application in `Draft` status owned by the current Applicant, **When** they PUT `/api/v1/applications/{id}/draft` with partial data, **Then** the draft is updated and remains in `Draft` status.
2. **Given** a draft with all mandatory fields populated, **When** the Applicant PATCH `/api/v1/applications/{id}/submit`, **Then** the status transitions to `Submitted`, a notification is fired (In-App + Push + Email), and an AuditLog entry is recorded.
3. **Given** a draft with one or more required fields missing, **When** the Applicant attempts to submit, **Then** the system returns a validation error listing all missing fields and the application remains in `Draft`.
4. **Given** an application the Applicant does not own, **When** they attempt to update it, **Then** the system returns a 403 Forbidden error.

---

### User Story 3 — Employee Views Applications Scoped to Their Role (Priority: P1)

As an Employee (Receptionist, Doctor, Examiner, Manager, or Admin), I need to view applications that are relevant to my role and stage of the workflow so that I can process only those assigned to me.

**Why this priority**: Role-scoped data access is a core security and operational requirement. Without it, employees would see all applications regardless of relevance or authorization.

**Independent Test**: Can be tested by authenticating as each of the 5 employee roles and calling `GET /api/v1/applications` — each role should receive only their permitted subset with correct pagination, filtering, and sorting applied.

**Acceptance Scenarios**:

1. **Given** a Receptionist is authenticated, **When** they GET `/api/v1/applications`, **Then** they see all applications in the `DocumentReview` stage.
2. **Given** a Doctor is authenticated, **When** they GET `/api/v1/applications`, **Then** they see only applications in the `MedicalExam` stage.
3. **Given** a Manager is authenticated, **When** they GET `/api/v1/applications`, **Then** they see all applications across all stages.
4. **Given** any role applies `?status=Submitted&category=B&sortBy=createdAt&sortDir=desc&page=1&pageSize=20`, **Then** the response returns a properly paginated `PagedResult<ApplicationDto>` wrapped in `ApiResponse`.

---

### User Story 4 — Applicant Cancels an Application (Priority: P2)

As an Applicant, I need to cancel my application before it reaches a terminal stage so that I can stop the process if my circumstances change.

**Why this priority**: Cancellation is a self-service capability that prevents stale applications from clogging the workflow and allows applicants to restart if needed.

**Independent Test**: Can be tested by an authenticated Applicant calling PATCH `/api/v1/applications/{id}/cancel` with a reason — the application moves to `Cancelled`, the reason is stored, the timeline reflects it, and a notification fires.

**Acceptance Scenarios**:

1. **Given** an active application owned by the current Applicant, **When** they PATCH `/api/v1/applications/{id}/cancel` with a `cancellationReason`, **Then** the status becomes `Cancelled`, `CancelledAt` and `CancellationReason` are persisted, and an In-App + Push notification is sent.
2. **Given** an application already in a terminal status (`Cancelled`, `Expired`, or `Issued`), **When** they attempt to cancel it, **Then** the system returns a business logic error — terminal states cannot be cancelled.
3. **Given** a Manager or authorized Employee attempts to cancel any application, **When** they PATCH cancel with a reason, **Then** the cancellation succeeds and is logged in AuditLogs.

---

### User Story 5 — Application Timeline Tracking (Priority: P2)

As any authorized user, I need to view the full status history of an application so that I can understand every transition it has gone through and who performed each action.

**Why this priority**: The timeline is a core transparency feature for both applicants (to track their case) and employees (to audit decisions).

**Independent Test**: Can be tested immediately after any status transition — GET `/api/v1/applications/{id}/timeline` should return all recorded `ApplicationStatusHistory` entries in chronological order.

**Acceptance Scenarios**:

1. **Given** an application has undergone multiple status transitions (Draft → Submitted → DocumentReview → MedicalExam), **When** GET `/api/v1/applications/{id}/timeline` is called, **Then** all transitions are returned in chronological order with `changedBy`, `previousStatus`, `newStatus`, and `changedAt` fields.
2. **Given** an authenticated Applicant requesting the timeline of an application they do not own, **When** the request is made, **Then** a 403 Forbidden is returned.

---

### User Story 6 — Expired Applications Auto-Closed by Background Job (Priority: P3)

As the System, I need to automatically cancel applications that have exceeded their `APPLICATION_VALIDITY_MONTHS` expiry period so that stale applications do not remain active indefinitely.

**Why this priority**: Application validity enforcement is a business rule required for data hygiene and preventing applicants from holding an application open indefinitely.

**Independent Test**: Can be tested by seeding an application with an `ExpiresAt` in the past and triggering the Hangfire job — the application's status should transition to `Expired` and an AuditLog entry should be created.

**Acceptance Scenarios**:

1. **Given** a Hangfire job runs daily, **When** it finds applications where `ExpiresAt < UtcNow` and status is not terminal (`Cancelled`, `Expired`, `Issued`), **Then** each is transitioned to `Expired` with an `AuditLog` entry created for each auto-closure.
2. **Given** the job runs and there are no expired applications, **When** the job completes, **Then** no changes occur and no errors are logged.

---

### Edge Cases

- What happens when a unique application number collision occurs during generation? The system retries with a new random value until uniqueness is confirmed (max 5 retries before raising a system alert).
- What happens if a Hangfire job fails mid-batch for expired applications? The job is idempotent — re-running it will safely process any remaining expired applications without duplicating changes.
- What happens if the `APPLICATION_VALIDITY_MONTHS` setting is missing from SystemSettings? The system should throw a configuration exception and log it rather than silently using a default.
- What happens when a user attempts to call the eligibility check without being authenticated? The endpoint returns a 401 Unauthorized.
- What happens when a Manager cancels an application owned by another applicant? The action is permitted (Manager has ALL access), and the AuditLog captures the Manager's `UserId` as the actor.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement `IApplicationService` with the following operations: `CreateAsync`, `GetByIdAsync`, `GetListAsync`, `UpdateDraftAsync`, `SubmitAsync`, `CancelAsync`, `GetTimelineAsync`, and `CheckEligibilityAsync`.
- **FR-002**: System MUST enforce Gate 1 validation before application creation, checking all four conditions in order: (a) valid Applicant profile exists, (b) applicant age ≥ minimum for the requested category (loaded from `SystemSettings`), (c) no other active application exists, and (d) no security or judicial block exists.
- **FR-003**: System MUST generate the application number in the format `MOJ-{YEAR}-{8 random digits}` and guarantee uniqueness in the database via a retry loop (up to 5 attempts).
- **FR-004**: System MUST implement dual-mode application behavior — `Draft` mode accepts partial data (no mandatory field enforcement), while submission enforces all required field validation via FluentValidation.
- **FR-005**: System MUST calculate `ExpiresAt` as `CreatedAt + APPLICATION_VALIDITY_MONTHS` (loaded from `SystemSettings`) and store it on the Application entity at creation time.
- **FR-006**: System MUST implement a Hangfire recurring job (daily) that queries non-terminal applications where `ExpiresAt < UtcNow` and transitions them to `Expired` status, recording an `AuditLog` entry per application.
- **FR-007**: System MUST enforce role-based data ownership on all read and write operations:
  - `Applicant`: own applications only;
  - `Receptionist`: applications in `DocumentReview` stage;
  - `Doctor`: applications in `MedicalExam` stage;
  - `Examiner`: applications in `Testing` stage;
  - `Manager` and `Admin`: all applications without restriction.
- **FR-008**: System MUST expose the following REST endpoints:
  - `POST   /api/v1/applications`                      — Create (Applicant, Receptionist)
  - `GET    /api/v1/applications`                      — List with filters and pagination (scoped by role)
  - `GET    /api/v1/applications/{id}`                 — Single application detail (ownership enforced)
  - `PUT    /api/v1/applications/{id}/draft`           — Update draft (Applicant)
  - `PATCH  /api/v1/applications/{id}/submit`          — Submit (Applicant, Receptionist)
  - `PATCH  /api/v1/applications/{id}/cancel`          — Cancel with reason (Applicant, Receptionist, Manager)
  - `GET    /api/v1/applications/{id}/timeline`        — Full status history (all authorized roles)
  - `GET    /api/v1/applications/{id}/eligibility`     — Pre-creation eligibility check (Applicant)
- **FR-009**: System MUST support the following query filters on the list endpoint: `status`, `stage`, `serviceType`, `category`, `branchId`, `search` (application number or applicant name), `from` (date), `to` (date), `sortBy`, `sortDir`, `page`, `pageSize` (default 20, max 100).
- **FR-010**: System MUST trigger notifications on the following events — application submitted (In-App + Push + Email), application cancelled (In-App + Push), preliminary application accepted (In-App + Push + Email), application rejected (In-App + Push + Email + SMS).
- **FR-011**: System MUST record an `AuditLog` entry for every state transition, capturing `UserId`, `Action`, `EntityType` = `Application`, `EntityId`, `OldValues`, `NewValues` (JSON), `IpAddress`, and `Timestamp`.
- **FR-012**: System MUST return all responses wrapped in `ApiResponse<T>`, and all paginated list results in `ApiResponse<PagedResult<ApplicationDto>>`.
- **FR-013**: System MUST apply Soft Delete (`IsDeleted = true`) instead of hard deletion for any application removal operation.
- **FR-014**: System MUST store all dates as UTC (`DateTime.UtcNow`) — conversion to local time is the responsibility of the client/frontend only.

### Key Entities

- **Application**: The central entity representing a citizen's driving license service request. Contains `ApplicationNumber`, `ApplicantId`, `ServiceType`, `LicenseCategoryId`, `BranchId`, `Status`, `CurrentStage`, `ExpiresAt`, `CancelledAt`, `CancellationReason`, `DataAccuracyConfirmed`, `PreferredLanguage`, `SpecialNeeds`, `CreatedAt`, `UpdatedAt`, `IsDeleted`.
- **Applicant**: The profile entity linked to a `User`, holding personal data (NationalId, DateOfBirth, Gender, Nationality, BloodType, Address, ApplicantType). Used for Gate 1 age and profile validation.
- **LicenseCategory**: Defines license codes (A–F), minimum age, training requirements, and active status. Referenced by an Application to determine eligibility rules.
- **ApplicationStatusHistory**: Immutable log of every status transition on an Application, recording `PreviousStatus`, `NewStatus`, `ChangedBy` (UserId), `Reason`, and `ChangedAt`.
- **SystemSettings**: Key-value store for all configurable policies. Provides `APPLICATION_VALIDITY_MONTHS`, `MIN_AGE_CATEGORY_X`, and other runtime settings to the Application service.
- **AuditLog**: System-wide audit trail capturing actor, action, entity, old/new values, and metadata for compliance and traceability.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Gate 1 blocks 100% of underage applicants, applicants with an active application, and applicants with a security block — zero invalid applications are created.
- **SC-002**: Every application number generated conforms to the `MOJ-{YEAR}-{8 digits}` format and is provably unique in the database.
- **SC-003**: Draft applications accept partial updates without error; submission fails with a descriptive validation error when any required field is absent.
- **SC-004**: Role-based data ownership is enforced on 100% of read and write operations — unauthorized access always yields a 403 Forbidden.
- **SC-005**: Cancellation always records the reason and `CancelledAt` timestamp in both the Application record and ApplicationStatusHistory.
- **SC-006**: The timeline endpoint returns all transitions in chronological order with actor identity and timestamp for each entry.
- **SC-007**: List endpoint pagination, filtering by all defined parameters, and sorting all produce correct and consistent results.
- **SC-008**: Notifications fire on submit and cancel events for 100% of applicable cases, across all configured channels (In-App, Push, Email as required by event type).
- **SC-009**: The Hangfire daily job auto-closes expired applications within 24 hours of their `ExpiresAt` timestamp, with a corresponding AuditLog entry per closed application.
- **SC-010**: All list endpoint responses return in under 2 seconds at the 95th percentile under normal load (up to 500 concurrent users).

---

## Assumptions

- The `Applicants`, `LicenseCategories`, and `SystemSettings` tables are seeded and accessible at runtime — Gate 1 validation depends on them being populated.
- The Notification Service (Feature 010) is operational and its `INotificationService` interface is available for injection into `ApplicationService`.
- The AuditLog infrastructure (AuditLogs table and `IAuditLogService`) from Feature 011 (RBAC) is in place and reusable here.
- Hangfire is already configured (from Feature 012 infrastructure setup) with a recurring job scheduler available.
- Security/judicial block checking is simulated in MVP — a placeholder field or flag on the Applicant record is used. Real integration with external security systems is deferred to Phase 2.
- All amounts and configurable thresholds (ages, validity months) are read from `SystemSettings` at runtime — none are hardcoded.
- The `serviceType` field covers the 8 MVP services: NewLicenseIssuance, LicenseRenewal, LostDamagedReplacement, CategoryUpgrade, TestRetake, AppointmentBooking, ApplicationCancellation, DocumentDownload.
- Branch/center data (for `BranchId` filtering) is seeded as reference data and does not require its own management feature in this scope.
