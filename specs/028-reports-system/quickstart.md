# Quickstart: Reports & Analytics System

## Backend Setup

1. **Verify Database**: Ensure your local SQL Server is running.
2. **Seed Mock Data**: 
   Since reports require significant data volume to look realistic, run the dev seed command:
   ```bash
   dotnet run --project src/backend/Mojaz.API --seed-reports
   ```
   *(Note: This flag will be implemented as part of the feature development)*.
3. **Run Backend**:
   ```bash
   dotnet run --project src/backend/Mojaz.API
   ```

## Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install recharts @tanstack/react-table
   ```
2. **Run Frontend**:
   ```bash
   npm run dev
   ```

## Verification Steps

1. **Login as Manager**: 
   - Username: `manager@mojaz.gov.sa`
   - Password: `Password123!`
2. **Navigate to Reports**: 
   - Go to `/reports` (usually found in the Employee Portal sidebar).
3. **Validate Charts**: 
   - Ensure the "Status Distribution" donut chart is visible.
4. **Test Filters**: 
   - Change the Date Range to "Last Month" and verify all 7 reports refresh.
5. **Test Export**: 
   - Click "Export CSV" on the Delayed Applications table and verify the file content.
