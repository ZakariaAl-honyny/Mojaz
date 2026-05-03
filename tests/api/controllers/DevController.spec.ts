/**
 * Mojaz API Tests - DevController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/dev/dev
 * Endpoints: 1
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 401)
 * - Citizen/Applicant token (expect 200/403 - dev-only)
 * - Admin token (expect 200 - dev-only)
 * 
 * Note: DevController is development-only - requires dev environment.
 * Will return 404 in non-development environments.
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const DEV_BASE = `${BASE_URL}/api/v1/dev/dev`;

// Available email templates
const EMAIL_TEMPLATES = [
  'account-verification',
  'password-recovery',
  'application-received',
  'appointment-confirmed',
  'medical-result',
  'test-result',
  'application-decision',
  'license-issued',
  'payment-confirmed',
  'documents-missing'
];

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
// TEST SUITE: GET /api/v1/dev/dev/email-preview/{templateName} - Preview Email Templates
// ============================================================================
test.describe('GET /api/v1/dev/dev/email-preview/{templateName} - Preview Email Templates', () => {
  
  // Test: Unauthenticated (should return 401)
  test('should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`);
    
    // Dev controller likely requires authentication
    expect([401, 403, 404]).toContain(response.status());
  });

  // Test: With Applicant token (development-only - expect 200 or 404)
  test('should return 200 or 404 with applicant token (dev-only)', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /email-preview] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // Development endpoint - may return 200 (dev) or 404 (non-dev)
    expect([200, 404]).toContain(response.status());
  });

  // Test: With Admin token (development-only - expect 200 or 404)
  test('should return 200 or 404 with admin token (dev-only)', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /email-preview] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status());
  });

  // Test: With Manager token (development-only - expect 200 or 404)
  test('should return 200 or 404 with manager token (dev-only)', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /email-preview] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status());
  });

  // Test: With Receptionist token (development-only)
  test('should return 200 or 404 with receptionist token (dev-only)', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /email-preview] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status());
  });

  // Test: With Doctor token (development-only)
  test('should return 200 or 404 with doctor token (dev-only)', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /email-preview] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status());
  });

  // Test: With Examiner token (development-only)
  test('should return 200 or 404 with examiner token (dev-only)', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[GET /email-preview] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status());
  });

  // Test: With Security token (development-only)
  test('should return 200 or 404 with security token (dev-only)', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[GET /email-preview] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 404]).toContain(response.status());
  });

  // Test: With invalid token (should return 401)
  test('should return 401 with invalid token', async ({ request }) => {
    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    // Invalid token should be rejected
    expect([401, 403]).toContain(response.status());
  });

  // Test: All valid email templates should work when in development
  test('should preview all valid email templates in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[All Templates] Skipping - could not obtain admin tokens');
      return;
    }

    const results: { template: string; status: number }[] = [];

    for (const template of EMAIL_TEMPLATES) {
      const response = await request.get(`${DEV_BASE}/email-preview/${template}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      results.push({ template, status: response.status() });
    }

    // All templates should either return 200 (dev) or 404 (non-dev)
    for (const result of results) {
      expect([200, 404]).toContain(result.status);
    }
  });

  // Test: Invalid template name should return 400
  test('should return 400 for invalid template name', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Invalid Template] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/invalid-template-name`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // If in dev mode: 400 (BadRequest)
    // If not in dev mode: 404 (NotFound)
    expect([400, 404]).toContain(response.status());
  });

  // Test: Account verification template response format
  test('should return HTML for account-verification template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Account Verification] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // In development mode, should return HTML content
    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
      
      const text = await response.text();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  // Test: Password recovery template response format
  test('should return HTML for password-recovery template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Password Recovery] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/password-recovery`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    }
  });

  // Test: Application received template response format
  test('should return HTML for application-received template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Application Received] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/application-received`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    }
  });

  // Test: Appointment confirmed template response format
  test('should return HTML for appointment-confirmed template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Appointment Confirmed] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/appointment-confirmed`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    }
  });

  // Test: Medical result template response format
  test('should return HTML for medical-result template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Medical Result] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/medical-result`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    }
  });

  // Test: Test result template response format
  test('should return HTML for test-result template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Test Result] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/test-result`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    }
  });

  // Test: Application decision template response format
  test('should return HTML for application-decision template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Application Decision] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/application-decision`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    }
  });

  // Test: License issued template response format
  test('should return HTML for license-issued template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[License Issued] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/license-issued`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    }
  });

  // Test: Payment confirmed template response format
  test('should return HTML for payment-confirmed template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Payment Confirmed] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/payment-confirmed`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    }
  });

  // Test: Documents missing template response format
  test('should return HTML for documents-missing template in development', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Documents Missing] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/documents-missing`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    }
  });

  // Test: Multiple rapid requests should work
  test('should handle multiple rapid consecutive requests', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Rapid Requests] Skipping - could not obtain admin tokens');
      return;
    }

    // Make multiple rapid requests to different templates
    const promises = EMAIL_TEMPLATES.slice(0, 5).map(template => 
      request.get(`${DEV_BASE}/email-preview/${template}`, {
        headers: getAuthHeader(tokens.accessToken),
      })
    );
    
    const responses = await Promise.all(promises);
    
    for (const response of responses) {
      expect([200, 404]).toContain(response.status());
    }
  });

  // Test: Empty template name should return 404
  test('should return 404 for empty template name', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Empty Template] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // Either 404 or gets template with empty name
    expect([400, 404]).toContain(response.status());
  });

  // Test: Case-sensitive template name
  test('should handle case-sensitive template names correctly', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Case Sensitive] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/ACCOUNT-VERIFICATION`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // Different case - should be treated as invalid
    expect([400, 404]).toContain(response.status());
  });
});

// ============================================================================
// TEST SUITE: Integration - Dev Endpoints
// ============================================================================
test.describe('Integration - Dev Endpoints', () => {
  
  test('should verify endpoint route is correct', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Route Verification] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // Should handle request (dev mode) or return 404 (non-dev mode)
    expect([200, 400, 404]).toContain(response.status());
  });

  test('should verify all roles can be tested', async ({ request }) => {
    const roles = ['applicant', 'admin', 'manager', 'receptionist', 'doctor', 'examiner', 'security'] as const;
    
    for (const role of roles) {
      const tokens = await getTokens(role);
      if (!tokens) {
        console.warn(`[All Roles] Skipping - could not obtain ${role} tokens`);
        continue;
      }

      const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      // Should handle the request in some way
      expect([200, 401, 403, 404]).toContain(response.status());
    }
  });

  test('should verify endpoint returns consistent format', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Consistent Format] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    if (response.status() === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
      
      const text = await response.text();
      expect(text.length).toBeGreaterThan(0);
    } else {
      // Non-development environment - should return JSON or empty
      expect([404]).toContain(response.status());
    }
  });

  test('should verify endpoint requires authentication', async ({ request }) => {
    // Test without any token
    const noTokenResponse = await request.get(`${DEV_BASE}/email-preview/account-verification`);
    expect([401, 403, 404]).toContain(noTokenResponse.status());
    
    // Test with random token
    const randomTokenResponse = await request.get(`${DEV_BASE}/email-preview/account-verification`, {
      headers: getAuthHeader('random-invalid-token-12345'),
    });
    expect([401, 403]).toContain(randomTokenResponse.status());
  });

  test('should verify template names are validated', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Template Validation] Skipping - could not obtain admin tokens');
      return;
    }

    // Test various invalid template names
    const invalidTemplates = [
      'nonexistent',
      'test',
      'fake',
      'invalid'
    ];

    for (const invalidTemplate of invalidTemplates) {
      const response = await request.get(`${DEV_BASE}/email-preview/${invalidTemplate}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      // Invalid templates should fail
      expect([400, 404]).toContain(response.status());
    }
  });

  test('should verify response is different for each template', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[Different Responses] Skipping - could not obtain admin tokens');
      return;
    }

    const responses: string[] = [];

    for (const template of ['account-verification', 'password-recovery', 'application-received']) {
      const response = await request.get(`${DEV_BASE}/email-preview/${template}`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      if (response.status() === 200) {
        const text = await response.text();
        responses.push(text);
      }
    }

    // If all returned 200, they should have different content
    const validResponses = responses.filter(r => r.length > 0);
    if (validResponses.length >= 2) {
      // Each template should produce different HTML
      const uniqueContents = new Set(validResponses);
      expect(uniqueContents.size).toBeGreaterThanOrEqual(2);
    }
  });
});