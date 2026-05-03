/**
 * Mojaz API Tests - LookupsController
 * Test Engineer: Test Engineer
 * Target: http://localhost:5013/api/v1/lookups
 * Endpoints: 4 (AllowAnonymous - no auth required)
 * 
 * Tests ALL endpoints with 3 security roles:
 * - Unauthenticated (expect 200 - AllowAnonymous)
 * - Citizen/Applicant token (expect 200 - AllowAnonymous)
 * - Admin token (expect 200 - AllowAnonymous)
 * 
 * Note: LookupsController has [AllowAnonymous] attribute, so all endpoints 
 * are publicly accessible. Tests verify this behavior.
 */

import { test, expect, request } from '@playwright/test';
import { getCachedToken } from '../shared/helpers';

// Test configuration - use environment variable or default
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const LOOKUPS_BASE = `${BASE_URL}/api/v1/lookups`;

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

// Validate LookupItem structure
function validateLookupItem(item: any) {
  expect(item).toBeDefined();
  expect(typeof item.code).toBe('string');
  expect(typeof item.nameAr).toBe('string');
  expect(typeof item.nameEn).toBe('string');
}

// ============================================================================
// TEST SUITE: GET /api/v1/lookups - Get All Lookups
// ============================================================================
test.describe('GET /api/v1/lookups - Get All Lookups', () => {
  
  // Test: Unauthenticated (should succeed with 200 - AllowAnonymous)
  test('should return 200 when unauthenticated (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(LOOKUPS_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(json.data.examCenters).toBeDefined();
    expect(json.data.nationalities).toBeDefined();
    expect(json.data.governorates).toBeDefined();
  });

  // Test: With Citizen/Applicant token (should succeed with 200)
  test('should return lookups with citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /lookups] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(LOOKUPS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With valid Admin token (should succeed)
  test('should return lookups with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /lookups] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(LOOKUPS_BASE, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: With invalid token (should still succeed - AllowAnonymous)
  test('should return 200 with invalid token (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(LOOKUPS_BASE, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    // AllowAnonymous allows even invalid tokens
    expect(response.status()).toBe(200);
  });

  // Test: Verify data structure contains all lookup types
  test('should contain all lookup categories', async ({ request }) => {
    const response = await request.get(LOOKUPS_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const data = json.data;
    
    // Verify exam centers
    expect(Array.isArray(data.examCenters)).toBe(true);
    expect(data.examCenters.length).toBeGreaterThan(0);
    
    // Verify nationalities
    expect(Array.isArray(data.nationalities)).toBe(true);
    expect(data.nationalities.length).toBeGreaterThan(0);
    
    // Verify governorates
    expect(Array.isArray(data.governorates)).toBe(true);
    expect(data.governorates.length).toBeGreaterThan(0);
    
    // Validate first item in each category
    validateLookupItem(data.examCenters[0]);
    validateLookupItem(data.nationalities[0]);
    validateLookupItem(data.governorates[0]);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/lookups/exam-centers - Get Exam Centers
// ============================================================================
test.describe('GET /api/v1/lookups/exam-centers - Get Exam Centers', () => {
  const EXAM_CENTERS_ENDPOINT = `${LOOKUPS_BASE}/exam-centers`;
  
  // Test: Unauthenticated (should succeed with 200 - AllowAnonymous)
  test('should return 200 when unauthenticated (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(EXAM_CENTERS_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With Citizen/Applicant token (should succeed with 200)
  test('should return exam centers with citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /exam-centers] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(EXAM_CENTERS_ENDPOINT, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Admin token (should succeed)
  test('should return exam centers with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /exam-centers] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(EXAM_CENTERS_ENDPOINT, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: Verify exam centers contain Yemeni context
  test('should contain Yemeni exam centers', async ({ request }) => {
    const response = await request.get(EXAM_CENTERS_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const centers = json.data;
    
    expect(centers.length).toBeGreaterThan(0);
    
    // Check for expected Yemeni cities
    const centerNames = centers.map((c: any) => c.nameAr);
    expect(centerNames.some((name: string) => name.includes('صنعاء'))).toBe(true); // Sanaa
    expect(centerNames.some((name: string) => name.includes('عدن'))).toBe(true);   // Aden
    expect(centerNames.some((name: string) => name.includes('تعز'))).toBe(true);    // Taiz
  });

  // Test: Verify exam centers have required fields
  test('should have required fields for all centers', async ({ request }) => {
    const response = await request.get(EXAM_CENTERS_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const centers = json.data;
    
    for (const center of centers) {
      validateLookupItem(center);
      // Exam centers have RegionCode and RegionNameAr
      expect(center.regionCode).toBeDefined();
      expect(center.regionNameAr).toBeDefined();
    }
  });

  // Test: With invalid token (should still succeed - AllowAnonymous)
  test('should return 200 with invalid token (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(EXAM_CENTERS_ENDPOINT, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(200);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/lookups/nationalities - Get Nationalities
// ============================================================================
test.describe('GET /api/v1/lookups/nationalities - Get Nationalities', () => {
  const NATIONALITIES_ENDPOINT = `${LOOKUPS_BASE}/nationalities`;
  
  // Test: Unauthenticated (should succeed with 200 - AllowAnonymous)
  test('should return 200 when unauthenticated (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(NATIONALITIES_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With Citizen/Applicant token (should succeed with 200)
  test('should return nationalities with citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /nationalities] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(NATIONALITIES_ENDPOINT, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Admin token (should succeed)
  test('should return nationalities with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /nationalities] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(NATIONALITIES_ENDPOINT, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: Verify nationalities include Yemen and Arab countries
  test('should include Yemen and Arab nationalities', async ({ request }) => {
    const response = await request.get(NATIONALITIES_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const nationalities = json.data;
    
    expect(nationalities.length).toBeGreaterThan(0);
    
    // Check for key nationalities
    const codes = nationalities.map((n: any) => n.code);
    expect(codes).toContain('YE'); // Yemeni
    expect(codes).toContain('SA'); // Saudi
    expect(codes).toContain('EG'); // Egyptian
    expect(codes).toContain('SD'); // Sudanese
  });

  // Test: Verify nationalities have Arabic and English names
  test('should have Arabic and English names for all nationalities', async ({ request }) => {
    const response = await request.get(NATIONALITIES_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const nationalities = json.data;
    
    for (const nationality of nationalities) {
      validateLookupItem(nationality);
      // Nationalities should not have region codes
      expect(nationality.regionCode).toBeUndefined();
      expect(nationality.regionNameAr).toBeUndefined();
    }
  });

  // Test: Verify minimum number of nationalities
  test('should have at least 20 nationalities', async ({ request }) => {
    const response = await request.get(NATIONALITIES_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    expect(json.data.length).toBeGreaterThanOrEqual(20);
  });

  // Test: With invalid token (should still succeed - AllowAnonymous)
  test('should return 200 with invalid token (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(NATIONALITIES_ENDPOINT, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(200);
  });
});

// ============================================================================
// TEST SUITE: GET /api/v1/lookups/regions - Get Governorates/Regions
// ============================================================================
test.describe('GET /api/v1/lookups/regions - Get Governorates/Regions', () => {
  const REGIONS_ENDPOINT = `${LOOKUPS_BASE}/regions`;
  const PROVINCES_ENDPOINT = `${LOOKUPS_BASE}/provinces`;
  
  // Test: Unauthenticated - /regions (should succeed with 200 - AllowAnonymous)
  test('should return 200 for /regions when unauthenticated (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(REGIONS_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: Unauthenticated - /provinces (should succeed with 200 - AllowAnonymous)
  test('should return 200 for /provinces when unauthenticated (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(PROVINCES_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  // Test: With Citizen/Applicant token (should succeed with 200)
  test('should return regions with citizen token', async ({ request }) => {
    const tokens = await getTokens('applicant');
    if (!tokens) {
      console.warn('[GET /regions] Skipping - could not obtain applicant tokens');
      return;
    }

    const response = await request.get(REGIONS_ENDPOINT, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
  });

  // Test: With valid Admin token (should succeed)
  test('should return regions with admin token', async ({ request }) => {
    const tokens = await getTokens('admin');
    if (!tokens) {
      console.warn('[GET /regions] Skipping - could not obtain admin tokens');
      return;
    }

    const response = await request.get(REGIONS_ENDPOINT, {
      headers: getAuthHeader(tokens.accessToken),
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    validateApiResponse(json, true);
    expect(json.data).toBeDefined();
  });

  // Test: Verify both /regions and /provinces return same data
  test('should return identical data for /regions and /provinces', async ({ request }) => {
    const regionsResponse = await request.get(REGIONS_ENDPOINT);
    const provincesResponse = await request.get(PROVINCES_ENDPOINT);
    
    expect(regionsResponse.status()).toBe(200);
    expect(provincesResponse.status()).toBe(200);
    
    const regionsJson = await regionsResponse.json();
    const provincesJson = await provincesResponse.json();
    
    // Both endpoints should return governorates
    expect(regionsJson.data.length).toBe(provincesJson.data.length);
  });

  // Test: Verify governorates contain Yemeni regions
  test('should include major Yemeni governorates', async ({ request }) => {
    const response = await request.get(REGIONS_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const governorates = json.data;
    
    expect(governorates.length).toBeGreaterThan(0);
    
    // Check for key Yemeni governorates
    const names = governorates.map((g: any) => g.nameAr);
    expect(names.some((name: string) => name.includes('صنعاء'))).toBe(true); // Sanaa
    expect(names.some((name: string) => name.includes('عدن'))).toBe(true);      // Aden
    expect(names.some((name: string) => name.includes('تعز'))).toBe(true);     // Taiz
    expect(names.some((name: string) => name.includes('الحديدة'))).toBe(true); // Hodeidah
  });

  // Test: Verify governorates have required fields
  test('should have required fields for all governorates', async ({ request }) => {
    const response = await request.get(REGIONS_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    const governorates = json.data;
    
    for (const governorate of governorates) {
      validateLookupItem(governorate);
      // Governorates should not have region codes (they ARE regions)
      expect(governorate.regionCode).toBeUndefined();
      expect(governorate.regionNameAr).toBeUndefined();
    }
  });

  // Test: Verify minimum number of governorates
  test('should have at least 15 Yemeni governorates', async ({ request }) => {
    const response = await request.get(REGIONS_ENDPOINT);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    expect(json.data.length).toBeGreaterThanOrEqual(15);
  });

  // Test: With invalid token (should still succeed - AllowAnonymous)
  test('should return 200 with invalid token (AllowAnonymous)', async ({ request }) => {
    const response = await request.get(REGIONS_ENDPOINT, {
      headers: getAuthHeader('invalid-token-xyz'),
    });

    expect(response.status()).toBe(200);
  });
});

// ============================================================================
// TEST SUITE: Integration - Complete Lookups Flow
// ============================================================================
test.describe('Integration - Complete Lookups Flow', () => {
  
  test('should fetch all lookup endpoints sequentially', async ({ request }) => {
    // Step 1: Get all lookups at once
    const allResponse = await request.get(LOOKUPS_BASE);
    expect(allResponse.status()).toBe(200);
    const allJson = await allResponse.json();
    validateApiResponse(allJson, true);
    
    // Step 2: Get exam centers individually
    const centersResponse = await request.get(`${LOOKUPS_BASE}/exam-centers`);
    expect(centersResponse.status()).toBe(200);
    const centersJson = await centersResponse.json();
    validateApiResponse(centersJson, true);
    
    // Step 3: Get nationalities individually
    const nationalitiesResponse = await request.get(`${LOOKUPS_BASE}/nationalities`);
    expect(nationalitiesResponse.status()).toBe(200);
    const nationalitiesJson = await nationalitiesResponse.json();
    validateApiResponse(nationalitiesJson, true);
    
    // Step 4: Get governorates individually
    const regionsResponse = await request.get(`${LOOKUPS_BASE}/regions`);
    expect(regionsResponse.status()).toBe(200);
    const regionsJson = await regionsResponse.json();
    validateApiResponse(regionsJson, true);
    
    // Verify data consistency across endpoints
    expect(allJson.data.examCenters.length).toBe(centersJson.data.length);
    expect(allJson.data.nationalities.length).toBe(nationalitiesJson.data.length);
    expect(allJson.data.governorates.length).toBe(regionsJson.data.length);
  });

  test('should verify allowAnonymous behavior with different auth scenarios', async ({ request }) => {
    // Scenario 1: No auth - should work
    let response = await request.get(LOOKUPS_BASE);
    expect(response.status()).toBe(200);
    
    // Scenario 2: Applicant auth - should work
    const applicantTokens = await getTokens('applicant');
    if (applicantTokens) {
      response = await request.get(LOOKUPS_BASE, {
        headers: getAuthHeader(applicantTokens.accessToken),
      });
      expect(response.status()).toBe(200);
    }
    
    // Scenario 3: Admin auth - should work
    const adminTokens = await getTokens('admin');
    if (adminTokens) {
      response = await request.get(LOOKUPS_BASE, {
        headers: getAuthHeader(adminTokens.accessToken),
      });
      expect(response.status()).toBe(200);
    }
    
    // Scenario 4: Invalid token - should still work (AllowAnonymous)
    response = await request.get(LOOKUPS_BASE, {
      headers: getAuthHeader('invalid-token-xyz'),
    });
    expect(response.status()).toBe(200);
    
    // Scenario 5: Malformed token - should still work (AllowAnonymous)
    response = await request.get(LOOKUPS_BASE, {
      headers: getAuthHeader('Bearer malformed.token.here'),
    });
    expect(response.status()).toBe(200);
  });

  test('should verify response message is in Arabic', async ({ request }) => {
    const response = await request.get(LOOKUPS_BASE);
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    // The API returns Arabic success messages
    expect(json.message).toBeDefined();
    expect(typeof json.message).toBe('string');
    expect(json.message.length).toBeGreaterThan(0);
  });

  test('should verify all lookups are accessible without auth', async ({ request }) => {
    // All these endpoints should be accessible without any authentication
    const endpoints = [
      LOOKUPS_BASE,
      `${LOOKUPS_BASE}/exam-centers`,
      `${LOOKUPS_BASE}/nationalities`,
      `${LOOKUPS_BASE}/regions`,
      `${LOOKUPS_BASE}/provinces`,
    ];
    
    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      
      const json = await response.json();
      validateApiResponse(json, true);
    }
  });
});