import { UserRole } from './enums';

/**
 * Mojaz RBAC Permission Authority
 * Defines which roles can perform specific functional tasks.
 */

export const RolePermissions = {
  // Can view and manage the common intake queue
  canAccessQueue: (role: UserRole | number) => [
    UserRole.Receptionist,
    UserRole.Manager,
    UserRole.Admin
  ].includes(Number(role)),

  // Can enter and view medical examination results
  canAccessMedical: (role: UserRole | number) => [
    UserRole.Doctor,
    UserRole.Admin
  ].includes(Number(role)),

  // Can enter and view theory/practical test results
  canAccessTesting: (role: UserRole | number) => [
    UserRole.Examiner,
    UserRole.Admin
  ].includes(Number(role)),

  // Can issue digital/physical licenses
  canIssueLicense: (role: UserRole | number) => [
    UserRole.Security,
    UserRole.Manager,
    UserRole.Admin
  ].includes(Number(role)),

  // Can access security verification queue and dashboard
  canAccessSecurity: (role: UserRole | number) => [
    UserRole.Security,
    UserRole.Manager,
    UserRole.Admin
  ].includes(Number(role)),

  // Can track attendance and check-in applicants
  canTrackAttendance: (role: UserRole | number) => [
    UserRole.Receptionist,
    UserRole.Security,
    UserRole.Admin
  ].includes(Number(role)),

  // Can view institutional reports and analytics
  canViewReports: (role: UserRole | number) => [
    UserRole.Manager,
    UserRole.Admin
  ].includes(Number(role)),

  // Can manage employee schedules and resources
  canManagerResources: (role: UserRole | number) => [
    UserRole.Manager,
    UserRole.Admin
  ].includes(Number(role)),

  // Can manage system settings and configuration
  canManageSettings: (role: UserRole | number) => [
    UserRole.Manager,
    UserRole.Admin
  ].includes(Number(role)),

  // Can manage users (CRUD operations)
  canManageUsers: (role: UserRole | number) => [
    UserRole.Admin
  ].includes(Number(role)),

  // Can manage fees and payment settings
  canManageFees: (role: UserRole | number) => [
    UserRole.Admin
  ].includes(Number(role)),

  // Can access audit logs
  canAccessAuditLogs: (role: UserRole | number) => [
    UserRole.Manager,
    UserRole.Security,
    UserRole.Admin
  ].includes(Number(role))
};

/**
 * Hook-ready version for specialized logic if needed
 */
export const hasPermission = (userRole: UserRole | number, permissionCheck: (role: UserRole | number) => boolean) => {
  return permissionCheck(userRole);
};
