using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFeeStructuresSoftDeleteColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FeeStructures' AND COLUMN_NAME = 'IsDeleted')
                    ALTER TABLE [FeeStructures] ADD [IsDeleted] bit NOT NULL DEFAULT 0
            ");
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FeeStructures' AND COLUMN_NAME = 'DeletedAt')
                    ALTER TABLE [FeeStructures] ADD [DeletedAt] datetime2 NULL
            ");
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'FeeStructures' AND COLUMN_NAME = 'DeletedBy')
                    ALTER TABLE [FeeStructures] ADD [DeletedBy] uniqueidentifier NULL
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "IsDeleted", table: "FeeStructures");
            migrationBuilder.DropColumn(name: "DeletedAt", table: "FeeStructures");
            migrationBuilder.DropColumn(name: "DeletedBy", table: "FeeStructures");
        }
    }
}