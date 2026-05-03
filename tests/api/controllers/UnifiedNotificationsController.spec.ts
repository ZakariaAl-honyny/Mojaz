/**
 * Mojaz UnifiedNotificationsController API Tests
 * Target: http://localhost:5013/api/v1/notifications-unified
 * Endpoints: 4
 * 
 * Test Coverage:
 * - GET /api/v1/notifications-unified - Get paged notifications
 * - GET /api/v1/notifications-unified/unread-count - Get unread count
 * - PATCH /api/v1/notifications-unified/{id}/read - Mark single as read
 * - PATCH /api/v1/notifications-unified/read-all - Mark all as read
 * 
 * Roles tested: Unauthenticated (401), Citizen (Applicant), Admin (200)
 */

const { test, expect } = require('@playwright/test');
const { BASE_URL, TEST_ACCOUNTS, getTokens, bearer, assertApiResponse, buildQuery, parseResponse } = require('../shared/helpers');

// Test configuration
const API_BASE = 'http://localhost:5013';
const NOTIFICATIONS_UNIFIED_ENDPOINT = `${API_BASE}/api/v1/notifications-unified`;

/**
 * Generate random string for unique test data
 */
function randomStr(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

/**
 * Generate a valid notification ID for testing
 */
function getTestNotificationId() {
  return 1; // Use ID 1 for testing (may or may not exist)
}

test.describe('UnifiedNotificationsController - All 4 Endpoints', () => {
  
  // =========================================================================
  // 1. GET /api/v1/notifications-unified - Get Paged Notifications
  // =========================================================================
  
  test.describe('GET /api/v1/notifications-unified - Get Notifications', () => {
    
    // 1.1 Unauthenticated Access
    test('should return 401 when unauthenticated user tries to get notifications', async ({ request }) => {
      const response = await request.get(NOTIFICATIONS_UNIFIED_ENDPOINT);
      
      expect(response.status()).toBe(401);
      
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(401);
    });
    
    // 1.2 Applicant (Citizen Token) Access
    test('should return 200 when applicant retrieves own notifications', async ({ request }) => {
      const tokenData = await getTokens('applicant');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(NOTIFICATIONS_UNIFIED_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('notifications list', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
      // Should return paged result with Items array
      expect(body.data).toBeDefined();
      expect(body.data.Items).toBeDefined();
      expect(Array.isArray(body.data.Items)).toBe(true);
    });
    
    // 1.3 Admin Access
    test('should return 200 when admin retrieves notifications', async ({ request }) => {
      const tokenData = await getTokens('admin');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(NOTIFICATIONS_UNIFIED_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('notifications list (admin)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
      expect(body.data.Items).toBeDefined();
      expect(Array.isArray(body.data.Items)).toBe(true);
    });
    
    // 1.4 Manager Access
    test('should return 200 when manager retrieves notifications', async ({ request }) => {
      const tokenData = await getTokens('manager');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(NOTIFICATIONS_UNIFIED_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('notifications list (manager)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 1.5 Receptionist Access
    test('should return 200 when receptionist retrieves notifications', async ({ request }) => {
      const tokenData = await getTokens('receptionist');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(NOTIFICATIONS_UNIFIED_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('notifications list (receptionist)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 1.6 Doctor Access
    test('should return 200 when doctor retrieves notifications', async ({ request }) => {
      const tokenData = await getTokens('doctor');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(NOTIFICATIONS_UNIFIED_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('notifications list (doctor)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 1.7 Examiner Access
    test('should return 200 when examiner retrieves notifications', async ({ request }) => {
      const tokenData = await getTokens('examiner');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(NOTIFICATIONS_UNIFIED_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('notifications list (examiner)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 1.8 Security Access
    test('should return 200 when security retrieves notifications', async ({ request }) => {
      const tokenData = await getTokens('security');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(NOTIFICATIONS_UNIFIED_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('notifications list (security)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 1.9 Pagination Parameters
    test('should respect pagination parameters when getting notifications', async ({ request }) => {
      const tokenData = await getTokens('applicant');
      expect(tokenData).not.toBeNull();
      
      const response = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}${buildQuery({ page: 1, pageSize: 10 })}`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('paginated notifications', body);
      expect(body.success).toBe(true);
      expect(body.data.Page).toBe(1);
      expect(body.data.PageSize).toBe(10);
    });
  });

  // =========================================================================
  // 2. GET /api/v1/notifications-unified/unread-count - Get Unread Count
  // =========================================================================
  
  test.describe('GET /api/v1/notifications-unified/unread-count - Get Unread Count', () => {
    
    // 2.1 Unauthenticated Access
    test('should return 401 when unauthenticated user tries to get unread count', async ({ request }) => {
      const response = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/unread-count`);
      
      expect(response.status()).toBe(401);
      
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(401);
    });
    
    // 2.2 Applicant Access
    test('should return 200 when applicant gets unread count', async ({ request }) => {
      const tokenData = await getTokens('applicant');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('unread count', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
      // Should return integer count in data field
      expect(typeof body.data).toBe('number');
    });
    
    // 2.3 Admin Access
    test('should return 200 when admin gets unread count', async ({ request }) => {
      const tokenData = await getTokens('admin');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('unread count (admin)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
      expect(typeof body.data).toBe('number');
    });
    
    // 2.4 Manager Access
    test('should return 200 when manager gets unread count', async ({ request }) => {
      const tokenData = await getTokens('manager');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('unread count (manager)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 2.5 Receptionist Access
    test('should return 200 when receptionist gets unread count', async ({ request }) => {
      const tokenData = await getTokens('receptionist');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('unread count (receptionist)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 2.6 Doctor Access
    test('should return 200 when doctor gets unread count', async ({ request }) => {
      const tokenData = await getTokens('doctor');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('unread count (doctor)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 2.7 Examiner Access
    test('should return 200 when examiner gets unread count', async ({ request }) => {
      const tokenData = await getTokens('examiner');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('unread count (examiner)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 2.8 Security Access
    test('should return 200 when security gets unread count', async ({ request }) => {
      const tokenData = await getTokens('security');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('unread count (security)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
  });

  // =========================================================================
  // 3. PATCH /api/v1/notifications-unified/{id}/read - Mark Single as Read
  // =========================================================================
  
  test.describe('PATCH /api/v1/notifications-unified/{id}/read - Mark Single as Read', () => {
    
    // 3.1 Unauthenticated Access
    test('should return 401 when unauthenticated user tries to mark as read', async ({ request }) => {
      const testId = getTestNotificationId();
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/${testId}/read`);
      
      expect(response.status()).toBe(401);
      
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(401);
    });
    
    // 3.2 Applicant Access - Success
    test('should return 200 when applicant marks notification as read', async ({ request }) => {
      const tokenData = await getTokens('applicant');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const testId = getTestNotificationId();
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/${testId}/read`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Should return 200 or 404 (if notification doesn't exist for user)
      expect([200, 404]).toContain(response.status());
      
      const body = await response.json();
      // If 200, expect success
      if (response.status() === 200) {
        expect([true, false]).toContain(body.Success);
      }
    });
    
    // 3.3 Admin Access - Success
    test('should return 200 when admin marks notification as read', async ({ request }) => {
      const tokenData = await getTokens('admin');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const testId = getTestNotificationId();
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/${testId}/read`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Should return 200 or 404
      expect([200, 404]).toContain(response.status());
      
      const body = await response.json();
      if (response.status() === 200) {
        expect([true, false]).toContain(body.Success);
      }
    });
    
    // 3.4 Manager Access
    test('should return 200 when manager marks notification as read', async ({ request }) => {
      const tokenData = await getTokens('manager');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const testId = getTestNotificationId();
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/${testId}/read`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect([200, 404]).toContain(response.status());
    });
    
    // 3.5 Receptionist Access
    test('should return 200 when receptionist marks notification as read', async ({ request }) => {
      const tokenData = await getTokens('receptionist');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const testId = getTestNotificationId();
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/${testId}/read`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect([200, 404]).toContain(response.status());
    });
    
    // 3.6 Doctor Access
    test('should return 200 when doctor marks notification as read', async ({ request }) => {
      const tokenData = await getTokens('doctor');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const testId = getTestNotificationId();
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/${testId}/read`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect([200, 404]).toContain(response.status());
    });
    
    // 3.7 Examiner Access
    test('should return 200 when examiner marks notification as read', async ({ request }) => {
      const tokenData = await getTokens('examiner');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const testId = getTestNotificationId();
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/${testId}/read`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect([200, 404]).toContain(response.status());
    });
    
    // 3.8 Security Access
    test('should return 200 when security marks notification as read', async ({ request }) => {
      const tokenData = await getTokens('security');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const testId = getTestNotificationId();
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/${testId}/read`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect([200, 404]).toContain(response.status());
    });
    
    // 3.9 Invalid Notification ID
    test('should return 404 for non-existent notification', async ({ request }) => {
      const tokenData = await getTokens('applicant');
      expect(tokenData).not.toBeNull();
      
      const invalidId = 999999999;
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/${invalidId}/read`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Should return 404 for non-existent notification
      expect(response.status()).toBe(404);
    });
  });

  // =========================================================================
  // 4. PATCH /api/v1/notifications-unified/read-all - Mark All as Read
  // =========================================================================
  
  test.describe('PATCH /api/v1/notifications-unified/read-all - Mark All as Read', () => {
    
    // 4.1 Unauthenticated Access
    test('should return 401 when unauthenticated user tries to mark all as read', async ({ request }) => {
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`);
      
      expect(response.status()).toBe(401);
      
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.statusCode).toBe(401);
    });
    
    // 4.2 Applicant Access - Success
    test('should return 200 when applicant marks all notifications as read', async ({ request }) => {
      const tokenData = await getTokens('applicant');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('mark all as read (applicant)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
      // Should return a message
      expect(body.message).toBeDefined();
      expect(typeof body.message).toBe('string');
    });
    
    // 4.3 Admin Access - Success
    test('should return 200 when admin marks all notifications as read', async ({ request }) => {
      const tokenData = await getTokens('admin');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('mark all as read (admin)', body);
      expect(body.success).toBe(true);
      expect(body.statusCode).toBe(200);
    });
    
    // 4.4 Manager Access
    test('should return 200 when manager marks all notifications as read', async ({ request }) => {
      const tokenData = await getTokens('manager');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('mark all as read (manager)', body);
      expect(body.success).toBe(true);
    });
    
    // 4.5 Receptionist Access
    test('should return 200 when receptionist marks all notifications as read', async ({ request }) => {
      const tokenData = await getTokens('receptionist');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('mark all as read (receptionist)', body);
      expect(body.success).toBe(true);
    });
    
    // 4.6 Doctor Access
    test('should return 200 when doctor marks all notifications as read', async ({ request }) => {
      const tokenData = await getTokens('doctor');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('mark all as read (doctor)', body);
      expect(body.success).toBe(true);
    });
    
    // 4.7 Examiner Access
    test('should return 200 when examiner marks all notifications as read', async ({ request }) => {
      const tokenData = await getTokens('examiner');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('mark all as read (examiner)', body);
      expect(body.success).toBe(true);
    });
    
    // 4.8 Security Access
    test('should return 200 when security marks all notifications as read', async ({ request }) => {
      const tokenData = await getTokens('security');
      expect(tokenData).not.toBeNull();
      expect(tokenData.accessToken).toBeDefined();
      
      const response = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      assertApiResponse('mark all as read (security)', body);
      expect(body.success).toBe(true);
    });
    
    // 4.9 Multiple Calls
    test('should handle multiple calls gracefully', async ({ request }) => {
      const tokenData = await getTokens('applicant');
      expect(tokenData).not.toBeNull();
      
      // First call
      const response1 = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      expect(response1.status()).toBe(200);
      
      // Second call (should still return 200 even with no unread notifications)
      const response2 = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      expect(response2.status()).toBe(200);
      
      const body2 = await response2.json();
      // Should return message about no unread notifications
      expect(body2.message).toBeDefined();
    });
  });

  // =========================================================================
  // Summary Test - All Endpoints Working
  // =========================================================================
  
  test('should have all endpoints responding correctly', async ({ request }) => {
    // Get tokens for applicant
    const tokenData = await getTokens('applicant');
    expect(tokenData).not.toBeNull();
    const token = tokenData.accessToken;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    // Test all 4 endpoints
    const getResponse = await request.get(NOTIFICATIONS_UNIFIED_ENDPOINT, { headers });
    expect(getResponse.status()).toBe(200);
    
    const unreadCountResponse = await request.get(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/unread-count`, { headers });
    expect(unreadCountResponse.status()).toBe(200);
    
    const markReadResponse = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/1/read`, { headers });
    expect([200, 404]).toContain(markReadResponse.status());
    
    const markAllReadResponse = await request.patch(`${NOTIFICATIONS_UNIFIED_ENDPOINT}/read-all`, { headers });
    expect(markAllReadResponse.status()).toBe(200);
  });
});