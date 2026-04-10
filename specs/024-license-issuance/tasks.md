# Tasks: 024-license-issuance

**Input**: Design documents from `specs/024-license-issuance/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `024-license-issuance`
**Created**: 2026-04-06

## Phase 1: Persistence & Generation Logic (Priority: P1)

- [ ] **T2401**: Create `License` entity (LicenseNumber, IssueDate, ExpiryDate, Category).
- [ ] **T2402**: Add unique format generator logic for `MOJ-{YEAR}-{8 random digits}`.
- [ ] **T2403**: Map `ValidityYears` (5 or 10) correctly to categories in the DB seeder.
- [ ] **T2404**: Update `ApplicationDbContext` with `Licenses` DbSet.

## Phase 2: Domain Logic & API (Priority: P1)

- [ ] **T2405**: Create `ILicenseService` and `LicenseService` in the Application layer.
- [ ] **T2406**: Implement `IssueLicenseAsync` (Verify status/payment, generate number, create record).
- [ ] **T2407**: Add `POST /api/v1/licenses/{appId}/issue` (Post-Approval/Payment).
- [ ] **T2408**: Add `GET /api/v1/licenses/my-license` for applicants.
- [ ] **T2409**: Implement `GetLicensePdfAsync` using `QuestPDF`.

## Phase 3: PDF Template & QR (Priority: P1)

- [ ] **T2410**: Build the `DigitalLicensePdf` layout (Bilingual AR/EN, Lucide Icons).
- [ ] **T2411**: Embed applicant photo from document storage (Feature 014).
- [ ] **T2412**: Integrate QR code generator with secure validation URL.
- [ ] **T2413**: Add `GET /api/v1/licenses/{id}/download` endpoint with secure stream serving.

## Phase 4: Frontend & Notifications (Priority: P2)

- [ ] **T2414**: Create `LicenseCard` component in the applicant dashboard (Dashboard card).
- [ ] **T2415**: Add "Download PDF" button with loading state.
- [ ] **T2416**: Trigger `INotificationService` on license issuance.

## Phase 5: Verification (Priority: P2)

- [ ] **T2417**: Unit tests for License Number format and collision avoidance.
- [ ] **T2418**: Unit tests for Category-based Expiry calculation (5 vs 10 years).
- [ ] **T2419**: Verify PDF content: check for correct bilingual data and photo visibility.
- [ ] **T2420**: Verify only the license owner can access the PDF download (403 for others).

## Success Criteria Checklist

- [ ] Unique license number generated in the correct format.
- [ ] Expiry date calculated correctly per category.
- [ ] High-quality bilingual PDF generated with photo and QR.
- [ ] Applicant notified on issuance success.
- [ ] Application status transitions to `Issued/Completed`.
- [ ] Build completes without errors.
