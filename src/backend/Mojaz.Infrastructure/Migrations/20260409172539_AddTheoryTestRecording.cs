using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTheoryTestRecording : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TestDate",
                table: "TheoryTests",
                newName: "ConductedAt");

            migrationBuilder.AlterColumn<int>(
                name: "Score",
                table: "TheoryTests",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "TheoryTests",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(512)",
                oldMaxLength: 512,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAbsent",
                table: "TheoryTests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TheoryAttemptCount",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4170));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4204));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4209));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4231));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4235));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4434));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4440));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4456));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4471));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4475));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4479));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4483));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4487));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4492));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4495));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4499));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4502));

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "Category", "CreatedAt", "CreatedBy", "Description", "IsEncrypted", "SettingKey", "SettingValue", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000009001"), "Training", new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4505), null, "Minimum training hours for Category A (Motorcycle)", false, "MIN_TRAINING_HOURS_CATEGORY_A", "8", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009002"), "Training", new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4508), null, "Minimum training hours for Category B (Private)", false, "MIN_TRAINING_HOURS_CATEGORY_B", "20", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009003"), "Training", new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4512), null, "Minimum training hours for Category C (Public Transport)", false, "MIN_TRAINING_HOURS_CATEGORY_C", "30", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009004"), "Training", new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4515), null, "Minimum training hours for Category D (Heavy Vehicles)", false, "MIN_TRAINING_HOURS_CATEGORY_D", "40", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009005"), "Training", new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4519), null, "Minimum training hours for Category E (Industrial)", false, "MIN_TRAINING_HOURS_CATEGORY_E", "40", null, null },
                    { new Guid("00000000-0000-0000-0000-000000009006"), "Training", new DateTime(2026, 4, 9, 17, 25, 36, 490, DateTimeKind.Utc).AddTicks(4522), null, "Minimum training hours for Category F (Special Needs)", false, "MIN_TRAINING_HOURS_CATEGORY_F", "20", null, null }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_TheoryTests_Users_ExaminerId",
                table: "TheoryTests",
                column: "ExaminerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TheoryTests_Users_ExaminerId",
                table: "TheoryTests");

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"));

            migrationBuilder.DeleteData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"));

            migrationBuilder.DropColumn(
                name: "IsAbsent",
                table: "TheoryTests");

            migrationBuilder.DropColumn(
                name: "TheoryAttemptCount",
                table: "Applications");

            migrationBuilder.RenameColumn(
                name: "ConductedAt",
                table: "TheoryTests",
                newName: "TestDate");

            migrationBuilder.AlterColumn<int>(
                name: "Score",
                table: "TheoryTests",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "TheoryTests",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6317));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6339));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6343));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6345));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6350));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6391));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6393));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6397));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6404));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6406));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6408));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6410));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6413));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6415));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6418));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6421));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 15, 5, 36, 855, DateTimeKind.Utc).AddTicks(6423));
        }
    }
}
