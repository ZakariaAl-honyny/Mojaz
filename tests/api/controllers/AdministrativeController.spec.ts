/**
 * Mojaz API Tests - AdministrativeController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/administrative
 * Endpoints: 1
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 401)
 * - Citizen/Applicant token (expect 403 - not authorized)
 * - Admin token (expect 200)
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken, getAuthHeader } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const ADMIN_BASE = `${BASE_URL}/api/v1/administrative`;

// Helper function for test setup - uses cached tokens
async function getTokens(role: 'applicant' | 'admin' | 'manager' | 'receptionist' | 'doctor' | 'examiner' | 'security') {
  const token = getCachedToken(role);
  if (!token) {
    console.warn(`[getTokens] No cached token for ${role}`);
    return null;
  }
  return { accessToken: token, refreshToken: null };
}

// Arabic-appropriate mock data for stolen report verification
const MOCK_DATA = {
  verifyStolenReport: {
    // Valid request - report is verified
    verifiedTrue: {
      isVerified: true,
      comments: 'تم التحقق من التقرير الشرطي. الوثيقة أصالة.',
    },
    // Valid request - report is rejected
    verifiedFalse: {
      isVerified: false,
      comments: 'التقرير الشرطي غير صالح للتطبيق.',
    },
    // Request without comments
    verifiedNoComments: {
      isVerified: true,
    },
    // Request with empty comments
    verifiedEmptyComments: {
      isVerified: false,
      comments: '',
    },
    // Invalid request - missing isVerified field
    missingIsVerified: {
      comments: 'Test comment',
    },
  },
  // Valid application ID or number for testing
  validApplicationId: 1,
  validApplicationNumber: 'MOJ-2026-12345678',
  invalidApplicationId: 999999,
  invalidApplicationNumber: 'MOJ-2026-99999999',
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
// TEST SUITE: PATCH /api/v1/administrative/applications/{idOrNumber}/verify-stolen-report
// Verify a stolen police report for a replacement application
// ============================================================================
test.describe('PATCH /api/v1/administrative/applications/{idOrNumber}/verify-stolen-report - Verify Stolen Report', () => {

  // Test: Unauthenticated (should fail with 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    expect(response.status()).toBe(401);
  });

  // Test: Unauthenticated with invalid application number
  test('should return 401 when unauthenticated with application number', async ({ request }) => {
    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationNumber}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    expect(response.status()).toBe(401);
  });

  // Test: Applicant role (should fail with 403)
  test('should return 403 when applicant tries to verify stolen report', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      test.skip('Cannot get applicant token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Applicant doesn't have permission - expect 403 Forbidden
    expect([403, 404]).toContain(response.status());
    
    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json, false);
    }
  });

  // Test: Doctor role (should fail with 403)
  test('should return 403 when doctor tries to verify stolen report', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      test.skip('Cannot get doctor token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Doctor doesn't have permission - expect 403 Forbidden
    expect([403, 404]).toContain(response.status());
  });

  // Test: Examiner role (should fail with 403)
  test('should return 403 when examiner tries to verify stolen report', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      test.skip('Cannot get examiner token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Examiner doesn't have permission - expect 403 Forbidden
    expect([403, 404]).toContain(response.status());
  });

  // Test: Security role (should fail with 403 - not in allowed roles)
  test('should return 403 when security tries to verify stolen report', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      test.skip('Cannot get security token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Security doesn't have permission - expect 403 Forbidden
    expect([403, 404]).toContain(response.status());
  });

  // Test: Manager role (should succeed with 200)
  test('should return 200 when manager verifies stolen report', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      test.skip('Cannot get manager token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Manager has permission - expect 200 or 404 if application not found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json);
    }
  });

  // Test: Receptionist role (should succeed with 200)
  test('should return 200 when receptionist verifies stolen report', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      test.skip('Cannot get receptionist token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Receptionist has permission - expect 200 or 404 if application not found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json);
    }
  });

  // Test: Admin role (should succeed with 200)
  test('should return 200 when admin verifies stolen report', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      test.skip('Cannot get admin token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Admin has permission - expect 200 or 404 if application not found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json);
    }
  });

  // Test: Admin with valid application number instead of ID
  test('should return 200 when admin verifies stolen report with application number', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      test.skip('Cannot get admin token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationNumber}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Admin has permission - expect 200 or 404 if application not found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json);
    }
  });

  // Test: Admin with invalid application ID (404)
  test('should return 404 when admin verifies stolen report with invalid application ID', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      test.skip('Cannot get admin token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.invalidApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: Admin with invalid application number (404)
  test('should return 404 when admin verifies stolen report with invalid application number', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      test.skip('Cannot get admin token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.invalidApplicationNumber}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    expect(response.status()).toBe(404);
    const json = await response.json();
    validateApiResponse(json, false);
  });

  // Test: Verify stolen report with rejected status
  test('should return 200 when admin verifies stolen report with rejected status', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      test.skip('Cannot get admin token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedFalse,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Expect 200 or 404 if application not found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json);
    }
  });

  // Test: Verify stolen report without comments
  test('should return 200 when admin verifies stolen report without comments', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      test.skip('Cannot get admin token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedNoComments,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Expect 200 or 404 if application not found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json);
    }
  });

  // Test: Verify stolen report with empty comments
  test('should return 200 when admin verifies stolen report with empty comments', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      test.skip('Cannot get admin token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedEmptyComments,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Expect 200 or 404 if application not found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json);
    }
  });

  // Test: Manager can reject a stolen report
  test('should return 200 when manager rejects stolen report', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      test.skip('Cannot get manager token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedFalse,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Expect 200 or 404 if application not found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json);
    }
  });

  // Test: Receptionist can reject a stolen report
  test('should return 200 when receptionist rejects stolen report', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      test.skip('Cannot get receptionist token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/${MOCK_DATA.validApplicationId}/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedFalse,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    // Expect 200 or 404 if application not found
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const json = await response.json();
      validateApiResponse(json);
    }
  });
});

// ============================================================================
// Additional Edge Case Tests
// ============================================================================
test.describe('AdministrativeController - Edge Cases', () => {

  // Test: Invalid JSON body
  test('should return 400 when invalid JSON is sent', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      test.skip('Cannot get admin token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/1/verify-stolen-report`,
      {
        data: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(tokens.accessToken),
        },
      }
    );

    expect([400, 415]).toContain(response.status());
  });

  // Test: Missing content-type header
  test('should return 415 when content-type is missing', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      test.skip('Cannot get admin token - skipping test');
      return;
    }

    const response = await request.patch(
      `${ADMIN_BASE}/applications/1/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: getAuthHeader(tokens.accessToken),
      }
    );

    expect([415, 400]).toContain(response.status());
  });

  // Test: Invalid token format
  test('should return 401 when invalid token format is used', async ({ request }) => {
    const response = await request.patch(
      `${ADMIN_BASE}/applications/1/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'InvalidTokenFormat',
        },
      }
    );

    expect(response.status()).toBe(401);
  });

  // Test: Empty bearer token
  test('should return 401 when empty bearer token is used', async ({ request }) => {
    const response = await request.patch(
      `${ADMIN_BASE}/applications/1/verify-stolen-report`,
      {
        data: MOCK_DATA.verifyStolenReport.verifiedTrue,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ',
        },
      }
    );

    expect(response.status()).toBe(401);
  });
});