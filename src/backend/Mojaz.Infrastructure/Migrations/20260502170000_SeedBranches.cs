using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedBranches : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                SET IDENTITY_INSERT Branches ON;
                INSERT INTO Branches (Id, Name, Address, PhoneNumber, IsDeleted, CreatedAt, UpdatedAt)
                VALUES 
                (1, N'الفرع الرئيسي', N'الرياض، المملكة العربية السعودية', N'0111234567', 0, GETUTCDATE(), GETUTCDATE()),
                (2, N'فرع جدة', N'جدة، المملكة العربية السعودية', N'0121234567', 0, GETUTCDATE(), GETUTCDATE()),
                (3, N'فرع الدمام', N'الدمام، المملكة العربية السعودية', N'0131234567', 0, GETUTCDATE(), GETUTCDATE());
                SET IDENTITY_INSERT Branches OFF;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM Branches WHERE Id IN (1, 2, 3)");
        }
    }
}