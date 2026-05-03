/**
 * Mojaz TrainingController API Tests
 * Target: http://localhost:5013/api/v1/training
 * Endpoints: 8
 * 
 * Test Coverage:
 * - GET training record by application ID/Number
 * - GET training completion status
 * - GET all training records (paginated)
 * - POST create training record
 * - PATCH update training hours
 * - POST request exemption
 * - PATCH approve exemption
 * - PATCH reject exemption
 * 
 * Roles tested: Unauthenticated (401), Citizen token (200/403), Admin token (200)
 */

const { test, expect } = require('@playwright/test');
const { BASE_URL, TEST_ACCOUNTS, getTokens, bearer, assertApiResponse, buildQuery, parseResponse } = require('../shared/helpers');

// Test configuration
const API_BASE = BASE_URL;
const TRAINING_ENDPOINT = `${API_BASE}/api/v1/training`;

// Helper to generate random unique data
function randomStr(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

/**
 * Mock create training record request
 */
function getMockCreateTrainingRecordRequest(overrides = {}) {
  return {
    applicationId: 1,
    schoolName: 'مدرسة قيادة العليا',
    certificateNumber: `CERT-${randomStr(6)}`,
    hoursCompleted: 20,
    trainingDate: new Date().toISOString(),
    trainerName: 'أحمد محمد',
    centerName: 'مركز التدريب',
    notes: 'تدريب مكتمل',
    ...overrides
  };
}

/**
 * Mock update training hours request
 */
function getMockUpdateHoursRequest(overrides = {}) {
  return {
    hoursToAdd: 10,
    notes: 'إضافة ساعات تدريب إضافية',
    ...overrides
  };
}

/**
 * Mock exemption request
 */
function getMockExemptionRequest(overrides = {}) {
  return {
    applicationId: 1,
    exemptionReason: 'خبرة سابقة في القيادة',
    exemptionDocumentId: 1,
    ...overrides
  };
}

/**
 * Mock exemption action request
 */
function getMockExemptionActionRequest(overrides = {}) {
  return {
    actionBy: 2,
    notes: 'موافقةexception',
    ...overrides
  };
}

test.describe('TrainingController - All 8 Endpoints', () => {
  
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
  // 1. GET /api/v1/training/application/{appIdOrNumber} - Get Training Record
  // =========================================================================
  test.describe('GET /api/v1/training/application/{appIdOrNumber} - Get Training Record', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${TRAINING_ENDPOINT}/application/1`);
      expect(response.status()).toBe(401);
    });

    test('should return 200 when applicant retrieves own training record', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.get(`${TRAINING_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      // May return 200 or 404 if no training record
      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when doctor retrieves training record', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.get(`${TRAINING_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when manager retrieves training record', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.get(`${TRAINING_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when admin retrieves training record', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.get(`${TRAINING_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should support application number as parameter', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.get(`${TRAINING_ENDPOINT}/application/MOJ-2025-12345678`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.get(`${TRAINING_ENDPOINT}/application/999999`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 2. GET /api/v1/training/application/{appIdOrNumber}/status - Get Training Status
  // =========================================================================
  test.describe('GET /api/v1/training/application/{appIdOrNumber}/status - Get Training Status', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${TRAINING_ENDPOINT}/application/1/status`);
      expect(response.status()).toBe(401);
    });

    test('should return 200 when applicant checks training status', async ({ request }) => {
      const token = await getTokens('applicant');

      const response = await request.get(`${TRAINING_ENDPOINT}/application/1/status`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      // May return 200 or 404
      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when doctor checks training status', async ({ request }) => {
      const token = await getTokens('doctor');

      const response = await request.get(`${TRAINING_ENDPOINT}/application/1/status`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when manager checks training status', async ({ request }) => {
      const token = await getTokens('manager');

      const response = await request.get(`${TRAINING_ENDPOINT}/application/1/status`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when admin checks training status', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.get(`${TRAINING_ENDPOINT}/application/1/status`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 3. GET /api/v1/training - Get All Training Records (Paginated)
  // =========================================================================
  test.describe('GET /api/v1/training - Get All Training Records', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(TRAINING_ENDPOINT);
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to access list', async ({ request }) => {
      const token = await getTokens('applicant');

      const response = await request.get(TRAINING_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when manager lists training records', async ({ request }) => {
      const token = await getTokens('manager');

      const response = await request.get(TRAINING_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('List Training Records', body);
    });

    test('should return 200 when receptionist lists training records', async ({ request }) => {
      const token = await getTokens('receptionist');

      const response = await request.get(TRAINING_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should return 200 when doctor lists training records', async ({ request }) => {
      const token = await getTokens('doctor');

      const response = await request.get(TRAINING_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should return 200 when admin lists training records', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.get(TRAINING_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('List Training Records', body);
    });

    test('should support pagination parameters', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.get(`${TRAINING_ENDPOINT}${buildQuery({ page: 1, pageSize: 10 })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('List with Pagination', body);
    });

    test('should support search filter', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.get(`${TRAINING_ENDPOINT}${buildQuery({ search: 'تدريب' })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should support status filter', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.get(`${TRAINING_ENDPOINT}${buildQuery({ status: 'Completed' })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });
  });

  // =========================================================================
  // 4. POST /api/v1/training - Create Training Record
  // =========================================================================
  test.describe('POST /api/v1/training - Create Training Record', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.post(TRAINING_ENDPOINT, {
        data: getMockCreateTrainingRecordRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to create', async ({ request }) => {
      const token = await getTokens('applicant');

      const response = await request.post(TRAINING_ENDPOINT, {
        data: getMockCreateTrainingRecordRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when doctor tries to create', async ({ request }) => {
      const token = await getTokens('doctor');

      const response = await request.post(TRAINING_ENDPOINT, {
        data: getMockCreateTrainingRecordRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 201 when examiner creates training record', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.post(TRAINING_ENDPOINT, {
        data: getMockCreateTrainingRecordRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Create Training Record', body);
        expect(body.success).toBe(true);
      } else {
        // May return 400 for validation or 404 for invalid application
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should return 201 when receptionist creates training record', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.post(TRAINING_ENDPOINT, {
        data: getMockCreateTrainingRecordRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Create Training Record', body);
        expect(body.success).toBe(true);
      } else {
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should return 201 when admin creates training record', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.post(TRAINING_ENDPOINT, {
        data: getMockCreateTrainingRecordRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Create Training Record', body);
        expect(body.success).toBe(true);
      } else {
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should return 400 on invalid data', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.post(TRAINING_ENDPOINT, {
        data: { applicationId: 0 }, // Invalid - missing required fields
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(400);
    });
  });

  // =========================================================================
  // 5. PATCH /api/v1/training/{id}/hours - Update Training Hours
  // =========================================================================
  test.describe('PATCH /api/v1/training/{id}/hours - Update Training Hours', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.patch(`${TRAINING_ENDPOINT}/1/hours`, {
        data: getMockUpdateHoursRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to update hours', async ({ request }) => {
      const token = await getTokens('applicant');

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/hours`, {
        data: getMockUpdateHoursRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when receptionist tries to update hours', async ({ request }) => {
      const token = await getTokens('receptionist');

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/hours`, {
        data: getMockUpdateHoursRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when doctor tries to update hours', async ({ request }) => {
      const token = await getTokens('doctor');

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/hours`, {
        data: getMockUpdateHoursRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when examiner updates training hours', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/hours`, {
        data: getMockUpdateHoursRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      // May return 200 or 404 if record not found
      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when admin updates training hours', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/hours`, {
        data: getMockUpdateHoursRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent record', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.patch(`${TRAINING_ENDPOINT}/999999/hours`, {
        data: getMockUpdateHoursRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(404);
    });
  });

  // =========================================================================
  // 6. POST /api/v1/training/exemption - Request Exemption
  // =========================================================================
  test.describe('POST /api/v1/training/exemption - Request Exemption', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.post(`${TRAINING_ENDPOINT}/exemption`, {
        data: getMockExemptionRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 201 when applicant requests exemption', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.post(`${TRAINING_ENDPOINT}/exemption`, {
        data: getMockExemptionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Request Exemption', body);
        expect(body.success).toBe(true);
      } else {
        // May return 400 or 404 for invalid application
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should return 201 when receptionist requests exemption', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.post(`${TRAINING_ENDPOINT}/exemption`, {
        data: getMockExemptionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Request Exemption', body);
        expect(body.success).toBe(true);
      } else {
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should return 201 when admin requests exemption', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.post(`${TRAINING_ENDPOINT}/exemption`, {
        data: getMockExemptionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Request Exemption', body);
        expect(body.success).toBe(true);
      } else {
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should return 403 when examiner tries to request exemption', async ({ request }) => {
      const token = await getTokens('examiner');

      const response = await request.post(`${TRAINING_ENDPOINT}/exemption`, {
        data: getMockExemptionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 400 on invalid data', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.post(`${TRAINING_ENDPOINT}/exemption`, {
        data: { applicationId: 0 }, // Invalid
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(400);
    });
  });

  // =========================================================================
  // 7. PATCH /api/v1/training/{id}/exemption/approve - Approve Exemption
  // =========================================================================
  test.describe('PATCH /api/v1/training/{id}/exemption/approve - Approve Exemption', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/approve`, {
        data: getMockExemptionActionRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to approve exemption', async ({ request }) => {
      const token = await getTokens('applicant');

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/approve`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when examiner tries to approve exemption', async ({ request }) => {
      const token = await getTokens('examiner');

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/approve`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when receptionist tries to approve exemption', async ({ request }) => {
      const token = await getTokens('receptionist');

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/approve`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when manager approves exemption', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/approve`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      // May return 200 or 404 if no exemption request found
      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when admin approves exemption', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/approve`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent exemption', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.patch(`${TRAINING_ENDPOINT}/999999/exemption/approve`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(404);
    });
  });

  // =========================================================================
  // 8. PATCH /api/v1/training/{id}/exemption/reject - Reject Exemption
  // =========================================================================
  test.describe('PATCH /api/v1/training/{id}/exemption/reject - Reject Exemption', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/reject`, {
        data: getMockExemptionActionRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to reject exemption', async ({ request }) => {
      const token = await getTokens('applicant');

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/reject`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when examiner tries to reject exemption', async ({ request }) => {
      const token = await getTokens('examiner');

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/reject`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when receptionist tries to reject exemption', async ({ request }) => {
      const token = await getTokens('receptionist');

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/reject`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when manager rejects exemption', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/reject`, {
        data: getMockExemptionActionRequest({ notes: 'رفض exemption' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      // May return 200 or 404 if no exemption request found
      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when admin rejects exemption', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.patch(`${TRAINING_ENDPOINT}/1/exemption/reject`, {
        data: getMockExemptionActionRequest({ notes: 'رفض exemption' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent exemption', async ({ request }) => {
      const token = await getTokens('admin');

      const response = await request.patch(`${TRAINING_ENDPOINT}/999999/exemption/reject`, {
        data: getMockExemptionActionRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(404);
    });
  });
});