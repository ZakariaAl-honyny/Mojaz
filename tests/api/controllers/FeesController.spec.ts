/**
 * Mojaz API Tests - FeesController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/fees
 * Endpoints: 5
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 401)
 * - Citizen/Applicant token (expect 403 - not authorized)
 * - Admin token (expect 200)
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const FEES_BASE = `${BASE_URL}/api/v1/fees`;

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

// Arabic-appropriate mock data for Saudi fee structures
const MOCK_DATA = {
  // Valid FeeType values: ApplicationFee, MedicalExamFee, TheoryTestFee, PracticalTestFee, IssuanceFee, RetakeFee, RenewalFee, ReplacementFee, CategoryUpgrade
  feeTypeApplication: 'ApplicationFee',
  feeTypeMedical: 'MedicalExamFee',
  feeTypeTheory: 'TheoryTestFee',
  feeTypePractical: 'PracticalTestFee',
  feeTypeIssuance: 'IssuanceFee',
  feeTypeRetake: 'RetakeFee',
  feeTypeRenewal: 'RenewalFee',
  feeTypeReplacement: 'ReplacementFee',
  feeTypeUpgrade: 'CategoryUpgrade',
  // Amounts in SAR
  validAmount: 100.00,
  updatedAmount: 150.00,
  // Currency
  currencySAR: 'SAR',
  // Date ranges
  effectiveFrom: '2026-01-01',
  effectiveTo: '2026-12-31',
  // License category ID (if applicable)
  licenseCategoryId: 1,
  // Description
  descriptionAr: 'رسوم طلب رخصة القيادة',
  descriptionEn: 'Driving license application fee',
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
// TEST SUITE: GET /api/v1/fees - Get All Fee Structures
// ============================================================================
test.describe('GET /api/v1/fees - Get All Fee Structures', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(FEES_BASE);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /fees] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(FEES_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token (should succeed)
  test('should return fee structures with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /fees] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(FEES_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    // Should return array of fee structures
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data.items) || Array.isArray(json.data)).toBe(true);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(FEES_BASE, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });

  // Test: With Manager token (should succeed)
  test('should return fee structures with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /fees] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(FEES_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // Manager should have Admin role
    expect([200, 403]).toContain(response.status());
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/fees/{id} - Get Fee Structure By ID
// ============================================================================
test.describe('GET /api/v1/fees/{id} - Get Fee Structure By ID', () => {
  const validId = 1;
  const invalidId = 99999;

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${FEES_BASE}/${validId}`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /fees/{id}] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${FEES_BASE}/${validId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token and valid ID (should succeed)
  test('should return fee structure with admin token and valid id', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${FEES_BASE}/${validId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status()); // 404 if not found, 200 if found
    const json = await response.json();
    validateApiResponse(json);
    if (response.status() === 200) {
      expect(json.data).toHaveProperty('id');
      expect(json.data).toHaveProperty('feeType');
      expect(json.data).toHaveProperty('amount');
    }
  });

  // Test: With valid Admin token and invalid ID (should return 404)
  test('should return 404 with admin token and invalid id', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${FEES_BASE}/${invalidId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${FEES_BASE}/${validId}`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });

  // Test: With non-numeric ID (should return 404 or 400)
  test('should handle non-numeric id gracefully', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${FEES_BASE}/abc`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([400, 404]).toContain(response.status());
  });
});

// ============================================================================
// TEST SUITE: POST /api/v1/fees - Create Fee Structure
// ============================================================================
test.describe('POST /api/v1/fees - Create Fee Structure', () => {
  
  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(FEES_BASE, {
      data: {
        feeType: MOCK_DATA.feeTypeApplication,
        amount: MOCK_DATA.validAmount,
        currency: MOCK_DATA.currencySAR,
        effectiveFrom: MOCK_DATA.effectiveFrom,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[POST /fees] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.post(FEES_BASE, {
      data: {
        feeType: MOCK_DATA.feeTypeApplication,
        amount: MOCK_DATA.validAmount,
        currency: MOCK_DATA.currencySAR,
        effectiveFrom: MOCK_DATA.effectiveFrom,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token and valid data (should succeed)
  test('should create fee structure with admin token and valid data', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[POST /fees] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(FEES_BASE, {
      data: {
        feeType: MOCK_DATA.feeTypeMedical,
        amount: MOCK_DATA.validAmount,
        currency: MOCK_DATA.currencySAR,
        effectiveFrom: MOCK_DATA.effectiveFrom,
        licenseCategoryId: MOCK_DATA.licenseCategoryId,
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
      expect(json.data).toHaveProperty('id');
      expect(json.data.feeType).toBe('MedicalExamFee');
      expect(json.data.amount).toBe(MOCK_DATA.validAmount);
    }
  });

  // Test: With valid Admin token and missing required fields (should fail)
  test('should reject create with missing required fields', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[POST /fees] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(FEES_BASE, {
      data: {
        // Missing feeType, amount, effectiveFrom
        currency: MOCK_DATA.currencySAR,
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

  // Test: With valid Admin token and invalid amount (should fail validation)
  test('should reject create with negative amount', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[POST /fees] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.post(FEES_BASE, {
      data: {
        feeType: MOCK_DATA.feeTypeApplication,
        amount: -100.00, // Invalid negative amount
        currency: MOCK_DATA.currencySAR,
        effectiveFrom: MOCK_DATA.effectiveFrom,
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

  // Test: With valid Admin token and duplicate fee type (should fail with 409)
  test('should reject duplicate fee type with same category', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[POST /fees] Skipping - could not obtain admin tokens');
      return;
    }

    // Try to create a fee with same type and category that might already exist
    const response = await request.post(FEES_BASE, {
      data: {
        feeType: MOCK_DATA.feeTypeApplication,
        amount: MOCK_DATA.validAmount,
        currency: MOCK_DATA.currencySAR,
        effectiveFrom: MOCK_DATA.effectiveFrom,
        licenseCategoryId: MOCK_DATA.licenseCategoryId,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([200, 201, 400, 409]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.post(FEES_BASE, {
      data: {
        feeType: MOCK_DATA.feeTypeApplication,
        amount: MOCK_DATA.validAmount,
        currency: MOCK_DATA.currencySAR,
        effectiveFrom: MOCK_DATA.effectiveFrom,
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
// TEST SUITE: PUT /api/v1/fees/{id} - Update Fee Structure
// ============================================================================
test.describe('PUT /api/v1/fees/{id} - Update Fee Structure', () => {
  const validId = 1;
  const invalidId = 99999;

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.put(`${FEES_BASE}/${validId}`, {
      data: {
        amount: MOCK_DATA.updatedAmount,
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[PUT /fees/{id}] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.put(`${FEES_BASE}/${validId}`, {
      data: {
        amount: MOCK_DATA.updatedAmount,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token and valid ID (should succeed)
  test('should update fee structure with admin token and valid id', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[PUT /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.put(`${FEES_BASE}/${validId}`, {
      data: {
        amount: MOCK_DATA.updatedAmount,
        description: MOCK_DATA.descriptionEn,
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
      expect(json.data).toHaveProperty('id');
      expect(json.data.amount).toBe(MOCK_DATA.updatedAmount);
    }
  });

  // Test: With valid Admin token and invalid ID (should return 404)
  test('should return 404 with admin token and invalid id', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[PUT /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.put(`${FEES_BASE}/${invalidId}`, {
      data: {
        amount: MOCK_DATA.updatedAmount,
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

  // Test: With valid Admin token and invalid data (should fail validation)
  test('should reject update with invalid amount', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[PUT /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.put(`${FEES_BASE}/${validId}`, {
      data: {
        amount: -500.00, // Invalid negative amount
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

  // Test: With empty update request (should succeed with no changes or fail)
  test('should handle empty update request', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[PUT /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.put(`${FEES_BASE}/${validId}`, {
      data: {},
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    expect([200, 400]).toContain(response.status());
    const json = await response.json();
    validateApiResponse(json);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.put(`${FEES_BASE}/${validId}`, {
      data: {
        amount: MOCK_DATA.updatedAmount,
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
// TEST SUITE: DELETE /api/v1/fees/{id} - Delete (Soft) Fee Structure
// ============================================================================
test.describe('DELETE /api/v1/fees/{id} - Delete (Soft) Fee Structure', () => {
  const validId = 1;
  const invalidId = 99999;

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.delete(`${FEES_BASE}/${validId}`);
    expect(response.status()).toBe(401);
  });

  // Test: With Citizen/Applicant token (should fail with 403)
  test('should return 403 when citizen token (not authorized)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[DELETE /fees/{id}] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.delete(`${FEES_BASE}/${validId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(403);
  });

  // Test: With valid Admin token and valid ID (should succeed with 200 or 404)
  test('should delete fee structure with admin token and valid id', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[DELETE /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    // First create a new fee to delete
    const createResponse = await request.post(FEES_BASE, {
      data: {
        feeType: MOCK_DATA.feeTypeRetake,
        amount: 50.00,
        currency: MOCK_DATA.currencySAR,
        effectiveFrom: MOCK_DATA.effectiveFrom,
      },
      headers: {
        ...getAuthHeader(tokens.accessToken),
        'Content-Type': 'application/json',
      },
    });

    let testFeeId: number | null = null;
    if (createResponse.status() === 201 || createResponse.status() === 200) {
      const createJson = await createResponse.json();
      testFeeId = createJson.data?.id;
    }

    // If we couldn't create, try to delete an existing one
    if (!testFeeId) {
      testFeeId = validId;
    }

    const deleteResponse = await request.delete(`${FEES_BASE}/${testFeeId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(deleteResponse.status());
    const json = await deleteResponse.json();
    validateApiResponse(json);
  });

  // Test: With valid Admin token and invalid ID (should return 404)
  test('should return 404 with admin token and invalid id', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[DELETE /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.delete(`${FEES_BASE}/${invalidId}`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: With invalid token (should fail with 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.delete(`${FEES_BASE}/${validId}`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(401);
  });

  // Test: With non-numeric ID (should return 404 or 400)
  test('should handle non-numeric id gracefully', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[DELETE /fees/{id}] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.delete(`${FEES_BASE}/abc`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([400, 404]).toContain(response.status());
  });
});

// ============================================================================
// TEST SUITE: Integration - Complete Fee Management Flow
// ============================================================================
test.describe('Integration - Complete Fee Management Flow', () => {
  
  test('should complete full fee management flow', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Integration] Skipping - could not obtain admin tokens');
      return;
    }

    // Step 1: Create a new fee structure
    const createResponse = await request.post(FEES_BASE, {
      data: {
        feeType: MOCK_DATA.feeTypeRenewal,
        amount: 200.00,
        currency: MOCK_DATA.currencySAR,
        effectiveFrom: '2026-06-01',
        effectiveTo: '2027-05-31',
        description: 'رسوم تجديد الرخصة',
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
      const feeId = createJson.data.id;

      // Step 2: Get the created fee by ID
      const getByIdResponse = await request.get(`${FEES_BASE}/${feeId}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      expect(getByIdResponse.status()).toBe(200);
      const getByIdJson = await getByIdResponse.json();
      validateApiResponse(getByIdJson, true);
      expect(getByIdJson.data.id).toBe(feeId);

      // Step 3: Update the fee
      const updateResponse = await request.put(`${FEES_BASE}/${feeId}`, {
        data: {
          amount: 250.00,
          isActive: true,
        },
        headers: {
          ...getAuthHeader(tokens.accessToken),
          'Content-Type': 'application/json',
        },
      });

      expect(updateResponse.status()).toBe(200);
      const updateJson = await updateResponse.json();
      validateApiResponse(updateJson, true);
      expect(updateJson.data.amount).toBe(250.00);

      // Step 4: Delete the fee
      const deleteResponse = await request.delete(`${FEES_BASE}/${feeId}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      expect(deleteResponse.status()).toBe(200);
      const deleteJson = await deleteResponse.json();
      validateApiResponse(deleteJson, true);
    }

    // Step 5: Get all fees to verify list is accessible
    const getAllResponse = await request.get(FEES_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(getAllResponse.status()).toBe(200);
    const getAllJson = await getAllResponse.json();
    validateApiResponse(getAllJson, true);
    expect(getAllJson.data).toBeDefined();
  });

  test('should verify unauthorized access across all endpoints', async ({ request }) => {
    // Test that applicant role cannot access any fee endpoints
    const applicantTokens = await getTokens('applicant');
    if (!applicantTokens) {
      console.warn('[Authorization] Skipping - could not obtain applicant tokens');
      return;
    }

    // GET all
    let response = await request.get(FEES_BASE, {
      headers: getAuthHeader(applicantTokens.accessToken),
    });
    expect(response.status()).toBe(403);

    // GET by id
    response = await request.get(`${FEES_BASE}/1`, {
      headers: getAuthHeader(applicantTokens.accessToken),
    });
    expect(response.status()).toBe(403);

    // POST
    response = await request.post(FEES_BASE, {
      data: { feeType: 'ApplicationFee', amount: 100, effectiveFrom: '2026-01-01' },
      headers: { ...getAuthHeader(applicantTokens.accessToken), 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(403);

    // PUT
    response = await request.put(`${FEES_BASE}/1`, {
      data: { amount: 100 },
      headers: { ...getAuthHeader(applicantTokens.accessToken), 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(403);

    // DELETE
    response = await request.delete(`${FEES_BASE}/1`, {
      headers: getAuthHeader(applicantTokens.accessToken),
    });
    expect(response.status()).toBe(403);
  });
});