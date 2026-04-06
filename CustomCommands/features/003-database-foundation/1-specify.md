# Feature 003: Database Foundation & Seed Data

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
The complete SQL Server database schema for the Mojaz platform with all 21 tables, relationships, constraints, indexes, and seed data for development and testing.

## DATABASE OVERVIEW:
- **Engine:** SQL Server 2022 (via Docker)
- **Collation:** Arabic_CI_AS (case-insensitive, Arabic-aware)
- **Naming:** PascalCase for tables and columns, singular nouns
- **Audit:** All tables have CreatedAt, UpdatedAt; most have CreatedBy, UpdatedBy
- **Soft Delete:** IsDeleted + DeletedAt on soft-deletable entities

---

## TABLES (21 Total):

### 1. Users
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| FirstName | NVARCHAR(100) | NOT NULL |
| LastName | NVARCHAR(100) | NOT NULL |
| Email | NVARCHAR(256) | NOT NULL, UNIQUE |
| PasswordHash | NVARCHAR(MAX) | NOT NULL |
| PhoneNumber | NVARCHAR(20) | NOT NULL |
| NationalId | NVARCHAR(20) | NULL, UNIQUE |
| DateOfBirth | DATE | NULL |
| Gender | TINYINT | NULL (0=Male, 1=Female) |
| ProfileImageUrl | NVARCHAR(500) | NULL |
| IsActive | BIT | NOT NULL, DEFAULT 1 |
| EmailConfirmed | BIT | NOT NULL, DEFAULT 0 |
| PhoneConfirmed | BIT | NOT NULL, DEFAULT 0 |
| LastLoginAt | DATETIME2 | NULL |
| RegistrationMethod | TINYINT | NOT NULL, DEFAULT 0 (0=Email, 1=NationalId, 2=Google) |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() |
| UpdatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() |
| IsDeleted | BIT | NOT NULL, DEFAULT 0 |
| DeletedAt | DATETIME2 | NULL |

**Indexes:** IX_Users_Email, IX_Users_NationalId, IX_Users_PhoneNumber
**Seed Data:** Admin user, 3 test applicants, 2 test employees

### 2. Roles
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| Name | NVARCHAR(50) | NOT NULL, UNIQUE |
| NormalizedName | NVARCHAR(50) | NOT NULL, UNIQUE |
| Description | NVARCHAR(256) | NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Seed Data:** Admin, Employee, Applicant

### 3. UserRoles
| Column | Type | Constraints |
|--------|------|-------------|
| UserId | INT | PK, FK -> Users(Id) |
| RoleId | INT | PK, FK -> Roles(Id) |
| AssignedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() |

**Seed Data:** Assign Admin to admin user, Applicant to test users, Employee to test employees

### 4. LicenseCategories
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| Code | NVARCHAR(20) | NOT NULL, UNIQUE |
| NameAr | NVARCHAR(200) | NOT NULL |
| NameEn | NVARCHAR(200) | NOT NULL |
| DescriptionAr | NVARCHAR(500) | NULL |
| DescriptionEn | NVARCHAR(500) | NULL |
| IsActive | BIT | NOT NULL, DEFAULT 1 |
| ValidityYears | INT | NOT NULL, DEFAULT 1 |
| RequiresMedicalTest | BIT | NOT NULL, DEFAULT 0 |
| RequiresWrittenTest | BIT | NOT NULL, DEFAULT 0 |
| RequiresPracticalTest | BIT | NOT NULL, DEFAULT 0 |
| MinAge | INT | NOT NULL, DEFAULT 18 |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Seed Data:** DL=Driving License (Private), DLT=Driving License (Taxi), PL=Professional License, BL=Business License, CL=Commercial License

### 5. FeeTypes
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| Code | NVARCHAR(20) | NOT NULL, UNIQUE |
| NameAr | NVARCHAR(200) | NOT NULL |
| NameEn | NVARCHAR(200) | NOT NULL |
| Category | TINYINT | NOT NULL (0=Application, 1=License, 2=Test, 3=Renewal, 4=Duplicate) |
| Amount | DECIMAL(18,2) | NOT NULL |
| Currency | NVARCHAR(3) | NOT NULL, DEFAULT 'SAR' |
| IsActive | BIT | NOT NULL, DEFAULT 1 |
| LicenseCategoryId | INT | NULL, FK -> LicenseCategories(Id) |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Seed Data:** Application fee, License issuance fee, Written test fee, Practical test fee, Medical test fee, Renewal fee, Duplicate certificate fee

