# Quickstart: Auth Login with JWT

This document explains how to set up and test the authentication login feature in the Mojaz system.

## Setup Requirements

1. **Database & Migrations**: Ensure `RefreshTokens` and `OtpCodes` tables are created.
   ```bash
   dotnet ef migrations add UpdateAuthTables --project src/Mojaz.Infrastructure --startup-project src/Mojaz.API
   dotnet ef database update --project src/Mojaz.Infrastructure --startup-project src/Mojaz.API
   ```

2. **Configuration**: Set your JWT settings in `appsettings.json` or User Secrets.
   ```json
   "JwtSettings": {
     "Secret": "your-256-bit-secret-key-at-least-32-bytes-long",
     "Issuer": "MojazAPI",
     "Audience": "MojazClient",
     "AccessTokenExpirationMinutes": 60,
     "RefreshTokenExpirationDays": 7
   }
   ```

## Local Testing

1. Ensure the API is running locally (`dotnet run` in `src/Mojaz.API`).
2. Register a new user utilizing the existing `/api/v1/auth/register` endpoint.
3. Call the login endpoint:
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"identifier":"user@example.com","password":"Password123!","method":"Email"}'
   ```
4. Copy the `accessToken` and `refreshToken` from the response.
5. Use the `accessToken` to access protected endpoints via the `Authorization: Bearer <accessToken>` header.
6. When the access token expires, use the `refreshToken` endpoint to get a new pair.
