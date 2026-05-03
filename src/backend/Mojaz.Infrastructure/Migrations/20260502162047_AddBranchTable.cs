using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBranchTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<bool>(
                name: "TrainingExempt",
                table: "Applications",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "TheoryExempt",
                table: "Applications",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "RenewalFeePaid",
                table: "Applications",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "PracticalExempt",
                table: "Applications",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.CreateTable(
                name: "Branches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branches", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 705, DateTimeKind.Utc).AddTicks(3162));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 705, DateTimeKind.Utc).AddTicks(3174));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 705, DateTimeKind.Utc).AddTicks(3178));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 705, DateTimeKind.Utc).AddTicks(3183));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 705, DateTimeKind.Utc).AddTicks(3186));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 705, DateTimeKind.Utc).AddTicks(3190));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(4951));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(4961));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(4965));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(4968));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(4971));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5045));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5049));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5052));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5068));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5071));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5151));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5156));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5159));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5162));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5166));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5169));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5172));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5206));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5210));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5213));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5216));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5219));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5222));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5225));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5244));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5247));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 51,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5259));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 52,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5262));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 53,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5265));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 61,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5279));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 71,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5290));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 72,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5293));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 73,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5295));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 81,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5311));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 82,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5315));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 83,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5318));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 84,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5320));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 85,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5323));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 86,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5326));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 87,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5329));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 88,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 16, 20, 41, 833, DateTimeKind.Utc).AddTicks(5331));

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_AssignedStaffId",
                table: "Appointments",
                column: "AssignedStaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Licenses_NewLicenseId",
                table: "Applications",
                column: "NewLicenseId",
                principalTable: "Licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Licenses_OldLicenseId",
                table: "Applications",
                column: "OldLicenseId",
                principalTable: "Licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_MedicalExaminations_MedicalExaminationId",
                table: "Applications",
                column: "MedicalExaminationId",
                principalTable: "MedicalExaminations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Branches_BranchId",
                table: "Appointments",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Users_AssignedStaffId",
                table: "Appointments",
                column: "AssignedStaffId",
                principalTable: "Users",
                principalColumn: "Id");
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

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Branches_BranchId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Users_AssignedStaffId",
                table: "Appointments");

            migrationBuilder.DropTable(
                name: "Branches");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_AssignedStaffId",
                table: "Appointments");

            migrationBuilder.AlterColumn<bool>(
                name: "TrainingExempt",
                table: "Applications",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "TheoryExempt",
                table: "Applications",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "RenewalFeePaid",
                table: "Applications",
                type: "bit",
                nullable: true,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "PracticalExempt",
                table: "Applications",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

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
    }
}
