/**
 * Mojaz API Tests - TheoryTestsController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/theory-tests
 * Endpoints: 2
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 401)
 * - Citizen/Applicant token (expect 200/403 based on endpoint)
 * - Admin token (expect 200)
 * - Examiner token (expect 200 for result submission)
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const THEORY_TESTS_BASE = `${BASE_URL}/api/v1/theory-tests`;

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

// Mock data for theory test submissions
const MOCK_DATA = {
  // Valid theory test result data
  theoryResult: {
    score: 85,
    passed: true,
    maxScore: 100,
    passingScore: 70,
    attemptNumber: 1,
    notes: 'اجتياز الاختبار بنجاح',
  },
  // Invalid result - failed
  failedResult: {
    score: 50,
    passed: false,
    maxScore: 100,
    passingScore: 70,
    attemptNumber: 2,
    notes: 'لم يجتز الاختبار - يحتاج تدريب إضافي',
  },
  // Invalid score
  invalidScoreResult: {
    score: 150, // Exceeds maxScore
    passed: true,
    maxScore: 100,
    passingScore: 70,
    attemptNumber: 1,
  },
  // Negative score
  negativeScoreResult: {
    score: -10,
    passed: false,
    maxScore: 100,
    passingScore: 70,
    attemptNumber: 1,
  },
  // Valid application ID for testing
  validApplicationId: '1',
  invalidApplicationId: '99999',
  // Pagination
  page: 1,
  pageSize: 20,
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
// TEST SUITE: POST /api/v1/theory-tests/application/{appIdOrNumber}/result
// Submit a theory test result for an application
// Roles: Examiner (authorized)
// ============================================================================
test.describe('POST /api/v1/theory-tests/application/{appIdOrNumber}/result - Submit Theory Test Result', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403 - not authorized)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should fail with 403 - not authorized for this action)
  test('should return 403 when admin token (not authorized for examiner action)', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(403);
  });

  // Test: With valid Examiner token and valid data (should succeed or fail based on application state)
  test('should submit theory test result with examiner token and valid data', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    // Should either succeed (201) or fail (404 for application not found, 400 for validation errors)
    expect([201, 400, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 201) {
      expect(json.data).toHaveProperty('id');
      expect(json.data.passed).toBe(true);
    }
  });

  // Test: With valid Examiner token and failed result (should succeed)
  test('should submit failed theory test result with examiner token', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.failedResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect([201, 400, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 201) {
      expect(json.data.passed).toBe(false);
    }
  });

  // Test: With valid Examiner token and invalid application ID (should return 404)
  test('should return 404 with examiner token and invalid application id', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.invalidApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Examiner token and invalid score (should fail validation)
  test('should reject submission with invalid score (exceeds max)', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.invalidScoreResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(400);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Examiner token and negative score (should fail validation)
  test('should reject submission with negative score', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.negativeScoreResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(400);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Examiner token and missing required fields (should fail)
  test('should reject submission with missing required fields', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: {
          // Missing: score, passed, maxScore, passingScore, attemptNumber
          notes: 'Some notes',
        },
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(400);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          Authorization: 'Bearer invalid-token-xyz',
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(401);
  });

  // Test: With Manager token (should fail with 403)
  test('should return 403 when manager token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(403);
  });

  // Test: With Receptionist token (should fail with 403)
  test('should return 403 when receptionist token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(403);
  });

  // Test: With Doctor token (should fail with 403)
  test('should return 403 when doctor token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(403);
  });

  // Test: With Security token (should fail with 403)
  test('should return 403 when security token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[POST /theory-tests/result] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(403);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/theory-tests/application/{appIdOrNumber}/history
// Get all theory test attempts for an application
// Roles: Applicant, Receptionist, Doctor, Examiner, Manager, Security, Admin, SuperAdmin, Support
// ============================================================================
test.describe('GET /api/v1/theory-tests/application/{appIdOrNumber}/history - Get Theory Test History', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`
    );

    expect(response.status()).toBe(401);
  });

  // Test: With valid Applicant token (should succeed)
  test('should return theory test history with applicant token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 200) {
      expect(json.data).toBeDefined();
    }
  });

  // Test: With valid Admin token (should succeed)
  test('should return theory test history with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 200) {
      expect(json.data).toBeDefined();
    }
  });

  // Test: With valid Examiner token (should succeed)
  test('should return theory test history with examiner token', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With valid Manager token (should succeed)
  test('should return theory test history with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With valid Receptionist token (should succeed)
  test('should return theory test history with receptionist token', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With valid Doctor token (should succeed)
  test('should return theory test history with doctor token', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With valid Security token (should succeed)
  test('should return theory test history with security token', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With invalid application ID (should return 404)
  test('should return 404 with invalid application id', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.invalidApplicationId}/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With pagination parameters (should succeed)
  test('should return theory test history with pagination', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history?page=${MOCK_DATA.page}&pageSize=${MOCK_DATA.pageSize}`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 200 && json.data) {
      expect(json.data).toHaveProperty('items');
      expect(json.data).toHaveProperty('totalCount');
      expect(json.data).toHaveProperty('page');
      expect(json.data).toHaveProperty('pageSize');
    }
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader('invalid-token-xyz'),
      }
    );

    expect(response.status()).toBe(401);
  });

  // Test: With application number instead of ID (should resolve correctly)
  test('should handle application number instead of ID', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain admin tokens');
      return;
    }

    // Try with an application number format (e.g., MOJ-2025-XXXXXXXX)
    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/MOJ-2025-12345678/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    // Should either succeed (200) or fail (404 for not found)
    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With non-existent application number (should return 404)
  test('should return 404 with non-existent application number', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /theory-tests/history] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(
      `${THEORY_TESTS_BASE}/application/MOJ-2099-99999999/history`,
      {
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });
});

// ============================================================================
// TEST SUITE: Integration - Complete Theory Test Flow
// ============================================================================
test.describe('Integration - Complete Theory Test Flow', () => {
  
  test('should complete full theory test flow', async ({ request }) => {
    const examinerTokens = await getTokens('examiner');
    const adminTokens = await getTokens('admin');
    
    if (!examinerTokens || !adminTokens) {
      console.warn('[Integration] Skipping - could not obtain required tokens');
      return;
    }

    // Step 1: Submit a theory test result as examiner
    const submitResponse = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(examinerTokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );

    // Should either succeed or fail based on application state
    expect([201, 400, 404]).toContain(submitResponse.status());
    const submitJson = await submitResponse.json();
    validateApiResponse(submitJson);

    // Step 2: Get theory test history (as admin)
    const historyResponse = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(adminTokens.accessToken),
      }
    );

    expect([200, 404]).toContain(historyResponse.status());
    const historyJson = await historyResponse.json();
    validateApiResponse(historyJson);

    // Step 3: Get history with pagination (as admin)
    const paginatedResponse = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history?page=1&pageSize=10`,
      {
        headers: getAuthHeader(adminTokens.accessToken),
      }
    );

    expect([200, 404]).toContain(paginatedResponse.status());
    const paginatedJson = await paginatedResponse.json();
    validateApiResponse(paginatedJson);
  });

  test('should verify unauthorized access across all endpoints', async ({ request }) => {
    // Test that applicant role can get history but cannot submit results
    const applicantTokens = await getTokens('applicant');
    if (!applicantTokens) {
      console.warn('[Authorization] Skipping - could not obtain applicant tokens');
      return;
    }

    // GET history - should succeed (200 or 404)
    let response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(applicantTokens.accessToken),
      }
    );
    expect([200, 404]).toContain(response.status());

    // POST result - should fail with 403
    response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(applicantTokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );
    expect(response.status()).toBe(403);
  });

  test('should verify examiner has full access', async ({ request }) => {
    const examinerTokens = await getTokens('examiner');
    if (!examinerTokens) {
      console.warn('[Authorization] Skipping - could not obtain examiner tokens');
      return;
    }

    // POST result - should succeed or fail based on application state
    let response = await request.post(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/result`,
      {
        data: MOCK_DATA.theoryResult,
        headers: {
          ...getAuthHeader(examinerTokens.accessToken),
          'Content-Type': 'application/json',
        },
      }
    );
    expect([201, 400, 404]).toContain(response.status());

    // GET history - should succeed or fail based on application state
    response = await request.get(
      `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
      {
        headers: getAuthHeader(examinerTokens.accessToken),
      }
    );
    expect([200, 404]).toContain(response.status());
  });

  test('should handle all roles for history endpoint', async ({ request }) => {
    const roles = ['applicant', 'admin', 'manager', 'receptionist', 'doctor', 'examiner', 'security'];
    
    for (const role of roles) {
      const tokens = await getTokens(role as any);
      if (!tokens) {
        console.warn(`[Authorization] Skipping - could not obtain ${role} tokens`);
        continue;
      }

      const response = await request.get(
        `${THEORY_TESTS_BASE}/application/${MOCK_DATA.validApplicationId}/history`,
        {
          headers: getAuthHeader(tokens.accessToken),
        }
      );

      // All authenticated roles should be able to access history (200 or 404)
      expect([200, 404]).toContain(response.status());
    }
  });
});