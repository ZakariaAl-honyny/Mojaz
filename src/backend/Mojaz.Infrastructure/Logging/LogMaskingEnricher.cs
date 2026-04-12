using Serilog.Core;
using Serilog.Events;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Mojaz.Infrastructure.Logging;

public class LogMaskingEnricher : ILogEventEnricher
{
    private static readonly Regex NationalIdRegex = new(@"\b\d{10}\b", RegexOptions.Compiled);
    private static readonly Regex PhoneRegex = new(@"\b(05|966)\d{8}\b", RegexOptions.Compiled);
    private static readonly Regex EmailRegex = new(@"\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b", RegexOptions.Compiled);

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        foreach (var property in logEvent.Properties.ToList())
        {
            if (property.Value is ScalarValue scalar && scalar.Value is string stringValue)
            {
                var maskedValue = MaskSensitiveData(stringValue);
                if (maskedValue != stringValue)
                {
                    logEvent.AddOrUpdateProperty(new LogEventProperty(property.Key, new ScalarValue(maskedValue)));
                }
            }
        }
    }

    private string MaskSensitiveData(string input)
    {
        if (string.IsNullOrEmpty(input)) return input;

        // Mask National IDs (e.g., 10XXXXXXXX -> 10****XXXX)
        input = NationalIdRegex.Replace(input, m => m.Value.Substring(0, 2) + "****" + m.Value.Substring(6));

        // Mask Phone Numbers (e.g., 05XXXXXXXX -> 05****XXXX)
        input = PhoneRegex.Replace(input, m => m.Value.Substring(0, 2) + "****" + m.Value.Substring(6));

        // Mask Email (e.g., user@example.com -> u***@example.com)
        input = EmailRegex.Replace(input, m =>
        {
            var parts = m.Value.Split('@');
            if (parts.Length != 2) return m.Value;
            var name = parts[0];
            var domain = parts[1];
            return name.Substring(0, 1) + "***@" + domain;
        });

        return input;
    }
}
