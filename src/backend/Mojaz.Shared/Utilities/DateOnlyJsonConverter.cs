using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Mojaz.Shared.Utilities;

/// <summary>
/// JSON converter for DateOnly that serializes as ISO date string "yyyy-MM-dd"
/// </summary>
public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    private const string DateFormat = "yyyy-MM-dd";

    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.String)
            throw new JsonException($"Expected string for DateOnly, got {reader.TokenType}");

        var dateString = reader.GetString();
        if (string.IsNullOrEmpty(dateString))
            throw new JsonException("Cannot convert empty string to DateOnly");

        if (DateOnly.TryParseExact(dateString, DateFormat, out var result))
            return result;

        // Try parsing as general date
        if (DateOnly.TryParse(dateString, out result))
            return result;

        throw new JsonException($"Invalid date format: {dateString}. Expected {DateFormat}");
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(DateFormat));
    }

    public override DateOnly ReadAsPropertyName(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return Read(ref reader, typeToConvert, options);
    }

    public override void WriteAsPropertyName(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        writer.WritePropertyName(value.ToString(DateFormat));
    }
}