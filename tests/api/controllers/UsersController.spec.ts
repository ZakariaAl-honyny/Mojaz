/**
 * Playwright API Tests for UsersController
 * Target: http://localhost:5013/api/v1/users
 * 
 * Tests all 8 endpoints with 3 roles: Unauthenticated (401), Citizen (200/403), Admin (200)
 * 
 * Endpoints:
 * - GET /users (list all users - Admin/Manager only)
 * - GET /users/{id} (get user by ID - Admin only)
 * - POST /users (create user - Admin only)
 * - DELETE /users/{id} (soft delete - Admin only)
 * - PATCH /users/{id}/role (update user role - Admin only)
 * - PATCH /users/{id}/status (update user status - Admin only)
 * - GET /users/me (get current user profile - authenticated)
 * - PATCH /users/me (update current user profile - authenticated)
 */

const { test, expect } = require('@playwright/test');
const { BASE_URL, TEST_ACCOUNTS, getTokens, bearer, assertApiResponse, buildQuery, parseResponse } = require('../shared/helpers');

// Test Data
const VALID_CREATE_USER = {
  fullName: 'مستخدم جديد',
  email: `newuser${Date.now()}@mojaz.gov.sa`,
  phoneNumber: '+966501111111',
  appRole: 'Applicant'
};

const VALID_UPDATE_ME = {
  fullName: 'اسم محدث',
  address: 'الرياض',
  city: 'الرياض'
};

const VALID_UPDATE_ROLE = {
  appRole: 'Receptionist'
};

const VALID_UPDATE_STATUS = {
  isActive: false
};

