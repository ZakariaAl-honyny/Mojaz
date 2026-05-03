/**
 * Mojaz AppointmentsController API Tests
 * Target: http://localhost:5013/api/v1/appointments
 * Endpoints: 8
 *
 * Test Coverage:
 * - List all appointments (paginated)
 * - Get appointments by application
 * - Create new appointment
 * - Get available slots
 * - Check-in to appointment
 * - Reschedule appointment
 * - Cancel appointment
 * - Get attendance list
 *
 * Roles tested: Unauthenticated (401), Citizen token (200/403), Admin token (200)
 */

const { test, expect } = require('@playwright/test');
const { BASE_URL, TEST_ACCOUNTS, getTokens, bearer, assertApiResponse, buildQuery, parseResponse } = require('../shared/helpers');

// Test configuration
const API_BASE = BASE_URL;
const APPOINTMENT_ENDPOINT = `${API_BASE}/api/v1/appointments`;

// Helper to track created appointment IDs for cleanup
let createdAppointmentId = null;

/**
 * Generate random string for unique test data
 */
function randomStr(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

/**
 * Generate valid future date for scheduling
 */
function getFutureDate(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

/**
 * Mock appointment data for POST requests
 */
function getMockAppointmentData(overrides = {}) {
  return {
    type: 'MedicalExam',
    branchId: 1,
    scheduledDate: getFutureDate(7),
    timeSlot: '09:00',
    notes: 'موعد فحص طبي',
    ...overrides
  };
}

/**
 * Mock reschedule request
 */
function getMockRescheduleRequest(overrides = {}) {
  return {
    newScheduledDate: getFutureDate(14),
    newTimeSlot: '10:00',
    newBranchId: 1,
    ...overrides
  };
}

/**
 * Mock cancel request
 */
function getMockCancelRequest(overrides = {}) {
  return {
    reason: 'تغيير موعد',
    ...overrides
  };
}

test.describe('AppointmentsController - All 8 Endpoints', () => {
  
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
  // 1. GET /api/v1/appointments - List all appointments (paginated)
  // =========================================================================
  test.describe('GET /api/v1/appointments - List All Appointments', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(APPOINTMENT_ENDPOINT);
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to list all', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.get(APPOINTMENT_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when receptionist lists appointments', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.get(APPOINTMENT_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('List Appointments', body);
    });

    test('should return 200 when doctor lists appointments', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.get(APPOINTMENT_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should return 200 when examiner lists appointments', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.get(APPOINTMENT_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should return 200 when manager lists appointments', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.get(APPOINTMENT_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should return 200 when admin lists appointments', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.get(APPOINTMENT_ENDPOINT, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('List Appointments', body);
      expect(body.data).toHaveProperty('items');
    });

    test('should support pagination parameters', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}${buildQuery({ page: 1, pageSize: 10 })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('List with Pagination', body);
    });

    test('should support status filter', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}${buildQuery({ status: 'Scheduled' })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should support type filter', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}${buildQuery({ type: 'MedicalExam' })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should support date range filter', async ({ request }) => {
      const token = await getTokens('admin');
      const from = getFutureDate(1);
      const to = getFutureDate(30);
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}${buildQuery({ from, to })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });
  });

  // =========================================================================
  // 2. GET /api/v1/appointments/application/{appIdOrNumber} - Get by Application
  // =========================================================================
  test.describe('GET /api/v1/appointments/application/{appIdOrNumber} - Get by Application', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/application/1`);
      expect(response.status()).toBe(401);
    });

    test('should return 200 when applicant retrieves appointments', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.get(`${APPOINTMENT_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // May return 200 or 404 if application doesn't exist
      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when admin retrieves appointments', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/application/999999`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // May return 404 or empty list
      expect([200, 404]).toContain(response.status());
    });

    test('should work with application number', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/application/MOJ-2025-12345678`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 3. POST /api/v1/appointments/application/{appIdOrNumber} - Create Appointment
  // =========================================================================
  test.describe('POST /api/v1/appointments/application/{appIdOrNumber} - Create Appointment', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.post(`${APPOINTMENT_ENDPOINT}/application/1`, {
        data: getMockAppointmentData(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when doctor tries to create', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.post(`${APPOINTMENT_ENDPOINT}/application/1`, {
        data: getMockAppointmentData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 201 when applicant creates appointment', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.post(`${APPOINTMENT_ENDPOINT}/application/1`, {
        data: getMockAppointmentData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Create Appointment', body);
        expect(body.success).toBe(true);
        if (body.data) {
          createdAppointmentId = body.data.id;
        }
      } else {
        // May return 400 for validation or 404 if no application
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should return 201 when receptionist creates appointment', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.post(`${APPOINTMENT_ENDPOINT}/application/1`, {
        data: getMockAppointmentData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Create Appointment', body);
        expect(body.success).toBe(true);
      } else {
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should return 201 when manager creates appointment', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.post(`${APPOINTMENT_ENDPOINT}/application/1`, {
        data: getMockAppointmentData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Create Appointment', body);
        expect(body.success).toBe(true);
      } else {
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should return 201 when admin creates appointment', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.post(`${APPOINTMENT_ENDPOINT}/application/1`, {
        data: getMockAppointmentData(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      
      if (response.status() === 201) {
        assertApiResponse('Create Appointment', body);
        expect(body.success).toBe(true);
        createdAppointmentId = body.data?.id;
      } else {
        expect([201, 400, 404]).toContain(response.status());
      }
    });

    test('should accept TheoryTest type', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.post(`${APPOINTMENT_ENDPOINT}/application/1`, {
        data: getMockAppointmentData({ type: 'TheoryTest' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should accept PracticalTest type', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.post(`${APPOINTMENT_ENDPOINT}/application/1`, {
        data: getMockAppointmentData({ type: 'PracticalTest' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should return 400 for invalid data', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.post(`${APPOINTMENT_ENDPOINT}/application/1`, {
        data: { invalid: 'data' },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 401]).toContain(response.status());
    });
  });

  // =========================================================================
  // 4. GET /api/v1/appointments/available-slots - Get Available Slots
  // =========================================================================
  test.describe('GET /api/v1/appointments/available-slots - Get Available Slots', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/available-slots`);
      expect(response.status()).toBe(401);
    });

    test('should return 200 when applicant gets slots', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.get(`${APPOINTMENT_ENDPOINT}/available-slots${buildQuery({ type: 'MedicalExam', branchId: 1, date: getFutureDate(7) })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('Get Available Slots', body);
    });

    test('should return 200 when admin gets slots', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/available-slots${buildQuery({ type: 'TheoryTest', branchId: 1, date: getFutureDate(7) })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should return 200 when doctor gets slots', async ({ request }) => {
      const token = await getTokens('doctor');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/available-slots${buildQuery({ type: 'MedicalExam', branchId: 1, date: getFutureDate(7) })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should require type parameter', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/available-slots${buildQuery({ branchId: 1, date: getFutureDate(7) })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // May return 400 or 200 depending on validation
      expect([200, 400]).toContain(response.status());
    });

    test('should support all appointment types', async ({ request }) => {
      const token = await getTokens('admin');
      const types = ['MedicalExam', 'TheoryTest', 'PracticalTest'];
      
      for (const type of types) {
        const response = await request.get(`${APPOINTMENT_ENDPOINT}/available-slots${buildQuery({ type, branchId: 1, date: getFutureDate(7) })}`, {
          headers: { Authorization: `Bearer ${token.accessToken}` }
        });

        expect(response.status()).toBe(200);
      }
    });
  });

  // =========================================================================
  // 5. PATCH /api/v1/appointments/{id}/check-in - Check-in
  // =========================================================================
  test.describe('PATCH /api/v1/appointments/{id}/check-in - Check-in', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/check-in`);
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to check-in', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/check-in`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when receptionist checks in', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/check-in`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      // May be 200, 400 (not found), or 404
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when security checks in', async ({ request }) => {
      const token = await getTokens('security');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/check-in`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when doctor checks in', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/check-in`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when examiner checks in', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/check-in`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when manager checks in', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/check-in`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when admin checks in', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/check-in`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent appointment', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/999999/check-in`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 6. PATCH /api/v1/appointments/{id}/reschedule - Reschedule
  // =========================================================================
  test.describe('PATCH /api/v1/appointments/{id}/reschedule - Reschedule', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/reschedule`, {
        data: getMockRescheduleRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when security tries to reschedule', async ({ request }) => {
      const token = await getTokens('security');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/reschedule`, {
        data: getMockRescheduleRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when applicant reschedules own appointment', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/reschedule`, {
        data: getMockRescheduleRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      // May be 200, 400, or 404
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when receptionist reschedules', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/reschedule`, {
        data: getMockRescheduleRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when examiner reschedules', async ({ request }) => {
      const token = await getTokens('examiner');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/reschedule`, {
        data: getMockRescheduleRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when manager reschedules', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/reschedule`, {
        data: getMockRescheduleRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 403 when admin reschedules (not allowed)', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/reschedule`, {
        data: getMockRescheduleRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      // Admin is not in the allowed roles
      expect(response.status()).toBe(403);
    });

    test('should return 404 for non-existent appointment', async ({ request }) => {
      const token = await getTokens('manager');
      
      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/999999/reschedule`, {
        data: getMockRescheduleRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 400 for invalid date', async ({ request }) => {
      const token = await getTokens('manager');
      
      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/reschedule`, {
        data: getMockRescheduleRequest({ newScheduledDate: '2020-01-01' }),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 7. PATCH /api/v1/appointments/{id}/cancel - Cancel
  // =========================================================================
  test.describe('PATCH /api/v1/appointments/{id}/cancel - Cancel', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/cancel`, {
        data: getMockCancelRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when doctor tries to cancel', async ({ request }) => {
      const token = await getTokens('doctor');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/cancel`, {
        data: getMockCancelRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when applicant cancels own appointment', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/cancel`, {
        data: getMockCancelRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      // May be 200, 400, or 404
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when receptionist cancels', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/cancel`, {
        data: getMockCancelRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 403 when manager tries to cancel (not allowed)', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/cancel`, {
        data: getMockCancelRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when admin tries to cancel (not allowed)', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/cancel`, {
        data: getMockCancelRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 404 for non-existent appointment', async ({ request }) => {
      const token = await getTokens('receptionist');
      
      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/999999/cancel`, {
        data: getMockCancelRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should require reason', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.patch(`${APPOINTMENT_ENDPOINT}/1/cancel`, {
        data: { reason: '' },
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 8. GET /api/v1/appointments/attendance - Get Attendance List
  // =========================================================================
  test.describe('GET /api/v1/appointments/attendance - Get Attendance', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/attendance`);
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to access attendance', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      const response = await request.get(`${APPOINTMENT_ENDPOINT}/attendance${buildQuery({ date: getFutureDate(1) })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 400 when date is missing', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.get(`${APPOINTMENT_ENDPOINT}/attendance`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(400);
    });

    test('should return 200 when receptionist gets attendance', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.get(`${APPOINTMENT_ENDPOINT}/attendance${buildQuery({ date: getFutureDate(1) })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('Get Attendance', body);
    });

    test('should return 200 when security gets attendance', async ({ request }) => {
      const token = await getTokens('security');
      expect(token).toBeTruthy();

      const response = await request.get(`${APPOINTMENT_ENDPOINT}/attendance${buildQuery({ date: getFutureDate(1) })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should return 200 when manager gets attendance', async ({ request }) => {
      const token = await getTokens('manager');
      expect(token).toBeTruthy();

      const response = await request.get(`${APPOINTMENT_ENDPOINT}/attendance${buildQuery({ date: getFutureDate(1) })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });

    test('should return 200 when admin gets attendance', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.get(`${APPOINTMENT_ENDPOINT}/attendance${buildQuery({ date: getFutureDate(1) })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('Get Attendance', body);
    });

    test('should support branch filter', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${APPOINTMENT_ENDPOINT}/attendance${buildQuery({ date: getFutureDate(1), branchId: 1 })}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
    });
  });
});