### 6. Applications
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| ApplicationNumber | NVARCHAR(20) | NOT NULL, UNIQUE |
| ApplicantId | INT | NOT NULL, FK -> Users(Id) |
| LicenseCategoryId | INT | NOT NULL, FK -> LicenseCategories(Id) |
| Status | TINYINT | NOT NULL, DEFAULT 0 |
| SubmittedAt | DATETIME2 | NULL |
| ApprovedAt | DATETIME2 | NULL |
| RejectedAt | DATETIME2 | NULL |
| RejectionReason | NVARCHAR(500) | NULL |
| ReviewedByEmployeeId | INT | NULL, FK -> Users(Id) |
| Notes | NVARCHAR(1000) | NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |
| CreatedBy | INT | NULL |
| UpdatedBy | INT | NULL |
| IsDeleted | BIT | NOT NULL, DEFAULT 0 |
| DeletedAt | DATETIME2 | NULL |

**ApplicationStatus enum values:**
- 0 = Draft
- 1 = Submitted
- 2 = UnderReview
- 3 = PendingPayment
- 4 = PendingDocuments
- 5 = PendingMedicalTest
- 6 = PendingWrittenTest
- 7 = PendingPracticalTest
- 8 = Approved
- 9 = Rejected
- 10 = Cancelled
- 11 = Expired

**Indexes:** IX_Applications_ApplicantId, IX_Applications_ApplicationNumber, IX_Applications_Status, IX_Applications_LicenseCategoryId
**Seed Data:** 5 applications in various statuses per test applicant

### 7. Licenses
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| LicenseNumber | NVARCHAR(30) | NOT NULL, UNIQUE |
| ApplicationId | INT | NOT NULL, FK -> Applications(Id) |
| HolderId | INT | NOT NULL, FK -> Users(Id) |
| LicenseCategoryId | INT | NOT NULL, FK -> LicenseCategories(Id) |
| IssuedAt | DATETIME2 | NOT NULL |
| ExpiresAt | DATETIME2 | NOT NULL |
| Status | TINYINT | NOT NULL, DEFAULT 0 (0=Active, 1=Expired, 2=Revoked, 3=Suspended) |
| RevokedAt | DATETIME2 | NULL |
| RevokedReason | NVARCHAR(500) | NULL |
| QRCodeData | NVARCHAR(MAX) | NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |
| IsDeleted | BIT | NOT NULL, DEFAULT 0 |
| DeletedAt | DATETIME2 | NULL |

**Indexes:** IX_Licenses_HolderId, IX_Licenses_LicenseNumber, IX_Licenses_ExpiresAt
**Seed Data:** 2 active licenses for completed applications

### 8. Appointments
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| ApplicationId | INT | NOT NULL, FK -> Applications(Id) |
| ApplicantId | INT | NOT NULL, FK -> Users(Id) |
| Type | TINYINT | NOT NULL (0=WrittenTest, 1=PracticalTest, 2=MedicalTest, 3=PhotoCapture, 4=DocumentVerification) |
| ScheduledAt | DATETIME2 | NOT NULL |
| DurationMinutes | INT | NOT NULL, DEFAULT 30 |
| Location | NVARCHAR(200) | NULL |
| Status | TINYINT | NOT NULL, DEFAULT 0 (0=Scheduled, 1=Confirmed, 2=Completed, 3=Cancelled, 4=NoShow) |
| AssignedEmployeeId | INT | NULL, FK -> Users(Id) |
| Notes | NVARCHAR(500) | NULL |
| CancelledReason | NVARCHAR(500) | NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |
| CreatedBy | INT | NULL |
| UpdatedBy | INT | NULL |
| IsDeleted | BIT | NOT NULL, DEFAULT 0 |
| DeletedAt | DATETIME2 | NULL |

**Indexes:** IX_Appointments_ApplicantId, IX_Appointments_ApplicationId, IX_Appointments_ScheduledAt, IX_Appointments_Status
**Seed Data:** 3 appointments for pending applications

