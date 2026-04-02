---
description: API design and endpoint conventions
globs: ["**/Controllers/**", "**/api/**"]
alwaysApply: false
---

# API Conventions

## URL Pattern: /api/v1/{resource}
- GET    /api/v1/resources          → List (paginated)
- GET    /api/v1/resources/{id}     → Single
- POST   /api/v1/resources          → Create  
- PUT    /api/v1/resources/{id}     → Full update
- PATCH  /api/v1/resources/{id}/action → Partial/action
- DELETE /api/v1/resources/{id}     → Soft delete

## Response Contract (MANDATORY)
```json
{
  "success": true|false,
  "message": "string",
  "data": T|null,
  "errors": ["string"]|null,
  "statusCode": 200
}
```
Pagination Parameters
?page=1&pageSize=20&sortBy=createdAt&sortDir=desc&search=keyword

Every Endpoint Must Have:
[Authorize(Roles = "...")] or [AllowAnonymous]
[ProducesResponseType] for each possible status code
XML documentation comment (/// summary)
Swagger documentation
