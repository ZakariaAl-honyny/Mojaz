using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedReplacementFee_T005 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "FeeStructures",
                columns: new[] { "Id", "Amount", "CreatedAt", "Currency", "EffectiveFrom", "EffectiveTo", "FeeType", "IsActive", "LicenseCategoryId", "UpdatedAt", "UpdatedBy", "CreatedBy" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000010001"), 100.00m, new DateTime(2026, 4, 10, 15, 0, 0, DateTimeKind.Utc), "SAR", new DateTime(2026, 4, 10, 15, 0, 0, DateTimeKind.Utc), null, "ReplacementFee", true, null, null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "FeeStructures",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"));
        }
    }
}