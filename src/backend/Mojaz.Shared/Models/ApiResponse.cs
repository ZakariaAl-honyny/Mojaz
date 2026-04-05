using System.Collections.Generic;

namespace Mojaz.Shared.Models;

public class ApiResponse<T>
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }
    public List<string>? Errors { get; init; }
    public int StatusCode { get; init; }

    public static ApiResponse<T> Ok(T data, string message = "Success") => new()
    {
        Success = true,
        Message = message,
        Data = data,
        StatusCode = 200
    };

    public static ApiResponse<T> Created(T data, string message = "Created") => new()
    {
        Success = true,
        Message = message,
        Data = data,
        StatusCode = 201
    };

    public static ApiResponse<T> Fail(int statusCode, string message, List<string>? errors = null) => new()
    {
        Success = false,
        Message = message,
        Errors = errors,
        StatusCode = statusCode
    };
}
