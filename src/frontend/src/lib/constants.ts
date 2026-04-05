export const APP_NAME = "مُجاز | Mojaz";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  APPLICATIONS: "/applications",
  APPOINTMENTS: "/appointments",
  PROFILE: "/profile",
};

export const ROLES = {
  APPLICANT: "Applicant",
  RECEPTIONIST: "Receptionist",
  DOCTOR: "Doctor",
  EXAMINER: "Examiner",
  MANAGER: "Manager",
  SECURITY: "Security",
  ADMIN: "Admin",
};

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];
