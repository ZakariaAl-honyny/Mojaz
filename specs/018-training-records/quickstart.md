# Quickstart: Training Records Development (018)

## Prerequisites

- SQL Server running and `Mojaz` database seeded (see Feature 003 setup)
- `SystemSettings` table has rows for all `TRAINING_HOURS_{A-F}` keys
- `ApplicationDocuments` table has at least one document (for exemption testing)
- Feature 016 (Appointments) deployed — Gate 3 hooks into AppointmentBookingValidator

---

## 1. Apply the Migration

```bash
cd src/backend
dotnet ef migrations add AddTrainingRecordExtendedFields \
  --project Mojaz.Infrastructure \
  --startup-project Mojaz.API

dotnet ef database update \
  --project Mojaz.Infrastructure \
  --startup-project Mojaz.API
```

---

## 2. Seed SystemSettings (if not already present)

Run this SQL to add required training hours defaults:

```sql
INSERT INTO SystemSettings (Id, [Key], [Value], Description, CreatedAt)
VALUES
  (NEWID(), 'TRAINING_HOURS_A', '20', 'Motorcycle training hours', GETUTCDATE()),
  (NEWID(), 'TRAINING_HOURS_B', '30', 'Private car training hours', GETUTCDATE()),
  (NEWID(), 'TRAINING_HOURS_C', '40', 'Commercial training hours', GETUTCDATE()),
  (NEWID(), 'TRAINING_HOURS_D', '50', 'Bus training hours', GETUTCDATE()),
  (NEWID(), 'TRAINING_HOURS_E', '50', 'Heavy vehicle training hours', GETUTCDATE()),
  (NEWID(), 'TRAINING_HOURS_F', '20', 'Agricultural vehicle training hours', GETUTCDATE());
```

---

## 3. Run the Backend

```bash
cd src/backend/Mojaz.API
dotnet run
```

Swagger UI available at: `https://localhost:7001/swagger`

---

## 4. Run the Frontend

```bash
cd src/frontend
npm run dev
```

Frontend available at: `http://localhost:3000`

---

## 5. Test the Employee Training Entry Flow

1. Log in as a **Receptionist** (`receptionist@mojaz.gov.sa` / dev password).
2. Navigate to `/ar/employee/training/{applicationId}` where the application is in `TrainingRequired` stage.
3. Fill in the training form — school name, hours (try partial, e.g. 15 out of 30).
4. Observe the **circular arc progress indicator** animate to 50%.
5. Submit again with remaining 15 hours — observe arc reach 100% and status badge flip to `Completed` (Royal Green).
6. Verify the applicant receives an In-App notification.

---

## 6. Test the Manager Exemption Flow

1. As Receptionist, navigate to the training page and click **"Request Exemption"**.
2. Fill in an exemption reason and select a previously uploaded document.
3. Log out and log in as a **Manager** (`manager@mojaz.gov.sa`).
4. Navigate to the pending exemptions queue.
5. Click **Approve** — observe the confirmation overlay countdown before commit.
6. Verify the training status transitions to `Exempted` (Government Gold badge).
7. Check AuditLog table for the approve event.

---

## 7. Test Gate 3 Enforcement

1. With an application in `TrainingRequired` status, attempt to book a Theory Test appointment.
2. Verify the API returns `400` with message `"Training requirement not fulfilled (Gate 3)"`.
3. On the frontend, verify the Theory Test step shows the padlock icon `GateLockIndicator`.

---

## Key Files Modified

| File | Change |
|------|--------|
| `Mojaz.Domain/Entities/TrainingRecord.cs` | Add new fields; replace Status string with enum |
| `Mojaz.Domain/Enums/TrainingStatus.cs` | NEW — 4-state enum |
| `Mojaz.Application/Services/TrainingService.cs` | NEW — core business logic |
| `Mojaz.Application/Interfaces/ITrainingService.cs` | NEW |
| `Mojaz.Infrastructure/Repositories/TrainingRepository.cs` | NEW |
| `Mojaz.API/Controllers/TrainingController.cs` | NEW |
| `AppointmentBookingValidator.cs` | EXTEND — add Gate 3 rule |
| `src/frontend/src/app/[locale]/(employee)/training/[applicationId]/page.tsx` | NEW |
| `src/frontend/src/components/domain/training/` | NEW directory (7 components) |
| `src/frontend/src/services/training.service.ts` | NEW |
| `public/locales/ar/training.json` | NEW |
| `public/locales/en/training.json` | NEW |
