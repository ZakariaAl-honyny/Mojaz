using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixEnumColumnTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Users table: Change Gender from nvarchar(max) to tinyint
            migrationBuilder.AlterColumn<byte>(
                name: "Gender",
                table: "Users",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            // Users table: Change BloodType from nvarchar(max) to tinyint
            migrationBuilder.AlterColumn<byte>(
                name: "BloodType",
                table: "Users",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            // Users table: Change ApplicantType from nvarchar(max) to tinyint
            migrationBuilder.AlterColumn<byte>(
                name: "ApplicantType",
                table: "Users",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            // Users table: Change RegistrationMethod from int to tinyint
            migrationBuilder.AlterColumn<byte>(
                name: "RegistrationMethod",
                table: "Users",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            // LicenseCategories table: Change Code from nvarchar(50) to tinyint
            migrationBuilder.AlterColumn<byte>(
                name: "Code",
                table: "LicenseCategories",
                type: "tinyint",
                nullable: false);

            migrationBuilder.AlterColumn<string>(
                name: "EntityName",
                table: "AuditLogs",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(64)",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<string>(
                name: "ActionType",
                table: "AuditLogs",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(64)",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<string>(
                name: "ActionCategory",
                table: "AuditLogs",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(64)",
                oldMaxLength: 64);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "CheckInTime",
                table: "Appointments",
                type: "time",
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse LicenseCategories.Code from tinyint back to nvarchar(50)
            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "LicenseCategories",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(byte));

            // Reverse Users.RegistrationMethod from tinyint back to int
            migrationBuilder.AlterColumn<int>(
                name: "RegistrationMethod",
                table: "Users",
                type: "int",
                nullable: false,
                oldClrType: typeof(byte));

            // Reverse Users.ApplicantType from tinyint back to nvarchar(max)
            migrationBuilder.AlterColumn<string>(
                name: "ApplicantType",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(byte));

            // Reverse Users.BloodType from tinyint back to nvarchar(max)
            migrationBuilder.AlterColumn<string>(
                name: "BloodType",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(byte));

            // Reverse Users.Gender from tinyint back to nvarchar(max)
            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(byte));

            migrationBuilder.DropColumn(
                name: "CheckInTime",
                table: "Appointments");

            migrationBuilder.AlterColumn<string>(
                name: "EntityName",
                table: "AuditLogs",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "ActionType",
                table: "AuditLogs",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "ActionCategory",
                table: "AuditLogs",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldMaxLength: 128);

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 890, DateTimeKind.Utc).AddTicks(8883));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 890, DateTimeKind.Utc).AddTicks(8931));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 890, DateTimeKind.Utc).AddTicks(8937));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 890, DateTimeKind.Utc).AddTicks(8941));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 890, DateTimeKind.Utc).AddTicks(8946));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 890, DateTimeKind.Utc).AddTicks(8950));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3609));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3634));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3639));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3643));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000001005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3647));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3708));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3713));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000007003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3718));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3730));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3735));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3739));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3746));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3750));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3754));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3757));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3773));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000008009"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3776));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3780));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3784));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3788));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3791));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3795));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3799));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000009007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3811));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3844));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000010002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3837));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3848));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3851));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3855));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000011004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3841));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3859));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3862));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000012003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3867));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013001"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3870));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013002"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3874));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013003"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3878));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013004"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3882));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013005"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3885));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013006"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3889));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013007"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3893));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000013008"),
                column: "CreatedAt",
                value: new DateTime(2026, 4, 24, 17, 56, 16, 908, DateTimeKind.Utc).AddTicks(3896));
        }
    }
}
