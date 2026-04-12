# Quickstart: 016-appointment-system

## Developer Setup
1. **Database Migration**: Ensure you run `dotnet ef database update` after creating the `Appointment` entity migration.
2. **Environment**: Verify Hangfire is running. `Hangfire.SqlServer` should be configured in `appsettings.Development.json`.
3. **Seeding**: The `SystemSettings` table must have the following keys initialized:
   - `MAX_RESCHEDULE_COUNT` (default: 3)
   - `SLOT_DURATION_MINUTES` (default: 30)

## API Testing Flow (Postman / Swagger)
1. **Login User**: Obtain JWT for an `Applicant` role.
2. **Setup Gate 2**: Mark an Application as `Under Review` and manually insert passing results for required documents (Gate 2 prerequisites).
3. **Query Slots**: Call `GET /api/v1/appointments/available-slots`.
4. **Book slot**: Call `POST /api/v1/appointments` with the selected date/time.
5. **Validation**: Check that your `Scheduled` appointment appears.
6. **Background Tasks**: Open the Hangfire Dashboard (`/hangfire` locally) to observe the 24-hour reminder job being queued or processed.
