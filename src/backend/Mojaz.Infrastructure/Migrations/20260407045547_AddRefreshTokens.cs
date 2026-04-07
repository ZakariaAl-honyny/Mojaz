using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRefreshTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "Category", "CreatedAt", "CreatedBy", "Description", "IsEncrypted", "SettingKey", "SettingValue", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000001001"), "OTP", new DateTime(2026, 4, 7, 4, 55, 43, 186, DateTimeKind.Utc).AddTicks(5784), null, "OTP validity in minutes for SMS", false, "OTP_VALIDITY_MINUTES_SMS", "5", null, null },
                    { new Guid("00000000-0000-0000-0000-000000001002"), "OTP", new DateTime(2026, 4, 7, 4, 55, 43, 186, DateTimeKind.Utc).AddTicks(5816), null, "OTP validity in minutes for Email", false, "OTP_VALIDITY_MINUTES_EMAIL", "10", null, null },
                    { new Guid("00000000-0000-0000-0000-000000001003"), "OTP", new DateTime(2026, 4, 7, 4, 55, 43, 186, DateTimeKind.Utc).AddTicks(5824), null, "Max OTP verification attempts", false, "OTP_MAX_ATTEMPTS", "3", null, null },
                    { new Guid("00000000-0000-0000-0000-000000001004"), "OTP", new DateTime(2026, 4, 7, 4, 55, 43, 186, DateTimeKind.Utc).AddTicks(5830), null, "Cooldown in seconds before resending OTP", false, "OTP_RESEND_COOLDOWN_SECONDS", "60", null, null },
                    { new Guid("00000000-0000-0000-0000-000000001005"), "OTP", new DateTime(2026, 4, 7, 4, 55, 43, 186, DateTimeKind.Utc).AddTicks(5835), null, "Max OTP resends per hour", false, "OTP_MAX_RESEND_PER_HOUR", "3", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"));
        }
    }
}
