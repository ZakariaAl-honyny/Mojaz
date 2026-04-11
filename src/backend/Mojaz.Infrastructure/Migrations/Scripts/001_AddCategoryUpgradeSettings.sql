-- SQL Script to Add System Settings for License Category Upgrade Feature
-- This script adds the required system settings for the category upgrade functionality
-- as specified in specs/027-category-upgrade/data-model.md

INSERT INTO SystemSettings (Id, SettingKey, SettingValue, Category, Description, IsEncrypted) VALUES
('00000000-0000-0000-0000-000000009008', 'MIN_HOLDING_PERIOD_UPGRADE', '12', 'Training', 'Minimum months current license must be held before upgrading to higher category', 0),
('00000000-0000-0000-0000-000000009009', 'UPGRADE_TRAINING_REDUCTION_PCNT', '25', 'Training', 'Percentage reduction for training hours when upgrading from lower category', 0);