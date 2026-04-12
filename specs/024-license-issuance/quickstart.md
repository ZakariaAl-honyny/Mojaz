# Phase 1: Quickstart Architecture Notes

1. **Dependency Injection**: Provide implementations for `IBlobStorageService` and `ILicensePdfGenerator` in the DI container.
2. **Infrastructure Logic**: Implement `QuestPdfGenerator` using the QuestPDF library. Set up the bilingual document structure leveraging Cairo (Arabic RTL) and Inter (English) font families.
3. **Idempotency Guard**: Inside `LicenseIssuanceService.IssueLicenseAsync`, perform an upfront lookup `_licenseRepository.GetByApplicationId(appId)` and abort with a `ConflictException` early if one is found.
4. **Expiry Calculation**: Retrieve category expiry duration correctly from `LicenseCategories` table rather than hardcoding the 5/10 years.
