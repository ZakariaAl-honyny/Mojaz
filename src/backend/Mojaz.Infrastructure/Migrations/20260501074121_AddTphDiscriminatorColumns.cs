using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTphDiscriminatorColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Applications",
                type: "nvarchar(21)",
                maxLength: 21,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MedicalExaminationId",
                table: "Applications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NewLicenseId",
                table: "Applications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OldLicenseId",
                table: "Applications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PracticalExempt",
                table: "Applications",
                type: "bit",
                nullable: true,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "RenewalFeePaid",
                table: "Applications",
                type: "bit",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TheoryExempt",
                table: "Applications",
                type: "bit",
                nullable: true,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "TrainingExempt",
                table: "Applications",
                type: "bit",
                nullable: true,
                defaultValue: true);

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 823, DateTimeKind.Utc).AddTicks(4406));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 823, DateTimeKind.Utc).AddTicks(4416));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 823, DateTimeKind.Utc).AddTicks(4418));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 823, DateTimeKind.Utc).AddTicks(4420));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 823, DateTimeKind.Utc).AddTicks(4422));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 823, DateTimeKind.Utc).AddTicks(4424));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7408));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7414));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7416));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7417));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7419));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7458));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7460));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7462));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7469));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7470));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7472));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7473));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7475));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7476));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7478));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7479));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7480));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7493));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7494));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7496));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7497));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7499));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7500));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7513));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7522));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7524));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 51,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7529));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 52,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7531));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 53,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7532));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 61,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7538));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 71,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7543));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 72,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7544));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 73,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7546));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 81,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7553));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 82,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7554));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 83,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7556));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 84,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7557));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 85,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7559));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 86,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7560));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 87,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7562));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 88,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 7, 41, 16, 859, DateTimeKind.Utc).AddTicks(7563));

            migrationBuilder.CreateIndex(
                name: "IX_Applications_MedicalExaminationId",
                table: "Applications",
                column: "MedicalExaminationId");

            migrationBuilder.CreateIndex(
                name: "IX_RenewalApplications_NewLicenseId",
                table: "Applications",
                column: "NewLicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_RenewalApplications_OldLicenseId",
                table: "Applications",
                column: "OldLicenseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Licenses_NewLicenseId",
                table: "Applications",
                column: "NewLicenseId",
                principalTable: "Licenses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Licenses_OldLicenseId",
                table: "Applications",
                column: "OldLicenseId",
                principalTable: "Licenses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_MedicalExaminations_MedicalExaminationId",
                table: "Applications",
                column: "MedicalExaminationId",
                principalTable: "MedicalExaminations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Licenses_NewLicenseId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Licenses_OldLicenseId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_MedicalExaminations_MedicalExaminationId",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_Applications_MedicalExaminationId",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_RenewalApplications_NewLicenseId",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_RenewalApplications_OldLicenseId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "MedicalExaminationId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "NewLicenseId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "OldLicenseId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "PracticalExempt",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "RenewalFeePaid",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "TheoryExempt",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "TrainingExempt",
                table: "Applications");

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 893, DateTimeKind.Utc).AddTicks(2842));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 893, DateTimeKind.Utc).AddTicks(2862));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 893, DateTimeKind.Utc).AddTicks(2865));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 893, DateTimeKind.Utc).AddTicks(2868));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 893, DateTimeKind.Utc).AddTicks(2870));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 893, DateTimeKind.Utc).AddTicks(2873));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6338));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6347));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6351));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6354));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6357));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6419));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6422));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6425));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6434));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6436));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6438));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6440));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6442));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6444));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6446));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6448));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6450));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6470));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6473));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6475));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6478));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6480));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6485));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6504));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6518));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6520));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 51,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6527));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 52,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6529));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 53,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6531));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 61,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6539));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 71,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6543));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 72,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6545));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 73,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6547));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 81,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6557));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 82,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6559));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 83,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6562));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 84,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6564));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 85,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6566));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 86,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6568));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 87,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6570));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 88,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 1, 1, 57, 15, 922, DateTimeKind.Utc).AddTicks(6572));
        }
    }
}
