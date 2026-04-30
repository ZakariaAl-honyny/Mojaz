using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAssignmentFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AssignedAt",
                table: "Applications",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AssignedToId",
                table: "Applications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AssignmentNotes",
                table: "Applications",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 733, DateTimeKind.Utc).AddTicks(9096));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 733, DateTimeKind.Utc).AddTicks(9122));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 733, DateTimeKind.Utc).AddTicks(9126));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 733, DateTimeKind.Utc).AddTicks(9130));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 733, DateTimeKind.Utc).AddTicks(9134));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 733, DateTimeKind.Utc).AddTicks(9138));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6445));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6477));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6482));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6486));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6489));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6542));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6546));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6551));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6563));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6632));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6639));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6643));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6648));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6652));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6656));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6660));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6664));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6668));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6672));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6675));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6679));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6683));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6687));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(6707));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7233));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7224));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7236));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7240));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7244));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7229));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7249));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7252));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7258));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7263));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7267));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7270));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7273));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7277));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7280));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7283));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 29, 3, 22, 7, 748, DateTimeKind.Utc).AddTicks(7287));

            migrationBuilder.CreateIndex(
                name: "IX_Applications_AssignedToId",
                table: "Applications",
                column: "AssignedToId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Applications_AssignedToId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "AssignedAt",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "AssignedToId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "AssignmentNotes",
                table: "Applications");

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 479, DateTimeKind.Utc).AddTicks(2585));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 479, DateTimeKind.Utc).AddTicks(2603));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 479, DateTimeKind.Utc).AddTicks(2605));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 479, DateTimeKind.Utc).AddTicks(2608));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 479, DateTimeKind.Utc).AddTicks(2610));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 479, DateTimeKind.Utc).AddTicks(2612));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4351));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4369));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4372));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4374));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4376));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4410));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4413));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4415));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4423));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4425));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4428));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4430));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4512));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4517));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4519));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4522));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4524));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4527));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4529));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4531));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4533));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4535));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4537));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4550));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4577));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4573));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4580));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4582));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4584));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4575));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4586));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4589));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4591));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4593));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4596));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4598));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4601));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4603));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4606));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4608));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 42, 47, 489, DateTimeKind.Utc).AddTicks(4611));
        }
    }
}