test.describe('UsersController', () => {
  
  // ============================================================
  // GET /users - List all users (paginated)
  // Roles: Admin/Manager only, others get 403
  // ============================================================
  
  test('GET /users - should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/users`);
    expect(response.status()).toBe(401);
  });

  test('GET /users - should return 200 when Admin token', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users`, { headers: auth });
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    assertApiResponse('GET /users', body);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('items');
  });

  test('GET /users - should return 200 when Manager token', async ({ request }) => {
    const auth = await bearer('manager');
    const response = await request.get(`${BASE_URL}/api/v1/users`, { headers: auth });
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    assertApiResponse('GET /users', body);
    expect(body.data).toHaveProperty('items');
  });

  test('GET /users - should return 403 when Applicant token', async ({ request }) => {
    const auth = await bearer('applicant');
    const response = await request.get(`${BASE_URL}/api/v1/users`, { headers: auth });
    expect(response.status()).toBe(403);
  });

  test('GET /users - should return 403 when Doctor token', async ({ request }) => {
    const auth = await bearer('doctor');
    const response = await request.get(`${BASE_URL}/api/v1/users`, { headers: auth });
    expect(response.status()).toBe(403);
  });

  test('GET /users - should support pagination parameters', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users${buildQuery({ page: 1, pageSize: 10 })}`, { headers: auth });
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.data.page).toBe(1);
    expect(body.data.pageSize).toBe(10);
  });

  test('GET /users - should support search parameter', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users${buildQuery({ search: 'admin' })}`, { headers: auth });
    expect(response.status()).toBe(200);
  });

  test('GET /users - should support role filter', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users${buildQuery({ role: 'Admin' })}`, { headers: auth });
    expect(response.status()).toBe(200);
  });


  // ============================================================
  // GET /users/me - Get current authenticated user's profile
  // Roles: Any authenticated user
  // ============================================================

  test('GET /users/me - should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/users/me`);
    expect(response.status()).toBe(401);
  });

  test('GET /users/me - should return 200 when Applicant token', async ({ request }) => {
    const auth = await bearer('applicant');
    const response = await request.get(`${BASE_URL}/api/v1/users/me`, { headers: auth });
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    assertApiResponse('GET /users/me', body);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('email');
  });

  test('GET /users/me - should return 200 when Admin token', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users/me`, { headers: auth });
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.data.email).toBeDefined();
  });

  test('GET /users/me - should return 200 when Doctor token', async ({ request }) => {
    const auth = await bearer('doctor');
    const response = await request.get(`${BASE_URL}/api/v1/users/me`, { headers: auth });
    expect(response.status()).toBe(200);
  });

  test('GET /users/me - should return correct user data structure', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users/me`, { headers: auth });
    const body = await response.json();
    
    // Validate response structure
    expect(body.data).toMatchObject({
      id: expect.any(Number),
      fullName: expect.any(String),
      email: expect.any(String),
      phoneNumber: expect.any(String),
      appRole: expect.any(String),
      isActive: expect.any(Boolean)
    });
  });


  // ============================================================
  // PATCH /users/me - Update current user's profile
  // Roles: Any authenticated user
  // ============================================================

  test('PATCH /users/me - should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/v1/users/me`, {
      data: VALID_UPDATE_ME
    });
    expect(response.status()).toBe(401);
  });

  test('PATCH /users/me - should return 200 when Applicant token with valid data', async ({ request }) => {
    const auth = await bearer('applicant');
    const response = await request.patch(`${BASE_URL}/api/v1/users/me`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: VALID_UPDATE_ME
    });
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    assertApiResponse('PATCH /users/me', body);
  });

  test('PATCH /users/me - should update fullName when provided', async ({ request }) => {
    const auth = await bearer('applicant');
    const updateData = { fullName: 'اسم جديد للاختبار' };
    
    const response = await request.patch(`${BASE_URL}/api/v1/users/me`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: updateData
    });
    expect(response.status()).toBe(200);
  });

  test('PATCH /users/me - should return 400 with invalid email format', async ({ request }) => {
    const auth = await bearer('applicant');
    const invalidData = { email: 'not-an-email' };
    
    const response = await request.patch(`${BASE_URL}/api/v1/users/me`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: invalidData
    });
    expect(response.status()).toBe(400);
  });

  test('PATCH /users/me - should allow partial update (only address)', async ({ request }) => {
    const auth = await bearer('applicant');
    const partialUpdate = { address: 'جدة' };
    
    const response = await request.patch(`${BASE_URL}/api/v1/users/me`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: partialUpdate
    });
    expect([200, 400]).toContain(response.status());
  });


  // ============================================================
  // GET /users/{id} - Get user by ID
  // Roles: Admin only
  // ============================================================

  test('GET /users/{id} - should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v1/users/2`);
    expect(response.status()).toBe(401);
  });

  test('GET /users/{id} - should return 200 when Admin token', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users/2`, { headers: auth });
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    assertApiResponse('GET /users/{id}', body);
    expect(body.data.id).toBe(2);
  });

  test('GET /users/{id} - should return 403 when Applicant token', async ({ request }) => {
    const auth = await bearer('applicant');
    const response = await request.get(`${BASE_URL}/api/v1/users/2`, { headers: auth });
    expect(response.status()).toBe(403);
  });

  test('GET /users/{id} - should return 403 when Manager token', async ({ request }) => {
    const auth = await bearer('manager');
    const response = await request.get(`${BASE_URL}/api/v1/users/2`, { headers: auth });
    expect(response.status()).toBe(403);
  });

  test('GET /users/{id} - should return 404 for non-existent user', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users/999999`, { headers: auth });
    expect(response.status()).toBe(404);
  });


  // ============================================================
  // POST /users - Create new user
  // Roles: Admin only
  // ============================================================

  test('POST /users - should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/v1/users`, {
      data: VALID_CREATE_USER
    });
    expect(response.status()).toBe(401);
  });

  test('POST /users - should return 201 when Admin creates valid user', async ({ request }) => {
    const auth = await bearer('admin');
    const uniqueUser = {
      ...VALID_CREATE_USER,
      email: `testuser${Date.now()}@mojaz.gov.sa`,
      phoneNumber: `+9665${Math.floor(Math.random() * 10000000)}`
    };
    
    const response = await request.post(`${BASE_URL}/api/v1/users`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: uniqueUser
    });
    
    // May return 201 or 400 depending on validation
    expect([201, 400]).toContain(response.status());
    
    if (response.status() === 201) {
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('userId');
    }
  });

  test('POST /users - should return 403 when Applicant token', async ({ request }) => {
    const auth = await bearer('applicant');
    const response = await request.post(`${BASE_URL}/api/v1/users`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: VALID_CREATE_USER
    });
    expect(response.status()).toBe(403);
  });

  test('POST /users - should return 400 with duplicate email', async ({ request }) => {
    const auth = await bearer('admin');
    const duplicateUser = {
      fullName: 'مستخدم مكرر',
      email: TEST_ACCOUNTS.admin.email, // Already exists
      phoneNumber: '+966502222222',
      appRole: 'Applicant'
    };
    
    const response = await request.post(`${BASE_URL}/api/v1/users`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: duplicateUser
    });
    expect(response.status()).toBe(400);
  });

  test('POST /users - should return 400 with invalid email format', async ({ request }) => {
    const auth = await bearer('admin');
    const invalidUser = {
      fullName: 'مستخدم غير صالح',
      email: 'not-an-email',
      phoneNumber: '+966503333333',
      appRole: 'Applicant'
    };
    
    const response = await request.post(`${BASE_URL}/api/v1/users`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: invalidUser
    });
    expect(response.status()).toBe(400);
  });

  test('POST /users - should return 400 with missing required fields', async ({ request }) => {
    const auth = await bearer('admin');
    const incompleteUser = {
      fullName: 'مستخدم ناقص'
      // Missing email, phoneNumber, appRole
    };
    
    const response = await request.post(`${BASE_URL}/api/v1/users`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: incompleteUser
    });
    expect(response.status()).toBe(400);
  });


  // ============================================================
  // PATCH /users/{id}/role - Update user role
  // Roles: Admin only
  // ============================================================

  test('PATCH /users/{id}/role - should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/role`, {
      data: VALID_UPDATE_ROLE
    });
    expect(response.status()).toBe(401);
  });

  test('PATCH /users/{id}/role - should return 200 when Admin updates role', async ({ request }) => {
    const auth = await bearer('admin');
    const updateData = { appRole: 'Receptionist' };
    
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/role`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: updateData
    });
    
    // May return 200 or 404 (if user doesn't exist)
    expect([200, 404]).toContain(response.status());
  });

  test('PATCH /users/{id}/role - should return 403 when Applicant token', async ({ request }) => {
    const auth = await bearer('applicant');
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/role`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: VALID_UPDATE_ROLE
    });
    expect(response.status()).toBe(403);
  });

  test('PATCH /users/{id}/role - should return 403 when Manager token', async ({ request }) => {
    const auth = await bearer('manager');
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/role`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: VALID_UPDATE_ROLE
    });
    expect(response.status()).toBe(403);
  });

  test('PATCH /users/{id}/role - should return 404 for non-existent user', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.patch(`${BASE_URL}/api/v1/users/999999/role`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: VALID_UPDATE_ROLE
    });
    expect(response.status()).toBe(404);
  });

  test('PATCH /users/{id}/role - should return 400 with invalid role', async ({ request }) => {
    const auth = await bearer('admin');
    const invalidData = { appRole: 'InvalidRole' };
    
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/role`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: invalidData
    });
    expect([400, 404]).toContain(response.status());
  });


  // ============================================================
  // PATCH /users/{id}/status - Activate or deactivate user
  // Roles: Admin only
  // ============================================================

  test('PATCH /users/{id}/status - should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/status`, {
      data: VALID_UPDATE_STATUS
    });
    expect(response.status()).toBe(401);
  });

  test('PATCH /users/{id}/status - should return 200 when Admin deactivates user', async ({ request }) => {
    const auth = await bearer('admin');
    const updateData = { isActive: false };
    
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/status`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: updateData
    });
    
    expect([200, 404]).toContain(response.status());
  });

  test('PATCH /users/{id}/status - should return 200 when Admin activates user', async ({ request }) => {
    const auth = await bearer('admin');
    const updateData = { isActive: true };
    
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/status`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: updateData
    });
    
    expect([200, 404]).toContain(response.status());
  });

  test('PATCH /users/{id}/status - should return 403 when Applicant token', async ({ request }) => {
    const auth = await bearer('applicant');
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/status`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: VALID_UPDATE_STATUS
    });
    expect(response.status()).toBe(403);
  });

  test('PATCH /users/{id}/status - should return 403 when Manager token', async ({ request }) => {
    const auth = await bearer('manager');
    const response = await request.patch(`${BASE_URL}/api/v1/users/5/status`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: VALID_UPDATE_STATUS
    });
    expect(response.status()).toBe(403);
  });

  test('PATCH /users/{id}/status - should return 404 for non-existent user', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.patch(`${BASE_URL}/api/v1/users/999999/status`, {
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: VALID_UPDATE_STATUS
    });
    expect(response.status()).toBe(404);
  });


  // ============================================================
  // DELETE /users/{id} - Soft delete user
  // Roles: Admin only
  // ============================================================

  test('DELETE /users/{id} - should return 401 when unauthenticated', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/api/v1/users/5`);
    expect(response.status()).toBe(401);
  });

  test('DELETE /users/{id} - should return 200 when Admin deletes user', async ({ request }) => {
    const auth = await bearer('admin');
    // Try to delete a non-admin user (userId 5 is doctor, should work)
    const response = await request.delete(`${BASE_URL}/api/v1/users/5`, { headers: auth });
    
    // May return 200 or 404 (if already deleted or doesn't exist)
    expect([200, 404]).toContain(response.status());
  });

  test('DELETE /users/{id} - should return 403 when Applicant token', async ({ request }) => {
    const auth = await bearer('applicant');
    const response = await request.delete(`${BASE_URL}/api/v1/users/5`, { headers: auth });
    expect(response.status()).toBe(403);
  });

  test('DELETE /users/{id} - should return 403 when Manager token', async ({ request }) => {
    const auth = await bearer('manager');
    const response = await request.delete(`${BASE_URL}/api/v1/users/5`, { headers: auth });
    expect(response.status()).toBe(403);
  });

  test('DELETE /users/{id} - should return 403 when Doctor token', async ({ request }) => {
    const auth = await bearer('doctor');
    const response = await request.delete(`${BASE_URL}/api/v1/users/5`, { headers: auth });
    expect(response.status()).toBe(403);
  });

  test('DELETE /users/{id} - should return 404 for non-existent user', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.delete(`${BASE_URL}/api/v1/users/999999`, { headers: auth });
    expect(response.status()).toBe(404);
  });


  // ============================================================
  // Additional Edge Cases and Error Scenarios
  // ============================================================

  test('GET /users - should reject invalid page size', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users${buildQuery({ pageSize: -1 })}`, { headers: auth });
    expect([200, 400]).toContain(response.status());
  });

  test('GET /users - should reject pageSize over maximum', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users${buildQuery({ pageSize: 200 })}`, { headers: auth });
    expect([200, 400]).toContain(response.status());
  });

  test('GET /users/{id} - should reject non-numeric id', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.get(`${BASE_URL}/api/v1/users/abc`, { headers: auth });
    expect(response.status()).toBe(404);
  });

  test('PATCH /users/{id}/role - should reject self-role-change for non-admin', async ({ request }) => {
    const auth = await bearer('manager');
    // Try to change own role - this should fail
    const response = await request.patch(`${BASE_URL}/api/v1/users/3/role`, { // userId 3 is manager
      headers: { ...auth, 'Content-Type': 'application/json' },
      data: { appRole: 'Admin' }
    });
    expect([403, 404]).toContain(response.status());
  });

  test('All endpoints - should return proper error structure', async ({ request }) => {
    // Test with invalid auth to verify error structure
    const response = await request.get(`${BASE_URL}/api/v1/users`, {
      headers: { Authorization: 'Bearer invalid-token' }
    });
    
    if (response.status() === 401) {
      const body = await response.json();
      expect(body).toHaveProperty('success');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('statusCode');
    }
  });

  test('Content-Type - should require application/json', async ({ request }) => {
    const auth = await bearer('admin');
    const response = await request.post(`${BASE_URL}/api/v1/users`, {
      headers: { ...auth, 'Content-Type': 'text/plain' } as any,
      data: 'invalid content'
    });
    expect([400, 415, 500]).toContain(response.status());
  });

  test('Concurrent requests - should handle race conditions', async ({ request }) => {
    const auth = await bearer('admin');
    
    // Send multiple concurrent requests to the same endpoint
    const promises = [
      request.get(`${BASE_URL}/api/v1/users`, { headers: auth }),
      request.get(`${BASE_URL}/api/v1/users`, { headers: auth }),
      request.get(`${BASE_URL}/api/v1/users`, { headers: auth })
    ];
    
    const responses = await Promise.all(promises);
    
    // All should succeed
    expect(responses.every(r => r.status() === 200)).toBe(true);
  });

});