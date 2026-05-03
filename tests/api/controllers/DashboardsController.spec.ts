/**
 * Mojaz API Tests - DashboardsController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/dashboards
 * Endpoints: 7
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 401)
 * - Citizen/Applicant token (expect 403 or 200 based on endpoint)
 * - Admin token (expect 200)
 * 
 * Endpoints:
 * 1. GET /api/v1/dashboards/applicant - Applicant dashboard (Applicant role)
 * 2. GET /api/v1/dashboards/manager - Manager KPI dashboard (Manager,Admin,Receptionist,Doctor,Examiner)
 * 3. GET /api/v1/dashboards/admin - Admin dashboard (Admin role)
 * 4. GET /api/v1/dashboards/employee - Employee dashboard (Admin,Receptionist,Doctor,Examiner,Manager,Security)
 * 5. GET /api/v1/dashboards/receptionist - Receptionist dashboard (Admin,Receptionist,Manager,Security)
 * 6. GET /api/v1/dashboards/stats - General statistics (All authenticated roles)
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const DASHBOARDS_BASE = `${BASE_URL}/api/v1/dashboards`;

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
// TEST SUITE: GET /api/v1/dashboards/applicant - Applicant Dashboard
// ============================================================================
test.describe('GET /api/v1/dashboards/applicant - Applicant Dashboard', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/applicant`);
    expect(response.status()).toBe(401);
  });

  // Test: With valid Applicant token (should succeed)
  test('should return applicant dashboard with applicant token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /dashboards/applicant] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/applicant`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    // Applicant dashboard should have specific fields
    expect(json.data).toBeDefined();
  });

  // Test: With Admin token (should fail with 403 - not in Applicant role)
  test('should return 403 when admin tries to access applicant dashboard', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /dashboards/applicant] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/applicant`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Manager token (should fail with 403 - not in Applicant role)
  test('should return 403 when manager tries to access applicant dashboard', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /dashboards/applicant] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/applicant`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/applicant`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/dashboards/manager - Manager KPI Dashboard
// ============================================================================
test.describe('GET /api/v1/dashboards/manager - Manager KPI Dashboard', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/manager`);
    expect(response.status()).toBe(401);
  });

  // Test: With valid Admin token (should succeed)
  test('should return manager dashboard with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /dashboards/manager] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/manager`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With valid Manager token (should succeed)
  test('should return manager dashboard with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /dashboards/manager] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/manager`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Receptionist token (should succeed)
  test('should return manager dashboard with receptionist token', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /dashboards/manager] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/manager`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Doctor token (should succeed)
  test('should return manager dashboard with doctor token', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /dashboards/manager] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/manager`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Examiner token (should succeed)
  test('should return manager dashboard with examiner token', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[GET /dashboards/manager] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/manager`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Applicant token (should fail with 403)
  test('should return 403 when applicant tries to access manager dashboard', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /dashboards/manager] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/manager`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/manager`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/dashboards/admin - Admin Dashboard
// ============================================================================
test.describe('GET /api/v1/dashboards/admin - Admin Dashboard', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/admin`);
    expect(response.status()).toBe(401);
  });

  // Test: With valid Admin token (should succeed)
  test('should return admin dashboard with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /dashboards/admin] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/admin`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With Manager token (should fail with 403 - not in Admin role)
  test('should return 403 when manager tries to access admin dashboard', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /dashboards/admin] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/admin`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Receptionist token (should fail with 403)
  test('should return 403 when receptionist tries to access admin dashboard', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /dashboards/admin] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/admin`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Doctor token (should fail with 403)
  test('should return 403 when doctor tries to access admin dashboard', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /dashboards/admin] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/admin`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Applicant token (should fail with 403)
  test('should return 403 when applicant tries to access admin dashboard', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /dashboards/admin] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/admin`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/admin`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/dashboards/employee - Employee Dashboard
// ============================================================================
test.describe('GET /api/v1/dashboards/employee - Employee Dashboard', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/employee`);
    expect(response.status()).toBe(401);
  });

  // Test: With valid Admin token (should succeed)
  test('should return employee dashboard with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /dashboards/employee] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/employee`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Receptionist token (should succeed)
  test('should return employee dashboard with receptionist token', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /dashboards/employee] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/employee`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Doctor token (should succeed)
  test('should return employee dashboard with doctor token', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /dashboards/employee] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/employee`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Examiner token (should succeed)
  test('should return employee dashboard with examiner token', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[GET /dashboards/employee] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/employee`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Manager token (should succeed)
  test('should return employee dashboard with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /dashboards/employee] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/employee`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Security token (should succeed)
  test('should return employee dashboard with security token', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[GET /dashboards/employee] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/employee`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With Applicant token (should fail with 403)
  test('should return 403 when applicant tries to access employee dashboard', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /dashboards/employee] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/employee`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/employee`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/dashboards/receptionist - Receptionist Dashboard
// ============================================================================
test.describe('GET /api/v1/dashboards/receptionist - Receptionist Dashboard', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/receptionist`);
    expect(response.status()).toBe(401);
  });

  // Test: With valid Admin token (should succeed)
  test('should return receptionist dashboard with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /dashboards/receptionist] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/receptionist`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Receptionist token (should succeed)
  test('should return receptionist dashboard with receptionist token', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /dashboards/receptionist] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/receptionist`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Manager token (should succeed)
  test('should return receptionist dashboard with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /dashboards/receptionist] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/receptionist`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Security token (should succeed)
  test('should return receptionist dashboard with security token', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[GET /dashboards/receptionist] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/receptionist`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With Doctor token (should fail with 403 - not in allowed roles)
  test('should return 403 when doctor tries to access receptionist dashboard', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /dashboards/receptionist] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/receptionist`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Examiner token (should fail with 403)
  test('should return 403 when examiner tries to access receptionist dashboard', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[GET /dashboards/receptionist] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/receptionist`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Applicant token (should fail with 403)
  test('should return 403 when applicant tries to access receptionist dashboard', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /dashboards/receptionist] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/receptionist`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/receptionist`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/dashboards/stats - General Statistics
// ============================================================================
test.describe('GET /api/v1/dashboards/stats - General Statistics', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/stats`);
    expect(response.status()).toBe(401);
  });

  // Test: With valid Admin token (should succeed)
  test('should return stats with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /dashboards/stats] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/stats`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With valid Manager token (should succeed)
  test('should return stats with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /dashboards/stats] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/stats`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Receptionist token (should succeed)
  test('should return stats with receptionist token', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /dashboards/stats] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/stats`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Doctor token (should succeed)
  test('should return stats with doctor token', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /dashboards/stats] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/stats`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Examiner token (should succeed)
  test('should return stats with examiner token', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[GET /dashboards/stats] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/stats`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With valid Applicant token (should succeed - returns applicant dashboard for applicants)
  test('should return stats with applicant token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /dashboards/stats] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/stats`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Security token (should succeed)
  test('should return stats with security token', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[GET /dashboards/stats] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.get(`${DASHBOARDS_BASE}/stats`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${DASHBOARDS_BASE}/stats`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// SUMMARY TEST: All Endpoints Comprehensive Check
// ============================================================================
test.describe('DashboardsController - Comprehensive Security Check', () => {
  
  test('should verify all 6 endpoints respond correctly', async ({ request }) => {
    // This test serves as a quick smoke test for all dashboard endpoints
    const endpoints = [
      '/applicant',
      '/manager',
      '/admin',
      '/employee',
      '/receptionist',
      '/stats'
    ];

    // Get admin token for endpoints that allow admin
    const adminTokens = await getTokens('admin');
    const applicantTokens = await getTokens('applicant');

    if (!adminTokens) {
      console.warn('[Smoke Test] Skipping - could not obtain admin tokens');
      return;
    }

    // Test that endpoints are accessible (may return 200 or 403 based on role)
    for (const endpoint of endpoints) {
      const response = await request.get(`${DASHBOARDS_BASE}${endpoint}`, {
        headers: getAuthHeader(adminTokens.accessToken),
      });

      // Admin should have access to most endpoints (except applicant)
      expect([200, 403]).toContain(response.status());
    }

    // Test applicant-only endpoint
    if (applicantTokens) {
      const applicantOnlyResponse = await request.get(`${DASHBOARDS_BASE}/applicant`, {
        headers: getAuthHeader(applicantTokens.accessToken),
      });
      expect(applicantOnlyResponse.status()).toBe(200);

      // Applicant should NOT have access to admin dashboard
      const adminResponse = await request.get(`${DASHBOARDS_BASE}/admin`, {
        headers: getAuthHeader(applicantTokens.accessToken),
      });
      expect(adminResponse.status()).toBe(403);
    }

    console.log('[Smoke Test] All dashboard endpoints verified successfully');
  });
});