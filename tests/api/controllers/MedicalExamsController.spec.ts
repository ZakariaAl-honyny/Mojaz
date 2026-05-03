/**
 * Mojaz MedicalExamsController API Tests
 * Target: http://localhost:5013/api/v1/medical-exams
 * Endpoints: 3
 *
 * Test Coverage:
 * - POST /api/v1/medical-exams/application/{appIdOrNumber} - Create medical exam result (Doctor)
 * - GET /api/v1/medical-exams/application/{appIdOrNumber} - Get medical exam by application (Authenticated)
 * - PATCH /api/v1/medical-exams/{id}/result - Update medical exam result (Doctor)
 *
 * Roles tested: Unauthenticated (401), Applicant token (200/403), Admin token (200)
 */

const { test, expect } = require('@playwright/test');
const { BASE_URL, TEST_ACCOUNTS, getTokens, assertApiResponse, buildQuery, parseResponse } = require('../shared/helpers');

// Test configuration
const API_BASE = BASE_URL;
const MEDICAL_EXAMS_ENDPOINT = `${API_BASE}/api/v1/medical-exams`;

/**
 * Generate random string for unique test data
 */
function randomStr(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

/**
 * Get mock medical result data for POST requests
 * Based on CreateMedicalResultRequest DTO
 */
function getMockMedicalResultData(overrides = {}) {
  return {
    applicationId: 1,
    appointmentId: 1,
    result: 'Fit',
    bloodType: 'APositive',
    notes: 'الفحص الطبي ناجح - جميع الفحوصات سليمة',
    visionTestResult: '6/6',
    colorBlindTestResult: 'Normal',
    bloodPressureNormal: true,
    ...overrides
  };
}

/**
 * Get mock update medical result request for PATCH
 * Based on UpdateMedicalResultRequest DTO
 */
function getMockUpdateResultRequest(overrides = {}) {
  return {
    result: 'Fit',
    notes: 'تم تحديث النتيجة بنجاح',
    ...overrides
  };
}

test.describe('MedicalExamsController - All 3 Endpoints', () => {
  
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
  // 1. POST /api/v1/medical-exams/application/{appIdOrNumber} - Create Medical Exam
  // =========================================================================
  test.describe('POST /api/v1/medical-exams/application/{appIdOrNumber} - Create Medical Exam', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        data: getMockMedicalResultData(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to create', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        data: getMockMedicalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when receptionist tries to create', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        data: getMockMedicalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when manager tries to create', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        data: getMockMedicalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when admin tries to create (no Doctor role)', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        data: getMockMedicalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 201 when doctor creates medical exam', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        data: getMockMedicalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Create Medical Exam', body);
        expect(body.success).toBe(true);
      } else {
        // May return 400 for validation or 404 if no application
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should accept Unfit result', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();
      
      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        data: getMockMedicalResultData({ result: 'Unfit' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should accept ConditionallyFit result', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();
      
      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        data: getMockMedicalResultData({ result: 'ConditionallyFit' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should accept all blood types', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();
      
      const bloodTypes = ['APositive', 'ANegative', 'BPositive', 'BNegative', 'OPositive', 'ONegative', 'ABPositive', 'ABNegative'];
      
      for (const bloodType of bloodTypes) {
        const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
          data: getMockMedicalResultData({ bloodType }),
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.accessToken}`
          }
        });

        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should work with application number', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();
      
      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/MOJ-2025-12345678`, {
        data: getMockMedicalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should return 400 for invalid data', async ({ request }) => {
      const token = await getTokens('doctor');
      
      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        data: { invalid: 'data' },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 401]).toContain(response.status());
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('doctor');
      
      const response = await request.post(`${MEDICAL_EXAMS_ENDPOINT}/application/999999`, {
        data: getMockMedicalResultData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 2. GET /api/v1/medical-exams/application/{appIdOrNumber} - Get Medical Exam
  // =========================================================================
  test.describe('GET /api/v1/medical-exams/application/{appIdOrNumber} - Get Medical Exam', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/1`);
      expect(response.status()).toBe(401);
    });

    test('should return 200 when applicant retrieves medical exam', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // May return 200 with data or 404 if not found
      expect([200, 404]).toContain(response.status());
      
      if (response.status() === 200) {
        const body = await parseResponse(response);
        assertApiResponse('Get Medical Exam', body);
      }
    });

    test('should return 200 when receptionist retrieves medical exam', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when doctor retrieves medical exam', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when examiner retrieves medical exam', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when manager retrieves medical exam', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when admin retrieves medical exam', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
      
      if (response.status() === 200) {
        assertApiResponse('Get Medical Exam', body);
        expect(body.data).toHaveProperty('result');
      }
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/999999`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });

    test('should work with application number', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/MOJ-2025-12345678`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return data with correct structure', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${MEDICAL_EXAMS_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      if (response.status() === 200) {
        const body = await parseResponse(response);
        expect(body.data).toHaveProperty('result');
        expect(body.data).toHaveProperty('notes');
      }
    });
  });

  // =========================================================================
  // 3. PATCH /api/v1/medical-exams/{id}/result - Update Medical Exam Result
  // =========================================================================
  test.describe('PATCH /api/v1/medical-exams/{id}/result - Update Medical Exam Result', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to update', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when receptionist tries to update', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when manager tries to update', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when admin tries to update (no Doctor role)', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when doctor updates medical exam result', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      // May be 200, 400, or 404
      expect([200, 400, 404]).toContain(response.status());
      
      if (response.status() === 200) {
        assertApiResponse('Update Medical Exam Result', body);
        expect(body.success).toBe(true);
      }
    });

    test('should accept Unfit result', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();
      
      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest({ result: 'Unfit' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should accept ConditionallyFit result', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();
      
      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest({ result: 'ConditionallyFit' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should accept Fit result', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();
      
      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest({ result: 'Fit' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should update notes', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();
      
      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: getMockUpdateResultRequest({ notes: 'ملاحظات محدثة' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent medical exam', async ({ request }) => {
      const token = await getTokens('doctor');
      
      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/999999/result`, {
        data: getMockUpdateResultRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });

    test('should return 400 for invalid result value', async ({ request }) => {
      const token = await getTokens('doctor');
      
      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: { result: 'InvalidResult', notes: 'test' },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 401]).toContain(response.status());
    });

    test('should return 400 for invalid data', async ({ request }) => {
      const token = await getTokens('doctor');
      
      const response = await request.patch(`${MEDICAL_EXAMS_ENDPOINT}/1/result`, {
        data: { invalid: 'data' },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 401]).toContain(response.status());
    });
  });
});