### 9. Documents
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| ApplicationId | INT | NOT NULL, FK -> Applications(Id) |
| UploadedById | INT | NOT NULL, FK -> Users(Id) |
| DocumentType | TINYINT | NOT NULL |
| FileName | NVARCHAR(256) | NOT NULL |
| OriginalFileName | NVARCHAR(256) | NOT NULL |
| FilePath | NVARCHAR(500) | NOT NULL |
| ContentType | NVARCHAR(100) | NOT NULL |
| FileSizeBytes | BIGINT | NOT NULL |
| IsVerified | BIT | NOT NULL, DEFAULT 0 |
| VerifiedById | INT | NULL, FK -> Users(Id) |
| VerifiedAt | DATETIME2 | NULL |
| RejectionReason | NVARCHAR(500) | NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |
| IsDeleted | BIT | NOT NULL, DEFAULT 0 |
| DeletedAt | DATETIME2 | NULL |

**DocumentType enum values:**
- 0 = NationalId
- 1 = Passport
- 2 = Photo
- 3 = MedicalCertificate
- 4 = TrainingCertificate
- 5 = ProofOfAddress
- 6 = BirthCertificate
- 7 = Other

**Indexes:** IX_Documents_ApplicationId, IX_Documents_UploadedById, IX_Documents_DocumentType
**Seed Data:** 4 documents across test applications

### 10. Payments
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| PaymentReference | NVARCHAR(50) | NOT NULL, UNIQUE |
| ApplicationId | INT | NOT NULL, FK -> Applications(Id) |
| PaidById | INT | NOT NULL, FK -> Users(Id) |
| FeeTypeId | INT | NOT NULL, FK -> FeeTypes(Id) |
| Amount | DECIMAL(18,2) | NOT NULL |
| Currency | NVARCHAR(3) | NOT NULL, DEFAULT 'SAR' |
| Status | TINYINT | NOT NULL, DEFAULT 0 (0=Pending, 1=Completed, 2=Failed, 3=Refunded) |
| PaymentMethod | TINYINT | NOT NULL (0=CreditCard, 1=BankTransfer, 2=Cash, 3=Wallet) |
| TransactionId | NVARCHAR(100) | NULL |
| PaidAt | DATETIME2 | NULL |
| RefundedAt | DATETIME2 | NULL |
| RefundReason | NVARCHAR(500) | NULL |
| GatewayResponse | NVARCHAR(MAX) | NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Indexes:** IX_Payments_ApplicationId, IX_Payments_PaidById, IX_Payments_PaymentReference, IX_Payments_Status
**Seed Data:** 3 completed payments, 1 pending payment

### 11. Notifications
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| UserId | INT | NOT NULL, FK -> Users(Id) |
| EventType | TINYINT | NOT NULL |
| TitleAr | NVARCHAR(200) | NOT NULL |
| TitleEn | NVARCHAR(200) | NOT NULL |
| MessageAr | NVARCHAR(1000) | NOT NULL |
| MessageEn | NVARCHAR(1000) | NOT NULL |
| IsRead | BIT | NOT NULL, DEFAULT 0 |
| ReadAt | DATETIME2 | NULL |
| RelatedEntityType | NVARCHAR(50) | NULL |
| RelatedEntityId | INT | NULL |
| ActionUrl | NVARCHAR(500) | NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**NotificationEventType enum values:**
- 0 = ApplicationSubmitted
- 1 = ApplicationApproved
- 2 = ApplicationRejected
- 3 = PaymentReceived
- 4 = AppointmentScheduled
- 5 = AppointmentReminder
- 6 = DocumentRequired
- 7 = TestResultAvailable
- 8 = LicenseIssued
- 9 = LicenseExpiringSoon
- 10 = SystemNotification

**Indexes:** IX_Notifications_UserId, IX_Notifications_IsRead, IX_Notifications_CreatedAt
**Seed Data:** 5 notifications for admin user, 3 for test applicant

### 12. TestResults
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| ApplicationId | INT | NOT NULL, FK -> Applications(Id) |
| AppointmentId | INT | NULL, FK -> Appointments(Id) |
| TestType | TINYINT | NOT NULL (0=Written, 1=Practical) |
| Result | TINYINT | NOT NULL (0=Pending, 1=Pass, 2=Fail) |
| Score | DECIMAL(5,2) | NULL |
| MaxScore | DECIMAL(5,2) | NULL |
| Notes | NVARCHAR(500) | NULL |
| TestedByEmployeeId | INT | NOT NULL, FK -> Users(Id) |
| TestedAt | DATETIME2 | NOT NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Indexes:** IX_TestResults_ApplicationId, IX_TestResults_AppointmentId
**Seed Data:** 2 test results for completed test appointments

