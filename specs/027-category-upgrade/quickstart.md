# Quickstart: License Category Upgrade

## Overview
This feature allows transitioning from one license category to another with reduced training and automated test waivers for professional paths.

## Local Development Setup

### 1. Configuration Settings
Ensure the following keys exist in your `SystemSettings` table:
```sql
INSERT INTO SystemSettings (Id, [Key], Value, Description)
Values 
(NEWID(), 'MIN_HOLDING_PERIOD_UPGRADE', '12', 'Min months holding before upgrade'),
(NEWID(), 'UPGRADE_TRAINING_REDUCTION_PCNT', '25', 'Upgrade training credit %');
```

### 2. Fees
Ensure `CategoryUpgrade` service fees are defined for target categories:
```sql
INSERT INTO FeeStructures (Id, ServiceType, LicenseCategory, Amount, EffectiveFrom)
VALUES (NEWID(), 2, 'C', 500.00, '2025-01-01'); -- Type 2 = CategoryUpgrade
```

## Manual Verification Flow

1. **Prerequisite**: Use a SQL script to set a user's `License.IssueDate` to 13 months ago.
2. **Step 1**: Login as Applicant.
3. **Step 2**: Navigate to "New Application" -> "Category Upgrade".
4. **Step 3**: Select Target Category.
5. **Step 4**: Complete document review and medical.
6. **Step 5**: Observe reduced hours in Training stage.
7. **Step 6** (Commercial only): Observe Theory stage is skipped.
8. **Step 7**: Complete Practical and Pay.
9. **Result**: New license issued; Old license archived.

## API Endpoints
- `GET /api/v1/applications/check-upgrade-eligibility`
- `POST /api/v1/applications/initiate-upgrade`
