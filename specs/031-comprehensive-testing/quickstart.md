# Quickstart: running the E2E tests

## Local Execution

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   npx playwright install
   ```

2. **Start the Application**:
   Ensure both Backend and Frontend are running:
   ```bash
   # Terminal 1
   dotnet run --project src/Mojaz.API
   
   # Terminal 2
   cd frontend
   npm run dev
   ```

3. **Run All Tests**:
   ```bash
   npx playwright test
   ```

4. **Run Visual Regression specifically**:
   ```bash
   npx playwright test --project=visual
   ```

## CI Execution

Tests run automatically on every Pull Request via `.github/workflows/playwright.yml`.
If visual tests fail due to intentional UI changes, run:
`npx playwright test --update-snapshots`
and commit the changes.
