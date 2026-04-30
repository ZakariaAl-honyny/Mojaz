-- Mark broken migrations as applied
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES 
('20260425120000_AddMissingApplicationAndAppointmentColumns', '8.0.8'),
('20260426120000_IncreaseAuditLogActionTypeTo500', '8.0.8');
GO
SELECT * FROM __EFMigrationsHistory ORDER BY MigrationId;
GO