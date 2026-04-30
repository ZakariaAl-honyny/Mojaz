using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingLicenseFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Check if Security columns exist in Applications
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'SecurityStatus')
                BEGIN
                    ALTER TABLE [Applications] ADD [SecurityStatus] tinyint NOT NULL DEFAULT 0
                END
            ");
            
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'SecurityVerifiedBy')
                BEGIN
                    ALTER TABLE [Applications] ADD [SecurityVerifiedBy] uniqueidentifier NULL
                END
            ");
            
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'SecurityVerifiedAt')
                BEGIN
                    ALTER TABLE [Applications] ADD [SecurityVerifiedAt] datetime2 NULL
                END
            ");
            
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'SecurityNotes')
                BEGIN
                    ALTER TABLE [Applications] ADD [SecurityNotes] nvarchar(500) NULL
                END
            ");

            // Add ReplacementCount to Licenses if missing
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Licenses' AND COLUMN_NAME = 'ReplacementCount')
                BEGIN
                    ALTER TABLE [Licenses] ADD [ReplacementCount] int NOT NULL DEFAULT 0
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "ReplacementCount", table: "Licenses");
            migrationBuilder.DropColumn(name: "SecurityNotes", table: "Applications");
            migrationBuilder.DropColumn(name: "SecurityVerifiedAt", table: "Applications");
            migrationBuilder.DropColumn(name: "SecurityVerifiedBy", table: "Applications");
            migrationBuilder.DropColumn(name: "SecurityStatus", table: "Applications");
        }
    }
}