using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixUsersEnumNulls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Set NULL values to 0 for all enum columns before altering to NOT NULL
            // This handles the case where columns have NULL values
            migrationBuilder.Sql("UPDATE [Users] SET [Gender] = 0 WHERE [Gender] IS NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [BloodType] = 0 WHERE [BloodType] IS NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [ApplicantType] = 0 WHERE [ApplicantType] IS NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [RegistrationMethod] = 0 WHERE [RegistrationMethod] IS NULL");

            // Step 2: Handle string values that might still be in the columns (convert to byte)
            // Gender: 'Male' -> 1, 'Female' -> 2
            migrationBuilder.Sql("UPDATE [Users] SET [Gender] = 1 WHERE [Gender] = 'Male' AND [Gender] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [Gender] = 2 WHERE [Gender] = 'Female' AND [Gender] IS NOT NULL");

            // BloodType
            migrationBuilder.Sql("UPDATE [Users] SET [BloodType] = 0 WHERE [BloodType] = 'APositive' AND [BloodType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [BloodType] = 1 WHERE [BloodType] = 'ANegative' AND [BloodType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [BloodType] = 2 WHERE [BloodType] = 'BPositive' AND [BloodType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [BloodType] = 3 WHERE [BloodType] = 'BNegative' AND [BloodType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [BloodType] = 4 WHERE [BloodType] = 'ABPositive' AND [BloodType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [BloodType] = 5 WHERE [BloodType] = 'ABNegative' AND [BloodType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [BloodType] = 6 WHERE [BloodType] = 'OPositive' AND [BloodType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [BloodType] = 7 WHERE [BloodType] = 'ONegative' AND [BloodType] IS NOT NULL");

            // ApplicantType
            migrationBuilder.Sql("UPDATE [Users] SET [ApplicantType] = 0 WHERE [ApplicantType] = 'Private' AND [ApplicantType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [ApplicantType] = 1 WHERE [ApplicantType] = 'Public' AND [ApplicantType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [ApplicantType] = 2 WHERE [ApplicantType] = 'Motorcycle' AND [ApplicantType] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [ApplicantType] = 3 WHERE [ApplicantType] = 'Commercial' AND [ApplicantType] IS NOT NULL");

            // RegistrationMethod
            migrationBuilder.Sql("UPDATE [Users] SET [RegistrationMethod] = 0 WHERE [RegistrationMethod] = 'NationalId' AND [RegistrationMethod] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [RegistrationMethod] = 1 WHERE [RegistrationMethod] = 'Email' AND [RegistrationMethod] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [RegistrationMethod] = 2 WHERE [RegistrationMethod] = 'Phone' AND [RegistrationMethod] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [RegistrationMethod] = 3 WHERE [RegistrationMethod] = 'AdminCreated' AND [RegistrationMethod] IS NOT NULL");

            // Role
            migrationBuilder.Sql("UPDATE [Users] SET [Role] = 0 WHERE [Role] = 'Applicant' AND [Role] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [Role] = 1 WHERE [Role] = 'Receptionist' AND [Role] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [Role] = 2 WHERE [Role] = 'Doctor' AND [Role] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [Role] = 3 WHERE [Role] = 'Examiner' AND [Role] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [Role] = 4 WHERE [Role] = 'Manager' AND [Role] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [Role] = 5 WHERE [Role] = 'Security' AND [Role] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [Role] = 6 WHERE [Role] = 'Admin' AND [Role] IS NOT NULL");

            // AppRole (nullable)
            migrationBuilder.Sql("UPDATE [Users] SET [AppRole] = 0 WHERE [AppRole] = 'Applicant' AND [AppRole] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [AppRole] = 1 WHERE [AppRole] = 'Receptionist' AND [AppRole] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [AppRole] = 2 WHERE [AppRole] = 'Doctor' AND [AppRole] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [AppRole] = 3 WHERE [AppRole] = 'Examiner' AND [AppRole] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [AppRole] = 4 WHERE [AppRole] = 'Manager' AND [AppRole] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [AppRole] = 5 WHERE [AppRole] = 'Security' AND [AppRole] IS NOT NULL");
            migrationBuilder.Sql("UPDATE [Users] SET [AppRole] = 6 WHERE [AppRole] = 'Admin' AND [AppRole] IS NOT NULL");

            // Step 3: Now alter the columns to tinyint NOT NULL
            migrationBuilder.AlterColumn<byte>(
                name: "Gender",
                table: "Users",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AlterColumn<byte>(
                name: "BloodType",
                table: "Users",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AlterColumn<byte>(
                name: "ApplicantType",
                table: "Users",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AlterColumn<byte>(
                name: "RegistrationMethod",
                table: "Users",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AlterColumn<byte>(
                name: "Role",
                table: "Users",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AlterColumn<byte>(
                name: "AppRole",
                table: "Users",
                type: "tinyint",
                nullable: true,
                defaultValue: (byte)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse back to string types
            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(byte));

            migrationBuilder.AlterColumn<string>(
                name: "BloodType",
                table: "Users",
                type: "nvarchar(5)",
                nullable: true,
                oldClrType: typeof(byte));

            migrationBuilder.AlterColumn<string>(
                name: "ApplicantType",
                table: "Users",
                type: "nvarchar(30)",
                nullable: true,
                oldClrType: typeof(byte));

            migrationBuilder.AlterColumn<string>(
                name: "RegistrationMethod",
                table: "Users",
                type: "nvarchar(20)",
                nullable: true,
                oldClrType: typeof(byte));

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(20)",
                nullable: true,
                oldClrType: typeof(byte));

            migrationBuilder.AlterColumn<string>(
                name: "AppRole",
                table: "Users",
                type: "nvarchar(20)",
                nullable: true,
                oldClrType: typeof(byte));
        }
    }
}