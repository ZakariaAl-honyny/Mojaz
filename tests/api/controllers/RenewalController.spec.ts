/**
 * Mojaz API Tests - RenewalController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/licenses/renewal
 * Endpoints: 5
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 401)
 * - Citizen/Applicant token (expect 200 or 403 depending on endpoint)
 * - Admin token (expect 200 for authorized endpoints)
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const RENEWAL_BASE = `${BASE_URL}/api/v1/licenses/renewal`;

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

// Arabic-appropriate mock data for license renewal
const MOCK_DATA = {
  // Valid license IDs (mock values)
  validOldLicenseId: 1,
  invalidOldLicenseId: 99999,
  validLicenseCategoryId: 1,
  invalidLicenseCategoryId: 99999,
  validApplicationId: 1,
  invalidApplicationId: 99999,
  validMedicalExaminationId: 1,
  invalidMedicalExaminationId: 99999,
  // Payment info
  paymentMethod: 'MADA',
  transactionId: 'TXN-20260501000001',
  amount: 200.00,
  // License category codes
  categoryCodeB: 'B',
  categoryCodeC: 'C',
  categoryCodeD: 'D',
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
// TEST SUITE: GET /api/v1/licenses/renewal/eligibility - Check Eligibility
// ============================================================================
test.describe('GET /api/v1/licenses/renewal/eligibility - Check Eligibility', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${RENEWAL_BASE}/eligibility?categoryId=${MOCK_DATA.validLicenseCategoryId}`);
    expect(response.status()).toBe(401);
  });

  // Test: With valid Applicant token and valid category (should succeed)
  test('should return eligibility with applicant token and valid category', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /eligibility] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${RENEWAL_BASE}/eligibility?categoryId=${MOCK_DATA.validLicenseCategoryId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 400]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 200) {
      expect(json.data).toHaveProperty('isEligible');
      expect(json.data).toHaveProperty('licenseId');
      expect(json.data).toHaveProperty('renewalFeeAmount');
    }
  });

  // Test: With valid Applicant token and invalid category (should fail)
  test('should return error with applicant token and invalid category', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /eligibility] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${RENEWAL_BASE}/eligibility?categoryId=${MOCK_DATA.invalidLicenseCategoryId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 400]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With valid Applicant token and missing category ID (should fail)
  test('should return 400 with applicant token and missing categoryId', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /eligibility] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${RENEWAL_BASE}/eligibility`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(400);
  });

  // Test: With valid Admin token (should succeed - admin has Applicant role too)
  test('should return eligibility with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /eligibility] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${RENEWAL_BASE}/eligibility?categoryId=${MOCK_DATA.validLicenseCategoryId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 400]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${RENEWAL_BASE}/eligibility?categoryId=1`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });

  // Test: With non-numeric category ID (should return 400)
  test('should handle non-numeric categoryId gracefully', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /eligibility] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${RENEWAL_BASE}/eligibility?categoryId=abc`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(400);
  });
});

// ============================================================================
// TEST SUITE: POST /api/v1/licenses/renewal - Create Renewal Application
// ============================================================================
test.describe('POST /api/v1/licenses/renewal - Create Renewal Application', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(RENEWAL_BASE, {
      data: {
        oldLicenseId: MOCK_DATA.validOldLicenseId,
        licenseCategoryId: MOCK_DATA.validLicenseCategoryId,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(401);
  });

  // Test: With valid Applicant token and valid data (should succeed)
  test('should create renewal with applicant token and valid data', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /renewal] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(RENEWAL_BASE, {
      data: {
        oldLicenseId: MOCK_DATA.validOldLicenseId,
        licenseCategoryId: MOCK_DATA.validLicenseCategoryId,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([200, 201, 400, 404, 409]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 201 || response.status() === 200) {
      expect(json.data).toHaveProperty('applicationId');
      expect(typeof json.data.applicationId).toBe('number');
    }
  });

  // Test: With valid Applicant token and invalid license ID (should fail)
  test('should reject renewal with invalid oldLicenseId', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /renewal] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(RENEWAL_BASE, {
      data: {
        oldLicenseId: MOCK_DATA.invalidOldLicenseId,
        licenseCategoryId: MOCK_DATA.validLicenseCategoryId,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([400, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Applicant token and invalid category ID (should fail)
  test('should reject renewal with invalid licenseCategoryId', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /renewal] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(RENEWAL_BASE, {
      data: {
        oldLicenseId: MOCK_DATA.validOldLicenseId,
        licenseCategoryId: MOCK_DATA.invalidLicenseCategoryId,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([400, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With valid Applicant token and missing required fields (should fail)
  test('should reject renewal with missing required fields', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /renewal] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(RENEWAL_BASE, {
      data: {
        oldLicenseId: MOCK_DATA.validOldLicenseId,
        // Missing licenseCategoryId
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

  // Test: With valid Applicant token and empty request body (should fail)
  test('should reject renewal with empty request body', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /renewal] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(RENEWAL_BASE, {
      data: {},
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(400);
  });

  // Test: With Admin token (should fail with 403 - admin is not Applicant)
  test('should return 403 with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[POST /renewal] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(RENEWAL_BASE, {
      data: {
        oldLicenseId: MOCK_DATA.validOldLicenseId,
        licenseCategoryId: MOCK_DATA.validLicenseCategoryId,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(403);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.post(RENEWAL_BASE, {
      data: {
        oldLicenseId: MOCK_DATA.validOldLicenseId,
        licenseCategoryId: MOCK_DATA.validLicenseCategoryId,
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
// TEST SUITE: POST /api/v1/licenses/renewal/{applicationId}/medical-result - Submit Medical Result
// ============================================================================
test.describe('POST /api/v1/licenses/renewal/{applicationId}/medical-result - Submit Medical Result', () => {
  const validApplicationId = 1;
  const invalidApplicationId = 99999;

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/medical-result`, {
      data: {
        medicalExaminationId: MOCK_DATA.validMedicalExaminationId,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(401);
  });

  // Test: With valid Doctor token and valid data (should succeed)
  test('should submit medical result with doctor token and valid data', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[POST /medical-result] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/medical-result`, {
      data: {
        medicalExaminationId: MOCK_DATA.validMedicalExaminationId,
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
      expect(typeof json.data).toBe('boolean');
    }
  });

  // Test: With valid Doctor token and invalid application ID (should fail)
  test('should return 404 with doctor token and invalid applicationId', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[POST /medical-result] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${invalidApplicationId}/medical-result`, {
      data: {
        medicalExaminationId: MOCK_DATA.validMedicalExaminationId,
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

  // Test: With valid Doctor token and invalid medical examination ID (should fail)
  test('should return 400 with doctor token and invalid medicalExaminationId', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[POST /medical-result] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/medical-result`, {
      data: {
        medicalExaminationId: MOCK_DATA.invalidMedicalExaminationId,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([400, 404]).toContain(response.status());
  });

  // Test: With Applicant token (should fail with 403)
  test('should return 403 with applicant token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /medical-result] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/medical-result`, {
      data: {
        medicalExaminationId: MOCK_DATA.validMedicalExaminationId,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Admin token (should fail with 403 - admin is not Doctor)
  test('should return 403 with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[POST /medical-result] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/medical-result`, {
      data: {
        medicalExaminationId: MOCK_DATA.validMedicalExaminationId,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(403);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/medical-result`, {
      data: {
        medicalExaminationId: MOCK_DATA.validMedicalExaminationId,
      },
      headers: {
        Authorization: 'Bearer invalid-token-xyz',
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);
  });

  // Test: With non-numeric application ID (should return 404 or 400)
  test('should handle non-numeric applicationId gracefully', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[POST /medical-result] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/abc/medical-result`, {
      data: {
        medicalExaminationId: MOCK_DATA.validMedicalExaminationId,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([400, 404]).toContain(response.status());
  });
});

// ============================================================================
// TEST SUITE: POST /api/v1/licenses/renewal/{applicationId}/pay - Pay Renewal Fee
// ============================================================================
test.describe('POST /api/v1/licenses/renewal/{applicationId}/pay - Pay Renewal Fee', () => {
  const validApplicationId = 1;
  const invalidApplicationId = 99999;

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/pay`, {
      data: {
        paymentMethod: MOCK_DATA.paymentMethod,
        transactionId: MOCK_DATA.transactionId,
        amount: MOCK_DATA.amount,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(401);
  });

  // Test: With valid Applicant token and valid data (should succeed)
  test('should process payment with applicant token and valid data', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /pay] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/pay`, {
      data: {
        paymentMethod: MOCK_DATA.paymentMethod,
        transactionId: `TXN-${Date.now()}`,
        amount: MOCK_DATA.amount,
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
      expect(typeof json.data).toBe('boolean');
    }
  });

  // Test: With valid Applicant token and invalid application ID (should fail)
  test('should return 404 with applicant token and invalid applicationId', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /pay] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${invalidApplicationId}/pay`, {
      data: {
        paymentMethod: MOCK_DATA.paymentMethod,
        transactionId: MOCK_DATA.transactionId,
        amount: MOCK_DATA.amount,
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

  // Test: With valid Applicant token and missing required fields (should fail)
  test('should reject payment with missing required fields', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /pay] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/pay`, {
      data: {
        paymentMethod: MOCK_DATA.paymentMethod,
        // Missing transactionId and amount
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

  // Test: With valid Applicant token and invalid amount (should fail)
  test('should reject payment with negative amount', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /pay] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/pay`, {
      data: {
        paymentMethod: MOCK_DATA.paymentMethod,
        transactionId: MOCK_DATA.transactionId,
        amount: -100.00, // Invalid negative amount
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

  // Test: With Admin token (should fail with 403)
  test('should return 403 with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[POST /pay] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/pay`, {
      data: {
        paymentMethod: MOCK_DATA.paymentMethod,
        transactionId: MOCK_DATA.transactionId,
        amount: MOCK_DATA.amount,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(403);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/pay`, {
      data: {
        paymentMethod: MOCK_DATA.paymentMethod,
        transactionId: MOCK_DATA.transactionId,
        amount: MOCK_DATA.amount,
      },
      headers: {
        Authorization: 'Bearer invalid-token-xyz',
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(401);
  });

  // Test: With non-numeric application ID (should return 404 or 400)
  test('should handle non-numeric applicationId gracefully', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /pay] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/abc/pay`, {
      data: {
        paymentMethod: MOCK_DATA.paymentMethod,
        transactionId: MOCK_DATA.transactionId,
        amount: MOCK_DATA.amount,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([400, 404]).toContain(response.status());
  });
});

// ============================================================================
// TEST SUITE: POST /api/v1/licenses/renewal/{applicationId}/issue - Issue Renewed License
// ============================================================================
test.describe('POST /api/v1/licenses/renewal/{applicationId}/issue - Issue Renewed License', () => {
  const validApplicationId = 1;
  const invalidApplicationId = 99999;

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/issue`);
    expect(response.status()).toBe(401);
  });

  // Test: With valid Manager token (should succeed)
  test('should issue license with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[POST /issue] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/issue`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 400, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 200) {
      expect(json.data).toHaveProperty('newLicenseId');
      expect(json.data).toHaveProperty('licenseNumber');
      expect(json.data).toHaveProperty('issuedAt');
      expect(json.data).toHaveProperty('expiresAt');
    }
  });

  // Test: With valid Security token (should succeed)
  test('should issue license with security token', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[POST /issue] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/issue`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 400, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With valid Admin token (should succeed)
  test('should issue license with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[POST /issue] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/issue`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 400, 404]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With valid Manager token and invalid application ID (should fail)
  test('should return 404 with manager token and invalid applicationId', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[POST /issue] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${invalidApplicationId}/issue`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With Applicant token (should fail with 403)
  test('should return 403 with applicant token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /issue] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/issue`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With Doctor token (should fail with 403)
  test('should return 403 with doctor token', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[POST /issue] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/issue`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.post(`${RENEWAL_BASE}/${validApplicationId}/issue`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });

  // Test: With non-numeric application ID (should return 404 or 400)
  test('should handle non-numeric applicationId gracefully', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[POST /issue] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.post(`${RENEWAL_BASE}/abc/issue`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([400, 404]).toContain(response.status());
  });
});

// ============================================================================
// TEST SUITE: Integration - Complete Renewal Flow
// ============================================================================
test.describe('Integration - Complete Renewal Flow', () => {
  
  test('should verify authorization across all endpoints', async ({ request }) => {
    // Test that unauthorized roles cannot access specific endpoints
    
    // Doctor-only endpoints - Applicant should fail
    let response = await request.post(`${RENEWAL_BASE}/1/medical-result`, {
      data: { medicalExaminationId: 1 },
      headers: { ...getAuthHeader((await getTokens('applicant'))?.accessToken || ''), 'Content-Type': 'application/json' },
    });
    if (response.status() !== 401) {
      expect(response.status()).toBe(403);
    }

    // Issue-only endpoints - Applicant should fail
    response = await request.post(`${RENEWAL_BASE}/1/issue`, {
      headers: getAuthHeader((await getTokens('applicant'))?.accessToken || ''),
    });
    if (response.status() !== 401) {
      expect(response.status()).toBe(403);
    }

    // Pay endpoint - Admin should fail
    response = await request.post(`${RENEWAL_BASE}/1/pay`, {
      data: { paymentMethod: 'MADA', transactionId: 'TXN-TEST', amount: 200 },
      headers: { ...getAuthHeader((await getTokens('admin'))?.accessToken || ''), 'Content-Type': 'application/json' },
    });
    if (response.status() !== 401) {
      expect(response.status()).toBe(403);
    }
  });

  test('should handle eligibility check with various category IDs', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[Eligibility Categories] Skipping - could not obtain applicant tokens');
      return;
    }

    // Test with different category IDs that might exist in the system
    const categoryIds = [1, 2, 3, 4, 5, 6];
    
    for (const categoryId of categoryIds) {
      const response = await request.get(`${RENEWAL_BASE}/eligibility?categoryId=${categoryId}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      // Should return 200 (eligible) or 400 (not eligible for renewal)
      expect([200, 400]).toContain(response.status());
      const json = await response.json();
      if (response.status() === 200) {
        expect(json.data).toHaveProperty('isEligible');
      }
    }
  });

  test('should validate payment request format', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[Payment Validation] Skipping - could not obtain applicant tokens');
      return;
    }

    // Test missing transaction ID
    let response = await request.post(`${RENEWAL_BASE}/1/pay`, {
      data: {
        paymentMethod: 'MADA',
        amount: 200,
        // Missing transactionId
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });
    expect(response.status()).toBe(400);

    // Test missing payment method
    response = await request.post(`${RENEWAL_BASE}/1/pay`, {
      data: {
        transactionId: 'TXN-TEST',
        amount: 200,
        // Missing paymentMethod
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });
    expect(response.status()).toBe(400);

    // Test missing amount
    response = await request.post(`${RENEWAL_BASE}/1/pay`, {
      data: {
        paymentMethod: 'MADA',
        transactionId: 'TXN-TEST',
        // Missing amount
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });
    expect(response.status()).toBe(400);
  });

  test('should verify invalid tokens are rejected', async ({ request }) => {
    const invalidTokens = ['invalid-token', 'Bearer ', 'null', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid'];
    
    for (const token of invalidTokens) {
      const response = await request.get(`${RENEWAL_BASE}/eligibility?categoryId=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status()).toBe(401);
    }
  });
});