namespace DrivingLicenseIssuanceSystem.Shared.Constants
{
    public static class SmsTemplates
    {
        // Template identifiers
        public const string RegistrationOtp = "reg-otp";
        public const string RecoveryOtp = "recovery-otp";
        public const string AppointmentConfirmed = "appointment-confirmed";
        public const string AppointmentReminder = "appointment-reminder";
        public const string TestResult = "test-result";
        public const string LicenseReady = "license-ready";

        /// <summary>
        /// Generates the message content for a specific template type.
        /// All messages are capped at 160 characters (SMS segment limit).
        /// </summary>
        public static string GetMessage(string templateType, string language, params string[] values)
        {
            return templateType switch
            {
                RegistrationOtp => GenerateRegistrationOtp(language, values),
                RecoveryOtp => GenerateRecoveryOtp(language, values),
                AppointmentConfirmed => GenerateAppointmentConfirmed(language, values),
                AppointmentReminder => GenerateAppointmentReminder(language, values),
                TestResult => GenerateTestResult(language, values),
                LicenseReady => GenerateLicenseReady(language, values),
                _ => string.Empty
            };
        }

        private static string GenerateRegistrationOtp(string language, string[] values)
        {
            // OTP is in values[0]
            if (language == "ar")
            {
                return $"نظام إصدار رخص القيادة: رمز التحقق الخاص بك هو {values[0]}.Expires in 5 min.";
            }
            else
            {
                return $"DrivingLicenseIssuanceSystem: Your verification code is {values[0]}. Valid for 5 min.";
            }
        }

        private static string GenerateRecoveryOtp(string language, string[] values)
        {
            if (language == "ar")
            {
                return $"نظام إصدار رخص القيادة: رمز استعادة كلمة المرور {values[0]}.Expires 5 min.";
            }
            else
            {
                return $"DrivingLicenseIssuanceSystem: Password reset code {values[0]}. Valid 5 min.";
            }
        }

        private static string GenerateAppointmentConfirmed(string language, string[] values)
        {
            // values[0] = appointment date/time
            if (language == "ar")
            {
                return $"نظام إصدار رخص القيادة: تم تأكيد موعدك في {values[0]}. يرجى الحضور في الموعد المحدد.";
            }
            else
            {
                return $"DrivingLicenseIssuanceSystem: Your appointment is confirmed at {values[0]}. Please arrive on time.";
            }
        }

        private static string GenerateAppointmentReminder(string language, string[] values)
        {
            // values[0] = appointment date/time
            if (language == "ar")
            {
                return $"نظام إصدار رخص القيادة: تذكير بالموعد غداً في {values[0]}. يرجى إحضار المستندات المطلوبة.";
            }
            else
            {
                return $"DrivingLicenseIssuanceSystem: Reminder - Your appointment is tomorrow at {values[0]}. Bring required documents.";
            }
        }

        private static string GenerateTestResult(string language, string[] values)
        {
            // values[0] = test type, values[1] = result (passed/failed)
            if (language == "ar")
            {
                var resultText = values[1] == "passed" ? "ناجح" : "راسب";
                return $"نظام إصدار رخص القيادة: نتيجة اختبار {values[0]}: {resultText}. للتفاصيل راجع التطبيق.";
            }
            else
            {
                var resultText = values[1] == "passed" ? "PASSED" : "FAILED";
                return $"DrivingLicenseIssuanceSystem: {values[0]} test result: {resultText}. Check app for details.";
            }
        }

        private static string GenerateLicenseReady(string language, string[] values)
        {
            if (language == "ar")
            {
                return "نظام إصدار رخص القيادة: رخصة القيادة الخاصة بك جاهزة للاستلام. يرجى مراجعة أقرب فرع.";
            }
            else
            {
                return "DrivingLicenseIssuanceSystem: Your driving license is ready for pickup. Please visit nearest branch.";
            }
        }
    }
}