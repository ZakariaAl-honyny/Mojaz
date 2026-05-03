using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeLicenseCategoryNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "LicenseCategoryId",
                table: "Applications",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 561, DateTimeKind.Utc).AddTicks(4382));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 561, DateTimeKind.Utc).AddTicks(4393));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 561, DateTimeKind.Utc).AddTicks(4396));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 561, DateTimeKind.Utc).AddTicks(4401));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 561, DateTimeKind.Utc).AddTicks(4405));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 561, DateTimeKind.Utc).AddTicks(4410));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6609));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6617));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6622));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6627));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6629));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6720));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6725));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6727));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6739));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6741));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6744));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6746));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6748));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6751));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6753));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6755));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6758));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6779));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6781));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6784));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6786));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6788));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6790));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6804));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6821));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6824));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 51,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6832));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 52,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6834));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 53,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6837));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 61,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6855));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 71,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6862));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 72,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6865));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 73,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6868));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 81,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6881));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 82,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6884));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 83,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6886));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 84,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6888));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 85,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6891));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 86,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6893));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 87,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6895));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 88,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 3, 4, 31, 7, 625, DateTimeKind.Utc).AddTicks(6898));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "LicenseCategoryId",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 734, DateTimeKind.Utc).AddTicks(8109));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 734, DateTimeKind.Utc).AddTicks(8120));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 734, DateTimeKind.Utc).AddTicks(8123));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 734, DateTimeKind.Utc).AddTicks(8125));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 734, DateTimeKind.Utc).AddTicks(8127));

            migrationBuilder.UpdateData(
                table: "LicenseCategories",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 734, DateTimeKind.Utc).AddTicks(8130));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2334));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2347));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2350));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2352));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2354));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2407));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2409));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2411));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2425));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2427));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2429));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2431));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2433));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2435));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2437));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2439));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2441));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2463));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2465));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2467));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2469));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2471));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2473));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2489));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2503));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2551));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 51,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2562));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 52,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2564));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 53,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2565));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 61,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2574));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 71,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2581));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 72,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2583));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 73,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2585));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 81,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2596));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 82,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2598));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 83,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2600));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 84,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2602));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 85,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2604));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 86,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2606));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 87,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2608));

            migrationBuilder.UpdateData(
                table: "SystemSettings",
                keyColumn: "Id",
                keyValue: 88,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 2, 18, 4, 26, 814, DateTimeKind.Utc).AddTicks(2609));
        }
    }
}