### 13. MedicalResults
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| ApplicationId | INT | NOT NULL, FK -> Applications(Id) |
| AppointmentId | INT | NULL, FK -> Appointments(Id) |
| Result | TINYINT | NOT NULL (0=Pending, 1=Fit, 2=Unfit, 3=Conditional) |
| VisionTestResult | NVARCHAR(100) | NULL |
| ColorBlindTestResult | BIT | NULL |
| BloodPressureNormal | BIT | NULL |
| Notes | NVARCHAR(1000) | NULL |
| DoctorName | NVARCHAR(200) | NULL |
| ClinicName | NVARCHAR(200) | NULL |
| ExaminedAt | DATETIME2 | NOT NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Indexes:** IX_MedicalResults_ApplicationId, IX_MedicalResults_AppointmentId
**Seed Data:** 1 medical result for completed medical appointment

### 14. AuditLogs
| Column | Type | Constraints |
|--------|------|-------------|
| Id | BIGINT | PK, IDENTITY(1,1) |
| UserId | INT | NULL, FK -> Users(Id) |
| Action | NVARCHAR(100) | NOT NULL |
| EntityType | NVARCHAR(100) | NOT NULL |
| EntityId | INT | NULL |
| OldValues | NVARCHAR(MAX) | NULL (JSON) |
| NewValues | NVARCHAR(MAX) | NULL (JSON) |
| IpAddress | NVARCHAR(45) | NULL |
| UserAgent | NVARCHAR(500) | NULL |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() |

**Indexes:** IX_AuditLogs_UserId, IX_AuditLogs_EntityType, IX_AuditLogs_CreatedAt
**Partition:** By CreatedAt (monthly) for retention management

### 15. RefreshTokens
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| UserId | INT | NOT NULL, FK -> Users(Id) |
| Token | NVARCHAR(500) | NOT NULL, UNIQUE |
| ExpiresAt | DATETIME2 | NOT NULL |
| CreatedAt | DATETIME2 | NOT NULL |
| RevokedAt | DATETIME2 | NULL |
| ReplacedByToken | NVARCHAR(500) | NULL |
| IpAddress | NVARCHAR(45) | NULL |

**Indexes:** IX_RefreshTokens_Token, IX_RefreshTokens_UserId
**Cleanup:** Hangfire job to delete expired tokens older than 30 days

### 16. Countries
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| Code | NVARCHAR(3) | NOT NULL, UNIQUE (ISO 3166-1 alpha-3) |
| NameAr | NVARCHAR(100) | NOT NULL |
| NameEn | NVARCHAR(100) | NOT NULL |
| IsActive | BIT | NOT NULL, DEFAULT 1 |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Seed Data:** Saudi Arabia (SAU), UAE (ARE), Egypt (EGY), Jordan (JOR), Kuwait (KWT), Bahrain (BHR), Qatar (QAT), Oman (OMN)

### 17. Cities
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| CountryId | INT | NOT NULL, FK -> Countries(Id) |
| NameAr | NVARCHAR(100) | NOT NULL |
| NameEn | NVARCHAR(100) | NOT NULL |
| IsActive | BIT | NOT NULL, DEFAULT 1 |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Seed Data:** Saudi cities: Riyadh, Jeddah, Dammam, Mecca, Medina, Taif, Abha, Tabuk; UAE cities: Dubai, Abu Dhabi, Sharjah; etc.

### 18. Settings
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| Key | NVARCHAR(100) | NOT NULL, UNIQUE |
| Value | NVARCHAR(MAX) | NOT NULL |
| Description | NVARCHAR(500) | NULL |
| DataType | TINYINT | NOT NULL, DEFAULT 0 (0=String, 1=Int, 2=Bool, 3=Json) |
| IsPublic | BIT | NOT NULL, DEFAULT 0 |
| UpdatedByUserId | INT | NULL, FK -> Users(Id) |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Seed Data:** AppName, AppVersion, MaxFileSizeMB, AllowedFileTypes, MaintenanceMode, SupportEmail, SupportPhone

