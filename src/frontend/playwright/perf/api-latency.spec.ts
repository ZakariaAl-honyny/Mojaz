import { test, expect } from '@playwright/test';

/**
 * T017: API Latency Timing Assertions
 * 
 * Tests API response times against SLA targets:
 * - API responses must be < 2 seconds
 * - Tests various endpoints with different payloads
 * - Reports slow endpoints
 */
test.describe('US4: API Latency Performance', () => {
  
  // SLA: API response time should be < 2000ms
  const API_SLA_MS = 2000;
  
  test('Login API responds within SLA', async ({ request }) => {
    const start = Date.now();
    
    const response = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000001',
        password: 'Password123!'
      }
    });
    
    const duration = Date.now() - start;
    
    expect(response.ok()).toBeTruthy();
    console.log(`LOGIN_API: ${duration}ms (SLA: ${API_SLA_MS}ms)`);
    expect(duration).toBeLessThan(API_SLA_MS);
  });
  
  test('Dashboard API responds within SLA', async ({ request }) => {
    // First login to get token
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000001',
        password: 'Password123!'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data?.accessToken;
    
    expect(token).toBeDefined();
    
    // Test dashboard endpoint
    const start = Date.now();
    const dashboardResponse = await request.get('/api/v1/applicants/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const duration = Date.now() - start;
    
    console.log(`DASHBOARD_API: ${duration}ms (SLA: ${API_SLA_MS}ms)`);
    expect(duration).toBeLessThan(API_SLA_MS);
  });
  
  test('Applications List API responds within SLA', async ({ request }) => {
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000001',
        password: 'Password123!'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data?.accessToken;
    
    const start = Date.now();
    const appsResponse = await request.get('/api/v1/applications?page=1&pageSize=20', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const duration = Date.now() - start;
    
    console.log(`APPLICATIONS_LIST_API: ${duration}ms (SLA: ${API_SLA_MS}ms)`);
    expect(duration).toBeLessThan(API_SLA_MS);
  });
  
  test('License Categories API responds within SLA', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/api/v1/lookups/license-categories');
    const duration = Date.now() - start;
    
    console.log(`LICENSE_CATEGORIES_API: ${duration}ms (SLA: ${API_SLA_MS}ms)`);
    expect(duration).toBeLessThan(API_SLA_MS);
  });
  
  test('Nationalities Lookup API responds within SLA', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/api/v1/lookups/nationalities');
    const duration = Date.now() - start;
    
    console.log(`NATIONALITIES_API: ${duration}ms (SLA: ${API_SLA_MS}ms)`);
    expect(duration).toBeLessThan(API_SLA_MS);
  });
  
  test('Regions Lookup API responds within SLA', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('/api/v1/lookups/regions');
    const duration = Date.now() - start;
    
    console.log(`REGIONS_API: ${duration}ms (SLA: ${API_SLA_MS}ms)`);
    expect(duration).toBeLessThan(API_SLA_MS);
  });
  
  test('Application Details API responds within SLA', async ({ request }) => {
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000001',
        password: 'Password123!'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data?.accessToken;
    
    // First get applications to find an ID
    const appsResponse = await request.get('/api/v1/applications?page=1&pageSize=1', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const appsData = await appsResponse.json();
    const appId = appsData.data?.items?.[0]?.id;
    
    if (appId) {
      const start = Date.now();
      const detailResponse = await request.get(`/api/v1/applications/${appId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const duration = Date.now() - start;
      
      console.log(`APPLICATION_DETAIL_API: ${duration}ms (SLA: ${API_SLA_MS}ms)`);
      expect(duration).toBeLessThan(API_SLA_MS);
    }
  });
  
  test('Create Application API responds within SLA', async ({ request }) => {
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000001',
        password: 'Password123!'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data?.accessToken;
    
    // This would be a create request - we test the endpoint responds fast
    // Not actually creating to avoid side effects
    const start = Date.now();
    const response = await request.post('/api/v1/applications', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: { test: 'payload' } // Minimal payload to test timing
    });
    const duration = Date.now() - start;
    
    console.log(`CREATE_APPLICATION_API: ${duration}ms (SLA: ${API_SLA_MS}ms)`);
    // Even validation errors should respond quickly
    expect(duration).toBeLessThan(API_SLA_MS);
  });
});

test.describe('US4: API Performance Under Load', () => {
  
  test('Multiple concurrent API calls stay within SLA', async ({ request }) => {
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000001',
        password: 'Password123!'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data?.accessToken;
    
    const API_SLA_MS = 2000;
    
    // Make 5 concurrent requests
    const endpoints = [
      '/api/v1/applicants/dashboard',
      '/api/v1/applications?page=1&pageSize=20',
      '/api/v1/lookups/license-categories',
      '/api/v1/lookups/nationalities',
      '/api/v1/lookups/regions',
    ];
    
    const start = Date.now();
    
    const promises = endpoints.map(endpoint => 
      request.get(endpoint, { headers: { Authorization: `Bearer ${token}` } })
    );
    
    const responses = await Promise.all(promises);
    const duration = Date.now() - start;
    
    console.log(`CONCURRENT_5_API: ${duration}ms`);
    
    // All should succeed
    responses.forEach((resp, i) => {
      expect(resp.ok(), `Endpoint ${i} failed`).toBeTruthy();
    });
    
    // Total time should be reasonable (not all executed sequentially)
    expect(duration).toBeLessThan(API_SLA_MS * 3); // Allow some overhead
  });
  
  test('Paginated API maintains performance', async ({ request }) => {
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000001',
        password: 'Password123!'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data?.accessToken;
    
    // Test different page sizes
    const pageSizes = [10, 20, 50];
    const API_SLA_MS = 2000;
    
    for (const pageSize of pageSizes) {
      const start = Date.now();
      const response = await request.get(`/api/v1/applications?page=1&pageSize=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const duration = Date.now() - start;
      
      console.log(`PAGINATED_API_pageSize=${pageSize}: ${duration}ms`);
      expect(duration).toBeLessThan(API_SLA_MS);
    }
  });
});

test.describe('US4: API Response Time Reporting', () => {
  
  test('Report all endpoint timings', async ({ request }) => {
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000001',
        password: 'Password123!'
      }
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data?.accessToken;
    
    const endpoints = [
      { method: 'GET', path: '/api/v1/applicants/dashboard', name: 'Dashboard' },
      { method: 'GET', path: '/api/v1/applications?page=1&pageSize=20', name: 'Applications' },
      { method: 'GET', path: '/api/v1/lookups/license-categories', name: 'License Categories' },
      { method: 'GET', path: '/api/v1/lookups/nationalities', name: 'Nationalities' },
      { method: 'GET', path: '/api/v1/lookups/regions', name: 'Regions' },
    ];
    
    console.log('\n=== API Performance Report ===');
    
    for (const endpoint of endpoints) {
      const start = Date.now();
      const response = await request.get(endpoint.path, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const duration = Date.now() - start;
      
      const status = response.ok() ? 'PASS' : 'FAIL';
      console.log(`${endpoint.name}: ${duration}ms [${status}]`);
    }
    
    console.log('=============================\n');
  });
});