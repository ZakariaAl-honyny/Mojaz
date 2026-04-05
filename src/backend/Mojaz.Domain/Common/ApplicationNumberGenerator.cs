using System;

namespace Mojaz.Domain.Common;

/// <summary>
/// Generates unique application numbers for the Mojaz platform.
/// Format: MOJ-{YEAR}-{8_RANDOM_DIGITS}
/// Example: MOJ-2025-48291037
/// </summary>
public static class ApplicationNumberGenerator
{
    private static readonly Random _random = new Random();
    private static readonly object _lock = new object();

    /// <summary>
    /// Generates a unique application number.
    /// </summary>
    /// <returns>A unique application number in the format MOJ-YYYY-XXXXXXXX</returns>
    public static string GenerateApplicationNumber()
    {
        lock (_lock)
        {
            var year = DateTime.UtcNow.Year;
            var randomDigits = _random.Next(10000000, 100000000); // 8 random digits
            return $"MOJ-{year}-{randomDigits}";
        }
    }
}
