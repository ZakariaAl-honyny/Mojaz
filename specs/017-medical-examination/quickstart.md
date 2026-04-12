# Quickstart: Medical Examination Development

## Environment Setup
Make sure you have both SQL Server and Redis running, and you've synchronized the latest database schema.

1. **Apply Migrations**
   ```bash
   cd src/backend/Mojaz.Infrastructure
   dotnet ef database update --project . --startup-project ../Mojaz.API
   ```

2. **Add Missing Settings Row**
   Check that your default database seed includes `SystemSettings` where `Key = 'MEDICAL_VALIDITY_DAYS'` and `Value = '90'`.

3. **Run the Backend**
   ```bash
   cd src/backend/Mojaz.API
   dotnet run
   ```

4. **Run the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Test the Flow**
   - Log into the app as a **Doctor** (e.g. `doctor@mojaz.gov.sa`).
   - Navigate to `/ar/employee/applications` and locate an application in `PendingMedicalTest` status.
   - Click to record the examination and observe the frontend optimistic transition upon clicking "Save". 
