using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixUsersAndOtpCodesColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 46, DateTimeKind.Utc).AddTicks(9154));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 46, DateTimeKind.Utc).AddTicks(9175));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 46, DateTimeKind.Utc).AddTicks(9179));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 46, DateTimeKind.Utc).AddTicks(9181));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 46, DateTimeKind.Utc).AddTicks(9184));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 46, DateTimeKind.Utc).AddTicks(9187));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(249));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(273));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(276));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(279));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(281));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(323));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(326));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(329));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(337));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(340));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(344));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(349));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(352));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(354));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(357));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(359));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(362));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(365));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(367));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(369));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(372));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(374));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(377));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(389));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(407));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(402));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(410));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(469));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(473));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(404));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(476));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(479));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(482));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(485));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(488));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(492));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(496));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(503));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(506));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(508));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 57, 19, 62, DateTimeKind.Utc).AddTicks(511));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 890, DateTimeKind.Utc).AddTicks(2734));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 890, DateTimeKind.Utc).AddTicks(2763));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 890, DateTimeKind.Utc).AddTicks(2768));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 890, DateTimeKind.Utc).AddTicks(2772));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 890, DateTimeKind.Utc).AddTicks(2776));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 890, DateTimeKind.Utc).AddTicks(2779));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7660));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7683));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7687));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7690));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7693));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7741));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7744));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7748));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7757));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7760));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7764));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7767));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7770));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7773));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7776));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7779));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7782));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7784));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7788));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7791));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7793));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7796));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7799));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7813));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7832));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7826));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7835));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7838));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7841));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7830));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7843));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7847));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7849));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7852));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7855));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7859));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7865));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7868));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7871));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7873));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 25, 7, 29, 30, 906, DateTimeKind.Utc).AddTicks(7876));
        }
    }
}
