using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mojaz.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixUserEnumStringValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Fix Gender column - convert string values to byte
            // Only run if column is still nvarchar (not yet converted)
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'Gender' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    UPDATE Users 
                    SET Gender = CASE 
                        WHEN Gender = 'Male' THEN CAST(1 AS TINYINT)
                        WHEN Gender = 'Female' THEN CAST(2 AS TINYINT)
                        ELSE CAST(0 AS TINYINT)
                    END
                    WHERE TRY_CAST(Gender AS TINYINT) IS NULL;
                END
            ");

            // Fix BloodType column
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'BloodType' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    UPDATE Users 
                    SET BloodType = CASE 
                        WHEN BloodType IN ('APositive', '0') THEN CAST(0 AS TINYINT)
                        WHEN BloodType IN ('ANegative', '1') THEN CAST(1 AS TINYINT)
                        WHEN BloodType IN ('BPositive', '2') THEN CAST(2 AS TINYINT)
                        WHEN BloodType IN ('BNegative', '3') THEN CAST(3 AS TINYINT)
                        WHEN BloodType IN ('ABPositive', '4') THEN CAST(4 AS TINYINT)
                        WHEN BloodType IN ('ABNegative', '5') THEN CAST(5 AS TINYINT)
                        WHEN BloodType IN ('OPositive', '6') THEN CAST(6 AS TINYINT)
                        WHEN BloodType IN ('ONegative', '7') THEN CAST(7 AS TINYINT)
                        ELSE CAST(0 AS TINYINT)
                    END
                    WHERE TRY_CAST(BloodType AS TINYINT) IS NULL;
                END
            ");

            // Fix ApplicantType column
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'ApplicantType' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    UPDATE Users 
                    SET ApplicantType = CASE 
                        WHEN ApplicantType IN ('Private', '0') THEN CAST(0 AS TINYINT)
                        WHEN ApplicantType IN ('Public', '1') THEN CAST(1 AS TINYINT)
                        WHEN ApplicantType IN ('Motorcycle', '2') THEN CAST(2 AS TINYINT)
                        WHEN ApplicantType IN ('Commercial', '3') THEN CAST(3 AS TINYINT)
                        ELSE CAST(0 AS TINYINT)
                    END
                    WHERE TRY_CAST(ApplicantType AS TINYINT) IS NULL;
                END
            ");

            // Fix RegistrationMethod column
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'RegistrationMethod' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    UPDATE Users 
                    SET RegistrationMethod = CASE 
                        WHEN RegistrationMethod IN ('NationalId', '0') THEN CAST(0 AS TINYINT)
                        WHEN RegistrationMethod IN ('Email', '1') THEN CAST(1 AS TINYINT)
                        WHEN RegistrationMethod IN ('Phone', '2') THEN CAST(2 AS TINYINT)
                        WHEN RegistrationMethod IN ('AdminCreated', '3') THEN CAST(3 AS TINYINT)
                        ELSE CAST(0 AS TINYINT)
                    END
                    WHERE TRY_CAST(RegistrationMethod AS TINYINT) IS NULL;
                END
            ");

            // Fix Role column (UserRole enum - not nullable)
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'Role' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    UPDATE Users 
                    SET Role = CASE 
                        WHEN Role = 'Applicant' THEN CAST(0 AS TINYINT)
                        WHEN Role = 'Receptionist' THEN CAST(1 AS TINYINT)
                        WHEN Role = 'Doctor' THEN CAST(2 AS TINYINT)
                        WHEN Role = 'Examiner' THEN CAST(3 AS TINYINT)
                        WHEN Role = 'Manager' THEN CAST(4 AS TINYINT)
                        WHEN Role = 'Security' THEN CAST(5 AS TINYINT)
                        WHEN Role = 'Admin' THEN CAST(6 AS TINYINT)
                        ELSE CAST(0 AS TINYINT)
                    END
                    WHERE TRY_CAST(Role AS TINYINT) IS NULL;
                END
            ");

            // Fix AppRole column (nullable AppRole enum)
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'AppRole' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    UPDATE Users 
                    SET AppRole = CASE 
                        WHEN AppRole = 'Applicant' THEN CAST(0 AS TINYINT)
                        WHEN AppRole = 'Receptionist' THEN CAST(1 AS TINYINT)
                        WHEN AppRole = 'Doctor' THEN CAST(2 AS TINYINT)
                        WHEN AppRole = 'Examiner' THEN CAST(3 AS TINYINT)
                        WHEN AppRole = 'Manager' THEN CAST(4 AS TINYINT)
                        WHEN AppRole = 'Security' THEN CAST(5 AS TINYINT)
                        WHEN AppRole = 'Admin' THEN CAST(6 AS TINYINT)
                        ELSE NULL
                    END
                    WHERE TRY_CAST(AppRole AS TINYINT) IS NULL;
                END
            ");

            // Now alter column types - use SQL to only alter if still nvarchar
            // Gender
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'Gender' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN Gender tinyint NULL;
                END
            ");

            // BloodType
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'BloodType' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN BloodType tinyint NULL;
                END
            ");

            // ApplicantType
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'ApplicantType' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN ApplicantType tinyint NULL;
                END
            ");

            // RegistrationMethod
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'RegistrationMethod' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN RegistrationMethod tinyint NOT NULL;
                END
            ");

            // Role
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'Role' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN Role tinyint NOT NULL;
                END
            ");

            // AppRole
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'AppRole' 
                    AND DATA_TYPE = 'nvarchar'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN AppRole tinyint NULL;
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse the column type changes - convert back to nvarchar if they're currently tinyint
            // Gender
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'Gender' 
                    AND DATA_TYPE = 'tinyint'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN Gender nvarchar(max) NULL;
                END
            ");

            // BloodType
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'BloodType' 
                    AND DATA_TYPE = 'tinyint'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN BloodType nvarchar(5) NULL;
                END
            ");

            // ApplicantType
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'ApplicantType' 
                    AND DATA_TYPE = 'tinyint'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN ApplicantType nvarchar(30) NULL;
                END
            ");

            // RegistrationMethod
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'RegistrationMethod' 
                    AND DATA_TYPE = 'tinyint'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN RegistrationMethod nvarchar(20) NOT NULL;
                END
            ");

            // Role
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'Role' 
                    AND DATA_TYPE = 'tinyint'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN Role nvarchar(20) NOT NULL;
                END
            ");

            // AppRole
            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    AND COLUMN_NAME = 'AppRole' 
                    AND DATA_TYPE = 'tinyint'
                )
                BEGIN
                    ALTER TABLE Users ALTER COLUMN AppRole nvarchar(20) NULL;
                END
            ");
        }
    }
}