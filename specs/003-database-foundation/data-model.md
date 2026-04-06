# Data Model: Database Foundation & Seed Data

This document extracts the entity structure from the feature spec into actionable classes for `Mojaz.Domain`.

## Base Entities and Interfaces

- `BaseEntity`: Has `Id (int)`
- `IAuditable`: Has `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`
- `ISoftDeletable`: Has `IsDeleted (bool)`, `DeletedAt (DateTime2)`

## Identified Domain Entities

### Authentication & Identification 
- **User**: Core identities (Id, FirstName, LastName, Email, PasswordHash, PhoneNumber, NationalId, Gender, IsActive, LastLoginAt, RegistrationMethod, IAuditable, ISoftDeletable).
- **Role**: Access roles (Id, Name, NormalizedName, Description, IAuditable).
- **UserRole**: Join table (UserId, RoleId, AssignedAt).
- **RefreshToken**: Auth tokens (UserId, Token, ExpiresAt, RevokedAt, IpAddress).
- **PasswordReset**: Password reset objects (UserId, Token, ExpiresAt, UsedAt).

### Configuration & Business Dictionary
- **LicenseCategory**: Driving categories (Code, NameAr, NameEn, Description, IsActive, ValidityYears, RequiresX, MinAge).
- **FeeType**: Fee categories (Code, NameAr, NameEn, Category, Amount, Currency, LicenseCategoryId).
- **LicenseCategoryFee**: Link mapping fees (LicenseCategoryId, FeeTypeId, Amount, EffectiveDates).
- **Country**: Geographic constraint (Code, NameAr, NameEn).
- **City**: Geographic constraint (CountryId, NameAr, NameEn).
- **Setting**: Feature flags & variables (Key, Value, Description, DataType, IsPublic).

### Core Working Models
- **Application**: Driver application processes (ApplicationNumber, ApplicantId, LicenseCategoryId, Status, Dates, ReviewedBy, IAuditable, ISoftDeletable).
- **License**: Active licenses (LicenseNumber, ApplicationId, HolderId, LicenseCategoryId, Status, IssuedAt, ExpiresAt, RevokedAt).
- **Appointment**: Booked appointments (ApplicationId, ApplicantId, Type, ScheduledAt, Status, AssignedEmployeeId).
- **Document**: Applicant uploads (ApplicationId, UploadedById, DocumentType, FilePath, IsVerified).
- **Payment**: Payment ledger (PaymentReference, ApplicationId, PaidById, FeeTypeId, Amount, TransactionId, Status).

### Operational Tracking
- **ApplicationStatusHistory**: Timeline (ApplicationId, FromStatus, ToStatus, ChangedByUserId, Reason).
- **Notification**: Automated alerts (UserId, EventType, Title*, Message*, IsRead).
- **TestResult**: Theory & Practical (ApplicationId, AppointmentId, TestType, Result, Score).
- **MedicalResult**: Medical status (ApplicationId, AppointmentId, Result, VisionTest, DoctorName).
- **AuditLog**: Platform audits (UserId, Action, EntityType, OldValues, NewValues).

## State Transitions
- **ApplicationStatus**: Draft -> Submitted -> UnderReview -> PendingPayment -> PendingDocuments -> PendingMedicalTest -> (Various tests) -> Approved / Rejected -> Cancelled / Expired.
- **AppointmentStatus**: Scheduled -> Confirmed -> Completed / Cancelled / NoShow.
- **PaymentStatus**: Pending -> Completed / Failed / Refunded.
