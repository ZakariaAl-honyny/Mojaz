# Contract: Standard Security Error Response

## Status Codes
- `401 Unauthorized` - Token expired or invalid.
- `403 Forbidden` - Insufficient role permissions / Resource ownership violation.
- `429 Too Many Requests` - Rate limit exceeded.
- `500 Internal Server Error` - Sanitized unhandled exception.

## Response Body (ApiResponse Wrapper)

```json
{
  "success": false,
  "message": "A human-readable sanitized message (Bilingual)",
  "data": null,
  "errors": [
    "Error code or machine-readable identifier"
  ],
  "statusCode": 4xx | 500
}
```

## ProblemDetails Extension
For 500 errors, the response will follow RFC 7807:

```json
{
  "type": "https://mojaz.gov.sa/errors/internal-server-error",
  "title": "An unexpected error occurred",
  "status": 500,
  "detail": "Please contact support with TraceId: {TraceId}",
  "instance": "/api/v1/resource"
}
```
