using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSecurityVerificationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 16, 987, DateTimeKind.Utc).AddTicks(1845));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 16, 987, DateTimeKind.Utc).AddTicks(1912));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 16, 987, DateTimeKind.Utc).AddTicks(1918));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 16, 987, DateTimeKind.Utc).AddTicks(1922));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 16, 987, DateTimeKind.Utc).AddTicks(1926));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 16, 987, DateTimeKind.Utc).AddTicks(1929));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(7903));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(7930));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(7935));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(7940));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(7943));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8012));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8016));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8021));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8047));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8058));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8178));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8188));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8192));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8195));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8200));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8204));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8208));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8212));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8215));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8218));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8222));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8229));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8233));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8262));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8292));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8283));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8296));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8300));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8304));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8287));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8307));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8310));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8314));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8318));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8321));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8325));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8327));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8331));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8334));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8338));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 32, 17, 6, DateTimeKind.Utc).AddTicks(8342));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 921, DateTimeKind.Utc).AddTicks(1308));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 921, DateTimeKind.Utc).AddTicks(1366));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 921, DateTimeKind.Utc).AddTicks(1371));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 921, DateTimeKind.Utc).AddTicks(1374));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 921, DateTimeKind.Utc).AddTicks(1377));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 921, DateTimeKind.Utc).AddTicks(1380));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7071));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7096));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7099));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7101));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7103));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7140));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7142));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7145));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7151));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7154));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7155));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7158));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7160));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7163));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7169));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7171));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7174));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7176));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7178));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7180));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7182));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7184));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7188));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7204));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7220));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7215));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7221));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7223));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7225));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7217));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7227));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7229));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7231));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7235));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7237));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7239));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7242));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7244));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7248));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7251));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 28, 2, 26, 21, 930, DateTimeKind.Utc).AddTicks(7253));
        }
    }
}
