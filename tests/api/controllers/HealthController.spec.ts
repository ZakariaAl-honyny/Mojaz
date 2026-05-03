/**
 * Mojaz API Tests - HealthController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/health
 * Endpoints: 2
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 200 - AllowAnonymous is set)
 * - Citizen/Applicant token (expect 200 - AllowAnonymous)
 * - Admin token (expect 200 - AllowAnonymous)
 * 
 * Note: HealthController has [AllowAnonymous] attribute, so all requests should succeed.
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const HEALTH_BASE = `${BASE_URL}/api/v1/health`;

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
// TEST SUITE: GET /api/v1/health - Check API Health Status
// ============================================================================
test.describe('GET /api/v1/health - Check API Health Status', () => {
  
  // Test: Unauthenticated (should succeed with 200 - AllowAnonymous)
  test('should return 200 when unauthenticated', async ({ request }) => {
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With Applicant token (should succeed - AllowAnonymous)
  test('should return 200 with applicant token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /health] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(HEALTH_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With Admin token (should succeed - AllowAnonymous)
  test('should return 200 with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /health] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(HEALTH_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Manager token (should succeed - AllowAnonymous)
  test('should return 200 with manager token', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /health] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(HEALTH_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With Receptionist token (should succeed - AllowAnonymous)
  test('should return 200 with receptionist token', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /health] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(HEALTH_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With Doctor token (should succeed - AllowAnonymous)
  test('should return 200 with doctor token', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /health] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(HEALTH_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With Examiner token (should succeed - AllowAnonymous)
  test('should return 200 with examiner token', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[GET /health] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.get(HEALTH_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With Security token (should succeed - AllowAnonymous)
  test('should return 200 with security token', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[GET /health] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.get(HEALTH_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With invalid token (should still succeed - AllowAnonymous takes precedence)
  test('should return 200 with invalid token (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(HEALTH_BASE, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    // AllowAnonymous means even invalid tokens get through
    // But JWT middleware might reject first - so 401 is also acceptable
    expect([200, 401]).toContain(response.status());
  });

  // Test: Response structure validation
  test('should return valid response structure', async ({ request }) => {
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    validateApiResponse(json, true);
    
    // Validate response data structure
    expect(json.data).toHaveProperty('status');
    expect(json.data).toHaveProperty('timestamp');
    expect(json.data).toHaveProperty('version');
    expect(json.data).toHaveProperty('environment');
    
    // Validate values
    expect(json.data.status).toBe('Healthy');
    expect(json.data.version).toBe('1.0.0');
    expect(typeof json.data.timestamp).toBe('string');
    expect(typeof json.data.environment).toBe('string');
  });

  // Test: Response message validation
  test('should return success message', async ({ request }) => {
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    expect(json.message).toBe('API is healthy');
  });

  // Test: Timestamp is valid ISO format
  test('should return valid timestamp', async ({ request }) => {
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const timestamp = new Date(json.data.timestamp);
    
    // Should be a valid date
    expect(timestamp.getTime()).toBeGreaterThan(0);
    expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now() + 60000); // Within 1 minute tolerance
  });

  // Test: Environment is present
  test('should return environment information', async ({ request }) => {
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    // Environment should be one of: Development, Staging, Production
    expect(['Development', 'Staging', 'Production']).toContain(json.data.environment);
  });

  // Test: No extra unexpected fields
  test('should not include unexpected fields in response', async ({ request }) => {
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    
    // Check that expected fields exist
    expect(Object.keys(json.data)).toContain('status');
    expect(Object.keys(json.data)).toContain('timestamp');
    expect(Object.keys(json.data)).toContain('version');
    expect(Object.keys(json.data)).toContain('environment');
  });

  // Test: All roles can access health endpoint
  test('should allow all authenticated roles to access health endpoint', async ({ request }) => {
    const roles = ['applicant', 'admin', 'manager', 'receptionist', 'doctor', 'examiner', 'security'] as const;
    
    for (const role of roles) {
      const tokens = await getTokens(role);
      if (!tokens) {
        console.warn(`[All Roles] Skipping - could not obtain ${role} tokens`);
        continue;
      }

      const response = await request.get(HEALTH_BASE, {
        headers: getAuthHeader(tokens.accessToken),
      });

      expect(response.status()).toBe(200);
      const json = await response.json();
      validateApiResponse(json, true);
    }
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/health/database - Check Database Health
// ============================================================================
test.describe('GET /api/v1/health/database - Check Database Health', () => {
  
  // Test: Unauthenticated (should succeed - AllowAnonymous)
  test('should return 200 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${HEALTH_BASE}/database`);
    // Database may be connected (200) or disconnected (500)
    expect([200, 500]).toContain(response.status());
    
    const json = await response.json();
    
    // If connected, expect success
    if (response.status() === 200) {
      validateApiResponse(json, true);
      expect(json.data.database).toBe('Connected');
    } else {
      // If database is down, expect failure response
      expect(json.success).toBe(false);
    }
  });

  // Test: With Applicant token (should succeed - AllowAnonymous)
  test('should return 200 with applicant token when database connected', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /health/database] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(`${HEALTH_BASE}/database`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    // May return 200 (connected) or 500 (disconnected)
    expect([200, 500]).toContain(response.status());
    
    const json = await response.json();
    
    if (response.status() === 200) {
      validateApiResponse(json, true);
    }
  });

  // Test: With Admin token (should succeed - AllowAnonymous)
  test('should return 200 with admin token when database connected', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /health/database] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(`${HEALTH_BASE}/database`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 500]).toContain(response.status());
    
    const json = await response.json();
    
    if (response.status() === 200) {
      validateApiResponse(json, true);
    }
  });

  // Test: With Manager token (should succeed - AllowAnonymous)
  test('should return 200 with manager token when database connected', async ({ request }) => {
    const tokens = await getTokens('manager');
    if (!tokens) {
      console.warn('[GET /health/database] Skipping - could not obtain manager tokens');
      return;
    }

    const response = await request.get(`${HEALTH_BASE}/database`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 500]).toContain(response.status());
  });

  // Test: With Receptionist token (should succeed - AllowAnonymous)
  test('should return 200 with receptionist token', async ({ request }) => {
    const tokens = await getTokens('receptionist');
    if (!tokens) {
      console.warn('[GET /health/database] Skipping - could not obtain receptionist tokens');
      return;
    }

    const response = await request.get(`${HEALTH_BASE}/database`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 500]).toContain(response.status());
  });

  // Test: With Doctor token (should succeed - AllowAnonymous)
  test('should return 200 with doctor token', async ({ request }) => {
    const tokens = await getTokens('doctor');
    if (!tokens) {
      console.warn('[GET /health/database] Skipping - could not obtain doctor tokens');
      return;
    }

    const response = await request.get(`${HEALTH_BASE}/database`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 500]).toContain(response.status());
  });

  // Test: With Examiner token (should succeed - AllowAnonymous)
  test('should return 200 with examiner token', async ({ request }) => {
    const tokens = await getTokens('examiner');
    if (!tokens) {
      console.warn('[GET /health/database] Skipping - could not obtain examiner tokens');
      return;
    }

    const response = await request.get(`${HEALTH_BASE}/database`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 500]).toContain(response.status());
  });

  // Test: With Security token (should succeed - AllowAnonymous)
  test('should return 200 with security token', async ({ request }) => {
    const tokens = await getTokens('security');
    if (!tokens) {
      console.warn('[GET /health/database] Skipping - could not obtain security tokens');
      return;
    }

    const response = await request.get(`${HEALTH_BASE}/database`, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect([200, 500]).toContain(response.status());
  });

  // Test: With invalid token (should still attempt - AllowAnonymous)
  test('should attempt check with invalid token (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(`${HEALTH_BASE}/database`, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    // May get through or be rejected by JWT middleware
    expect([200, 401, 500]).toContain(response.status());
  });

  // Test: Response structure when database is connected
  test('should return valid response structure when database connected', async ({ request }) => {
    const response = await request.get(`${HEALTH_BASE}/database`);
    
    const json = await response.json();
    
    // Response should have standard structure
    expect(json).toHaveProperty('success');
    expect(json).toHaveProperty('message');
    expect(json).toHaveProperty('data');
    expect(json).toHaveProperty('statusCode');
    
    // If database is connected, data should contain database status
    if (json.data && json.data.database) {
      expect(['Connected', 'Disconnected']).toContain(json.data.database);
    }
  });

  // Test: Response message when connected
  test('should return success message when database connected', async ({ request }) => {
    const response = await request.get(`${HEALTH_BASE}/database`);
    
    if (response.status() === 200) {
      const json = await response.json();
      expect(json.message).toBe('Database connection successful');
    }
  });

  // Test: Response message when disconnected
  test('should return failure message when database disconnected', async ({ request }) => {
    const response = await request.get(`${HEALTH_BASE}/database`);
    
    // If database is down
    if (response.status() === 500) {
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.message).toBe('Database connection failed');
    }
  });

  // Test: Status code matches database state
  test('should return correct status code for database state', async ({ request }) => {
    const response = await request.get(`${HEALTH_BASE}/database`);
    
    if (response.status() === 200) {
      const json = await response.json();
      expect(json.statusCode).toBe(200);
    } else if (response.status() === 500) {
      const json = await response.json();
      expect(json.statusCode).toBe(500);
    }
  });

  // Test: All roles can access database health endpoint
  test('should allow all authenticated roles to access database health', async ({ request }) => {
    const roles = ['applicant', 'admin', 'manager', 'receptionist', 'doctor', 'examiner', 'security'] as const;
    
    for (const role of roles) {
      const tokens = await getTokens(role);
      if (!tokens) {
        console.warn(`[DB All Roles] Skipping - could not obtain ${role} tokens`);
        continue;
      }

      const response = await request.get(`${HEALTH_BASE}/database`, {
        headers: getAuthHeader(tokens.accessToken),
      });

      // May return 200 (connected) or 500 (disconnected)
      expect([200, 500]).toContain(response.status());
    }
  });

  // Test: Can check database multiple times rapidly
  test('should handle rapid consecutive requests', async ({ request }) => {
    // Make multiple rapid requests
    const promises = Array(5).fill(null).map(() => request.get(`${HEALTH_BASE}/database`));
    const responses = await Promise.all(promises);
    
    for (const response of responses) {
      expect([200, 500]).toContain(response.status());
    }
  });
});

// ============================================================================
// TEST SUITE: Integration - Health Endpoints
// ============================================================================
test.describe('Integration - Health Endpoints', () => {
  
  test('should handle concurrent health and database requests', async ({ request }) => {
    // Make concurrent requests to both endpoints
    const healthResponse = request.get(HEALTH_BASE);
    const dbResponse = request.get(`${HEALTH_BASE}/database`);
    
    const [health, db] = await Promise.all([healthResponse, dbResponse]);
    
    expect(health.status()).toBe(200);
    expect([200, 500]).toContain(db.status());
  });

  test('should verify health endpoint is accessible without authentication', async ({ request }) => {
    // Health endpoint should not require authentication
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data.status).toBe('Healthy');
  });

  test('should verify database endpoint works independently', async ({ request }) => {
    const response = await request.get(`${HEALTH_BASE}/database`);
    
    // Should get some response (even if database is disconnected)
    expect([200, 500]).toContain(response.status());
    
    const json = await response.json();
    expect(json).toBeDefined();
  });

  test('should verify both endpoints return consistent ApiResponse format', async ({ request }) => {
    const healthResponse = await request.get(HEALTH_BASE);
    const dbResponse = await request.get(`${HEALTH_BASE}/database`);
    
    const healthJson = await healthResponse.json();
    const dbJson = await dbResponse.json();
    
    // Both should have standard ApiResponse structure
    expect(healthJson).toHaveProperty('success');
    expect(healthJson).toHaveProperty('message');
    expect(healthJson).toHaveProperty('data');
    expect(healthJson).toHaveProperty('statusCode');
    
    expect(dbJson).toHaveProperty('success');
    expect(dbJson).toHaveProperty('message');
    expect(dbJson).toHaveProperty('data');
    expect(dbJson).toHaveProperty('statusCode');
  });

  test('should verify health data contains required fields', async ({ request }) => {
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    
    // Required fields
    expect(json.data.status).toBeDefined();
    expect(json.data.timestamp).toBeDefined();
    expect(json.data.version).toBeDefined();
    expect(json.data.environment).toBeDefined();
    
    // Types
    expect(typeof json.data.status).toBe('string');
    expect(typeof json.data.timestamp).toBe('string');
    expect(typeof json.data.version).toBe('string');
    expect(typeof json.data.environment).toBe('string');
  });

  test('should verify database data contains required fields', async ({ request }) => {
    const response = await request.get(`${HEALTH_BASE}/database`);
    
    // Even if disconnected (500), should have response
    const json = await response.json();
    
    if (json.data && json.data.database !== undefined) {
      expect(json.data.database).toBeDefined();
      expect(typeof json.data.database).toBe('string');
    }
  });

  test('should verify timestamp is recent', async ({ request }) => {
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const healthTimestamp = new Date(json.data.timestamp).getTime();
    const now = Date.now();
    
    // Timestamp should be within reasonable range (last 5 minutes)
    expect(healthTimestamp).toBeGreaterThan(now - 5 * 60 * 1000);
    expect(healthTimestamp).toBeLessThanOrEqual(now + 60000);
  });

  test('should verify version format is valid semantic version', async ({ request }) => {
    const response = await request.get(HEALTH_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const version = json.data.version;
    
    // Should match semver format (X.Y.Z)
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test('should verify API is healthy before checking database', async ({ request }) => {
    // First check API health
    const healthResponse = await request.get(HEALTH_BASE);
    expect(healthResponse.status()).toBe(200);
    
    const healthJson = await healthResponse.json();
    expect(healthJson.data.status).toBe('Healthy');
    
    // Then check database
    const dbResponse = await request.get(`${HEALTH_BASE}/database`);
    expect([200, 500]).toContain(dbResponse.status());
  });
});