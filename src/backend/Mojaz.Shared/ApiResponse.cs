namespace Mojaz.Shared;

/// <summary>
/// Standard API response wrapper for all endpoints.
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
    public int StatusCode { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Success")
        => new() { Success = true, Data = data, Message = message, StatusCode = 200 };

    public static ApiResponse<T> Created(T data, string message = "Created")
        => new() { Success = true, Data = data, Message = message, StatusCode = 201 };

    public static ApiResponse<T> Fail(string message, int statusCode = 400, List<string>? errors = null)
        => new() { Success = false, Message = message, StatusCode = statusCode, Errors = errors };

    public static ApiResponse<T> NotFound(string message = "Resource not found")
        => new() { Success = false, Message = message, StatusCode = 404 };

    public static ApiResponse<T> Unauthorized(string message = "Unauthorized")
        => new() { Success = false, Message = message, StatusCode = 401 };

    public static ApiResponse<T> Forbidden(string message = "Forbidden")
        => new() { Success = false, Message = message, StatusCode = 403 };
}
