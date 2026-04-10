# Phase 0: Research

**Issue**: Blob storage provider selection.
**Decision**: Standard configured local file storage path via appsettings.json for the MVP, abstracted behind an `IBlobStorageService` interface.
**Rationale**: In the current MVP context of the Mojaz platform, an explicit cloud provider has not been strictly locked in or provisioned. Using the `IBlobStorageService` abstraction allows seamless swapping to AWS S3, local storage, or Azure Blob Storage in production while immediately fulfilling the requirement for immutable PDF storage.
**Alternatives considered**: Direct database storage using varbinary fields (rejected due to db bloat and performance degradation). Hardcoded Azure Blob SDK implementation (rejected due to MVP constraints and keeping the domain clean).
