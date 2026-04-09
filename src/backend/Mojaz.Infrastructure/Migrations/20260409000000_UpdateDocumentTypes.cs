using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <summary>
    /// Update ApplicationDocuments table with new schema and DocumentType enum values.
    /// </summary>
    public partial class UpdateDocumentTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Rename columns to match new schema
            migrationBuilder.RenameColumn(
                name: "FileName",
                newName: "OriginalFileName",
                table: "ApplicationDocuments");

            migrationBuilder.RenameColumn(
                name: "FileSize",
                newName: "FileSizeBytes",
                table: "ApplicationDocuments");

            // Increase column lengths for new schema
            migrationBuilder.AlterColumn<string>(
                name: "OriginalFileName",
                table: "ApplicationDocuments",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldMaxLength: 128);

            migrationBuilder.AddColumn<string>(
                name: "StoredFileName",
                table: "ApplicationDocuments",
                type: "nvarchar(260)",
                maxLength: 260,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "RejectionReason",
                table: "ApplicationDocuments",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "ContentType",
                table: "ApplicationDocuments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(64)",
                oldMaxLength: 64);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert column renames
            migrationBuilder.RenameColumn(
                name: "OriginalFileName",
                newName: "FileName",
                table: "ApplicationDocuments");

            migrationBuilder.RenameColumn(
                name: "FileSizeBytes",
                newName: "FileSize",
                table: "ApplicationDocuments");

            migrationBuilder.DropColumn(
                name: "StoredFileName",
                table: "ApplicationDocuments");

            migrationBuilder.AlterColumn<string>(
                name: "RejectionReason",
                table: "ApplicationDocuments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<string>(
                name: "ContentType",
                table: "ApplicationDocuments",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);
        }
    }
}