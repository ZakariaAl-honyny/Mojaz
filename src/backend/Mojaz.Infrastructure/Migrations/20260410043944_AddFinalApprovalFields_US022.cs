using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFinalApprovalFields_US022 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 36, 622, DateTimeKind.Utc).AddTicks(3149));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 36, 622, DateTimeKind.Utc).AddTicks(3287));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 36, 622, DateTimeKind.Utc).AddTicks(3293));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 36, 622, DateTimeKind.Utc).AddTicks(3298));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 36, 622, DateTimeKind.Utc).AddTicks(3303));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 36, 622, DateTimeKind.Utc).AddTicks(3308));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3170));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3198));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3202));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3205));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3209));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3275));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3288));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3291));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3302));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3305));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3309));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3312));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3316));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3321));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3325));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3328));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3331));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3335));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3339));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3342));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3345));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3348));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3351));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3367));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3389));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3382));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3392));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3395));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3400));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 39, 37, 123, DateTimeKind.Utc).AddTicks(3386));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4271));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4299));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4292));

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

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 10, 4, 37, 11, 178, DateTimeKind.Utc).AddTicks(4296));
        }
    }
}
