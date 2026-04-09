using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTrainingRecordExtendedFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Applications_ApplicationId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingRecords_Applications_ApplicationId",
                table: "TrainingRecords");

            migrationBuilder.DropIndex(
                name: "IX_TrainingRecords_Status",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "IpAddress",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "NewValues",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "OldValues",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "UserAgent",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "FileName",
                table: "ApplicationDocuments");

            migrationBuilder.DropColumn(
                name: "UploadedAt",
                table: "ApplicationDocuments");

            migrationBuilder.RenameColumn(
                name: "RequiredHours",
                table: "TrainingRecords",
                newName: "TotalHoursRequired");

            migrationBuilder.RenameColumn(
                name: "IsExempt",
                table: "TrainingRecords",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "EntityType",
                table: "AuditLogs",
                newName: "EntityName");

            migrationBuilder.RenameColumn(
                name: "Action",
                table: "AuditLogs",
                newName: "ActionType");

            migrationBuilder.RenameIndex(
                name: "IX_AuditLogs_EntityType",
                table: "AuditLogs",
                newName: "IX_AuditLogs_EntityName");

            migrationBuilder.RenameColumn(
                name: "FileSize",
                table: "ApplicationDocuments",
                newName: "FileSizeBytes");

            migrationBuilder.AddColumn<int>(
                name: "AppRole",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "EnableEmail",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnablePush",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnableSms",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresPasswordReset",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "SchoolName",
                table: "TrainingRecords",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "ExemptionReason",
                table: "TrainingRecords",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CenterName",
                table: "TrainingRecords",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "TrainingRecords",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedBy",
                table: "TrainingRecords",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExemptionApprovedAt",
                table: "TrainingRecords",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ExemptionDocumentId",
                table: "TrainingRecords",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExemptionRejectionReason",
                table: "TrainingRecords",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsExempted",
                table: "TrainingRecords",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TrainerName",
                table: "TrainingRecords",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TrainingDate",
                table: "TrainingRecords",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TrainingStatus",
                table: "TrainingRecords",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "TwilioMessageId",
                table: "SmsLogs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "ErrorMessage",
                table: "SmsLogs",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<string>(
                name: "ErrorMessage",
                table: "EmailLogs",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<string>(
                name: "EntityId",
                table: "AuditLogs",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldMaxLength: 64);

            migrationBuilder.AddColumn<string>(
                name: "Payload",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<Guid>(
                name: "BranchId",
                table: "Appointments",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<bool>(
                name: "ReminderSent",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RescheduleCount",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Appointments",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CurrentStage",
                table: "Applications",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "ApplicationDocuments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "ApplicationDocuments",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "Pending",
                oldClrType: typeof(string),
                oldType: "nvarchar(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "RejectionReason",
                table: "ApplicationDocuments",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FilePath",
                table: "ApplicationDocuments",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "ContentType",
                table: "ApplicationDocuments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(64)",
                oldMaxLength: 64);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "ApplicationDocuments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedBy",
                table: "ApplicationDocuments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "ApplicationDocuments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OriginalFileName",
                table: "ApplicationDocuments",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StoredFileName",
                table: "ApplicationDocuments",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6317));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6339));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6343));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6345));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6350));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6391));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6393));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6397));

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "Category", "CreatedAt", "CreatedBy", "Description", "IsEncrypted", "SettingKey", "SettingValue", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000008001"), "Appointment", new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6404), null, "Maximum number of times an applicant can reschedule an appointment", false, "MAX_RESCHEDULE_COUNT", "3", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008002"), "Appointment", new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6406), null, "Default duration of an appointment slot in minutes", false, "DEFAULT_APPOINTMENT_DURATION_MINUTES", "30", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008003"), "Appointment", new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6408), null, "Maximum number of appointments allowed per time slot per branch", false, "MAX_APPOINTMENTS_PER_SLOT", "2", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008004"), "Appointment", new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6410), null, "Buffer time between appointments in minutes", false, "SLOT_BUFFER_MINUTES", "15", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008005"), "Appointment", new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6413), null, "Start of working hours for appointments (24-hour format)", false, "WORKING_HOURS_START", "08:00", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008006"), "Appointment", new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6415), null, "End of working hours for appointments (24-hour format)", false, "WORKING_HOURS_END", "16:00", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008007"), "Appointment", new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6418), null, "Hours before appointment to send reminder notification", false, "REMINDER_HOURS_BEFORE", "24", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008008"), "Appointment", new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6421), null, "Minimum days in advance an appointment must be booked", false, "MIN_BOOKING_DAYS_AHEAD", "1", null, null },
                    { new Guid("00000000-0000-0000-0000-000000008009"), "Appointment", new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6423), null, "Maximum days in advance an appointment can be booked", false, "MAX_BOOKING_DAYS_AHEAD", "30", null, null }
                });

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
                name: "IX_TrainingRecords_TrainingStatus",
                table: "TrainingRecords",
                column: "TrainingStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_BranchId",
                table: "Appointments",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_RescheduleCount",
                table: "Appointments",
                column: "RescheduleCount");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationDocuments_ApplicationId_DocumentType",
                table: "ApplicationDocuments",
                columns: new[] { "ApplicationId", "DocumentType" },
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Applications_ApplicationId",
                table: "Appointments",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingRecords_ApplicationDocuments_ExemptionDocumentId",
                table: "TrainingRecords",
                column: "ExemptionDocumentId",
                principalTable: "ApplicationDocuments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingRecords_Applications_ApplicationId",
                table: "TrainingRecords",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingRecords_Users_CreatedBy",
                table: "TrainingRecords",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingRecords_Users_ExemptionApprovedBy",
                table: "TrainingRecords",
                column: "ExemptionApprovedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Applications_ApplicationId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingRecords_ApplicationDocuments_ExemptionDocumentId",
                table: "TrainingRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingRecords_Applications_ApplicationId",
                table: "TrainingRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingRecords_Users_CreatedBy",
                table: "TrainingRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingRecords_Users_ExemptionApprovedBy",
                table: "TrainingRecords");

            migrationBuilder.DropIndex(
                name: "IX_TrainingRecords_CreatedBy",
                table: "TrainingRecords");

            migrationBuilder.DropIndex(
                name: "IX_TrainingRecords_ExemptionApprovedBy",
                table: "TrainingRecords");

            migrationBuilder.DropIndex(
                name: "IX_TrainingRecords_ExemptionDocumentId",
                table: "TrainingRecords");

            migrationBuilder.DropIndex(
                name: "IX_TrainingRecords_TrainingStatus",
                table: "TrainingRecords");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_BranchId",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_RescheduleCount",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationDocuments_ApplicationId_DocumentType",
                table: "ApplicationDocuments");

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"));

            migrationBuilder.DropColumn(
                name: "AppRole",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EnableEmail",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EnablePush",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EnableSms",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RequiresPasswordReset",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CenterName",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "ExemptionApprovedAt",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "ExemptionDocumentId",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "ExemptionRejectionReason",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "IsExempted",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "TrainerName",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "TrainingDate",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "TrainingStatus",
                table: "TrainingRecords");

            migrationBuilder.DropColumn(
                name: "Payload",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "ReminderSent",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "RescheduleCount",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "ApplicationDocuments");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "ApplicationDocuments");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "ApplicationDocuments");

            migrationBuilder.DropColumn(
                name: "OriginalFileName",
                table: "ApplicationDocuments");

            migrationBuilder.DropColumn(
                name: "StoredFileName",
                table: "ApplicationDocuments");

            migrationBuilder.RenameColumn(
                name: "TotalHoursRequired",
                table: "TrainingRecords",
                newName: "RequiredHours");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "TrainingRecords",
                newName: "IsExempt");

            migrationBuilder.RenameColumn(
                name: "EntityName",
                table: "AuditLogs",
                newName: "EntityType");

            migrationBuilder.RenameColumn(
                name: "ActionType",
                table: "AuditLogs",
                newName: "Action");

            migrationBuilder.RenameIndex(
                name: "IX_AuditLogs_EntityName",
                table: "AuditLogs",
                newName: "IX_AuditLogs_EntityType");

            migrationBuilder.RenameColumn(
                name: "FileSizeBytes",
                table: "ApplicationDocuments",
                newName: "FileSize");

            migrationBuilder.AlterColumn<string>(
                name: "SchoolName",
                table: "TrainingRecords",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "ExemptionReason",
                table: "TrainingRecords",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "TrainingRecords",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "TwilioMessageId",
                table: "SmsLogs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ErrorMessage",
                table: "SmsLogs",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ErrorMessage",
                table: "EmailLogs",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "EntityId",
                table: "AuditLogs",
                type: "uniqueidentifier",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(64)",
                oldMaxLength: 64);

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                table: "AuditLogs",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NewValues",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OldValues",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserAgent",
                table: "AuditLogs",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "BranchId",
                table: "Appointments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CurrentStage",
                table: "Applications",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "ApplicationDocuments",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "ApplicationDocuments",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(32)",
                oldMaxLength: 32,
                oldDefaultValue: "Pending");

            migrationBuilder.AlterColumn<string>(
                name: "RejectionReason",
                table: "ApplicationDocuments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FilePath",
                table: "ApplicationDocuments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<string>(
                name: "ContentType",
                table: "ApplicationDocuments",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "ApplicationDocuments",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UploadedAt",
                table: "ApplicationDocuments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 5, 4, 58, 582, DateTimeKind.Utc).AddTicks(2704));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 5, 4, 58, 582, DateTimeKind.Utc).AddTicks(2730));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 5, 4, 58, 582, DateTimeKind.Utc).AddTicks(2735));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 5, 4, 58, 582, DateTimeKind.Utc).AddTicks(2739));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 5, 4, 58, 582, DateTimeKind.Utc).AddTicks(2742));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 5, 4, 58, 582, DateTimeKind.Utc).AddTicks(2799));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 5, 4, 58, 582, DateTimeKind.Utc).AddTicks(2803));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 8, 5, 4, 58, 582, DateTimeKind.Utc).AddTicks(2807));

            migrationBuilder.CreateIndex(
                name: "IX_TrainingRecords_Status",
                table: "TrainingRecords",
                column: "Status");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Applications_ApplicationId",
                table: "Appointments",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingRecords_Applications_ApplicationId",
                table: "TrainingRecords",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
