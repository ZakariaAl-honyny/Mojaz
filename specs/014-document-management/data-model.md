# Data Model: 014-Document Management

**Branch**: `014-document-management` | **Date**: 2026-04-09

---

## Entity: ApplicationDocument

**Table**: `ApplicationDocuments`
**Namespace**: `Mojaz.Domain.Entities`
**Base class**: `SoftDeletableEntity` (has `IsDeleted`, `CreatedAt`, `UpdatedAt`, `Id`)

### Fields

| Column | Type | Nullable | Constraints | Notes |
|--------|------|:--------:|-------------|-------|
| `Id` | `Guid` | ❌ | PK | Inherited from BaseEntity |
| `ApplicationId` | `Guid` | ❌ | FK → Applications.Id | Cascade delete: Restrict |
| `DocumentType` | `DocumentType` (enum→int) | ❌ | — | One of 8 values |
| `OriginalFileName` | `nvarchar(260)` | ❌ | — | Client-provided filename (display only) |
| `StoredFileName` | `nvarchar(260)` | ❌ | — | GUID-based server filename, never exposed |
| `FilePath` | `nvarchar(500)` | ❌ | — | Relative path in storage (e.g., `uploads/2025/abc.pdf`) |
| `ContentType` | `nvarchar(100)` | ❌ | — | Verified MIME type (server-validated) |
| `FileSizeBytes` | `bigint` | ❌ | ≥ 1, ≤ MAX_FILE_SIZE_MB×1048576 | Validated at upload time |
| `Status` | `DocumentStatus` (enum→int) | ❌ | Default: Pending | State machine: Pending → Approved/Rejected |
| `IsRequired` | `bit` | ❌ | — | True for mandatory; false for conditional |
| `ReviewedBy` | `Guid?` | ✅ | FK → Users.Id | Null if not yet reviewed |
| `ReviewedAt` | `DateTime?` | ✅ | UTC | Null if not yet reviewed |
| `RejectionReason` | `nvarchar(1000)?` | ✅ | Required when Status=Rejected | Null when Approved |
| `IsDeleted` | `bit` | ❌ | Default: false | Inherited from SoftDeletableEntity |
| `CreatedAt` | `DateTime` | ❌ | UTC | Inherited |
| `UpdatedAt` | `DateTime` | ❌ | UTC | Inherited |

### Navigation Properties

```csharp
public virtual Application Application { get; set; } = null!;
public virtual User? Reviewer { get; set; }
```

### Indexes

```sql
IX_ApplicationDocuments_ApplicationId         -- on ApplicationId
IX_ApplicationDocuments_ApplicationId_Type    -- on (ApplicationId, DocumentType) WHERE IsDeleted = 0
                                              -- enforces one active upload per type per application
```

### EF Core Configuration Notes

```csharp
// In ApplicationDocumentConfiguration.cs
builder.HasQueryFilter(d => !d.IsDeleted);   // Soft delete global filter
builder.HasIndex(d => new { d.ApplicationId, d.DocumentType })
       .HasFilter("[IsDeleted] = 0")
       .IsUnique();                           // Unique constraint: one active doc per type per app
builder.Property(d => d.Status)
       .HasDefaultValue(DocumentStatus.Pending);
builder.Property(d => d.StoredFileName).HasMaxLength(260).IsRequired();
builder.Property(d => d.RejectionReason).HasMaxLength(1000);
```

---

## Enum: DocumentType (Updated)

**Namespace**: `Mojaz.Domain.Enums`
**File**: `DocumentType.cs`

```csharp
public enum DocumentType
{
    // Mandatory (always required for new license issuance)
    IdCopy = 1,
    PersonalPhoto = 2,
    MedicalReport = 3,
    TrainingCertificate = 4,

    // Conditional
    AddressProof = 5,          // Required when applicant is Resident
    GuardianConsent = 6,       // Required when applicant age < 18
    PreviousLicense = 7,       // Required when previous license declared / Renewal / Upgrade service
    AccessibilityDocuments = 8 // Required when SupportNeeds == true
}
```

> **Migration needed**: Existing enum values (`NationalId=0`, `Photo=2`, `MedicalCertificate=1`, `DrivingRecord=3`, `TrainingCertificate=4`) must be remapped. A data migration script must run before this enum change is deployed.

---

## Enum: DocumentStatus (Normalized)

**Namespace**: `Mojaz.Domain.Enums`
**File**: `AdditionalEnums.cs` (update existing)

```csharp
public enum DocumentStatus
{
    Pending = 0,    // Uploaded, awaiting employee review (replaces Uploaded)
    Approved = 1,
    Rejected = 2
}
```

> **Breaking change**: Remove `Uploaded = 3` variant. Any rows with `Status = Uploaded` must be migrated to `Status = Pending` before deployment.

---

## DTO Set

**Namespace**: `Mojaz.Application.DTOs.Document`

### DocumentDto (Response)
```csharp
public class DocumentDto
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public DocumentType DocumentType { get; set; }
    public string DocumentTypeName { get; set; } = string.Empty;  // Human-readable (set by mapper)
    public string OriginalFileName { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public DocumentStatus Status { get; set; }
    public string? RejectionReason { get; set; }
    public Guid? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public DateTime CreatedAt { get; set; }  // Upload timestamp
    public string DownloadUrl { get; set; } = string.Empty;  // Set by service, e.g. /api/v1/applications/{id}/documents/{docId}/download
}
```

