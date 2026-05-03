using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixAuditLogEntityIdSize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 673, DateTimeKind.Utc).AddTicks(46));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 673, DateTimeKind.Utc).AddTicks(55));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 673, DateTimeKind.Utc).AddTicks(57));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 673, DateTimeKind.Utc).AddTicks(59));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 673, DateTimeKind.Utc).AddTicks(62));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 673, DateTimeKind.Utc).AddTicks(64));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(1913));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(1927));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(1931));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(1932));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(1934));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2029));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2032));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2034));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2050));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2052));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2061));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2063));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2065));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2067));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2069));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2071));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2073));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2094));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2196));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2198));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2201));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2203));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2205));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2248));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2271));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2273));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 51,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2285));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 52,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2287));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 53,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2289));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 61,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2299));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 71,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2305));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 72,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2307));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 73,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2313));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 81,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2331));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 82,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2333));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 83,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2335));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 84,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2337));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 85,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2339));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 86,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2341));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 87,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2346));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 88,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 30, 18, 32, 12, 690, DateTimeKind.Utc).AddTicks(2348));
        }
    }
}
