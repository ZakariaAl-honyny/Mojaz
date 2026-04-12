# Quickstart: Database Foundation

This quickstart assumes you have the Database Foundation branch and want to set up the Mojaz database locally.

## 1. Prerequisites

- Docker Desktop installed and running
- .NET 8 SDK
- EF Core CLI tools (`dotnet tool install --global dotnet-ef`)

## 2. Setting up the Database

1. **Start SQL Server via Docker**:
   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Mojaz@123Complex" -p 1433:1433 -d --name mojaz-sql mcr.microsoft.com/mssql/server:2022-latest
   ```
2. **Apply Migrations**:
   In the solution root:
   ```bash
   dotnet ef database update --project src/Mojaz.Infrastructure --startup-project src/Mojaz.API
   ```

## 3. Verifying Seed Data

You can connect to `localhost,1433` using SSMS or Azure Data Studio with:
- Username: `sa`
- Password: `Mojaz@123Complex`

Query `SELECT * FROM Users` to see the seeded Admin and Developer users and confirm that initialization ran successfully.
