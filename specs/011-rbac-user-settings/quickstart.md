# Quickstart: 011-rbac-user-settings

## Summary
This quickstart outlines how to leverage the RBAC and Settings endpoints once implemented.

### Admin User Onboarding Employee
1. Call `POST /api/v1/users` with payload including `{ "fullName": "New Employee", "email": "employee@mojaz.gov.sa", "appRole": "Receptionist" }` using an Admin JWT.
2. The response will return a generated temporary password.
3. Employee calls `POST /api/v1/auth/login` with that password.
4. Active token is returned, but has restricted claims or triggers a 403 on protected routes until `POST /api/v1/auth/change-password` is invoked.

### Managing System Settings
1. Retrieve all settings via `GET /api/v1/settings`. The endpoints hit memory cache for microsecond response times.
2. Update a configuration (e.g. `MIN_AGE_CATEGORY_B`) via `PUT /api/v1/settings/{key}` with `{"value": "18"}` payload using an Admin JWT.
3. The server immediately evicts `MIN_AGE_CATEGORY_B` from IMemoryCache.
4. Next invocation of `GET /api/v1/settings` fetches the new value from SQL Server, caches it, and returns the response.

### Audit Tracking
1. All changes performed above trigger an append operation to `AuditLogs`.
2. Admin query `GET /api/v1/audit-logs?entity=SystemSetting` to review history.
