using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedCategoryF_021 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "LicenseCategories",
                columns: new[] { "Id", "Code", "CreatedAt", "CreatedBy", "IsActive", "MinimumAge", "NameAr", "NameEn", "RequiresTraining", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), "A", new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7461), null, true, 16, "دراجة نارية", "Motorcycle", true, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000002"), "B", new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7482), null, true, 18, "خصوصي", "Private", true, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000003"), "C", new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7486), null, true, 21, "نقل عام", "Public Transport", true, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000004"), "D", new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7489), null, true, 21, "مركبات ثقيلة", "Heavy Vehicles", true, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000005"), "E", new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7491), null, true, 21, "مركبات صناعية", "Industrial Vehicles", true, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000006"), "F", new DateTime(2026, 4, 9, 22, 46, 7, 734, DateTimeKind.Utc).AddTicks(7494), null, true, 18, "مركبات زراعية", "Agricultural Vehicles", true, null, null }
                });

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
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 4, 9, 22, 46, 7, 748, DateTimeKind.Utc).AddTicks(6291), "Minimum training hours for Category F (Agricultural)" });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9423));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9445));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9448));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9451));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9453));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9490));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9493));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9495));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9502));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9504));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9507));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9509));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9511));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9514));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9516));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9518));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9520));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9522));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9525));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9528));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9530));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9532));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9535), "Minimum training hours for Category F (Special Needs)" });

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9537));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9539));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9541));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 43, 18, 213, DateTimeKind.Utc).AddTicks(9544));
        }
    }
}
