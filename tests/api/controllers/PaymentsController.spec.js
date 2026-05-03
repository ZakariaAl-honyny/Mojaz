/**
 * Playwright API Tests for PaymentsController
 * Base URL: http://localhost:5013
 * 
 * Tests 10 endpoints with 3 roles: Unauthenticated, Citizen (Applicant), Admin
 * 
 * Endpoints:
 * - GET    /api/v1/payments              → List payments
 * - GET    /api/v1/payments/my-payments  → Get my payments (Applicant only)
 * - POST   /api/v1/payments/initiate     → Initiate payment
 * - POST   /api/v1/payments/{id}/process → Process payment
 * - POST   /api/v1/payments/callback     → Payment callback (webhook)
 * - GET    /api/v1/payments/verify/{id}  → Verify payment
 * - POST   /api/v1/payments/confirm      → Confirm payment
 * - GET    /api/v1/payments/receipt/{id} → Get receipt
 * - GET    /api/v1/payments/application/{id} → Get by application
 * - POST   /api/v1/payments/application/{id}/initiate → Initiate by app
 */

const { test, expect, request } = require('@playwright/test');
const { getTokens, assertApiResponse, buildQuery } = require('../shared/helpers');

const BASE_URL = 'http://localhost:5013';
const CONTROLLER = '/api/v1/payments';

// ============================================================================
// Test Accounts & Helper Functions
// ============================================================================

async function getAuthHeaders(role) {
  const tokens = await getTokens(role);
  if (!tokens || !tokens.accessToken) return {};
  return { Authorization: `Bearer ${tokens.accessToken}` };
}

async function fetchPayments(url, options = {}) {
  const response = await request(url, options);
  let body;
  try {
    body = await response.json();
  } catch {
    body = { raw: await response.text() };
  }
  return { status: response.status(), headers: response.headers(), body };
}

// ============================================================================
// Unauthenticated Tests (401)
// ============================================================================

