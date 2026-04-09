using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <summary>
    /// Normalize DocumentStatus enum values and add unique filtered index.
    /// </summary>
    public partial class NormalizeDocumentStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update any existing rows with old Uploaded status to Pending
            // Note: If the old enum had Uploaded = 3, this updates those to Pending = 0
            // This is a data migration to handle legacy data
            migrationBuilder.Sql(@"
                UPDATE ApplicationDocuments 
                SET Status = 'Pending' 
                WHERE Status = 'Uploaded' OR Status = '3'
            ");

            // Add unique filtered index on ApplicationId + DocumentType where IsDeleted = 0
            migrationBuilder.Sql(@"
                CREATE UNIQUE INDEX IX_ApplicationDocuments_ApplicationId_DocumentType 
                ON ApplicationDocuments (ApplicationId, DocumentType)
                WHERE IsDeleted = 0
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the index
            migrationBuilder.Sql(@"
                DROP INDEX IX_ApplicationDocuments_ApplicationId_DocumentType 
                ON ApplicationDocuments
            ");

            // Note: We don't revert the Status update as it could cause data loss
            // The Down is only for index removal
        }
    }
}