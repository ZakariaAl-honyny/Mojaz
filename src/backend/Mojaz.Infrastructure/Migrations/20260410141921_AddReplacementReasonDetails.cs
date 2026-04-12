using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddReplacementReasonDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Reason",
                table: "LicenseReplacements",
                type: "int",
                maxLength: 256,
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsReportVerified",
                table: "LicenseReplacements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ReviewComments",
                table: "LicenseReplacements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 882, DateTimeKind.Utc).AddTicks(8663));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 882, DateTimeKind.Utc).AddTicks(8685));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 882, DateTimeKind.Utc).AddTicks(8689));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 882, DateTimeKind.Utc).AddTicks(8693));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 882, DateTimeKind.Utc).AddTicks(8696));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 882, DateTimeKind.Utc).AddTicks(8699));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9523));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9630));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9640));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9643));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9652));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9775));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9779));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9783));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9793));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9795));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9798));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9803));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9809));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9815));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9818));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9820));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9836));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9838));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9842));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9845));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9847));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9850));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9853));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9868));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9901));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9894));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9904));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9906));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9909));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 14, 19, 15, 899, DateTimeKind.Utc).AddTicks(9897));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsReportVerified",
                table: "LicenseReplacements");

            migrationBuilder.DropColumn(
                name: "ReviewComments",
                table: "LicenseReplacements");

            migrationBuilder.AlterColumn<string>(
                name: "Reason",
                table: "LicenseReplacements",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldMaxLength: 256);

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 574, DateTimeKind.Utc).AddTicks(9114));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 574, DateTimeKind.Utc).AddTicks(9286));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 574, DateTimeKind.Utc).AddTicks(9291));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 574, DateTimeKind.Utc).AddTicks(9296));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 574, DateTimeKind.Utc).AddTicks(9298));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 574, DateTimeKind.Utc).AddTicks(9301));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8320));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8353));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8357));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8359));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8361));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8415));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8417));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8421));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8428));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8431));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8433));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8435));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8438));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8444));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8449));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8454));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8462));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8466));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8468));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8470));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8472));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8474));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8479));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8495));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8518));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8512));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8521));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8523));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8526));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 9, 15, 35, 604, DateTimeKind.Utc).AddTicks(8514));
        }
    }
}
