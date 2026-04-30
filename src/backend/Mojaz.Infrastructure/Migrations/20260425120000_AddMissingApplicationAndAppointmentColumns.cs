using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingApplicationAndAppointmentColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add missing columns to Applications table
            migrationBuilder.AddColumn<bool>(
                name: "AdditionalTrainingRequired",
                table: "Applications",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TheoryAttemptCount",
                table: "Applications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PracticalAttemptCount",
                table: "Applications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "FinalDecision",
                table: "Applications",
                type: "tinyint",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FinalDecisionAt",
                table: "Applications",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FinalDecisionBy",
                table: "Applications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinalDecisionReason",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReturnToStage",
                table: "Applications",
                type: "nvarchar(50)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManagerNotes",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: true);

            // Add missing columns to Appointments table
            migrationBuilder.AddColumn<TimeOnly>(
                name: "CheckInTime",
                table: "Appointments",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ReminderSent",
                table: "Appointments",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RescheduleCount",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Appointments",
                type: "rowversion",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove Applications columns
            migrationBuilder.DropColumn(name: "AdditionalTrainingRequired", table: "Applications");
            migrationBuilder.DropColumn(name: "TheoryAttemptCount", table: "Applications");
            migrationBuilder.DropColumn(name: "PracticalAttemptCount", table: "Applications");
            migrationBuilder.DropColumn(name: "FinalDecision", table: "Applications");
            migrationBuilder.DropColumn(name: "FinalDecisionAt", table: "Applications");
            migrationBuilder.DropColumn(name: "FinalDecisionBy", table: "Applications");
            migrationBuilder.DropColumn(name: "FinalDecisionReason", table: "Applications");
            migrationBuilder.DropColumn(name: "ReturnToStage", table: "Applications");
            migrationBuilder.DropColumn(name: "ManagerNotes", table: "Applications");

            // Remove Appointments columns
            migrationBuilder.DropColumn(name: "CheckInTime", table: "Appointments");
            migrationBuilder.DropColumn(name: "ReminderSent", table: "Appointments");
            migrationBuilder.DropColumn(name: "RescheduleCount", table: "Appointments");
            migrationBuilder.DropColumn(name: "RowVersion", table: "Appointments");
        }
    }
}