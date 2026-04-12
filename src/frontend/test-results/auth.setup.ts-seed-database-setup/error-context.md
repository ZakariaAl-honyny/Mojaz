# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.setup.ts >> seed database
- Location: playwright\auth.setup.ts:8:6

# Error details

```
Error: apiRequestContext.post: connect ECONNREFUSED ::1:3000
Call log:
  - → POST http://localhost:3000/api/v1/Testing/seed
    - user-agent: Playwright/1.59.1 (x64; windows 10.0) node/24.13
    - accept: application/json
    - accept-encoding: gzip,deflate,br

```