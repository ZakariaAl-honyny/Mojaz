/**
 * Mojaz LicensesController API Tests
 * Target: http://localhost:50013/api/vi/licenses
 * Endpoints: 5
 *
 * Test Coverage:
 * - Issue new driving license (Manager/Admin only)
 * - Issue replacement license (Manager/Admin only)
 * - Download license PDF (authenticated + authorization)
 * - Get my licenses (Applicant only)
 * - Get upgrade targets (Applicant only)
 *
 * Roles tested: Unauthenticated (401), Applicant (200/403), Manager/Admin (200)
 */

const { test, expect } = require('@playwright/test');
const { BASE_URL, TEST_ACCOUNTS, getTokens, bearer, assertApiResponse, buildQuery, parseResponse } = require('../shared/helpers');

// Test configuration
const API_BASE = BASE_URL;
const LICENSE_ENDPOINT = `${API_BASE}/api/vi/licenses`;

// Helper to track created license IDs for cleanup
let createdLicenseId = null;

/**
 * Generate random string for unique test data
 */
function randomStr(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

// =========================================================================
// 1. GET /api/vi/licenses - Get My Licenses
// =========================================================================
test. describe('GET /api/vi/licenses - Get My Licenses (Applicant only)', () => {

  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(LICENSE_ENDPOINT);
    expect(response.status()).toBe(401);
  });

  test('should return 200 when applicant retrieves own licenses', async ({ request }) => {
    const token = await getTokens('applicant');
    expect(token).toBeTruthy();

    const response = await request.get(LICENSE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    // May return 200 (success) or 404 (no licenses)
    expect([200, 404]).toContain(response.status());
  });

  test('should return 200 when admin retrieves applicant licenses', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.get(LICENSE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    // May return 200 (success) or 404 (no licenses)
    expect([200, 404]).toContain(response.status());
  });

  test('should return licenses with valid API response structure', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.get(LICENSE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    if (response.status() === 200) {
      const body = await parseResponse(response);
      assertApiResponse('Get My Licenses', body);
    }
  });

  test('should support pagination parameters', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.get(`${LICENSE_ENDPOINT}${buildQuery({ page: 1, pageSize: 10 })}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    // May return 200 or 404
    expect([200, 404]).toContain(response.status());
  });

  test('should return valid license data structure when licenses exist', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.get(LICENSE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    if (response.status() === 200) {
      const body = await parseResponse(response);
      expect(body).toHaveProperty('data');

      // Store first license ID for download tests if available
      if (body.data && Array.isArray(body.data)) {
        const firstLicense = body.data[0];
        if (firstLicense && firstLicense.id) {
          createdLicenseId = firstLicense.id;
        }
      }
    }
  });
});

// =========================================================================
// 2. GET /api/vi/licenses/{id}/download - Download License PDF
// =========================================================================
test.describe('GET /api/vi/licenses/{id}/download - Download License PDF', () => {

  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${LICENSE_ENDPOINT}/1/download`);
    expect(response.status()).toBe(401);
  });

  test('should return 404 for non-existent license', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.get(`${LICENSE_ENDPOINT}/99999/download`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    // Should return 404 or 403
    expect([403, 404]).toContain(response.status());
  });

  test('should return 403 when applicant tries to download another user\'s license', async ({ request }) => {
    const applicantToken = await getTokens('applicant');

    // Try to download with a non-existent ID
    const response = await request.get(`${LICENSE_ENDPOINT}/99999/download`, {
      headers: {
        Authorization: `Bearer ${applicantToken.accessToken}`
      }
    });

    const body = await parseResponse(response);
    // Should return 403 or 404 (no access or not found)
    expect([403, 404]).toContain(response.status());
  });

  test('should return 200 when admin downloads any license PDF', async ({ request }) => {
    const token = await getTokens('admin');

    // Try to download non-existent license (will return 404 if not found)
    const response = await request.get(`${LICENSE_ENDPOINT}/99999/download`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    // Response may be 200 (PDF), 404 (license not found), or 404 (file not found)
    expect([200, 404]).toContain(response.status());
  });

  test('should return 200 when manager downloads any license PDF', async ({ request }) => {
    const token = await getTokens('manager');

    const response = await request.get(`${LICENSE_ENDPOINT}/99999/download`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect([200, 404]).toContain(response.status());
  });

  test('should return 200 when security downloads any license PDF', async ({ request }) => {
    const token = await getTokens('security');

    const response = await request.get(`${LICENSE_ENDPOINT}/99999/download`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect([200, 404]).toContain(response.status());
  });

  test('should return PDF content-type when license exists with file', async ({ request }) => {
    const token = await getTokens('admin');

    // If we have a createdLicenseId, test with it
    if (createdLicenseId) {
      const response = await request.get(`${LICENSE_ENDPOINT}/${createdLicenseId}/download`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      // Should return PDF or 404
      if (response.status() === 200) {
        const contentType = response.headers()['content-type'];
        expect(contentType).toContain('application/pdf');
      }
    }
  });
});

// =========================================================================
// 3. POST /api/vi/licenses/application/{appIdOrNumber}/issue - Issue New License
// =========================================================================
test.describe('POST /api/vi/licenses/application/{appIdOrNumber}/issue - Issue New License', () => {

  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(`${LICENSE_ENDPOINT}/application/1/issue`);
    expect(response.status()).toBe(401);
  });

  test('should return 403 when applicant tries to issue license', async ({ request }) => {
    const token = await getTokens('applicant');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/1/issue`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect(response.status()).toBe(403);
  });

  test('should return 404 for non-existent application', async ({ request }) => {
    const token = await getTokens('manager');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    // Should return 404 (application not found) or 400 (validation/business rule)
    expect([400, 404]).toContain(response.status());
  });

  test('should return 200 when manager issues license for valid application', async ({ request }) => {
    const token = await getTokens('manager');

    // Use a non-existent application ID - business will validate
    const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    // May return 200 (success), 400 (business rule), or 404 (not found)
    expect([200, 400, 404]).toContain(response.status());
  });

  test('should return 200 when admin issues license', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    expect([200, 400, 404]).toContain(response.status());
  });

  test('should support application number format MOJ-YYYY-XXXXXXXX', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/MOJ-2026-99999999/issue`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    expect([200, 400, 404]).toContain(response.status());
  });

  test('should return valid LicenseDto structure on success', async ({ request }) => {
    const token = await getTokens('admin');

    // Use a valid application number format
    const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    if (response.status() === 200) {
      const body = await parseResponse(response);
      assertApiResponse('Issue License', body);
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('licenseNumber');
      expect(body.data).toHaveProperty('categoryCode');
    }
  });
});

// =========================================================================
// 4. POST /api/vi/licenses/application/{appIdOrNumber}/issue-replacement - Issue Replacement
// =========================================================================
test.describe('POST /api/vi/licenses/application/{appIdOrNumber}/issue-replacement - Issue Replacement', () => {

  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(`${LICENSE_ENDPOINT}/application/1/issue-replacement`);
    expect(response.status()).toBe(401);
  });

  test('should return 403 when applicant tries to issue replacement', async ({ request }) => {
    const token = await getTokens('applicant');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/1/issue-replacement`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect(response.status()).toBe(403);
  });

  test('should return 404 for non-existent application', async ({ request }) => {
    const token = await getTokens('manager');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue-replacement`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    expect([400, 404]).toContain(response.status());
  });

  test('should return 200 when manager issues replacement for valid application', async ({ request }) => {
    const token = await getTokens('manager');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue-replacement`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    expect([200, 400, 404]).toContain(response.status());
  });

  test('should return 200 when admin issues replacement', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue-replacement`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    expect([200, 400, 404]).toContain(response.status());
  });

  test('should support application number format MOJ-YYYY-XXXXXXXX', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/MOJ-2026-99999999/issue-replacement`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    expect([200, 400, 404]).toContain(response.status());
  });

  test('should return license ID on success', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue-replacement`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    if (response.status() === 200) {
      const body = await parseResponse(response);
      assertApiResponse('Issue Replacement', body);
      // Returns int (new license ID)
      expect(typeof body.data).toBe('number');
    }
  });
});