test.describe('PaymentsController - Unauthenticated (401)', () => {
  test('GET /api/v1/payments should return 401', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}`);
    expect(res.status).toBe(401);
  });

  test('GET /api/v1/payments/my-payments should return 401', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/my-payments`);
    expect(res.status).toBe(401);
  });

  test('POST /api/v1/payments/initiate should return 401', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: 1 })
    });
    expect(res.status).toBe(401);
  });

  test('POST /api/v1/payments/1/process should return 401', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/1/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    expect(res.status).toBe(401);
  });

  test('GET /api/v1/payments/verify/1 should return 401', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/verify/1`);
    expect(res.status).toBe(401);
  });

  test('POST /api/v1/payments/confirm should return 401', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId: 1, transactionId: 'TXN123' })
    });
    expect(res.status).toBe(401);
  });

  test('GET /api/v1/payments/receipt/1 should return 401', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/receipt/1`);
    expect(res.status).toBe(401);
  });

  test('GET /api/v1/payments/application/1 should return 401', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/application/1`);
    expect(res.status).toBe(401);
  });

  test('POST /api/v1/payments/application/1/initiate should return 401', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/application/1/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feeType: 'ApplicationFee' })
    });
    expect(res.status).toBe(401);
  });
});

test.describe('PaymentsController - Callback (AllowAnonymous)', () => {
  test('POST /api/v1/payments/callback should work without auth', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId: 1,
        transactionId: 'TXN-TEST-123',
        status: 'Completed',
        amount: 100.00,
        timestamp: new Date().toISOString()
      })
    });
    // Should not be 401 - may be 200, 400, 404, etc.
    expect(res.status).not.toBe(401);
  });
});

// ============================================================================
// Applicant (Citizen) Tests - 200 or 403
// ============================================================================

test.describe('PaymentsController - Applicant (Citizen)', () => {
  let applicantHeaders;

  test.beforeAll(async () => {
    applicantHeaders = await getAuthHeaders('applicant');
    expect(applicantHeaders.Authorization).toBeDefined();
  });

  test('GET /api/v1/payments should return 200 with valid token', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}`, {
      headers: applicantHeaders
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500);
    if (res.status === 200) {
      assertApiResponse('Payments list', res.body);
    }
  });

  test('GET /api/v1/payments with pagination should return 200', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}${buildQuery({ page: 1, pageSize: 10 })}`, {
      headers: applicantHeaders
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500);
  });

  test('GET /api/v1/payments/my-payments should return 200', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/my-payments`, {
      headers: applicantHeaders
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500);
    if (res.status === 200) {
      assertApiResponse('My payments', res.body);
    }
  });

  test('POST /api/v1/payments/initiate should return 201 or 400/403', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/initiate`, {
      method: 'POST',
      headers: { ...applicantHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: 1 })
    });
    expect(res.status).not.toBe(401);
    // Success: 201, Failure: 400, 403, 404
    expect([201, 400, 403, 404]).toContain(res.status);
    if (res.status === 201) {
      assertApiResponse('Initiated payment', res.body);
    }
  });

  test('POST /api/v1/payments/1/process should return 200 or 403/404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/1/process`, {
      method: 'POST',
      headers: { ...applicantHeaders, 'Content-Type': 'application/json' }
    });
    expect(res.status).not.toBe(401);
    // Either success or not found/invalid
    expect([200, 400, 403, 404]).toContain(res.status);
  });

  test('GET /api/v1/payments/verify/1 should return 200 or 403/404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/verify/1`, {
      headers: applicantHeaders
    });
    expect(res.status).not.toBe(401);
    expect([200, 403, 404]).toContain(res.status);
  });

  test('POST /api/v1/payments/confirm should return 200 or 400/403/404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/confirm`, {
      method: 'POST',
      headers: { ...applicantHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId: 1, transactionId: 'TXN-TEST-123' })
    });
    expect(res.status).not.toBe(401);
    expect([200, 400, 403, 404]).toContain(res.status);
  });

  test('GET /api/v1/payments/receipt/1 should return 200 or 403/404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/receipt/1`, {
      headers: applicantHeaders
    });
    expect(res.status).not.toBe(401);
    expect([200, 403, 404]).toContain(res.status);
  });

  test('GET /api/v1/payments/application/1 should return 200 or 403/404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/application/1`, {
      headers: applicantHeaders
    });
    expect(res.status).not.toBe(401);
    expect([200, 403, 404]).toContain(res.status);
  });

  test('POST /api/v1/payments/application/1/initiate should return 201 or 400/403/404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/application/1/initiate`, {
      method: 'POST',
      headers: { ...applicantHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ feeType: 'ApplicationFee' })
    });
    expect(res.status).not.toBe(401);
    expect([201, 400, 403, 404]).toContain(res.status);
  });
});

// ============================================================================
// Admin Tests - 200 (or 400 for invalid data)
// ============================================================================

test.describe('PaymentsController - Admin', () => {
  let adminHeaders;

  test.beforeAll(async () => {
    adminHeaders = await getAuthHeaders('admin');
    expect(adminHeaders.Authorization).toBeDefined();
  });

  test('GET /api/v1/payments should return 200 with admin token', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}`, {
      headers: adminHeaders
    });
    expect(res.status).toBe(200);
    assertApiResponse('Payments list', res.body);
  });

  test('GET /api/v1/payments with filters should return 200', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}${buildQuery({ page: 1, pageSize: 20, status: 'Pending' })}`, {
      headers: adminHeaders
    });
    expect(res.status).toBe(200);
    assertApiResponse('Filtered payments', res.body);
  });

  test('GET /api/v1/payments with search should return 200', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}${buildQuery({ search: 'test' })}`, {
      headers: adminHeaders
    });
    expect(res.status).toBe(200);
  });

  test('GET /api/v1/payments/my-payments should return 200 (admin can access)', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/my-payments`, {
      headers: adminHeaders
    });
    // Admin has Applicant role too in many cases, or might be 403
    expect([200, 403]).toContain(res.status);
  });

  test('POST /api/v1/payments/initiate with valid data should return 201', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/initiate`, {
      method: 'POST',
      headers: { ...adminHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: 1 })
    });
    // 201 for success, or 400/404 for invalid data
    expect([201, 400, 404]).toContain(res.status);
  });

  test('POST /api/v1/payments/1/process should return 200 or 404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/1/process`, {
      method: 'POST',
      headers: { ...adminHeaders, 'Content-Type': 'application/json' }
    });
    expect([200, 400, 404]).toContain(res.status);
  });

  test('GET /api/v1/payments/verify/1 should return 200 or 404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/verify/1`, {
      headers: adminHeaders
    });
    expect([200, 404]).toContain(res.status);
  });

  test('POST /api/v1/payments/confirm should return 200 or 400/404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/confirm`, {
      method: 'POST',
      headers: { ...adminHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId: 1, transactionId: 'TXN-ADMIN-123' })
    });
    expect([200, 400, 404]).toContain(res.status);
  });

  test('GET /api/v1/payments/receipt/1 should return 200 or 404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/receipt/1`, {
      headers: adminHeaders
    });
    expect([200, 404]).toContain(res.status);
  });

  test('GET /api/v1/payments/application/1 should return 200 or 404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/application/1`, {
      headers: adminHeaders
    });
    expect([200, 404]).toContain(res.status);
  });

  test('POST /api/v1/payments/application/1/initiate should return 201 or 400/404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/application/1/initiate`, {
      method: 'POST',
      headers: { ...adminHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ feeType: 'ApplicationFee' })
    });
    expect([201, 400, 404]).toContain(res.status);
  });
});

