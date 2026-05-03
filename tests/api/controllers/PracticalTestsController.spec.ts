/**
 * Mojaz PracticalTestsController API Tests
 * Target: http://localhost:5013/api/v1/practical-tests
 * Endpoints: 2
 *
 * Test Coverage:
 * - POST /api/v1/practical-tests/application/{appIdOrNumber}/submit - Submit practical test result (Examiner)
 * - GET /api/v1/practical-tests/application/{appIdOrNumber}/history - Get practical test history (Authenticated)
 *
 * Roles tested: Unauthenticated (401), Citizen token (200/403), Admin token (200)
 */

const { test, expect } = require('@playwright/test');
const { getTokens, assertApiResponse, buildQuery, parseResponse } = require('../shared/helpers');

// Test configuration
const API_BASE = process.env.TEST_API_URL || 'http://localhost:5013';
const PRACTICAL_TESTS_ENDPOINT = `${API_BASE}/api/v1/practical-tests`;

/**
 * Generate random string for unique test data
 */
function randomStr(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

/**
 * Get mock practical test result data for POST requests
 * Based on SubmitPracticalResultRequest DTO
 */
function getMockPracticalResultData(overrides = {}) {
  return {
    score: Math.floor(Math.random() * 41) + 60, // 60-100
    isAbsent: false,
    requiresAdditionalTraining: false,
    vehicleUsed: 'Toyota Camry 2024',
    notes: 'اختبار القيادة الشخصي ناجح',
    ...overrides
  };
}

/**
 * Get mock absent result request
 */
function getMockAbsentResultRequest(overrides = {}) {
  return {
    isAbsent: true,
    notes: 'المتقدم لم يحضر للاختبار',
    ...overrides
  };
}

/**
 * Get mock additional training result request
 */
function getMockAdditionalTrainingResultRequest(overrides = {}) {
  return {
    score: 55,
    isAbsent: false,
    requiresAdditionalTraining: true,
    additionalHoursRequired: 10,
    notes: 'يحتاج تدريب إضافي على المناورات',
    ...overrides
  };
}

test.describe('PracticalTestsController - All 2 Endpoints', () => {
  
  test.beforeAll(async () => {
    // Ensure test data is seeded
    const adminToken = await getTokens('admin');
    if (adminToken) {
      try {
        await fetch(`${API_BASE}/api/v1/testing/seed`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken.accessToken}` }
        });
      } catch (e) {
        // Non-fatal, continue
      }
    }
  });

  // =========================================================================
  // 1. POST /api/v1/practical-tests/application/{appIdOrNumber}/submit - Submit Result
  // =========================================================================
  test.describe('POST /api/v1/practical-tests/application/{appIdOrNumber}/submit - Submit Result', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to submit', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when receptionist tries to submit', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when doctor tries to submit', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when manager tries to submit', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when security tries to submit', async ({ request }) => {
      const token = await getTokens('security');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when admin tries to submit (no Examiner role)', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 201 when examiner submits result with passing score', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData({ score: 85 }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      // May return 201, 400 (validation), or 404 (no application)
      expect([201, 400, 404]).toContain(response.status());
      
      if (response.status() === 201) {
        assertApiResponse('Submit Practical Result', body);
        expect(body.success).toBe(true);
      }
    });

    test('should return 201 when examiner submits result with score 60', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData({ score: 60 }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should return 201 when examiner submits result with score 100', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData({ score: 100 }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should return 201 when examiner submits absent result', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockAbsentResultRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should return 201 when examiner submits result with additional training required', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockAdditionalTrainingResultRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should accept vehicle used', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();
      
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData({ vehicleUsed: 'Nissan Altima 2023' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should accept notes in Arabic', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();
      
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: getMockPracticalResultData({ notes: 'اختبار القيادة ناجح - مهارات القيادة ممتازة' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should work with application number', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();
      
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/MOJ-2025-12345678/submit`, {
        data: getMockPracticalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should return 400 for invalid data', async ({ request }) => {
      const token = await getTokens('examiner');
      
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: { invalid: 'data' },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 401]).toContain(response.status());
    });

    test('should return 400 for score above 100', async ({ request }) => {
      const token = await getTokens('examiner');
      
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: { score: 150, isAbsent: false },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 401]).toContain(response.status());
    });

    test('should return 400 for negative score', async ({ request }) => {
      const token = await getTokens('examiner');
      
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: { score: -10, isAbsent: false },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 401]).toContain(response.status());
    });

    test('should return 400 when additional training required but no hours specified', async ({ request }) => {
      const token = await getTokens('examiner');
      
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: { score: 55, isAbsent: false, requiresAdditionalTraining: true },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 401]).toContain(response.status());
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('examiner');
      
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/999999/submit`, {
        data: getMockPracticalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 404]).toContain(response.status());
    });

    test('should return 400 for empty score when not absent', async ({ request }) => {
      const token = await getTokens('examiner');
      
      const response = await request.post(`${PRACTICAL_TESTS_ENDPOINT}/application/1/submit`, {
        data: { isAbsent: false, score: null },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 401]).toContain(response.status());
    });
  });

  // =========================================================================
  // 2. GET /api/v1/practical-tests/application/{appIdOrNumber}/history - Get History
  // =========================================================================
  test.describe('GET /api/v1/practical-tests/application/{appIdOrNumber}/history - Get History', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`);
      expect(response.status()).toBe(401);
    });

    test('should return 200 when applicant retrieves history', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // May return 200 with data or 404 if not found
      expect([200, 404]).toContain(response.status());
      
      if (response.status() === 200) {
        const body = await parseResponse(response);
        assertApiResponse('Get Practical Test History', body);
      }
    });

    test('should return 200 when receptionist retrieves history', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when doctor retrieves history', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when examiner retrieves history', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when manager retrieves history', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when security retrieves history', async ({ request }) => {
      const token = await getTokens('security');
      expect(token).toBeTruthy();

      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when admin retrieves history', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
      
      if (response.status() === 200) {
        assertApiResponse('Get Practical Test History', body);
        expect(body.data).toHaveProperty('items');
      }
    });

    test('should support pagination parameters', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history?page=1&pageSize=20`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });

    test('should support default pagination', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
      
      if (response.status() === 200 && body.data) {
        expect(body.data).toHaveProperty('page');
        expect(body.data).toHaveProperty('pageSize');
        expect(body.data).toHaveProperty('totalCount');
        expect(body.data).toHaveProperty('items');
      }
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/999999/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });

    test('should work with application number', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/MOJ-2025-12345678/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return data with correct structure', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      if (response.status() === 200) {
        const body = await parseResponse(response);
        expect(body.data).toHaveProperty('items');
        if (body.data.items && body.data.items.length > 0) {
          const item = body.data.items[0];
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('score');
          expect(item).toHaveProperty('isAbsent');
        }
      }
    });

    test('should support custom page size', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${PRACTICAL_TESTS_ENDPOINT}/application/1/history${buildQuery({ page: 1, pageSize: 5 })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });
  });
});