### UploadDocumentRequest (Request)
```csharp
public class UploadDocumentRequest
{
    public DocumentType DocumentType { get; set; }
    public IFormFile File { get; set; } = null!;
}
```

### DocumentReviewRequest (Update — enforce RejectionReason validation)
```csharp
public class DocumentReviewRequest
{
    public bool Approved { get; set; }
    public string? RejectionReason { get; set; }  // MUST be non-empty when Approved = false
}
```

### DocumentRequirementDto (New — requirements endpoint response)
```csharp
public class DocumentRequirementDto
{
    public DocumentType DocumentType { get; set; }
    public string DocumentTypeName { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
    public bool IsConditional { get; set; }
    public string? ConditionDescription { get; set; }  // Human-readable reason why shown
    public bool HasUpload { get; set; }       // True if a Pending/Approved/Rejected doc exists
    public DocumentStatus? Status { get; set; } // Null if HasUpload = false
    public Guid? DocumentId { get; set; }     // For linking to existing upload
}
```

### BulkApproveResponse (New — bulk approve result)
```csharp
public class BulkApproveResponse
{
    public int ApprovedCount { get; set; }
    public List<Guid> ApprovedDocumentIds { get; set; } = new();
}
```

---

## Interface: IFileStorageService (New)

**Namespace**: `Mojaz.Application.Interfaces.Infrastructure`

```csharp
public interface IFileStorageService
{
    /// <summary>Saves the stream to storage. Returns the relative stored path.</summary>
    Task<string> SaveAsync(Stream fileStream, string storedFileName, string contentType);

    /// <summary>Reads a stored file. Returns (content, contentType).</summary>
    Task<(Stream content, string contentType)> ReadAsync(string storedFilePath);

    /// <summary>Soft-removes the file from storage (may be a no-op or physical delete depending on impl).</summary>
    Task DeleteAsync(string storedFilePath);
}
```

---

## Interface: IDocumentService (Updated)

**Namespace**: `Mojaz.Application.Interfaces.Services`

```csharp
public interface IDocumentService
{
    Task<ApiResponse<DocumentDto>> UploadAsync(Guid applicationId, UploadDocumentRequest request, Guid userId);
    Task<ApiResponse<IEnumerable<DocumentDto>>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role);
    Task<ApiResponse<IEnumerable<DocumentRequirementDto>>> GetRequirementsAsync(Guid applicationId, Guid userId);
    Task<ApiResponse<DocumentDto>> ReviewAsync(Guid documentId, DocumentReviewRequest request, Guid reviewerId);
    Task<ApiResponse<BulkApproveResponse>> BulkApproveAsync(Guid applicationId, Guid reviewerId);
    Task<ApiResponse<bool>> DeleteAsync(Guid documentId, Guid userId);
    Task<(Stream content, string contentType, string fileName)> DownloadAsync(Guid documentId, Guid userId, string role);
    Task<ApiResponse<bool>> NotifyMissingDocumentsAsync(Guid applicationId, List<string> missingAr, List<string> missingEn, DateTime deadline);
}
```

---

## Validation: UploadDocumentValidator

**Namespace**: `Mojaz.Application.Validators`

```csharp
// Validated in service, not controller (Constitution Principle II)
// Rules (all errors returned before any I/O):
// 1. DocumentType must be a valid enum value
// 2. File must not be null
// 3. File size must be > 0 and ≤ MAX_FILE_SIZE_MB × 1,048,576 (read from SystemSettings)
// 4. File extension must be one of: .pdf, .jpg, .jpeg, .png
// 5. MIME magic bytes must match declared extension (service-level check)
```

## Validation: DocumentReviewValidator

```csharp
// Rules:
// 1. If Approved = false, RejectionReason must not be null or whitespace
// 2. RejectionReason max length: 1,000 characters
```

---

## State Transition Diagram

```
                Upload
(No file) ─────────────▶ Pending
                               │
              ┌────────────────┴────────────────┐
              │                                 │
          Approve (employee)           Reject (employee)
              │                                 │
              ▼                                 ▼
           Approved                         Rejected
                                               │
                                        Re-upload (applicant)
                                               │
                                               ▼
                                            Pending   ◀── cycle repeats
```

---

## Database Migration Plan

Two migrations required:

### Migration A: SchemaUpdate_014_DocumentType_Enum
- Rename enum values in SQL (update `DocumentType` int column):
  - `NationalId (0)` → `IdCopy (1)` — UPDATE rows SET DocumentType = 1 WHERE DocumentType = 0
  - `MedicalCertificate (1)` → `MedicalReport (3)` — UPDATE rows SET DocumentType = 3 WHERE DocumentType = 1
  - `Photo (2)` → `PersonalPhoto (2)` — no int change
  - `DrivingRecord (3)` → NULL-check and soft-delete any orphaned rows
  - `TrainingCertificate (4)` — no int change
  - Add new columns if missing: `OriginalFileName`, `StoredFileName` (rename from `FileName`), `FileSizeBytes` (rename from `FileSize`)

### Migration B: SchemaUpdate_014_DocumentStatus_Normalize
- UPDATE ApplicationDocuments SET Status = 0 WHERE Status = 1 (Uploaded→Pending, using old int values)
- Remove `Uploaded` enum variant from code after migration
- Add unique filtered index: `IX_ApplicationDocuments_ApplicationId_Type` WHERE IsDeleted = 0
