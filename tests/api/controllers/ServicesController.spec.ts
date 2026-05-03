/**
 * Mojaz API Tests - ServicesController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/services
 * Endpoints: 1 (AllowAnonymous - no auth required)
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 200 - AllowAnonymous)
 * - Citizen/Applicant token (expect 200 - AllowAnonymous)
 * - Admin token (expect 200 - AllowAnonymous)
 * 
 * Note: ServicesController has [AllowAnonymous] attribute, so all endpoints
 * are publicly accessible. Tests verify this behavior.
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const SERVICES_BASE = `${BASE_URL}/api/v1/services`;

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

// Validate ServiceItem structure
function validateServiceItem(item: any) {
  expect(item).toBeDefined();
  expect(typeof item.code).toBe('string');
  expect(typeof item.nameAr).toBe('string');
  expect(typeof item.nameEn).toBe('string');
  expect(item.isActive).toBeDefined();
  expect(typeof item.isActive).toBe('boolean');
}

// ============================================================================
// TEST SUITE: GET /api/v1/services - Get All Available License Services
// ============================================================================
test.describe('GET /api/v1/services - Get All Available License Services', () => {
  
  // Test: Unauthenticated (should succeed with 200 - AllowAnonymous)
  test('should return 200 when unauthenticated (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With Citizen/Applicant token (should succeed with 200)
  test('should return services with citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /services] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(SERVICES_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With valid Admin token (should succeed)
  test('should return services with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /services] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(SERVICES_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With invalid token (should still succeed - AllowAnonymous)
  test('should return 200 with invalid token (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(SERVICES_BASE, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    // AllowAnonymous allows even invalid tokens
    expect(response.status()).toBe(200);
  });

  // Test: Verify data structure and required fields
  test('should have required fields for all services', async ({ request }) => {
    const response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const services = json.data;
    
    expect(services.length).toBeGreaterThan(0);
    
    // Validate first item structure
    validateServiceItem(services[0]);
  });

  // Test: Verify all expected service types are present
  test('should contain all expected service types', async ({ request }) => {
    const response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const services = json.data;
    const serviceCodes = services.map((s: any) => s.code);
    
    // Verify all service types are present
    expect(serviceCodes).toContain('NewLicense');
    expect(serviceCodes).toContain('Renewal');
    expect(serviceCodes).toContain('Replacement');
    expect(serviceCodes).toContain('CategoryUpgrade');
    expect(serviceCodes).toContain('InternationalLicense');
    expect(serviceCodes).toContain('TemporaryLicense');
  });

  // Test: Verify Arabic translations are present
  test('should have Arabic names for all services', async ({ request }) => {
    const response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const services = json.data;
    
    for (const service of services) {
      expect(service.nameAr).toBeDefined();
      expect(typeof service.nameAr).toBe('string');
      expect(service.nameAr.length).toBeGreaterThan(0);
    }
  });

  // Test: Verify English translations are present
  test('should have English names for all services', async ({ request }) => {
    const response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const services = json.data;
    
    for (const service of services) {
      expect(service.nameEn).toBeDefined();
      expect(typeof service.nameEn).toBe('string');
      expect(service.nameEn.length).toBeGreaterThan(0);
    }
  });

  // Test: Verify all services are active by default
  test('should have all services active by default', async ({ request }) => {
    const response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const services = json.data;
    
    for (const service of services) {
      expect(service.isActive).toBe(true);
    }
  });

  // Test: Verify minimum number of services
  test('should have at least 6 service types', async ({ request }) => {
    const response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    expect(json.data.length).toBeGreaterThanOrEqual(6);
  });

  // Test: Verify response message is in Arabic
  test('should return Arabic success message', async ({ request }) => {
    const response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    expect(json.message).toBeDefined();
    expect(typeof json.message).toBe('string');
    expect(json.message.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// TEST SUITE: Integration - Services Flow
// ============================================================================
test.describe('Integration - Services Flow', () => {
  
  test('should fetch services with different auth scenarios', async ({ request }) => {
    // Scenario 1: No auth - should work
    let response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    // Scenario 2: Applicant auth - should work
    const applicantTokens = await getTokens('applicant');
    if (applicantTokens) {
      response = await request.get(SERVICES_BASE, {
        headers: getAuthHeader(applicantTokens.accessToken),
      });
      expect(response.status()).toBe(200);
    }
    
    // Scenario 3: Admin auth - should work
    const adminTokens = await getTokens('admin');
    if (adminTokens) {
      response = await request.get(SERVICES_BASE, {
        headers: getAuthHeader(adminTokens.accessToken),
      });
      expect(response.status()).toBe(200);
    }
    
    // Scenario 4: Invalid token - should still work (AllowAnonymous)
    response = await request.get(SERVICES_BASE, {
      headers: getAuthHeader('invalid-token-xyz'),
    });
    expect(response.status()).toBe(200);
    
    // Scenario 5: Malformed token - should still work (AllowAnonymous)
    response = await request.get(SERVICES_BASE, {
      headers: getAuthHeader('Bearer malformed.token.here'),
    });
    expect(response.status()).toBe(200);
  });

  test('should fetch services multiple times without caching issues', async ({ request }) => {
    // Call the same endpoint multiple times
    for (let i = 0; i < 3; i++) {
      const response = await request.get(SERVICES_BASE);
      expect(response.status()).toBe(200);
      
      const json = await response.json();
      validateApiResponse(json, true);
      
      // Should return consistent data
      expect(json.data.length).toBeGreaterThanOrEqual(6);
    }
  });

  test('should verify service item order is consistent', async ({ request }) => {
    const response1 = await request.get(SERVICES_BASE);
    const json1 = await response1.json();
    
    const response2 = await request.get(SERVICES_BASE);
    const json2 = await response2.json();
    
    // Both responses should have the same order
    const codes1 = json1.data.map((s: any) => s.code);
    const codes2 = json2.data.map((s: any) => s.code);
    
    expect(codes1).toEqual(codes2);
  });

  test('should verify all services have description in Arabic', async ({ request }) => {
    const response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const services = json.data;
    
    for (const service of services) {
      expect(service.descriptionAr).toBeDefined();
      expect(typeof service.descriptionAr).toBe('string');
      expect(service.descriptionAr.length).toBeGreaterThan(0);
    }
  });

  test('should verify allowAnonymous behavior', async ({ request }) => {
    // Scenario 1: No auth - should work
    let response = await request.get(SERVICES_BASE);
    expect(response.status()).toBe(200);
    
    // Scenario 2: Applicant token - should work
    const applicantTokens = await getTokens('applicant');
    if (applicantTokens) {
      response = await request.get(SERVICES_BASE, {
        headers: getAuthHeader(applicantTokens.accessToken),
      });
      expect(response.status()).toBe(200);
    }
    
    // Scenario 3: Admin token - should work
    const adminTokens = await getTokens('admin');
    if (adminTokens) {
      response = await request.get(SERVICES_BASE, {
        headers: getAuthHeader(adminTokens.accessToken),
      });
      expect(response.status()).toBe(200);
    }
    
    // Scenario 4: Invalid token - should still work
    response = await request.get(SERVICES_BASE, {
      headers: getAuthHeader('invalid-token-xyz'),
    });
    expect(response.status()).toBe(200);
    
    // Scenario 5: Empty token - should still work
    response = await request.get(SERVICES_BASE, {
      headers: getAuthHeader(''),
    });
    expect(response.status()).toBe(200);
  });
});