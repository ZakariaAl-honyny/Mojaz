# Quickstart: License Renewal Implementation

## Prerequisites
- Branch `025-license-renewal` checked out.
- Local SQL Server running.
- .NET 8 SDK and Node 18+ installed.

## Dev Setup

### 1. Backend
- Navigate to `src/backend`.
- Add `ServiceType.Renewal` checks in `ApplicationService`.
- Implement `IRenewalService` in `Mojaz.Infrastructure`.
- Register the service in `Mojaz.API` (Program.cs).

### 2. Frontend
- Navigate to `frontend`.
- Components in `src/components/domain/license/`.
- Page route: `src/app/[locale]/(applicant)/license/renew/page.tsx`.

## Key Logic to Implement

### Atomic Transition (C#)
```csharp
using (var transaction = await _unitOfWork.BeginTransactionAsync())
{
    try 
    {
        // 1. Deactivate old
        oldLicense.Status = LicenseStatus.Renewed;
        
        // 2. Create new
        var newLicense = new License { ... };
        _licenseRepository.Add(newLicense);
        
        // 3. Update application
        application.Status = ApplicationStatus.Issued;
        
        await _unitOfWork.CommitAsync();
    }
    catch { await transaction.RollbackAsync(); }
}
```

## Verification
- Run `dotnet test src/tests/Mojaz.Application.Tests`.
- Functional test: Renew a license via Swagger UI (`POST /api/v1/licenses/renewal/{id}/issue`).