### 19. LicenseCategoryFees
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| LicenseCategoryId | INT | NOT NULL, FK -> LicenseCategories(Id) |
| FeeTypeId | INT | NOT NULL, FK -> FeeTypes(Id) |
| Amount | DECIMAL(18,2) | NOT NULL |
| EffectiveFrom | DATETIME2 | NOT NULL |
| EffectiveTo | DATETIME2 | NULL |
| IsActive | BIT | NOT NULL, DEFAULT 1 |
| CreatedAt | DATETIME2 | NOT NULL |
| UpdatedAt | DATETIME2 | NOT NULL |

**Indexes:** IX_LicenseCategoryFees_LicenseCategoryId, IX_LicenseCategoryFees_FeeTypeId
**Seed Data:** Fee mappings for each license category

### 20. ApplicationStatusHistories
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| ApplicationId | INT | NOT NULL, FK -> Applications(Id) |
| FromStatus | TINYINT | NULL |
| ToStatus | TINYINT | NOT NULL |
| ChangedByUserId | INT | NOT NULL, FK -> Users(Id) |
| Reason | NVARCHAR(500) | NULL |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() |

**Indexes:** IX_ApplicationStatusHistories_ApplicationId, IX_ApplicationStatusHistories_CreatedAt
**Seed Data:** Status transition history for test applications

### 21. PasswordResets
| Column | Type | Constraints |
|--------|------|-------------|
| Id | INT | PK, IDENTITY(1,1) |
| UserId | INT | NOT NULL, FK -> Users(Id) |
| Token | NVARCHAR(500) | NOT NULL, UNIQUE |
| ExpiresAt | DATETIME2 | NOT NULL |
| UsedAt | DATETIME2 | NULL |
| CreatedAt | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() |
| IpAddress | NVARCHAR(45) | NULL |

**Indexes:** IX_PasswordResets_Token, IX_PasswordResets_UserId
**Cleanup:** Hangfire job to delete expired/used tokens older than 24 hours

---

## RELATIONSHIPS:

```
Users 1──M UserRoles M──1 Roles
Users 1──M Applications (as Applicant)
Users 1──M Applications (as Reviewer)
Users 1──M Licenses
Users 1──M Appointments (as Applicant)
Users 1──M Appointments (as Employee)
Users 1──M Documents (as Uploader)
Users 1──M Documents (as Verifier)
Users 1──M Payments
Users 1──M Notifications
Users 1──M TestResults
Users 1──M MedicalResults
Users 1──M AuditLogs
Users 1──M RefreshTokens
Users 1──M PasswordResets

LicenseCategories 1──M Applications
LicenseCategories 1──M Licenses
LicenseCategories 1──M FeeTypes (optional)
LicenseCategories 1──M LicenseCategoryFees

Applications 1──1 Licenses
Applications 1──M Appointments
Applications 1──M Documents
Applications 1──M Payments
Applications 1──M TestResults
Applications 1──M MedicalResults
Applications 1──M ApplicationStatusHistories

FeeTypes 1──M Payments
FeeTypes 1──M LicenseCategoryFees

Appointments 1──M TestResults
Appointments 1──M MedicalResults

Countries 1──M Cities
```

## SEED DATA SUMMARY:
- **Roles:** 3 (Admin, Employee, Applicant)
- **Users:** 6 (1 admin, 2 employees, 3 applicants)
- **UserRoles:** 6 assignments
- **LicenseCategories:** 5 categories
- **FeeTypes:** 7 fee types
- **LicenseCategoryFees:** 15 fee mappings
- **Applications:** 15 (various statuses)
- **Licenses:** 2 active
- **Appointments:** 9 across applications
- **Documents:** 12 across applications
- **Payments:** 8 (completed + pending)
- **Notifications:** 8 across users
- **TestResults:** 3
- **MedicalResults:** 2
- **Countries:** 8
- **Cities:** 11
- **Settings:** 7
- **AuditLogs:** auto-generated
- **RefreshTokens:** 0 (generated at runtime)
- **PasswordResets:** 0 (generated at runtime)
- **ApplicationStatusHistories:** auto-generated

## ACCEPTANCE CRITERIA:
- [ ] All 21 tables created with correct columns and types
- [ ] All foreign key relationships established
- [ ] All indexes created
- [ ] Unique constraints on Email, NationalId, ApplicationNumber, LicenseNumber, PaymentReference
- [ ] Soft delete filters work on Users, Applications, Licenses, Appointments, Documents
- [ ] Seed data loads without errors
- [ ] Arabic collation works for NameAr columns
- [ ] EF Core migrations generated successfully
- [ ] Database can be recreated from migrations on a fresh SQL Server