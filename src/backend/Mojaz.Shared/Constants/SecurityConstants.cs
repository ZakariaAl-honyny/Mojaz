namespace Mojaz.Shared.Constants;

public static class SecurityConstants
{
    public static class Policies
    {
        public const string AuthRateLimit = "AuthLimit";
        public const string GlobalRateLimit = "GlobalLimit";
    }

    public static class Settings
    {
        public const string LogRetentionDays = "SECURITY_LOG_RETENTION_DAYS";
        public const string AuthPermitLimit = "RATE_LIMIT_AUTH_PERMIT";
        public const string AuthWindowSeconds = "RATE_LIMIT_AUTH_WINDOW";
        public const string GlobalPermitLimit = "RATE_LIMIT_GLOBAL_PERMIT";
        public const string GlobalWindowSeconds = "RATE_LIMIT_GLOBAL_WINDOW";
        public const string MaxFileSizeBytes = "MAX_FILE_SIZE_BYTES";
        public const string AlertThreshold = "SECURITY_ALERT_THRESHOLD";
        public const string AlertWindowMins = "SECURITY_ALERT_WINDOW_MINS";
    }

    public static class Headers
    {
        public const string XFrameOptions = "X-Frame-Options";
        public const string XContentTypeOptions = "X-Content-Type-Options";
        public const string ContentSecurityPolicy = "Content-Security-Policy";
        public const string StrictTransportSecurity = "Strict-Transport-Security";
    }
}
