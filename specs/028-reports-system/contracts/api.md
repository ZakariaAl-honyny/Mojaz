# API Contract: Reports & Analytics System

All endpoints follow the uniform Mojaz contract: `ApiResponse<T>`.

## Base Path: `/api/v1/Reports`

### 1. Applications Status Distribution
`GET /api/v1/reports/status-distribution`
- **Description**: Returns counts of applications grouped by status.
- **Roles**: `Manager`, `Admin`
- **Query Params**: `from`, `to`, `branchId`
- **Response**: `ApiResponse<List<StatusDistributionDto>>`

### 2. Service Statistics
`GET /api/v1/reports/service-stats`
- **Description**: Compares volume across New, Renewal, Upgrade, etc.
- **Roles**: `Manager`, `Admin`
- **Query Params**: `from`, `to`, `categoryId`
- **Response**: `ApiResponse<List<ServiceStatsDto>>`

### 3. Test Performance
`GET /api/v1/reports/test-performance`
- **Description**: Pass/Fail rates for theory and practical exams.
- **Roles**: `Manager`, `Admin`
- **Query Params**: `from`, `to`, `branchId`
- **Response**: `ApiResponse<List<TestPerformanceDto>>`

### 4. Delayed Applications (Bottlenecks)
`GET /api/v1/reports/delayed-applications`
- **Description**: Paginated list of applications stuck in a stage.
- **Roles**: `Manager`, `Admin`
- **Query Params**: `page`, `pageSize`, `branchId`
- **Response**: `ApiResponse<PagedResult<DelayedApplicationEntry>>`

### 5. Branch Throughput
`GET /api/v1/reports/branch-throughput`
- **Description**: Daily load trend per branch.
- **Roles**: `Manager`, `Admin`
- **Query Params**: `from`, `to`
- **Response**: `ApiResponse<List<BranchThroughputDto>>`

### 6. Employee Activity
`GET /api/v1/reports/employee-activity`
- **Description**: Volume of work per specific employee (Doctor/Examiner).
- **Roles**: `Manager`, `Admin`
- **Query Params**: `from`, `to`, `role`
- **Response**: `ApiResponse<List<EmployeeActivityDto>>`

### 7. Issuance Timeline
`GET /api/v1/reports/issuance-timeline`
- **Description**: Line chart data for license issuance progress.
- **Roles**: `Manager`, `Admin`
- **Query Params**: `from`, `to`
- **Response**: `ApiResponse<List<DailyLoadDto>>`

## Export Endpoint
`GET /api/v1/reports/export`
- **Description**: Returns a CSV/Excel file based on filtered criteria.
- **Roles**: `Manager`, `Admin`
- **Query Params**: `reportType`, `from`, `to`, `branchId`
- **Response**: `FileContentResult` (application/csv)