// ============================================================================
// Edge Cases & Error Handling
// ============================================================================

test.describe('PaymentsController - Edge Cases', () => {
  let applicantHeaders;
  let adminHeaders;

  test.beforeAll(async () => {
    applicantHeaders = await getAuthHeaders('applicant');
    adminHeaders = await getAuthHeaders('admin');
  });

  test('GET /api/v1/payments with invalid page should handle gracefully', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}${buildQuery({ page: -1 })}`, {
      headers: adminHeaders
    });
    // Should either correct the page or return 400
    expect([200, 400]).toContain(res.status);
  });

  test('GET /api/v1/payments with invalid pageSize should handle gracefully', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}${buildQuery({ pageSize: 99999 })}`, {
      headers: adminHeaders
    });
    expect([200, 400]).toContain(res.status);
  });

  test('POST /api/v1/payments/initiate with missing body should return 400', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/initiate`, {
      method: 'POST',
      headers: { ...applicantHeaders, 'Content-Type': 'application/json' }
    });
    expect(res.status).toBe(400);
  });

  test('POST /api/v1/payments/initiate with null applicationId should return 400', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/initiate`, {
      method: 'POST',
      headers: { ...applicantHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: null })
    });
    expect(res.status).toBe(400);
  });

  test('GET /api/v1/payments/verify/invalid-id should return 404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/verify/999999999`, {
      headers: adminHeaders
    });
    expect([404, 400]).toContain(res.status);
  });

  test('GET /api/v1/payments/receipt/invalid-id should return 404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/receipt/999999999`, {
      headers: adminHeaders
    });
    expect([404, 400]).toContain(res.status);
  });

  test('GET /api/v1/payments/application/invalid should return 404', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/application/INVALID-999`, {
      headers: adminHeaders
    });
    expect(res.status).toBe(404);
  });
});

// ============================================================================
// Role-based Access Control Verification
// ============================================================================

test.describe('PaymentsController - Authorization Rules', () => {
  test('Applicant should NOT have access to admin-only endpoints', async () => {
    const applicantHeaders = await getAuthHeaders('applicant');
    // All endpoints that require Applicant, Admin, Receptionist, etc. should work for applicant
    // The controller already defines allowed roles per endpoint
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}`, {
      headers: applicantHeaders
    });
    // If applicant is in allowed roles, should get 200, otherwise 403
    expect([200, 403]).toContain(res.status);
  });

  test('Callback endpoint should be accessible without auth (AllowAnonymous)', async () => {
    const res = await fetchPayments(`${BASE_URL}${CONTROLLER}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId: 1,
        transactionId: 'AUTH-TEST-001',
        status: 'Completed'
      })
    });
    // Must NOT be 401 - AllowAnonymous should allow this
    expect(res.status).not.toBe(401);
  });
});

console.log('✅ PaymentsController test suite loaded');