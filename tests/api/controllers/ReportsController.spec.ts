/**
 * Mojaz API Tests - ReportsController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/reports
 * Endpoints: 10
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 401)
 * - Citizen/Applicant token (expect 403 - not authorized)
 * - Admin/Manager token (expect 200)
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const REPORTS_BASE = `${BASE_URL}/api/v1/reports`;

// Helper function for test setup - uses cached tokens
async function getTokens(role: 'applicant' | 'admin' | 'manager' | 'receptionist' | 'doctor' | 'examiner' | 'security') {
  const token = getCachedToken(role);
  if (!token) {
    console.warn(`[getTokens] No cached token for ${role}`);
    return null;
  }
  return { accessToken: token, refreshToken: null };
}

function getAuthHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// Valid ReportingFilter parameters
const FILTER_PARAMS = {
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  branchId: 1,
  licenseCategoryId: 1,
  role: 'Receptionist',
};

// Arabic-appropriate mock data
const MOCK_DATA = {
  // Date ranges for reporting
  validStartDate: '2026-01-01',
  validEndDate: '2026-12-31',
  // Invalid dates
  invalidStartDate: 'invalid-date',
  // Branch IDs
  validBranchId: 1,
  invalidBranchId: 99999,
  // License Category IDs
  validCategoryId: 1,
  invalidCategoryId: 99999,
  // Roles
  roleReceptionist: 'Receptionist',
  roleDoctor: 'Doctor',
  roleExaminer: 'Examiner',
};

// API Response validator
function validateApiResponse(response: any, expectedSuccess?: boolean) {
  expect(response).toBeDefined();
  expect(typeof response.success).toBe('boolean');
  expect(typeof response.statusCode).toBe('number');
  if (expectedSuccess !== undefined) {
    expect(response.success).toBe(expectedSuccess);
  }
}

// ============================================================================
// TEST SUITE: GET /api/v1/reports/summary - Reporting Dashboard Summary
// ============================================================================
test.describe('GET /api/v1/reports/summary - Reporting Dashboard Summary', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/summary`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/summary] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/summary`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return summary with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/summary] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/summary`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With valid Manager token (should succeed)
  test('should return summary with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/summary] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/summary`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With query parameters (should work)
  test('should return summary with filter parameters', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/summary] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/summary`, {
      params: {
        startDate: FILTER_PARAMS.startDate,
        endDate: FILTER_PARAMS.endDate,
        branchId: FILTER_PARAMS.branchId,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/summary`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });

  // Test: With Receptionist token (should fail with 403)
  test('should return 403 with receptionist token', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /reports/summary] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/summary`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/reports/status-distribution - Status Distribution
// ============================================================================
test.describe('GET /api/v1/reports/status-distribution - Status Distribution', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/status-distribution`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/status-distribution] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/status-distribution`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return status distribution with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/status-distribution] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/status-distribution`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With valid Manager token (should succeed)
  test('should return status distribution with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/status-distribution] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/status-distribution`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With date range filter (should work)
  test('should return status distribution with date filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/status-distribution] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/status-distribution`, {
      params: {
        startDate: MOCK_DATA.validStartDate,
        endDate: MOCK_DATA.validEndDate,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/status-distribution`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/reports/service-distribution - Service Distribution
// ============================================================================
test.describe('GET /api/v1/reports/service-distribution - Service Distribution', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/service-distribution`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/service-distribution] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/service-distribution`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return service distribution with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/service-distribution] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/service-distribution`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With valid Manager token (should succeed)
  test('should return service distribution with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/service-distribution] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/service-distribution`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With license category filter (should work)
  test('should return service distribution with category filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/service-distribution] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/service-distribution`, {
      params: {
        licenseCategoryId: MOCK_DATA.validCategoryId,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/service-distribution`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/reports/delayed-applications - Delayed Applications
// ============================================================================
test.describe('GET /api/v1/reports/delayed-applications - Delayed Applications', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/delayed-applications`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/delayed-applications] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/delayed-applications`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return delayed applications with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/delayed-applications] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/delayed-applications`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With valid Manager token (should succeed)
  test('should return delayed applications with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/delayed-applications] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/delayed-applications`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With pagination parameters (should work)
  test('should return delayed applications with pagination', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/delayed-applications] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/delayed-applications`, {
      params: {
        page: 1,
        pageSize: 20,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    // Paged result structure
    expect(json.data).toHaveProperty('items');
    expect(json.data).toHaveProperty('totalCount');
    expect(json.data).toHaveProperty('page');
    expect(json.data).toHaveProperty('pageSize');
  });

  // Test: With branch filter (should work)
  test('should return delayed applications with branch filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/delayed-applications] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/delayed-applications`, {
      params: {
        branchId: MOCK_DATA.validBranchId,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/delayed-applications`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/reports/test-performance - Test Performance
// ============================================================================
test.describe('GET /api/v1/reports/test-performance - Test Performance Metrics', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/test-performance`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/test-performance] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/test-performance`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return test performance with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/test-performance] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/test-performance`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With valid Manager token (should succeed)
  test('should return test performance with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/test-performance] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/test-performance`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With role filter (should work)
  test('should return test performance with role filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/test-performance] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/test-performance`, {
      params: {
        role: MOCK_DATA.roleExaminer,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/test-performance`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/reports/branch-throughput - Branch Throughput
// ============================================================================
test.describe('GET /api/v1/reports/branch-throughput - Branch Throughput', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/branch-throughput`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/branch-throughput] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/branch-throughput`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return branch throughput with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/branch-throughput] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/branch-throughput`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With valid Manager token (should succeed)
  test('should return branch throughput with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/branch-throughput] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/branch-throughput`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With date range and branch filter (should work)
  test('should return branch throughput with filters', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/branch-throughput] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/branch-throughput`, {
      params: {
        startDate: MOCK_DATA.validStartDate,
        endDate: MOCK_DATA.validEndDate,
        branchId: MOCK_DATA.validBranchId,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/branch-throughput`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/reports/employee-activity - Employee Activity
// ============================================================================
test.describe('GET /api/v1/reports/employee-activity - Employee Activity', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/employee-activity`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/employee-activity] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/employee-activity`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return employee activity with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/employee-activity] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/employee-activity`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With valid Manager token (should succeed)
  test('should return employee activity with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/employee-activity] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/employee-activity`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With role filter (should work)
  test('should return employee activity with role filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/employee-activity] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/employee-activity`, {
      params: {
        role: MOCK_DATA.roleReceptionist,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/employee-activity`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/reports/issuance-timeline - Issuance Timeline
// ============================================================================
test.describe('GET /api/v1/reports/issuance-timeline - Issuance Timeline', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/issuance-timeline`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/issuance-timeline] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/issuance-timeline`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return issuance timeline with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/issuance-timeline] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/issuance-timeline`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With valid Manager token (should succeed)
  test('should return issuance timeline with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/issuance-timeline] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/issuance-timeline`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With date range filter (should work)
  test('should return issuance timeline with date filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/issuance-timeline] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/issuance-timeline`, {
      params: {
        startDate: MOCK_DATA.validStartDate,
        endDate: MOCK_DATA.validEndDate,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/issuance-timeline`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/reports/export-csv - Export CSV
// ============================================================================
test.describe('GET /api/v1/reports/export-csv - Export Reports to CSV', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/export-csv`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/export-csv] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/export-csv`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed and return CSV)
  test('should export CSV with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/export-csv] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/export-csv`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    // Check content type is CSV
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('text/csv');
  });

  // Test: With valid Manager token (should succeed and return CSV)
  test('should export CSV with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/export-csv] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/export-csv`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('text/csv');
  });

  // Test: With filter parameters (should return filtered CSV)
  test('should export CSV with filter parameters', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/export-csv] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/export-csv`, {
      params: {
        startDate: MOCK_DATA.validStartDate,
        endDate: MOCK_DATA.validEndDate,
        branchId: MOCK_DATA.validBranchId,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('text/csv');
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/export-csv`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/reports/export-pdf - Export PDF
// ============================================================================
test.describe('GET /api/v1/reports/export-pdf - Export Reports to PDF', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/export-pdf`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /reports/export-pdf] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/export-pdf`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed and return PDF)
  test('should export PDF with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/export-pdf] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/export-pdf`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    // Check content type is PDF
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('application/pdf');
  });

  // Test: With valid Manager token (should succeed and return PDF)
  test('should export PDF with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /reports/export-pdf] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/export-pdf`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('application/pdf');
  });

  // Test: With filter parameters (should return filtered PDF)
  test('should export PDF with filter parameters', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /reports/export-pdf] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/export-pdf`, {
      params: {
        startDate: MOCK_DATA.validStartDate,
        endDate: MOCK_DATA.validEndDate,
        licenseCategoryId: MOCK_DATA.validCategoryId,
      },
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('application/pdf');
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${REPORTS_BASE}/export-pdf`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: Integration - Complete Reports Access Flow
// ============================================================================
test.describe('Integration - Complete Reports Access Flow', () => {
  
  test('should access all reports endpoints with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Integration] Skipping - could not obtain admin tokens');
      return;
    }

    const reportEndpoints = [
      '/summary',
      '/status-distribution',
      '/service-distribution',
      '/delayed-applications',
      '/test-performance',
      '/branch-throughput',
      '/employee-activity',
      '/issuance-timeline',
      '/export-csv',
      '/export-pdf',
    ];

    for (const endpoint of reportEndpoints) {
      const response = await request.get(`${REPORTS_BASE}${endpoint}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      expect([200, 400]).toContain(response.status());
      
      const json = await response.json();
      validateApiResponse(json);
    }
  });

  test('should verify unauthorized access across all reports endpoints', async ({ request }) => {
    // Test that applicant role cannot access any reports endpoints
    const applicantTokens = await getTokens('applicant');
    if (!applicantTokens) {
      console.warn('[Authorization] Skipping - could not obtain applicant tokens');
      return;
    }

    const reportEndpoints = [
      '/summary',
      '/status-distribution',
      '/service-distribution',
      '/delayed-applications',
      '/test-performance',
      '/branch-throughput',
      '/employee-activity',
      '/issuance-timeline',
      '/export-csv',
      '/export-pdf',
    ];

    for (const endpoint of reportEndpoints) {
      const response = await request.get(`${REPORTS_BASE}${endpoint}`, {
        headers: getAuthHeader(applicantTokens.accessToken),
      });

      expect(response.status()).toBe(403);
    }
  });

  test('should verify receptionist role cannot access reports endpoints', async ({ request }) => {
    const receptionistTokens = await getTokens('receptionist');
    if (!receptionistTokens) {
      console.warn('[Authorization] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${REPORTS_BASE}/summary`, {
      headers: getAuthHeader(receptionistTokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  test('should access reports with various filter combinations', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Filters] Skipping - could not obtain admin tokens');
      return;
    }

    // Test with date range only
    let response = await request.get(`${REPORTS_BASE}/summary`, {
      params: { startDate: '2026-01-01', endDate: '2026-06-30' },
      headers: getAuthHeader(tokens.accessToken),
    });
    expect(response.status()).toBe(200);

    // Test with branch only
    response = await request.get(`${REPORTS_BASE}/summary`, {
      params: { branchId: 1 },
      headers: getAuthHeader(tokens.accessToken),
    });
    expect(response.status()).toBe(200);

    // Test with license category only
    response = await request.get(`${REPORTS_BASE}/summary`, {
      params: { licenseCategoryId: 1 },
      headers: getAuthHeader(tokens.accessToken),
    });
    expect(response.status()).toBe(200);

    // Test with all filters
    response = await request.get(`${REPORTS_BASE}/summary`, {
      params: {
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        branchId: 1,
        licenseCategoryId: 1,
        role: 'Receptionist',
      },
      headers: getAuthHeader(tokens.accessToken),
    });
    expect(response.status()).toBe(200);
  });
});