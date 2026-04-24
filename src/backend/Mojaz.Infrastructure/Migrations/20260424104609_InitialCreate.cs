using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ActionType = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    ActionCategory = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    EntityName = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    EntityId = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Payload = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    IsSuccess = table.Column<bool>(type: "bit", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RecipientEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    TemplateName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ReferenceId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    RetryCount = table.Column<int>(type: "int", nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ErrorMessage = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LicenseCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<byte>(type: "tinyint", nullable: false),
                    NameAr = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    MinimumAge = table.Column<int>(type: "int", nullable: false),
                    RequiresTraining = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ValidityYears = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicenseCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OtpCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    DestinationType = table.Column<byte>(type: "tinyint", nullable: false),
                    CodeHash = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Purpose = table.Column<byte>(type: "tinyint", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false),
                    UsedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsInvalidated = table.Column<bool>(type: "bit", nullable: false),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    MaxAttempts = table.Column<int>(type: "int", nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OtpCodes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRevoked = table.Column<bool>(type: "bit", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReplacedByToken = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    CreatedByIp = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SettingKey = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    SettingValue = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    IsEncrypted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FullNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NationalId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    AppRole = table.Column<int>(type: "int", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Nationality = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    BloodType = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    City = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Region = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ApplicantType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    PreferredLanguage = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    AppointmentPreference = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NotificationPreferences = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    RegistrationMethod = table.Column<int>(type: "int", maxLength: 20, nullable: false),
                    IsEmailVerified = table.Column<bool>(type: "bit", nullable: false),
                    IsPhoneVerified = table.Column<bool>(type: "bit", nullable: false),
                    EmailVerifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PhoneVerifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsLocked = table.Column<bool>(type: "bit", nullable: false),
                    RequiresPasswordReset = table.Column<bool>(type: "bit", nullable: false),
                    EnableEmail = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    EnableSms = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    EnablePush = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsSecurityBlocked = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    FailedLoginAttempts = table.Column<int>(type: "int", nullable: false),
                    LockoutEnd = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.CheckConstraint("CK_Users_Contact", "(Email IS NOT NULL OR PhoneNumber IS NOT NULL)");
                });

            migrationBuilder.CreateTable(
                name: "FeeStructures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FeeType = table.Column<byte>(type: "tinyint", nullable: false),
                    LicenseCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    EffectiveFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EffectiveTo = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeeStructures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeeStructures_LicenseCategories_LicenseCategoryId",
                        column: x => x.LicenseCategoryId,
                        principalTable: "LicenseCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ApplicantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ServiceType = table.Column<byte>(type: "tinyint", nullable: false),
                    LicenseCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BranchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Status = table.Column<byte>(type: "tinyint", nullable: false),
                    CurrentStage = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PreferredLanguage = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    SpecialNeeds = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DataAccuracyConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CancelledAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CancellationReason = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TheoryAttemptCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    PracticalAttemptCount = table.Column<int>(type: "int", nullable: false),
                    AdditionalTrainingRequired = table.Column<bool>(type: "bit", nullable: false),
                    FinalDecision = table.Column<byte>(type: "tinyint", nullable: true),
                    FinalDecisionBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FinalDecisionAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FinalDecisionReason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ReturnToStage = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ManagerNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Applications_LicenseCategories_LicenseCategoryId",
                        column: x => x.LicenseCategoryId,
                        principalTable: "LicenseCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Applications_Users_ApplicantId",
                        column: x => x.ApplicantId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Licenses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LicenseNumber = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HolderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LicenseCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BranchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IssuedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IssuedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Status = table.Column<byte>(type: "tinyint", nullable: false),
                    QrCode = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    BlobUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrintedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DownloadedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Licenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Licenses_LicenseCategories_LicenseCategoryId",
                        column: x => x.LicenseCategoryId,
                        principalTable: "LicenseCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Licenses_Users_HolderId",
                        column: x => x.HolderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    EventType = table.Column<byte>(type: "tinyint", nullable: false),
                    TitleAr = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    MessageAr = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    MessageEn = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RelatedEntityId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    RelatedEntityType = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PushTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DeviceType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastUsedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PushTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PushTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationDocuments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentType = table.Column<byte>(type: "tinyint", nullable: false),
                    OriginalFileName = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    StoredFileName = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<byte>(type: "tinyint", nullable: false),
                    ReviewedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicationDocuments_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationStatusHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FromStatus = table.Column<byte>(type: "tinyint", nullable: false),
                    ToStatus = table.Column<byte>(type: "tinyint", nullable: false),
                    ChangedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationStatusHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicationStatusHistories_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AppointmentType = table.Column<byte>(type: "tinyint", nullable: false),
                    ScheduledDate = table.Column<DateOnly>(type: "date", nullable: false),
                    TimeSlot = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    BranchId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AssignedStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    CancelledAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CancellationReason = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    RescheduleCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ReminderSent = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicalExaminations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DoctorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExaminedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FitnessResult = table.Column<byte>(type: "tinyint", nullable: false),
                    BloodType = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    ReportReference = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    ValidUntil = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CertificatePath = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalExaminations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalExaminations_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PaymentTransactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FeeType = table.Column<byte>(type: "tinyint", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Status = table.Column<byte>(type: "tinyint", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TransactionReference = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PaidAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FailedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FailureReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ReceiptPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ReceiptNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentTransactions_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PracticalTests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExaminerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AttemptNumber = table.Column<int>(type: "int", nullable: false),
                    ConductedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: true),
                    PassingScore = table.Column<int>(type: "int", nullable: false),
                    IsAbsent = table.Column<bool>(type: "bit", nullable: false),
                    Result = table.Column<byte>(type: "tinyint", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    VehicleUsed = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    RequiresAdditionalTraining = table.Column<bool>(type: "bit", nullable: false),
                    AdditionalHoursRequired = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PracticalTests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PracticalTests_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PracticalTests_Users_ExaminerId",
                        column: x => x.ExaminerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SmsLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RecipientNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TemplateType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TwilioMessageId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ErrorMessage = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SmsLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SmsLogs_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SmsLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TheoryTests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExaminerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AttemptNumber = table.Column<int>(type: "int", nullable: false),
                    ConductedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: true),
                    PassingScore = table.Column<int>(type: "int", nullable: false),
                    Result = table.Column<byte>(type: "tinyint", nullable: false),
                    IsAbsent = table.Column<bool>(type: "bit", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TheoryTests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TheoryTests_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TheoryTests_Users_ExaminerId",
                        column: x => x.ExaminerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CategoryUpgrades",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LicenseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FromCategory = table.Column<byte>(type: "tinyint", nullable: false),
                    ToCategory = table.Column<byte>(type: "tinyint", nullable: false),
                    UpgradedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProcessedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryUpgrades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CategoryUpgrades_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CategoryUpgrades_Licenses_LicenseId",
                        column: x => x.LicenseId,
                        principalTable: "Licenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LicenseRenewals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LicenseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RenewedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NewExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProcessedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicenseRenewals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicenseRenewals_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LicenseRenewals_Licenses_LicenseId",
                        column: x => x.LicenseId,
                        principalTable: "Licenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LicenseReplacements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LicenseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Reason = table.Column<int>(type: "int", maxLength: 256, nullable: false),
                    IsReportVerified = table.Column<bool>(type: "bit", nullable: false),
                    ReviewComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProcessedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProcessedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicenseReplacements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicenseReplacements_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LicenseReplacements_Licenses_LicenseId",
                        column: x => x.LicenseId,
                        principalTable: "Licenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrainingRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CertificateNumber = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    CompletedHours = table.Column<int>(type: "int", nullable: false),
                    TotalHoursRequired = table.Column<int>(type: "int", nullable: false),
                    TrainingStatus = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsExempted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ExemptionReason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ExemptionDocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ExemptionApprovedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ExemptionApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExemptionRejectionReason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TrainingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TrainerName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CenterName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingRecords_ApplicationDocuments_ExemptionDocumentId",
                        column: x => x.ExemptionDocumentId,
                        principalTable: "ApplicationDocuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrainingRecords_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrainingRecords_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrainingRecords_Users_ExemptionApprovedBy",
                        column: x => x.ExemptionApprovedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "LicenseCategories",
                columns: new[] { "Id", "Code", "CreatedAt", "CreatedBy", "IsActive", "MinimumAge", "NameAr", "NameEn", "RequiresTraining", "UpdatedAt", "UpdatedBy", "ValidityYears" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), (byte)0, new DateTime(2026, 4, 24, 10, 46, 8, 638, DateTimeKind.Utc).AddTicks(6320), null, true, 16, "دراجة نارية", "Motorcycle", true, null, null, 0 },
                    { new Guid("00000000-0000-0000-0000-000000000002"), (byte)1, new DateTime(2026, 4, 24, 10, 46, 8, 638, DateTimeKind.Utc).AddTicks(6339), null, true, 18, "خصوصي", "Private", true, null, null, 0 },
                    { new Guid("00000000-0000-0000-0000-000000000003"), (byte)2, new DateTime(2026, 4, 24, 10, 46, 8, 638, DateTimeKind.Utc).AddTicks(6343), null, true, 21, "نقل عام", "Public Transport", true, null, null, 0 },
                    { new Guid("00000000-0000-0000-0000-000000000004"), (byte)3, new DateTime(2026, 4, 24, 10, 46, 8, 638, DateTimeKind.Utc).AddTicks(6345), null, true, 21, "مركبات ثقيلة", "Heavy Vehicles", true, null, null, 0 },
                    { new Guid("00000000-0000-0000-0000-000000000005"), (byte)4, new DateTime(2026, 4, 24, 10, 46, 8, 638, DateTimeKind.Utc).AddTicks(6348), null, true, 21, "مركبات صناعية", "Industrial Vehicles", true, null, null, 0 },
                    { new Guid("00000000-0000-0000-0000-000000000006"), (byte)5, new DateTime(2026, 4, 24, 10, 46, 8, 638, DateTimeKind.Utc).AddTicks(6350), null, true, 18, "مركبات زراعية", "Agricultural Vehicles", true, null, null, 0 }
                });

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "Category", "CreatedAt", "CreatedBy", "Description", "IsEncrypted", "SettingKey", "SettingValue", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000001001"), "OTP", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8368), null, "OTP validity in minutes for SMS", false, "OTP_VALIDITY_MINUTES_SMS", "5", null, null },
                    { new Guid("00000000-0000-0000-0000-000000001002"), "OTP", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8387), null, "OTP validity in minutes for Email", false, "OTP_VALIDITY_MINUTES_EMAIL", "10", null, null },
                    { new Guid("00000000-0000-0000-0000-000000001003"), "OTP", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8390), null, "Max OTP verification attempts", false, "OTP_MAX_ATTEMPTS", "3", null, null },
                    { new Guid("00000000-0000-0000-0000-000000001004"), "OTP", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8392), null, "Cooldown in seconds before resending OTP", false, "OTP_RESEND_COOLDOWN_SECONDS", "60", null, null },
                    { new Guid("00000000-0000-0000-0000-000000001005"), "OTP", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8395), null, "Max OTP resends per hour", false, "OTP_MAX_RESEND_PER_HOUR", "3", null, null },
                    { new Guid("00000000-0000-0000-0000-000000007001"), "Email", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8436), null, "Deduplication window in seconds for outgoing emails", false, "EMAIL_DEDUP_WINDOW_SECONDS", "300", null, null },
                    { new Guid("00000000-0000-0000-0000-000000007002"), "Email", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8438), null, "Maximum retry attempts for failed emails", false, "EMAIL_MAX_RETRIES", "3", null, null },
                    { new Guid("00000000-0000-0000-0000-000000007003"), "Email", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8441), null, "Base delay in seconds for email retry exponential backoff", false, "EMAIL_RETRY_BASE_DELAY_SECONDS", "60", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008001"), "Appointment", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8450), null, "Maximum number of times an applicant can reschedule an appointment", false, "MAX_RESCHEDULE_COUNT", "3", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008002"), "Appointment", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8453), null, "Default duration of an appointment slot in minutes", false, "DEFAULT_APPOINTMENT_DURATION_MINUTES", "30", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008003"), "Appointment", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8456), null, "Maximum number of appointments allowed per time slot per branch", false, "MAX_APPOINTMENTS_PER_SLOT", "2", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008004"), "Appointment", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8459), null, "Buffer time between appointments in minutes", false, "SLOT_BUFFER_MINUTES", "15", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008005"), "Appointment", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8462), null, "Start of working hours for appointments (24-hour format)", false, "WORKING_HOURS_START", "08:00", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008006"), "Appointment", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8464), null, "End of working hours for appointments (24-hour format)", false, "WORKING_HOURS_END", "16:00", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008007"), "Appointment", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8467), null, "Hours before appointment to send reminder notification", false, "REMINDER_HOURS_BEFORE", "24", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008008"), "Appointment", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8515), null, "Minimum days in advance an appointment must be booked", false, "MIN_BOOKING_DAYS_AHEAD", "1", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008009"), "Appointment", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8518), null, "Maximum days in advance an appointment can be booked", false, "MAX_BOOKING_DAYS_AHEAD", "30", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009001"), "Training", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8521), null, "Minimum training hours for Category A (Motorcycle)", false, "MIN_TRAINING_HOURS_CATEGORY_A", "8", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009002"), "Training", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8523), null, "Minimum training hours for Category B (Private)", false, "MIN_TRAINING_HOURS_CATEGORY_B", "20", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009003"), "Training", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8525), null, "Minimum training hours for Category C (Public Transport)", false, "MIN_TRAINING_HOURS_CATEGORY_C", "30", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009004"), "Training", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8527), null, "Minimum training hours for Category D (Heavy Vehicles)", false, "MIN_TRAINING_HOURS_CATEGORY_D", "40", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009005"), "Training", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8531), null, "Minimum training hours for Category E (Industrial)", false, "MIN_TRAINING_HOURS_CATEGORY_E", "40", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009006"), "Training", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8533), null, "Minimum training hours for Category F (Agricultural)", false, "MIN_TRAINING_HOURS_CATEGORY_F", "20", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009007"), "Training", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8545), null, "Minimum age for Category F (Agricultural)", false, "MIN_AGE_CATEGORY_F", "18", null, null },
                    { new Guid("00000000-0000-0000-0000-000000010001"), "Theory", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8564), null, "Minimum passing score for theory test", false, "MIN_PASS_SCORE_THEORY", "80", null, null },
                    { new Guid("00000000-0000-0000-0000-000000010002"), "Theory", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8560), null, "Number of theory test questions for Category F (Agricultural)", false, "THEORY_QUESTIONS_CATEGORY_F", "20", null, null },
                    { new Guid("00000000-0000-0000-0000-000000011001"), "Practical", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8567), null, "Minimum passing score for practical test", false, "MIN_PASS_SCORE_PRACTICAL", "80", null, null },
                    { new Guid("00000000-0000-0000-0000-000000011002"), "Practical", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8569), null, "Maximum number of practical test attempts", false, "MAX_PRACTICAL_ATTEMPTS", "3", null, null },
                    { new Guid("00000000-0000-0000-0000-000000011003"), "Practical", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8571), null, "Days applicant must wait before rebooking after practical test failure", false, "COOLING_PERIOD_DAYS_PRACTICAL", "7", null, null },
                    { new Guid("00000000-0000-0000-0000-000000011004"), "License", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8562), null, "License validity in years for Category F (Agricultural)", false, "VALIDITY_YEARS_CATEGORY_F", "10", null, null },
                    { new Guid("00000000-0000-0000-0000-000000012001"), "Upgrade", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8573), null, "Minimum months a license must be held before upgrading", false, "MIN_HOLDING_PERIOD_UPGRADE_MONTHS", "12", null, null },
                    { new Guid("00000000-0000-0000-0000-000000012002"), "Upgrade", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8577), null, "Allowed category upgrade paths (Format: FROM-TO, separated by comma)", false, "ALLOWED_UPGRADE_PATHS", "B-C,C-D,D-E,F-B", null, null },
                    { new Guid("00000000-0000-0000-0000-000000012003"), "Upgrade", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8579), null, "Percentage reduction in training hours for category upgrades", false, "UPGRADE_TRAINING_REDUCTION_PCNT", "50", null, null },
                    { new Guid("00000000-0000-0000-0000-000000013001"), "Security", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8581), null, "Retention period for Audit Logs in days", false, "SECURITY_LOG_RETENTION_DAYS", "90", null, null },
                    { new Guid("00000000-0000-0000-0000-000000013002"), "Security", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8584), null, "Number of permits for authentication endpoints per window", false, "RATE_LIMIT_AUTH_PERMIT", "10", null, null },
                    { new Guid("00000000-0000-0000-0000-000000013003"), "Security", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8586), null, "Time window in seconds for authentication rate limiting", false, "RATE_LIMIT_AUTH_WINDOW", "60", null, null },
                    { new Guid("00000000-0000-0000-0000-000000013004"), "Security", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8589), null, "Number of permits for global API endpoints per window", false, "RATE_LIMIT_GLOBAL_PERMIT", "100", null, null },
                    { new Guid("00000000-0000-0000-0000-000000013005"), "Security", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8591), null, "Time window in seconds for global rate limiting", false, "RATE_LIMIT_GLOBAL_WINDOW", "60", null, null },
                    { new Guid("00000000-0000-0000-0000-000000013006"), "Security", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8593), null, "Maximum allowed file size for uploads in bytes (Default 5MB)", false, "MAX_FILE_SIZE_BYTES", "5242880", null, null },
                    { new Guid("00000000-0000-0000-0000-000000013007"), "Security", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8595), null, "Number of failed login attempts before sending security alert", false, "SECURITY_ALERT_THRESHOLD", "5", null, null },
                    { new Guid("00000000-0000-0000-0000-000000013008"), "Security", new DateTime(2026, 4, 24, 10, 46, 8, 648, DateTimeKind.Utc).AddTicks(8598), null, "Time window in minutes for security alert threshold", false, "SECURITY_ALERT_WINDOW_MINS", "10", null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationDocuments_ApplicationId",
                table: "ApplicationDocuments",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationDocuments_DocumentType",
                table: "ApplicationDocuments",
                column: "DocumentType");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationDocuments_Status",
                table: "ApplicationDocuments",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_ApplicantId",
                table: "Applications",
                column: "ApplicantId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_ApplicationNumber",
                table: "Applications",
                column: "ApplicationNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Applications_LicenseCategoryId",
                table: "Applications",
                column: "LicenseCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationStatusHistories_ApplicationId",
                table: "ApplicationStatusHistories",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationStatusHistories_ChangedAt",
                table: "ApplicationStatusHistories",
                column: "ChangedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ApplicationId",
                table: "Appointments",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_AppointmentType",
                table: "Appointments",
                column: "AppointmentType");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_BranchId",
                table: "Appointments",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_RescheduleCount",
                table: "Appointments",
                column: "RescheduleCount");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ScheduledDate",
                table: "Appointments",
                column: "ScheduledDate");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_Status",
                table: "Appointments",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_ActionCategory",
                table: "AuditLogs",
                column: "ActionCategory");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_EntityId",
                table: "AuditLogs",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_EntityName",
                table: "AuditLogs",
                column: "EntityName");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Timestamp",
                table: "AuditLogs",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_UserId",
                table: "AuditLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryUpgrades_ApplicationId",
                table: "CategoryUpgrades",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryUpgrades_LicenseId",
                table: "CategoryUpgrades",
                column: "LicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryUpgrades_UpgradedAt",
                table: "CategoryUpgrades",
                column: "UpgradedAt");

            migrationBuilder.CreateIndex(
                name: "IX_EmailLogs_RecipientEmail_TemplateName_ReferenceId",
                table: "EmailLogs",
                columns: new[] { "RecipientEmail", "TemplateName", "ReferenceId" });

            migrationBuilder.CreateIndex(
                name: "IX_FeeStructures_FeeType_LicenseCategoryId_IsActive",
                table: "FeeStructures",
                columns: new[] { "FeeType", "LicenseCategoryId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_FeeStructures_LicenseCategoryId",
                table: "FeeStructures",
                column: "LicenseCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseCategories_Code",
                table: "LicenseCategories",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LicenseCategories_IsActive",
                table: "LicenseCategories",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseRenewals_ApplicationId",
                table: "LicenseRenewals",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseRenewals_LicenseId",
                table: "LicenseRenewals",
                column: "LicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseRenewals_RenewedAt",
                table: "LicenseRenewals",
                column: "RenewedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseReplacements_ApplicationId",
                table: "LicenseReplacements",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseReplacements_LicenseId",
                table: "LicenseReplacements",
                column: "LicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseReplacements_ProcessedAt",
                table: "LicenseReplacements",
                column: "ProcessedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_ApplicationId",
                table: "Licenses",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_ExpiresAt",
                table: "Licenses",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_HolderId",
                table: "Licenses",
                column: "HolderId");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_HolderId_Status",
                table: "Licenses",
                columns: new[] { "HolderId", "Status" },
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_LicenseCategoryId",
                table: "Licenses",
                column: "LicenseCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_LicenseNumber",
                table: "Licenses",
                column: "LicenseNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_Status",
                table: "Licenses",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalExaminations_ApplicationId",
                table: "MedicalExaminations",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalExaminations_DoctorId",
                table: "MedicalExaminations",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalExaminations_FitnessResult",
                table: "MedicalExaminations",
                column: "FitnessResult");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ApplicationId",
                table: "Notifications",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_EventType",
                table: "Notifications",
                column: "EventType");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_SentAt",
                table: "Notifications",
                column: "SentAt");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OtpCodes_Destination",
                table: "OtpCodes",
                column: "Destination");

            migrationBuilder.CreateIndex(
                name: "IX_OtpCodes_ExpiresAt",
                table: "OtpCodes",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_OtpCodes_Purpose",
                table: "OtpCodes",
                column: "Purpose");

            migrationBuilder.CreateIndex(
                name: "IX_OtpCodes_UserId",
                table: "OtpCodes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_ApplicationId",
                table: "PaymentTransactions",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_Status",
                table: "PaymentTransactions",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_TransactionReference",
                table: "PaymentTransactions",
                column: "TransactionReference",
                unique: true,
                filter: "[TransactionReference] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PracticalTests_ApplicationId",
                table: "PracticalTests",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_PracticalTests_ExaminerId",
                table: "PracticalTests",
                column: "ExaminerId");

            migrationBuilder.CreateIndex(
                name: "IX_PracticalTests_Result",
                table: "PracticalTests",
                column: "Result");

            migrationBuilder.CreateIndex(
                name: "IX_PushTokens_Token",
                table: "PushTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PushTokens_UserId",
                table: "PushTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_ExpiresAt",
                table: "RefreshTokens",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_Token",
                table: "RefreshTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SmsLogs_ApplicationId",
                table: "SmsLogs",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_SmsLogs_CreatedAt",
                table: "SmsLogs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SmsLogs_Status",
                table: "SmsLogs",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_SmsLogs_UserId_TemplateType",
                table: "SmsLogs",
                columns: new[] { "UserId", "TemplateType" });

            migrationBuilder.CreateIndex(
                name: "IX_SystemSettings_Category",
                table: "SystemSettings",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_SystemSettings_SettingKey",
                table: "SystemSettings",
                column: "SettingKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TheoryTests_ApplicationId",
                table: "TheoryTests",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_TheoryTests_ExaminerId",
                table: "TheoryTests",
                column: "ExaminerId");

            migrationBuilder.CreateIndex(
                name: "IX_TheoryTests_Result",
                table: "TheoryTests",
                column: "Result");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingRecords_ApplicationId",
                table: "TrainingRecords",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingRecords_CreatedBy",
                table: "TrainingRecords",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingRecords_ExemptionApprovedBy",
                table: "TrainingRecords",
                column: "ExemptionApprovedBy");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingRecords_ExemptionDocumentId",
                table: "TrainingRecords",
                column: "ExemptionDocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingRecords_SchoolName",
                table: "TrainingRecords",
                column: "SchoolName");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingRecords_TrainingStatus",
                table: "TrainingRecords",
                column: "TrainingStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Users_NationalId",
                table: "Users",
                column: "NationalId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationStatusHistories");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "CategoryUpgrades");

            migrationBuilder.DropTable(
                name: "EmailLogs");

            migrationBuilder.DropTable(
                name: "FeeStructures");

            migrationBuilder.DropTable(
                name: "LicenseRenewals");

            migrationBuilder.DropTable(
                name: "LicenseReplacements");

            migrationBuilder.DropTable(
                name: "MedicalExaminations");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "OtpCodes");

            migrationBuilder.DropTable(
                name: "PaymentTransactions");

            migrationBuilder.DropTable(
                name: "PracticalTests");

            migrationBuilder.DropTable(
                name: "PushTokens");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "SmsLogs");

            migrationBuilder.DropTable(
                name: "SystemSettings");

            migrationBuilder.DropTable(
                name: "TheoryTests");

            migrationBuilder.DropTable(
                name: "TrainingRecords");

            migrationBuilder.DropTable(
                name: "Licenses");

            migrationBuilder.DropTable(
                name: "ApplicationDocuments");

            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropTable(
                name: "LicenseCategories");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
