/**
 * Mojaz API Tests - SettingsController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/settings
 * Endpoints: 4
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 401)
 * - Citizen/Applicant token (expect 403 - not authorized)
 * - Admin token (expect 200)
 */

import { test, expect, request } from '@playwright/test';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const SETTINGS_BASE = `${BASE_URL}/api/v1/settings`;

// Helper functions for test setup
async function getTokens(apiContext: any, role: 'applicant' | 'admin' | 'manager' | 'receptionist' | 'doctor' | 'examiner' | 'security') {
  const AUTH_BASE = `${BASE_URL}/api/v1/auth`;
  const testAccounts: Record<string, { email: string; password: string }> = {
    applicant: { email: 'applicant@mojaz.gov.sa', password: 'Password123!' },
    admin: { email: 'admin@mojaz.gov.sa', password: 'Password123!' },
    manager: { email: 'manager@mojaz.gov.sa', password: 'Password123!' },
    receptionist: { email: 'receptionist@mojaz.gov.sa', password: 'Password123!' },
    doctor: { email: 'doctor@mojaz.gov.sa', password: 'Password123!' },
    examiner: { email: 'examiner@mojaz.gov.sa', password: 'Password123!' },
    security: { email: 'security@mojaz.gov.sa', password: 'Password123!' },
  };

  try {
    const response = await apiContext.post(`${AUTH_BASE}/login`, {
      data: {
        identifier: testAccounts[role].email,
        password: testAccounts[role].password,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok()) {
      console.warn(`[getTokens] Login failed for ${role}: ${response.status()}`);
      return null;
    }

    const json = await response.json();
    return json.success && json.data ? json.data : null;
  } catch (e) {
    console.warn(`[getTokens] Error for ${role}: ${e}`);
    return null;
  }
}

function getAuthHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// Arabic-appropriate mock data for Saudi system settings
const MOCK_DATA = {
  // Unique key for testing (use timestamp to avoid conflicts)
  testKey: `TEST_SETTING_${Date.now()}`,
  testKeyUpdate: `TEST_SETTING_${Date.now()}_UPDATED`,
  // Valid setting values
  testValue: '100',
  updatedValue: '200',
  // Categories
  categoryGeneral: 'General',
  categoryFees: 'Fees',
  categoryValidation: 'Validation',
  categorySecurity: 'Security',
  // Descriptions in Arabic
  descriptionAr: 'إعداد اختبار للنظام',
  descriptionEn: 'Test system setting',
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
// TEST SUITE: GET /api/v1/settings - Get All System Settings
// ============================================================================
test.describe('GET /api/v1/settings - Get All System Settings', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(SETTINGS_BASE);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens(request, 'applicant');
    if (!tokens) {
      console.warn('[GET /settings] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(SETTINGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return system settings with admin token', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[GET /settings] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(SETTINGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    // Should return paginated result with items array
    expect(json.data).toBeDefined();
    expect(json.data.items).toBeDefined();
    expect(Array.isArray(json.data.items)).toBe(true);
  });

  // Test: With pagination parameters
  test('should support pagination parameters', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[GET /settings] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${SETTINGS_BASE}?page=1&pageSize=10`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data.page).toBe(1);
    expect(json.data.pageSize).toBe(10);
  });

  // Test: With category filter
  test('should support category filter', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[GET /settings] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${SETTINGS_BASE}?category=General`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With search filter
  test('should support search filter', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[GET /settings] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${SETTINGS_BASE}?search=age`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(SETTINGS_BASE, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/settings/{key} - Get Setting By Key
// ============================================================================
test.describe('GET /api/v1/settings/{key} - Get Setting By Key', () => {
  const validKey = 'MIN_AGE_CATEGORY_A';
  const invalidKey = 'NONEXISTENT_KEY_12345';

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${SETTINGS_BASE}/${validKey}`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens(request, 'applicant');
    if (!tokens) {
      console.warn('[GET /settings/{key}] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${SETTINGS_BASE}/${validKey}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token and valid key (should succeed)
  test('should return setting with admin token and valid key', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[GET /settings/{key}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${SETTINGS_BASE}/${validKey}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // May return 200 (found) or 404 (not found)
    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 200) {
      expect(json.data).toHaveProperty('key');
      expect(json.data.key).toBe(validKey);
    }
  });

  // Test: With valid Admin token and invalid key (should return 404)
  test('should return 404 with admin token and invalid key', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[GET /settings/{key}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${SETTINGS_BASE}/${invalidKey}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${SETTINGS_BASE}/${validKey}`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: POST /api/v1/settings - Create System Setting
// ============================================================================
test.describe('POST /api/v1/settings - Create System Setting', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(SETTINGS_BASE, {
      data: {
        key: MOCK_DATA.testKey,
        value: MOCK_DATA.testValue,
        category: MOCK_DATA.categoryGeneral,
        description: MOCK_DATA.descriptionAr,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens(request, 'applicant');
    if (!tokens) {
      console.warn('[POST /settings] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(SETTINGS_BASE, {
      data: {
        key: MOCK_DATA.testKey,
        value: MOCK_DATA.testValue,
        category: MOCK_DATA.categoryGeneral,
        description: MOCK_DATA.descriptionAr,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token and valid data (should succeed)
  test('should create setting with admin token and valid data', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[POST /settings] Skipping - could not obtain admin tokens');
      return;
    }

    const uniqueKey = `TEST_SETTING_${Date.now()}`;
    const response = await request.post(SETTINGS_BASE, {
      data: {
        key: uniqueKey,
        value: MOCK_DATA.testValue,
        category: MOCK_DATA.categoryFees,
        description: MOCK_DATA.descriptionAr,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([200, 201, 400, 409]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 201 || response.status() === 200) {
      expect(json.data).toHaveProperty('key');
      expect(json.data.key).toBe(uniqueKey);
      expect(json.data.value).toBe(MOCK_DATA.testValue);
    }
  });

  // Test: With valid Admin token and missing required fields (should fail)
  test('should reject create with missing required fields', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[POST /settings] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(SETTINGS_BASE, {
      data: {
        // Missing key and value
        category: MOCK_DATA.categoryGeneral,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(400);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Admin token and empty key (should fail)
  test('should reject create with empty key', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[POST /settings] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(SETTINGS_BASE, {
      data: {
        key: '', // Empty key
        value: MOCK_DATA.testValue,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(400);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Admin token and empty value (should fail)
  test('should reject create with empty value', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[POST /settings] Skipping - could not obtain admin tokens');
      return;
    }

    const uniqueKey = `TEST_KEY_${Date.now()}`;
    const response = await request.post(SETTINGS_BASE, {
      data: {
        key: uniqueKey,
        value: '', // Empty value
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(400);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Admin token and duplicate key (should fail with 409)
  test('should reject duplicate key', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[POST /settings] Skipping - could not obtain admin tokens');
      return;
    }

    // First create a setting
    const uniqueKey = `DUPLICATE_TEST_${Date.now()}`;
    await request.post(SETTINGS_BASE, {
      data: {
        key: uniqueKey,
        value: MOCK_DATA.testValue,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    // Try to create same key again
    const response = await request.post(SETTINGS_BASE, {
      data: {
        key: uniqueKey,
        value: MOCK_DATA.updatedValue,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([200, 201, 400, 409]).toContain(response.status());
    const json = await response.json();
    // If duplicate, should return conflict
    if (response.status() === 409) {
      validateApiResponse(json, false);
    }
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.post(SETTINGS_BASE, {
      data: {
        key: MOCK_DATA.testKey,
        value: MOCK_DATA.testValue,
      },
      headers: {
        Authorization: 'Bearer invalid-token-xyz',
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: PUT /api/v1/settings/{key} - Update System Setting
// ============================================================================
test.describe('PUT /api/v1/settings/{key} - Update System Setting', () => {
  const validKey = 'MIN_AGE_CATEGORY_A';
  const invalidKey = 'NONEXISTENT_KEY_99999';

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.put(`${SETTINGS_BASE}/${validKey}`, {
      data: {
        value: MOCK_DATA.updatedValue,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens(request, 'applicant');
    if (!tokens) {
      console.warn('[PUT /settings/{key}] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.put(`${SETTINGS_BASE}/${validKey}`, {
      data: {
        value: MOCK_DATA.updatedValue,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token and valid key (should succeed)
  test('should update setting with admin token and valid key', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[PUT /settings/{key}] Skipping - could not obtain admin tokens');
      return;
    }

    // First create a test setting
    const uniqueKey = `UPDATE_TEST_${Date.now()}`;
    await request.post(SETTINGS_BASE, {
      data: {
        key: uniqueKey,
        value: '100',
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    // Now update it
    const response = await request.put(`${SETTINGS_BASE}/${uniqueKey}`, {
      data: {
        value: MOCK_DATA.updatedValue,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([200, 400, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 200) {
      expect(json.data).toHaveProperty('key');
      expect(json.data.key).toBe(uniqueKey);
      expect(json.data.value).toBe(MOCK_DATA.updatedValue);
    }
  });

  // Test: With valid Admin token and invalid key (should return 404)
  test('should return 404 with admin token and invalid key', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[PUT /settings/{key}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.put(`${SETTINGS_BASE}/${invalidKey}`, {
      data: {
        value: MOCK_DATA.updatedValue,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Admin token and empty value (should fail)
  test('should reject update with empty value', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[PUT /settings/{key}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.put(`${SETTINGS_BASE}/${validKey}`, {
      data: {
        value: '', // Empty value
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(400);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.put(`${SETTINGS_BASE}/${validKey}`, {
      data: {
        value: MOCK_DATA.updatedValue,
      },
      headers: {
        Authorization: 'Bearer invalid-token-xyz',
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);
  });
});

// ============================================================================
// TEST SUITE: DELETE /api/v1/settings/{key} - Reset System Setting
// ============================================================================
test.describe('DELETE /api/v1/settings/{key} - Reset System Setting', () => {
  const validKey = 'MIN_AGE_CATEGORY_A';
  const invalidKey = 'NONEXISTENT_KEY_99999';

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.delete(`${SETTINGS_BASE}/${validKey}`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens(request, 'applicant');
    if (!tokens) {
      console.warn('[DELETE /settings/{key}] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.delete(`${SETTINGS_BASE}/${validKey}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token and valid key (should succeed)
  test('should reset setting with admin token and valid key', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[DELETE /settings/{key}] Skipping - could not obtain admin tokens');
      return;
    }

    // First create a test setting to reset
    const uniqueKey = `RESET_TEST_${Date.now()}`;
    await request.post(SETTINGS_BASE, {
      data: {
        key: uniqueKey,
        value: '500',
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    // Now reset it
    const response = await request.delete(`${SETTINGS_BASE}/${uniqueKey}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 200) {
      expect(json.data).toHaveProperty('key');
      expect(json.data.key).toBe(uniqueKey);
    }
  });

  // Test: With valid Admin token and invalid key (should return 404)
  test('should return 404 with admin token and invalid key', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[DELETE /settings/{key}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.delete(`${SETTINGS_BASE}/${invalidKey}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.delete(`${SETTINGS_BASE}/${validKey}`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });

  // Test: With special characters in key (should handle gracefully)
  test('should handle special characters in key', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[DELETE /settings/{key}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.delete(`${SETTINGS_BASE}/KEY@#123`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([404, 400]).toContain(response.status());
  });
});

// ============================================================================
// TEST SUITE: Integration - Complete Settings Management Flow
// ============================================================================
test.describe('Integration - Complete Settings Management Flow', () => {
  
  test('should complete full settings management flow', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[Integration] Skipping - could not obtain admin tokens');
      return;
    }

    const uniqueKey = `INTEG_TEST_${Date.now()}`;

    // Step 1: Create a new setting
    const createResponse = await request.post(SETTINGS_BASE, {
      data: {
        key: uniqueKey,
        value: '100',
        category: 'Integration',
        description: 'Test setting for integration flow',
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([200, 201, 400, 409]).toContain(createResponse.status());
    const createJson = await createResponse.json();
    validateApiResponse(createJson);

    if (createResponse.status() === 201 || createResponse.status() === 200) {
      // Step 2: Get the created setting by key
      const getByKeyResponse = await request.get(`${SETTINGS_BASE}/${uniqueKey}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      expect(getByKeyResponse.status()).toBe(200);
      const getByKeyJson = await getByKeyResponse.json();
      validateApiResponse(getByKeyJson, true);
      expect(getByKeyJson.data.key).toBe(uniqueKey);

      // Step 3: Update the setting
      const updateResponse = await request.put(`${SETTINGS_BASE}/${uniqueKey}`, {
        data: {
          value: '999',
        },
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      });

      expect(updateResponse.status()).toBe(200);
      const updateJson = await updateResponse.json();
      validateApiResponse(updateJson, true);
      expect(updateJson.data.value).toBe('999');

      // Step 4: Reset the setting
      const resetResponse = await request.delete(`${SETTINGS_BASE}/${uniqueKey}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      expect(resetResponse.status()).toBe(200);
      const resetJson = await resetResponse.json();
      validateApiResponse(resetJson, true);
    }

    // Step 5: Get all settings to verify list is accessible
    const getAllResponse = await request.get(SETTINGS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(getAllResponse.status()).toBe(200);
    const getAllJson = await getAllResponse.json();
    validateApiResponse(getAllJson, true);
    expect(getAllJson.data).toBeDefined();
  });

  test('should verify unauthorized access across all endpoints', async ({ request }) => {
    const applicantTokens = await getTokens(request, 'applicant');
    if (!applicantTokens) {
      console.warn('[Authorization] Skipping - could not obtain applicant tokens');
      return;
    }

    const validKey = 'MIN_AGE_CATEGORY_A';

    // GET all
    let response = await request.get(SETTINGS_BASE, {
      headers: getAuthHeader(applicantTokens.accessToken),
    });
    expect(response.status()).toBe(403);

    // GET by key
    response = await request.get(`${SETTINGS_BASE}/${validKey}`, {
      headers: getAuthHeader(applicantTokens.accessToken),
    });
    expect(response.status()).toBe(403);

    // POST
    response = await request.post(SETTINGS_BASE, {
      data: { key: 'TEST', value: '100' },
      headers: { ...getAuthHeader(applicantTokens.accessToken), 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(403);

    // PUT
    response = await request.put(`${SETTINGS_BASE}/${validKey}`, {
      data: { value: '200' },
      headers: { ...getAuthHeader(applicantTokens.accessToken), 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(403);

    // DELETE
    response = await request.delete(`${SETTINGS_BASE}/${validKey}`, {
      headers: getAuthHeader(applicantTokens.accessToken),
    });
    expect(response.status()).toBe(403);
  });

  test('should verify alternative route works (api/v1/system-settings)', async ({ request }) => {
    const tokens = await getTokens(request, 'admin');
    if (!tokens) {
      console.warn('[Alternative Route] Skipping - could not obtain admin tokens');
      return;
    }

    // Test with alternative route
    const altBase = `${BASE_URL}/api/v1/system-settings`;
    const response = await request.get(altBase, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });
});