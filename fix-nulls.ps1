$ErrorActionPreference = "Stop"
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

# Update NULL values to defaults
$sql = @"
-- Update NULL bit columns to default values
UPDATE Users SET EnableEmail = 0 WHERE EnableEmail IS NULL;
UPDATE Users SET EnablePush = 0 WHERE EnablePush IS NULL;
UPDATE Users SET EnableSms = 0 WHERE EnableSms IS NULL;
UPDATE Users SET RequiresPasswordReset = 0 WHERE RequiresPasswordReset IS NULL;
UPDATE Users SET IsSecurityBlocked = 0 WHERE IsSecurityBlocked IS NULL;
UPDATE Users SET AppRole = 0 WHERE AppRole IS NULL;

-- Make columns NOT NULL with defaults
ALTER TABLE Users ALTER COLUMN EnableEmail bit NOT NULL;
ALTER TABLE Users ALTER COLUMN EnablePush bit NOT NULL;
ALTER TABLE Users ALTER COLUMN EnableSms bit NOT NULL;
ALTER TABLE Users ALTER COLUMN RequiresPasswordReset bit NOT NULL;
ALTER TABLE Users ALTER COLUMN IsSecurityBlocked bit NOT NULL;
ALTER TABLE Users ALTER COLUMN AppRole tinyint NOT NULL;
"@

Write-Host "Applying fixes..."
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$cmd.ExecuteNonQuery() | Out-Null

Write-Host "Done!"
$connection.Close()