using System;

namespace Mojaz.Shared.Extensions;

public static class StringExtensions
{
    public static string Mask(this string value, int unmaskedLength = 4)
    {
        if (string.IsNullOrEmpty(value) || value.Length <= unmaskedLength)
            return value;

        return new string('*', value.Length - unmaskedLength) + value[^unmaskedLength..];
    }

    public static string TruncateForLog(this string value, int maxLength = 100)
    {
        if (string.IsNullOrEmpty(value) || value.Length <= maxLength)
            return value;

        return value[..maxLength] + "...";
    }
}
