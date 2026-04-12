using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPracticalTestTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PracticalTests_Applications_ApplicationId",
                table: "PracticalTests");

            migrationBuilder.DropIndex(
                name: "IX_PracticalTests_Result",
                table: "PracticalTests");

            migrationBuilder.RenameColumn(
                name: "TestDate",
                table: "PracticalTests",
                newName: "ConductedAt");

            migrationBuilder.AlterColumn<string>(
                name: "VehicleUsed",
                table: "PracticalTests",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldMaxLength: 128,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "PracticalTests",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(512)",
                oldMaxLength: 512,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAbsent",
                table: "PracticalTests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PassingScore",
                table: "PracticalTests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "PracticalTests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AdditionalTrainingRequired",
                table: "Applications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PracticalAttemptCount",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 698, DateTimeKind.Utc).AddTicks(9908));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 698, DateTimeKind.Utc).AddTicks(9938));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 698, DateTimeKind.Utc).AddTicks(9943));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 698, DateTimeKind.Utc).AddTicks(9946));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 698, DateTimeKind.Utc).AddTicks(9950));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(4));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(9));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(12));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(22));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(26));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(30));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(33));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(36));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(39));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(43));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(46));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(49));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(52));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(55));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(59));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(63));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(66));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(70));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 20, 37, 14, 699, DateTimeKind.Utc).AddTicks(74));

            migrationBuilder.AddForeignKey(
                name: "FK_PracticalTests_Applications_ApplicationId",
                table: "PracticalTests",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PracticalTests_Users_ExaminerId",
                table: "PracticalTests",
                column: "ExaminerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PracticalTests_Applications_ApplicationId",
                table: "PracticalTests");

            migrationBuilder.DropForeignKey(
                name: "FK_PracticalTests_Users_ExaminerId",
                table: "PracticalTests");

            migrationBuilder.DropColumn(
                name: "IsAbsent",
                table: "PracticalTests");

            migrationBuilder.DropColumn(
                name: "PassingScore",
                table: "PracticalTests");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "PracticalTests");

            migrationBuilder.DropColumn(
                name: "AdditionalTrainingRequired",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "PracticalAttemptCount",
                table: "Applications");

            migrationBuilder.RenameColumn(
                name: "ConductedAt",
                table: "PracticalTests",
                newName: "TestDate");

            migrationBuilder.AlterColumn<string>(
                name: "VehicleUsed",
                table: "PracticalTests",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "PracticalTests",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(2897));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(2941));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(2971));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(2980));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(2986));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3389));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3440));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3447));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3502));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3508));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3516));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3522));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3526));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3532));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3801));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3806));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 540, DateTimeKind.Utc).AddTicks(3812));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 541, DateTimeKind.Utc).AddTicks(8579));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 541, DateTimeKind.Utc).AddTicks(8648));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 541, DateTimeKind.Utc).AddTicks(8655));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 541, DateTimeKind.Utc).AddTicks(8660));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 541, DateTimeKind.Utc).AddTicks(8665));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 541, DateTimeKind.Utc).AddTicks(8670));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 9, 17, 30, 0, 541, DateTimeKind.Utc).AddTicks(8676));

            migrationBuilder.CreateIndex(
                name: "IX_PracticalTests_Result",
                table: "PracticalTests",
                column: "Result");

            migrationBuilder.AddForeignKey(
                name: "FK_PracticalTests_Applications_ApplicationId",
                table: "PracticalTests",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
