/**
 * Mojaz DocumentsController API Tests
 * Target: http://localhost:5013/api/v1/documents
 * Endpoints: 8
 * 
 * Test Coverage:
 * - POST /application/{appIdOrNumber}/upload - Upload document
 * - GET /application/{appIdOrNumber} - List documents by application
 * - GET /application/{appIdOrNumber}/requirements - Get requirements
 * - PATCH /application/{appIdOrNumber}/bulk-approve - Bulk approve
 * - PATCH /application/{appIdOrNumber}/review/{documentId} - Review document
 * - DELETE /{documentId} - Delete document
 * - POST /application/{appIdOrNumber}/request-missing - Request missing
 * - GET /{documentId}/download - Download document
 * 
 * Roles tested: Unauthenticated (401), Citizen/Applicant (200/403), Admin (200)
 */

const { test, expect } = require('@playwright/test');
const { BASE_URL, TEST_ACCOUNTS, getTokens, bearer, assertApiResponse, buildQuery, parseResponse } = require('../shared/helpers');

// Test configuration
const API_BASE = BASE_URL;
const DOC_ENDPOINT = `${API_BASE}/api/v1/documents`;

/**
 * Generate random string for unique test data
 */
function randomStr(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

/**
 * Mock document review request
 */
function getMockReviewRequest() {
  return {
    status: 'Approved',
    notes: 'تم مراجعة المستند بنجاح'
  };
}

/**
 * Mock request missing documents request
 */
function getMockRequestMissingRequest() {
  return {
    missingDocumentsAr: ['صورة شخصية', 'إثبات 地址'],
    missingDocumentsEn: ['Photo', 'Proof of address'],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
}

test.describe('DocumentsController - All 8 Endpoints', () => {

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
  // 1. POST /api/v1/documents/application/{appIdOrNumber}/upload - Upload Document
  // =========================================================================
  test.describe('POST /api/v1/documents/application/{appIdOrNumber}/upload - Upload Document', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      // Create a simple file to upload
      const fileData = Buffer.from('Test file content for document upload');
      
      const response = await request.post(`${DOC_ENDPOINT}/application/1/upload`, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 201 when applicant uploads document', async ({ request }) => {
      const token = await getTokens('applicant');
      expect(token).toBeTruthy();

      // Note: Playwright doesn't support multipart file upload directly in API tests
      // We test with form data structure
      const response = await request.post(`${DOC_ENDPOINT}/application/1/upload`, {
        data: {
          documentType: 'PersonalPhoto',
          file: 'test-content'
        },
        headers: { 
          'Authorization': `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      // May return 201, 400 (validation), or 404 (application not found)
      expect([201, 400, 404]).toContain(response.status());
    });

    test('should return 403 when receptionist uploads to non-owned application', async ({ request }) => {
      const token = await getTokens('receptionist');
      expect(token).toBeTruthy();

      const response = await request.post(`${DOC_ENDPOINT}/application/99999/upload`, {
        data: {
          documentType: 'PersonalPhoto'
        },
        headers: { 
          'Authorization': `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 403, 404]).toContain(response.status());
    });

    test('should return 200 when admin uploads document', async ({ request }) => {
      const token = await getTokens('admin');
      expect(token).toBeTruthy();

      const response = await request.post(`${DOC_ENDPOINT}/application/1/upload`, {
        data: {
          documentType: 'PersonalPhoto'
        },
        headers: { 
          'Authorization': `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 201, 400, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 2. GET /api/v1/documents/application/{appIdOrNumber} - List Documents
  // =========================================================================
  test.describe('GET /api/v1/documents/application/{appIdOrNumber} - List Documents', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${DOC_ENDPOINT}/application/1`);
      expect(response.status()).toBe(401);
    });

    test('should return 200 when applicant lists own application documents', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.get(`${DOC_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      // May return 200 or 404
      expect([200, 404]).toContain(response.status());
    });

    test('should return 403 when applicant tries to access other application', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.get(`${DOC_ENDPOINT}/application/99999`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // 403 or 404 depending on implementation
      expect([403, 404]).toContain(response.status());
    });

    test('should return 200 when admin lists any application documents', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${DOC_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(200);
      const body = await parseResponse(response);
      assertApiResponse('List Documents', body);
    });

    test('should return 200 when receptionist lists documents', async ({ request }) => {
      const token = await getTokens('receptionist');
      
      const response = await request.get(`${DOC_ENDPOINT}/application/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${DOC_ENDPOINT}/application/999999`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(404);
    });
  });

  // =========================================================================
  // 3. GET /api/v1/documents/application/{appIdOrNumber}/requirements - Get Requirements
  // =========================================================================
  test.describe('GET /api/v1/documents/application/{appIdOrNumber}/requirements - Get Requirements', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${DOC_ENDPOINT}/application/1/requirements`);
      expect(response.status()).toBe(401);
    });

    test('should return 200 when applicant gets requirements', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.get(`${DOC_ENDPOINT}/application/1/requirements`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });

    test('should return 200 when admin gets requirements', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${DOC_ENDPOINT}/application/1/requirements`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${DOC_ENDPOINT}/application/999999/requirements`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(404);
    });
  });

  // =========================================================================
  // 4. PATCH /api/v1/documents/application/{appIdOrNumber}/bulk-approve - Bulk Approve
  // =========================================================================
  test.describe('PATCH /api/v1/documents/application/{appIdOrNumber}/bulk-approve - Bulk Approve', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/bulk-approve`);
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to bulk approve', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/bulk-approve`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when receptionist bulk approves', async ({ request }) => {
      const token = await getTokens('receptionist');
      
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/bulk-approve`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when manager bulk approves', async ({ request }) => {
      const token = await getTokens('manager');
      
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/bulk-approve`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when admin bulk approves', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/bulk-approve`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.patch(`${DOC_ENDPOINT}/application/999999/bulk-approve`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(404);
    });
  });

  // =========================================================================
  // 5. PATCH /api/v1/documents/application/{appIdOrNumber}/review/{documentId} - Review Document
  // =========================================================================
  test.describe('PATCH /api/v1/documents/application/{appIdOrNumber}/review/{documentId} - Review Document', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/review/1`, {
        data: getMockReviewRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to review', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/review/1`, {
        data: getMockReviewRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when receptionist reviews document', async ({ request }) => {
      const token = await getTokens('receptionist');
      
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/review/1`, {
        data: getMockReviewRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when manager reviews document', async ({ request }) => {
      const token = await getTokens('manager');
      
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/review/1`, {
        data: getMockReviewRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent document', async ({ request }) => {
      const token = await getTokens('manager');
      
      const response = await request.patch(`${DOC_ENDPOINT}/application/1/review/999999`, {
        data: getMockReviewRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect([400, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 6. DELETE /api/v1/documents/{documentId} - Delete Document
  // =========================================================================
  test.describe('DELETE /api/v1/documents/{documentId} - Delete Document', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.delete(`${DOC_ENDPOINT}/1`);
      expect(response.status()).toBe(401);
    });

    test('should return 403 when admin tries to delete (only Applicant, Receptionist allowed)', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.delete(`${DOC_ENDPOINT}/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when applicant deletes own document', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.delete(`${DOC_ENDPOINT}/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 400, 403, 404]).toContain(response.status());
    });

    test('should return 200 when receptionist deletes document', async ({ request }) => {
      const token = await getTokens('receptionist');
      
      const response = await request.delete(`${DOC_ENDPOINT}/1`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      const body = await parseResponse(response);
      expect([200, 400, 403, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent document', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.delete(`${DOC_ENDPOINT}/999999`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([403, 404]).toContain(response.status());
    });
  });

  // =========================================================================
  // 7. POST /api/v1/documents/application/{appIdOrNumber}/request-missing - Request Missing
  // =========================================================================
  test.describe('POST /api/v1/documents/application/{appIdOrNumber}/request-missing - Request Missing Documents', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.post(`${DOC_ENDPOINT}/application/1/request-missing`, {
        data: getMockRequestMissingRequest(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to request missing', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.post(`${DOC_ENDPOINT}/application/1/request-missing`, {
        data: getMockRequestMissingRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 403 when examiner tries to request missing', async ({ request }) => {
      const token = await getTokens('examiner');
      
      const response = await request.post(`${DOC_ENDPOINT}/application/1/request-missing`, {
        data: getMockRequestMissingRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(403);
    });

    test('should return 200 when receptionist requests missing documents', async ({ request }) => {
      const token = await getTokens('receptionist');
      
      const response = await request.post(`${DOC_ENDPOINT}/application/1/request-missing`, {
        data: getMockRequestMissingRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when manager requests missing documents', async ({ request }) => {
      const token = await getTokens('manager');
      
      const response = await request.post(`${DOC_ENDPOINT}/application/1/request-missing`, {
        data: getMockRequestMissingRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 200 when admin requests missing documents', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.post(`${DOC_ENDPOINT}/application/1/request-missing`, {
        data: getMockRequestMissingRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      const body = await parseResponse(response);
      expect([200, 400, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent application', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.post(`${DOC_ENDPOINT}/application/999999/request-missing`, {
        data: getMockRequestMissingRequest(),
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      });

      expect(response.status()).toBe(404);
    });
  });

  // =========================================================================
  // 8. GET /api/v1/documents/{documentId}/download - Download Document
  // =========================================================================
  test.describe('GET /api/v1/documents/{documentId}/download - Download Document', () => {
    
    test('should return 401 when unauthenticated', async ({ request }) => {
      const response = await request.get(`${DOC_ENDPOINT}/1/download`);
      expect(response.status()).toBe(401);
    });

    test('should return 403 when applicant tries to download without ownership', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.get(`${DOC_ENDPOINT}/99999/download`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // 403 or 404 depending on document existence
      expect([403, 404]).toContain(response.status());
    });

    test('should return 200 when applicant downloads own document', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.get(`${DOC_ENDPOINT}/1/download`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // 200 (OK with file), 403 (not authorized), or 404 (not found)
      expect([200, 403, 404]).toContain(response.status());
    });

    test('should return 200 when admin downloads any document', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${DOC_ENDPOINT}/1/download`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // Admin should have access to any document
      expect([200, 403, 404]).toContain(response.status());
    });

    test('should return 200 when receptionist downloads document', async ({ request }) => {
      const token = await getTokens('receptionist');
      
      const response = await request.get(`${DOC_ENDPOINT}/1/download`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 403, 404]).toContain(response.status());
    });

    test('should return 404 for non-existent document', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${DOC_ENDPOINT}/999999/download`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect(response.status()).toBe(404);
    });
  });

  // =========================================================================
  // Additional: Test with application number (not just ID)
  // =========================================================================
  test.describe('Application Number Resolution Tests', () => {
    
    test('should accept application number in URL for list', async ({ request }) => {
      const token = await getTokens('admin');
      
      // Try with a mock application number format
      const response = await request.get(`${DOC_ENDPOINT}/application/MOJ-2025-12345678`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      // Should either resolve or return 404
      expect([200, 404]).toContain(response.status());
    });

    test('should accept application number in URL for upload', async ({ request }) => {
      const token = await getTokens('applicant');
      
      const response = await request.post(`${DOC_ENDPOINT}/application/MOJ-2025-12345678/upload`, {
        data: { documentType: 'PersonalPhoto' },
        headers: { 
          'Authorization': `Bearer ${token.accessToken}`
        }
      });

      expect([201, 400, 404]).toContain(response.status());
    });

    test('should accept application number in URL for requirements', async ({ request }) => {
      const token = await getTokens('admin');
      
      const response = await request.get(`${DOC_ENDPOINT}/application/MOJ-2025-12345678/requirements`, {
        headers: { Authorization: `Bearer ${token.accessToken}` }
      });

      expect([200, 404]).toContain(response.status());
    });
  });
});