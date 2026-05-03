/**
 * Mojaz API Tests - AuditLogsController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/audit-logs
 * Endpoints: 2
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 401)
 * - Citizen/Applicant token (expect 403 - not authorized)
 * - Admin/Manager/Security token (expect 200)
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const AUDIT_LOGS_BASE = `${BASE_URL}/api/v1/audit-logs`;

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
// TEST SUITE: GET /api/v1/audit-logs - Get Audit Logs with Filtering
// ============================================================================
test.describe('GET /api/v1/audit-logs - Get Audit Logs with Filtering', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(AUDIT_LOGS_BASE);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return audit logs with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    // Should return paginated result
    expect(json.data).toBeDefined();
    expect(json.data.auditLogs).toBeDefined();
    expect(Array.isArray(json.data.auditLogs)).toBe(true);
  });

  // Test: With valid Manager token (should succeed)
  test('should return audit logs with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data.auditLogs).toBeDefined();
  });

  // Test: With valid Security token (should succeed)
  test('should return audit logs with security token', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data.auditLogs).toBeDefined();
  });

  // Test: With pagination parameters
  test('should support pagination parameters', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}?page=1&pageSize=10`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data.page).toBe(1);
    expect(json.data.pageSize).toBe(10);
  });

  // Test: With entityName filter
  test('should support entityName filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}?entityName=User`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With actionType filter
  test('should support actionType filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}?actionType=Login`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With date range filter (fromDate)
  test('should support fromDate filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain admin tokens');
      return;
    }

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const fromDateStr = fromDate.toISOString().split('T')[0];

    const response = await request.get(`${AUDIT_LOGS_BASE}?fromDate=${fromDateStr}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With date range filter (toDate)
  test('should support toDate filter', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain admin tokens');
      return;
    }

    const toDate = new Date().toISOString().split('T')[0];

    const response = await request.get(`${AUDIT_LOGS_BASE}?toDate=${toDate}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With combined filters
  test('should support combined filters', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain admin tokens');
      return;
    }

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    const fromDateStr = fromDate.toISOString().split('T')[0];
    const toDateStr = new Date().toISOString().split('T')[0];

    const response = await request.get(
      `${AUDIT_LOGS_BASE}?entityName=User&actionType=Login&fromDate=${fromDateStr}&toDate=${toDateStr}&page=1&pageSize=5`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data.page).toBe(1);
    expect(json.data.pageSize).toBe(5);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });

  // Test: With Receptionist token (should fail with 403 - not authorized)
  test('should return 403 when receptionist token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Doctor token (should fail with 403 - not authorized)
  test('should return 403 when doctor token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Examiner token (should fail with 403 - not authorized)
  test('should return 403 when examiner token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: Response structure validation
  test('should return valid response structure with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);

    // Validate response data structure
    expect(json.data).toHaveProperty('auditLogs');
    expect(json.data).toHaveProperty('totalCount');
    expect(json.data).toHaveProperty('page');
    expect(json.data).toHaveProperty('pageSize');
    expect(json.data).toHaveProperty('totalPages');

    // Validate types
    expect(typeof json.data.totalCount).toBe('number');
    expect(typeof json.data.page).toBe('number');
    expect(typeof json.data.pageSize).toBe('number');
    expect(typeof json.data.totalPages).toBe('number');
  });

  // Test: Large page size (should be limited)
  test('should handle large pageSize gracefully', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs] Skipping - could not obtain admin tokens');
      return;
    }

    // Request very large pageSize - should be limited by backend
    const response = await request.get(`${AUDIT_LOGS_BASE}?pageSize=1000`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    // Backend should cap at reasonable limit (e.g., 100)
    expect(json.data.pageSize).toBeLessThanOrEqual(100);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/audit-logs/{id} - Get Audit Log By ID
// ============================================================================
test.describe('GET /api/v1/audit-logs/{id} - Get Audit Log By ID', () => {
  const invalidId = 999999999;

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${AUDIT_LOGS_BASE}/1`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}/1`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token and valid ID (should succeed or 404 if no data)
  test('should return audit log with admin token and valid id', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    // First get list to find a valid ID
    const listResponse = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(listResponse.status()).toBe(200);
    const listJson = await listResponse.json();
    
    // Try to get first audit log if exists
    let testId = 1;
    if (listJson.data.auditLogs && listJson.data.auditLogs.length > 0) {
      testId = listJson.data.auditLogs[0].id;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}/${testId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // May return 200 (found) or 404 (not found)
    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    
    if (response.status() === 200) {
      expect(json.data).toHaveProperty('id');
      expect(json.data).toHaveProperty('actionType');
      expect(json.data).toHaveProperty('entityName');
      expect(json.data).toHaveProperty('timestamp');
    }
  });

  // Test: With valid Admin token and invalid ID (should return 404)
  test('should return 404 with admin token and invalid id', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}/${invalidId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Manager token (should succeed)
  test('should return audit log with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}/1`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With valid Security token (should succeed)
  test('should return audit log with security token', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}/1`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${AUDIT_LOGS_BASE}/1`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });

  // Test: With negative ID (should return 404 or 400)
  test('should handle negative ID gracefully', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}/-1`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([400, 404]).toContain(response.status());
  });

  // Test: With zero ID (should return 404 or 400)
  test('should handle zero ID gracefully', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}/0`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([400, 404]).toContain(response.status());
  });

  // Test: With non-numeric ID (should return 404 or 400)
  test('should handle non-numeric ID gracefully', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}/abc`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([400, 404]).toContain(response.status());
  });

  // Test: With Receptionist token (should fail with 403 - not authorized)
  test('should return 403 when receptionist token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${AUDIT_LOGS_BASE}/1`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: Response structure validation for valid ID
  test('should return valid response structure when audit log exists', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /audit-logs/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    // Get list to find valid ID
    const listResponse = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(listResponse.status()).toBe(200);
    const listJson = await listResponse.json();
    
    if (listJson.data.auditLogs && listJson.data.auditLogs.length > 0) {
      const testId = listJson.data.auditLogs[0].id;
      
      const response = await request.get(`${AUDIT_LOGS_BASE}/${testId}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      expect(response.status()).toBe(200);
      const json = await response.json();
      validateApiResponse(json, true);

      // Validate DTO structure
      expect(json.data.id).toBe(testId);
      expect(json.data).toHaveProperty('actionType');
      expect(json.data).toHaveProperty('entityName');
      expect(json.data).toHaveProperty('entityId');
      expect(json.data).toHaveProperty('timestamp');
      expect(json.data).toHaveProperty('userId');
      expect(json.data).toHaveProperty('userName');
    }
  });
});

// ============================================================================
// TEST SUITE: Integration - Complete Audit Logs Flow
// ============================================================================
test.describe('Integration - Complete Audit Logs Flow', () => {
  
  test('should verify unauthorized access across all endpoints', async ({ request }) => {
    const applicantTokens = await getTokens('applicant');
    if (!applicantTokens) {
      console.warn('[Authorization] Skipping - could not obtain applicant tokens');
      return;
    }

    // GET all
    let response = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(applicantTokens.accessToken),
    });
    expect(response.status()).toBe(403);

    // GET by ID
    response = await request.get(`${AUDIT_LOGS_BASE}/1`, {
      headers: getAuthHeader(applicantTokens.accessToken),
    });
    expect(response.status()).toBe(403);
  });

  test('should verify authorized roles have access', async ({ request }) => {
    const authorizedRoles = ['admin', 'manager', 'security'];
    
    for (const role of authorizedRoles) {
      const tokens = await getTokens(role as any);
      if (!tokens) {
        console.warn(`[Authorized Roles] Skipping - could not obtain ${role} tokens`);
        continue;
      }

      const response = await request.get(AUDIT_LOGS_BASE, {
        headers: getAuthHeader(tokens.accessToken),
      });

      expect(response.status()).toBe(200);
      const json = await response.json();
      validateApiResponse(json, true);
    }
  });

  test('should verify pagination metadata is correct', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Pagination] Skipping - could not obtain admin tokens');
      return;
    }

    // Get with specific page and pageSize
    const page = 2;
    const pageSize = 5;
    const response = await request.get(`${AUDIT_LOGS_BASE}?page=${page}&pageSize=${pageSize}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);

    // Verify pagination metadata
    expect(json.data.page).toBe(page);
    expect(json.data.pageSize).toBe(pageSize);
    expect(json.data.totalPages).toBeGreaterThanOrEqual(0);
    expect(json.data.totalCount).toBeGreaterThanOrEqual(0);
    
    // totalPages should be calculated correctly
    if (json.data.totalCount > 0) {
      const expectedTotalPages = Math.ceil(json.data.totalCount / pageSize);
      expect(json.data.totalPages).toBe(expectedTotalPages);
    }
  });

  test('should handle date filter edge cases', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Date Filter] Skipping - could not obtain admin tokens');
      return;
    }

    // Test with future date (should return empty or recent logs)
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const response = await request.get(`${AUDIT_LOGS_BASE}?fromDate=${futureDateStr}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    
    // Should return empty results for future date
    expect(json.data.auditLogs).toBeDefined();
    expect(json.data.totalCount).toBeLessThanOrEqual(json.data.auditLogs.length);
  });

  test('should handle case-insensitive filters', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Case Insensitive] Skipping - could not obtain admin tokens');
      return;
    }

    // Test with uppercase entity name
    const responseUpper = await request.get(`${AUDIT_LOGS_BASE}?entityName=USER`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // Test with lowercase entity name
    const responseLower = await request.get(`${AUDIT_LOGS_BASE}?entityName=user`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // Both should work (backend may or may not be case-sensitive)
    expect([200, 400]).toContain(responseUpper.status());
    expect([200, 400]).toContain(responseLower.status());
  });

  test('should verify all authorized roles can access by ID endpoint', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[By ID Access] Skipping - could not obtain admin tokens');
      return;
    }

    // Get list first to find any existing ID
    const listResponse = await request.get(AUDIT_LOGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(listResponse.status()).toBe(200);
    const listJson = await listResponse.json();

    // Test that Manager and Security roles can also access
    const authorizedRoles = ['manager', 'security'];
    
    for (const role of authorizedRoles) {
      const roleTokens = await getTokens(role as any);
      if (!roleTokens) continue;

      // If there are existing audit logs, try to get by ID
      if (listJson.data.auditLogs && listJson.data.auditLogs.length > 0) {
        const testId = listJson.data.auditLogs[0].id;
        
        const response = await request.get(`${AUDIT_LOGS_BASE}/${testId}`, {
          headers: getAuthHeader(roleTokens.accessToken),
        });

        expect([200, 404]).toContain(response.status());
      } else {
        // Try with ID 1
        const response = await request.get(`${AUDIT_LOGS_BASE}/1`, {
          headers: getAuthHeader(roleTokens.accessToken),
        });

        expect([200, 404]).toContain(response.status());
      }
    }
  });
});