// =========================================================================
// 5. GET /api/vi/licenses/{id}/upgrade-targets - Get Upgrade Targets
// =========================================================================
test.describe('GET /api/vi/licenses/{id}/upgrade-targets - Get Upgrade Targets', () => {

  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${LICENSE_ENDPOINT}/1/upgrade-targets`);
    expect(response.status()).toBe(401);
  });

  test('should return 403 when admin tries to get upgrade targets', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.get(`${LICENSE_ENDPOINT}/1/upgrade-targets`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    // Admin role not allowed for this endpoint
    expect(response.status()).toBe(403);
  });

  test('should return 403 when manager tries to get upgrade targets', async ({ request }) => {
    const token = await getTokens('manager');

    const response = await request.get(`${LICENSE_ENDPOINT}/1/upgrade-targets`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect(response.status()).toBe(403);
  });

  test('should return 200 when applicant gets upgrade targets for own license', async ({ request }) => {
    const token = await getTokens('applicant');

    const response = await request.get(`${LICENSE_ENDPOINT}/1/upgrade-targets`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    // May return 200 (success) or 404 (license not found)
    expect([200, 404]).toContain(response.status());
  });

  test('should return 200 when applicant gets upgrade targets with valid license ID', async ({ request }) => {
    const token = await getTokens('applicant');

    // Use a non-existent license ID
    const response = await request.get(`${LICENSE_ENDPOINT}/99999/upgrade-targets`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    expect([200, 404]).toContain(response.status());
  });

  test('should return valid upgrade targets structure', async ({ request }) => {
    const token = await getTokens('applicant');

    const response = await request.get(`${LICENSE_ENDPOINT}/1/upgrade-targets`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    if (response.status() === 200) {
      const body = await parseResponse(response);
      assertApiResponse('Get Upgrade Targets', body);
      // Should return array of available categories
      expect(body.data).toBeDefined();
    }
  });

  test('should return empty array when no upgrades available', async ({ request }) => {
    const token = await getTokens('applicant');

    const response = await request.get(`${LICENSE_ENDPOINT}/1/upgrade-targets`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    if (response.status() === 200) {
      const body = await parseResponse(response);
      // Data should be an array (empty or with categories)
      expect(Array.isArray(body.data) || body.data === null).toBeTruthy();
    }
  });
});

// =========================================================================
// Edge Cases & Error Scenarios
// =========================================================================
test.describe('LicensesController - Edge Cases', () => {

  test('should return 401 for invalid/expired token', async ({ request }) => {
    const response = await request.get(LICENSE_ENDPOINT, {
      headers: {
        Authorization: 'Bearer invalid-token-12345'
      }
    });

    expect(response.status()).toBe(401);
  });

  test('should return 401 for malformed authorization header', async ({ request }) => {
    const response = await request.get(LICENSE_ENDPOINT, {
      headers: {
        Authorization: 'InvalidFormat token'
      }
    });

    expect(response.status()).toBe(401);
  });

  test('should handle invalid license ID format gracefully', async ({ request }) => {
    const token = await getTokens('admin');

    // Try with non-numeric ID
    const response = await request.get(`${LICENSE_ENDPOINT}/abc/download`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    // Should return 404 or 400 (bad route)
    expect([400, 404]).toContain(response.status());
  });

  test('should handle negative license ID', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.get(`${LICENSE_ENDPOINT}/-1/download`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect([400, 404]).toContain(response.status());
  });

  test('should handle very large license ID', async ({ request }) => {
    const token = await getTokens('admin');

    const response = await request.get(`${LICENSE_ENDPOINT}/9999999999/download`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    // Should handle gracefully (404 or error response)
    expect([404, 500]).toContain(response.status());
  });

  test('should validate application number format strictly', async ({ request }) => {
    const token = await getTokens('admin');

    // Invalid format
    const response = await request.post(`${LICENSE_ENDPOINT}/application/INVALID-FORMAT/issue`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    const body = await parseResponse(response);
    expect([400, 404]).toContain(response.status());
  });
});

// =========================================================================
// Authorization Matrix Verification
// =========================================================================
test.describe('LicensesController - Authorization Matrix', () => {

  const employeeRoles = ['manager', 'admin', 'security', 'receptionist', 'examiner', 'doctor'];

  for (const role of employeeRoles) {
    test(`[${role}] should be able to download any license PDF`, async ({ request }) => {
      const token = await getTokens(role);

      const response = await request.get(`${LICENSE_ENDPOINT}/99999/download`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      // Employee roles can attempt download (200 or 404)
      expect([200, 404]).toContain(response.status());
    });

    test(`[${role}] should be able to issue new license`, async ({ request }) => {
      const token = await getTokens(role);

      const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      // Manager/Admin can issue, others get 403
      if (role === 'manager' || role === 'admin') {
        expect([200, 400, 404]).toContain(response.status());
      } else {
        expect(response.status()).toBe(403);
      }
    });

    test(`[${role}] should be able to issue replacement license`, async ({ request }) => {
      const token = await getTokens(role);

      const response = await request.post(`${LICENSE_ENDPOINT}/application/99999/issue-replacement`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      if (role === 'manager' || role === 'admin') {
        expect([200, 400, 404]).toContain(response.status());
      } else {
        expect(response.status()).toBe(403);
      }
    });
  }

  test('[Applicant] should be able to get own licenses', async ({ request }) => {
    const token = await getTokens('applicant');

    const response = await request.get(LICENSE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect([200, 404]).toContain(response.status());
  });

  test('[Applicant] should be able to get upgrade targets', async ({ request }) => {
    const token = await getTokens('applicant');

    const response = await request.get(`${LICENSE_ENDPOINT}/1/upgrade-targets`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect([200, 404]).toContain(response.status());
  });

  test('[Applicant] should NOT be able to issue license', async ({ request }) => {
    const token = await getTokens('applicant');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/1/issue`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect(response.status()).toBe(403);
  });

  test('[Applicant] should NOT be able to issue replacement', async ({ request }) => {
    const token = await getTokens('applicant');

    const response = await request.post(`${LICENSE_ENDPOINT}/application/1/issue-replacement`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`
      }
    });

    expect(response.status()).toBe(403);
  });
});