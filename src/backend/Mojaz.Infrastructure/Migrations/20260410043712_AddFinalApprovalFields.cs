using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFinalApprovalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSecurityBlocked",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "FinalDecision",
                table: "Applications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FinalDecisionAt",
                table: "Applications",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FinalDecisionBy",
                table: "Applications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinalDecisionReason",
                table: "Applications",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManagerNotes",
                table: "Applications",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReturnToStage",
                table: "Applications",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 165, DateTimeKind.Utc).AddTicks(4020));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 165, DateTimeKind.Utc).AddTicks(4039));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 165, DateTimeKind.Utc).AddTicks(4042));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 165, DateTimeKind.Utc).AddTicks(4044));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 165, DateTimeKind.Utc).AddTicks(4048));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 165, DateTimeKind.Utc).AddTicks(4050));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(3981));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4017));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4022));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4026));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4029));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4087));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4095));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4099));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4200));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4205));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4209));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4213));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4216));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4219));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4222));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4227));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4231));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4234));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4237));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4241));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4243));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4247));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4250));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4299));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4303));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4306));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4309));

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "Category", "CreatedAt", "CreatedBy", "Description", "IsEncrypted", "SettingKey", "SettingValue", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000009007"), "Training", new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4271), null, "Minimum age for Category F (Agricultural)", false, "MIN_AGE_CATEGORY_F", "18", null, null },
                    { new Guid("00000000-0000-0000-0000-000000010002"), "Theory", new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4292), null, "Number of theory test questions for Category F (Agricultural)", false, "THEORY_QUESTIONS_CATEGORY_F", "20", null, null },
                    { new Guid("00000000-0000-0000-0000-000000011004"), "License", new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4296), null, "License validity in years for Category F (Agricultural)", false, "VALIDITY_YEARS_CATEGORY_F", "10", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"));

            migrationBuilder.DropColumn(
                name: "IsSecurityBlocked",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FinalDecision",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FinalDecisionAt",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FinalDecisionBy",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FinalDecisionReason",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "ManagerNotes",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "ReturnToStage",
                table: "Applications");

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7461));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7482));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7486));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7489));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7491));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7494));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6161));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6184));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6188));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6191));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6193));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6236));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6239));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6242));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6251));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6254));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6257));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6260));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6264));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6267));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6270));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6272));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6275));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6278));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6280));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6284));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6286));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6289));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6291));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6304));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6319));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6322));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6325));
        }
    }
}
