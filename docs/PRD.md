# Mojaz Platform — Master Product Requirements Document

**Document ID:** MOJAZ-PRD-2025-001  
**Version:** 3.0 — Final Merged Edition  
**Date:** June 2025  
**Status:** Approved for Implementation  
**Classification:** Restricted  
**Release Type:** MVP - Version 1.0  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Vision & Goals](#2-vision--goals)
3. [Out of Scope (MVP v1.0)](#3-out-of-scope-mvp-v10)
4. [Tech Stack](#4-tech-stack)
5. [User Roles & Permissions](#5-user-roles--permissions)
6. [Services (MVP)](#6-services-mvp--8-services)
7. [License Categories](#7-license-categories-mvp--6)
8. [Workflow — New License Issuance](#8-workflow--new-license-issuance-10-stages)
9. [Eligibility Rules & Business Logic](#9-eligibility-rules--business-logic)
10. [Payment Scenarios & Fee Structure](#10-payment-scenarios--fee-structure)
11. [Application Data Model](#11-application-data-model)
12. [External Integrations](#12-external-integrations)
13. [Authentication System](#13-authentication-system)
14. [Security & Audit](#14-security--audit)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Notification System](#16-notification-system)
17. [Reports (MVP)](#17-reports-mvp--7)
18. [Landing Page](#18-landing-page)
19. [UI Screens by Role](#19-ui-screens-by-role)
20. [Permission Matrix](#20-permission-matrix)
21. [Database Schema](#21-database-schema-21-tables)
22. [API Architecture](#22-api-architecture)
23. [API Endpoints](#23-api-endpoints)
24. [Sprint Plan](#24-sprint-plan)
25. [Risks & Assumptions](#25-risks--assumptions)
26. [Next Steps](#26-next-steps)
27. [Final Summary](#27-final-summary)

---

## 1. Executive Summary

**Mojaz (مُجاز)** is a comprehensive government digital platform for managing the complete driving license lifecycle. The system simulates real Saudi government systems (inspired by Absher Design System) with full Arabic RTL and English LTR support.

The driving license issuance system is an integrated government electronic platform aimed at digitizing and automating the entire process of issuing driving licenses, from application submission to final license receipt.

### Platform Snapshot

| Item | Detail |
|------|--------|
| Platform Name | مُجاز (Mojaz) |
| Meaning | "Licensed" / "Authorized" in Arabic |
| Primary Color | #006C35 (Royal Green) |
| Design System | Absher-Inspired |
| Languages | Arabic (default, RTL) + English (LTR) |
| Theme | Dark + Light mode |
| MVP Duration | 10 Sprints (20 weeks) |

### Key Metrics

| Item | Count |
|------|-------|
| User Roles | 7 |
| MVP Services | 8 |
| Deferred Services | 3 |
| License Categories | 6 |
| Deferred Categories | 1 |
| Workflow Stages | 10 |
| Eligibility Rule Categories | 8 |
| Stage Gates | 4 |
| Simulated Integrations | 4 |
| Real Integrations | 3 (Email + SMS + Push) |
| Application Form Fields | 21 |
| Required Documents | 8 |
| Database Tables | 21 |
| API Endpoints | ~52 |
| UI Screens | 21 |
| Core Reports | 7 |
| Email Templates | 10 |
| SMS Templates | 6 |
| Push Notification Events | 10 |
| Sprints | 10 (20 weeks) |

### MVP Focus

The first version (MVP) focuses on:
- **8 core services** covering the majority of the user journey
- **6 license categories** which are the most commonly used (including agricultural vehicles)
- **7 user roles** with clear permissions
- **10 detailed workflow stages** for new license issuance
- **Bilingual support** (Arabic RTL / English LTR)
- **Real integration** with SMS + Email + Push Notifications
- **All other integrations simulated** to accelerate launch

### Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Application Processing Time | < 14 days | Average time from submission to issuance |
| System Uptime | 99.5% | Monthly availability |
| User Satisfaction | > 4.0/5.0 | Post-service survey |
| First-Time Approval Rate | > 80% | Applications approved without rejection |
| API Response Time | < 2 seconds | 95th percentile |

---

## 2. Vision & Goals

### Vision Statement

> Build a professional government digital system enabling citizens and residents to issue and manage driving licenses fully online, reducing bureaucracy and improving citizen experience while providing advanced administrative tools for employees and supervisors.

### Strategic Goals

| # | Goal | Description | Success Indicator |
|---|------|-------------|-------------------|
| 1 | **Digitize License Lifecycle** | Full 10-stage workflow from application to issuance | 100% paperless process |
| 2 | **Reduce Time & Effort** | No in-person visits except for examination and testing | Minimal physical presence required |
| 3 | **Control Operational Workflow** | No application without clear path and defined status | Zero undefined application states |
| 4 | **Automatic Eligibility Enforcement** | Age, documents, attempt limits via configurable settings | Zero manual eligibility checks |
| 5 | **Comprehensive Administrative Visibility** | Real-time reports and KPIs | 7 core reports available |
| 6 | **Extensible Architecture** | Ready for future growth with services and integrations | Modular, clean architecture |
| 7 | **Real-Time Notifications** | SMS + Email + Push from day one | < 5 min notification delivery |
| 8 | **Complete Audit Trail** | Every sensitive operation logged | 100% traceability |

### Problem Statement

| Current State | Future State |
|---------------|--------------|
| Manual paper-based applications | Fully digital online applications |
| In-person visits for each step | Single visit for tests only |
| No real-time status updates | Live tracking with notifications |
| Inconsistent rule application | Automated, configurable rules |
| Limited operating hours | 24/7 online availability |
| No audit trail | Complete operation history |

---

## 3. Out of Scope (MVP v1.0)

| # | Feature | Reason | Future Plan | Priority |
|---|---------|--------|-------------|----------|
| 1 | Foreign license conversion | Rules vary by country agreements | Phase 2 | High |
| 2 | International license issuance | Needs local service stability first | Phase 2 | Medium |
| 3 | License suspension/revocation | High-privilege + security integrations | Phase 2 | High |
| 4 | Category P (Professional) | Complex additional requirements | Phase 2 | Medium |
| 5 | Real integrations with external parties | All simulated except SMS/Email/Push | Phase 2 | Critical |
| 6 | Native mobile app | Web-first with responsive design | Phase 3 | High |
| 7 | Real payment gateway | Simulated in MVP | Phase 2 | Critical |
| 8 | Real identity verification | Manual check in MVP | Phase 2 | Critical |
| 9 | 2FA | OTP at registration is sufficient for MVP | Phase 2 | High |
| 10 | Biometric authentication | Requires hardware integration | Phase 3 | Medium |
| 11 | Multi-language beyond AR/EN | Limited user base | Phase 3 | Low |

---

## 4. Tech Stack

### 4.1 Frontend

| Technology | Usage |
|------------|-------|
| React / Next.js 15 | Core framework (App Router) |
| TypeScript 5 | Type safety |
| Tailwind CSS 4 | Styling and design |
| shadcn/ui | Ready-made component library (Mojaz-themed) |
| Lucide React | Icon library |
| Axios 1.7 | HTTP client |
| React Query 5 | Server state management |
| Zustand 5 | Client state management |
| React Hook Form 7 | Form management |
| Zod 3 | Schema validation |
| next-intl 3 | Internationalization |
| next-themes | Dark/Light mode |
| Framer Motion 11 | UI animations |
| Recharts 2 | Data visualization |
| TanStack Table 8 | Advanced tables |
| Firebase JS SDK 10 | Push notification client |

### 4.2 Backend

| Technology | Usage |
|------------|-------|
| ASP.NET Core 8 | Web API framework |
| Clean Architecture | 5-layer architectural pattern |
| Entity Framework Core 8 | ORM |
| SQL Server 2022 | Primary database |
| JWT + Refresh Token | Authentication |
| FluentValidation 11 | Input validation |
| AutoMapper 13 | Object mapping |
| Swagger/OpenAPI | API documentation |
| Hangfire 1.8 | Background jobs |
| Serilog | Structured logging |
| QuestPDF 2024 | PDF generation |
| SendGrid SDK | Real email delivery |
| Twilio SDK | Real SMS delivery |
| Firebase Admin SDK | Real push notifications |

### 4.3 Design Requirements

| Requirement | Detail |
|-------------|--------|
| Bilingual support | Arabic RTL / English LTR — instant switch affects entire layout |
| Dark/Light mode | Full theme support |
| Multiple themes | Switchable government themes |
| Responsive design | Fully responsive |
| General design | Modern, simple, official government style |
| Arabic font | Cairo or IBM Plex Arabic |
| English font | Inter or IBM Plex Sans |

### 4.4 Development Tools

| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub | Repository hosting |
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |
| Jest / xUnit | Unit testing |
| Playwright | E2E testing |
| Docker | Containerization |
| GitHub Actions | CI/CD |

---

## 5. User Roles & Permissions

### 5.1 Role Summary (7 Core Roles)

| # | Role | Arabic | Primary Responsibility | Access Level |
|---|------|--------|------------------------|--------------|
| 1 | **Applicant** | المتقدم (المواطن/المقيم) | Submit applications, track status, pay fees | Self-service |
| 2 | **Receptionist** | موظف الاستقبال | Review applications, verify documents | Branch |
| 3 | **Doctor** | الطبيب / جهة الفحص الطبي | Perform medical exams, record fitness results | Medical |
| 4 | **Examiner** | الفاحص النظري/العملي | Conduct tests, record results | Testing |
| 5 | **Manager/Supervisor** | المدير / المشرف | Oversight, approve exceptions, view reports | Management |
| 6 | **Security/Regulatory** | الجهة الأمنية/الرقابية | Verify compliance, review for blocks | Regulatory |
| 7 | **System Admin** | مسؤول النظام | System configuration, user management | Full |

### 5.2 Detailed Role Permissions

#### Role 1: Applicant (Citizen/Resident)

**Description:** The primary external user who applies for license issuance, renewal, or replacement, books appointments, and submits documents.

**Permissions:**
- Create account via email or phone with real OTP verification
- Login and identity verification
- Submit new applications or track existing ones
- Upload required documents and pay fees
- Book or modify examination/test appointments
- Receive notifications (internal + Push) and final decisions
- Download digital license (PDF)

#### Role 2: Receptionist

**Description:** User responsible for receiving applications, verifying completeness, and directing applicants to the next stage.

**Permissions:**
- Verify applicant data and documents
- Create applications on behalf of walk-in applicants
- Update receipt status and missing items
- Schedule reviews or forward to examination
- Print forms and receipts

#### Role 3: Doctor / Medical Examiner

**Description:** Entity that performs medical examination and certifies medical fitness or records reasons for ineligibility.

**Permissions:**
- View referred medical examination requests
- Enter medical examination results and measurements
- Approve fitness, unfitness, or request re-examination
- Attach medical reports and attachments
- Send results directly to the relevant authority

#### Role 4: Theory/Practical Examiner

**Description:** User who conducts driving tests or theory tests, records results, and documents observations.

**Permissions:**
- View lists of scheduled test applicants
- Record attendance, absence, and start evaluation sessions
- Enter test results and observations
- Approve pass, fail, or rescheduling
- Upload related records or evidence

#### Role 5: Manager/Supervisor

**Description:** Administrative user responsible for overseeing performance, permissions, application flow, and making decisions on exceptional cases.

**Permissions:**
- Monitor performance KPIs and application volume
- Approve or reject exceptional cases
- Manage users and operational permissions
- Monitor delays and bottlenecks in workflow
- Extract reports and operational statistics

#### Role 6: Security/Regulatory Authority

**Description:** Verification and review entity that monitors regulatory and security compliance and audits records and decisions.

**Permissions:**
- Verify security records or regulatory restrictions
- View applications referred for regulatory review
- Record verification results or observations
- Suspend or block completion when regulatory blocks exist
- Access audit and tracking records

#### Role 7: System Administrator

**Description:** Internal technical user for managing system settings, service connections, permissions, and notification rules.

**Permissions:**
- Manage roles, permissions, and policies
- Configure workflows, forms, and messages
- Manage integrations with external entities
- Monitor technical logs and alerts
- Ensure service continuity and backup
- Manage fee schedules and configurable policies

### 5.3 Organizational Recommendation

The system adopts **Role-Based Access Control (RBAC)** where each screen and action is linked to clear permissions: view, create, edit, approve, reject, print, export reports.

---

## 6. Services (MVP — 8 Services)

### 6.1 MVP Services Overview

| # | Service | Arabic | Description | Priority | Complexity |
|---|---------|--------|-------------|----------|------------|
| 01 | New License Issuance | إصدار رخصة جديدة | Full 10-stage workflow for first-time applicants including identity verification, medical fitness, training, tests, then final issuance approval | Critical | High |
| 02 | License Renewal | تجديد الرخصة | Renewal for expiring or recently expired licenses with requirement verification and fees | Critical | Medium |
| 03 | Lost/Damaged Replacement | بدل فاقد/تالف | License replacement when lost or damaged with reason documentation and fee payment | Critical | Medium |
| 04 | Category Upgrade | ترقية الفئة | Transition from one category to a higher one with requirement verification | High | High |
| 05 | Test Retake | إعادة الاختبار | Reactivate applicant file after failing previous test with new appointment booking | High | Low |
| 06 | Appointment Booking | حجز/إعادة جدولة موعد | Manage medical exam or test appointments according to available time slots | Critical | Medium |
| 07 | Application Cancellation | إلغاء الطلب | Enable user or employee to cancel application before completion according to specific controls | Medium | Low |
| 08 | Document Download | تحميل المستندات | Enable downloading receipt, appointment notification, test result, or digital license copy | Critical | Low |

### 6.2 Deferred Services (Phase 2)

| # | Service | Reason for Deferral |
|---|---------|---------------------|
| 09 | Foreign License Conversion | Rules vary by country and license type |
| 10 | International License Issuance | Added after local license services stabilize |
| 11 | License Suspension/Revocation | Requires high privileges and special approval workflow with security integrations |

---

## 7. License Categories (MVP — 6)

### 7.1 Category Overview

| Code | Category | Arabic | Min Age | Target Group | Validity |
|------|----------|--------|---------|--------------|----------|
| A | Motorcycle | دراجة نارية | 16 | Individuals | 10 years |
| B | Private Car | سيارة خاصة | 18 | Individuals | 10 years |
| C | Commercial/Taxi | تجاري/أجرة | 21 | Professional drivers | 5 years |
| D | Bus/Transport | حافلة/نقل ركاب | 21 | Professional drivers | 5 years |
| E | Heavy Vehicles | مركبات ثقيلة/شاحنات | 21 | Heavy transport | 5 years |
| F | Agricultural | مركبات زراعية | 18 | Farmers/agricultural workers | 10 years |

### 7.2 Category F — Agricultural Vehicles Details

| Item | Detail |
|------|--------|
| Description | Agricultural tractors, self-propelled agricultural equipment, vehicles designated for field and farm work |
| Training | Mandatory — specialized training on agricultural equipment operation |
| Medical Exam | Mandatory — standard examination with focus on physical capability |
| Theory Test | Required — includes traffic regulations + agricultural equipment operation rules |
| Practical Test | Required — includes tractor or agricultural equipment operation |

### 7.3 Category Requirements

| Category | Training Hours | Theory Questions | Practical Duration | Medical Frequency |
|----------|----------------|------------------|-------------------|-------------------|
| A | 20 | 30 | 30 min | Every 10 years |
| B | 30 | 30 | 45 min | Every 10 years |
| C | 40 | 40 | 60 min | Every 5 years |
| D | 50 | 40 | 60 min | Every 5 years |
| E | 50 | 40 | 60 min | Every 5 years |
| F | 20 | 20 | 30 min | Every 10 years |

### 7.4 Category Upgrade Paths

```
A (Motorcycle) → No upgrades available
B (Private) → C (Commercial) → D (Bus) → E (Heavy)
F (Agricultural) → B (Private)
```

### 7.5 Age Rules

> **IMPORTANT:** All minimum ages stored in `SystemSettings` table (key: `MIN_AGE_CATEGORY_X`).
> Zero hardcoded values in code.

| Age | Allowed Categories |
|-----|-------------------|
| 16-17 | A only |
| 18-20 | A, B, F |
| 21+ | All categories (A, B, C, D, E, F) |

### 7.6 Deferred Category

| Code | Category | Reason | Target |
|------|----------|--------|--------|
| P | Professional/Specialized | Complex additional requirements such as specialized material transport | Phase 2 |

---

## 8. Workflow — New License Issuance (10 Stages)

### 8.1 Shortened Path

```
01 Application Creation → 02 Document Upload → 03 Initial Payment → 04 Medical Exam →
05 Training → 06 Theory Test → 07 Practical Test → 08 Final Approval →
09 Issuance Payment → 10 License Issuance & Delivery
```

### 8.2 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEW LICENSE ISSUANCE WORKFLOW                │
└─────────────────────────────────────────────────────────────────┘

     ┌──────────────────┐
     │ 01. Application  │ ← Applicant creates + submits
     │     Creation     │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ 02. Document     │ ← Applicant uploads, Receptionist reviews
     │     Review       │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ 03. Initial      │ ← Applicant pays application fee
     │     Payment      │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ 04. Medical      │ ← Doctor records exam result
     │     Examination  │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ 05. Driving      │ ← Training school confirms completion
     │     Training     │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ 06. Theory       │ ← Examiner records test result
     │     Test         │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ 07. Practical    │ ← Examiner records test result
     │     Test         │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ 08. Final        │ ← Approver verifies all requirements
     │     Approval     │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ 09. Issuance     │ ← Applicant pays license fee
     │     Payment      │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ 10. License      │ ← System generates license
     │     Issuance     │
     └──────────────────┘
```

### 8.3 Stage Details

#### Stage 01: Application Creation

| Field | Detail |
|-------|--------|
| **Stage Number** | 01 |
| **Arabic Name** | إنشاء الطلب وتعبئة البيانات |
| **Owner** | Applicant |
| **Goal** | Create new transaction, select license type, enter basic data, link identity |
| **Start** | When selecting "New License Issuance" service |
| **End** | When initial application is submitted |
| **Statuses** | Draft, Under Submission, Submitted, Cancelled by Applicant |
| **Notes** | Application can be saved as draft — does not advance to next stage until mandatory fields are complete |

#### Stage 02: Document Upload & Review

| Field | Detail |
|-------|--------|
| **Stage Number** | 02 |
| **Arabic Name** | رفع المستندات والتحقق الأولي |
| **Owner** | Applicant → Receptionist/System |
| **Goal** | Verify availability and initial validity of required documents |
| **Statuses** | Pending Document Upload, Under Review, Documents Incomplete, Preliminary Approved, Rejected |
| **On Failure** | Incomplete → returns to applicant for completion / Legal block → rejected |

#### Stage 03: Initial Payment

| Field | Detail |
|-------|--------|
| **Stage Number** | 03 |
| **Arabic Name** | سداد الرسوم الأولية |
| **Owner** | Applicant |
| **Goal** | Collect fees that precede operational service execution |
| **Statuses** | Pending Payment, Processing, Paid, Payment Failed, Expired |
| **On Failure** | Failed/Expired → temporarily suspended until payment |

#### Stage 04: Medical Examination

| Field | Detail |
|-------|--------|
| **Stage Number** | 04 |
| **Arabic Name** | الفحص الطبي |
| **Owner** | Accredited medical center / Doctor |
| **Goal** | Confirm medical fitness required for license issuance |
| **Statuses** | Pending Booking, Scheduled, Exam Completed, Medically Fit, Medically Unfit, Requires Re-exam |
| **On Failure** | Unfit → paused until new result is provided |

#### Stage 05: Driving School Training

| Field | Detail |
|-------|--------|
| **Stage Number** | 05 |
| **Arabic Name** | التدريب في مدرسة القيادة |
| **Owner** | Driving school / Applicant |
| **Goal** | Complete required training hours or program |
| **Statuses** | Not Required, Pending Registration, In Training, Training Complete, Absent/Incomplete, Exempt |
| **On Failure** | Incomplete → cannot advance to tests |
| **Important Decision** | Training is a regulatory stage in the system for tracking, but actual execution is at an accredited driving school |

#### Stage 06: Theory Test

| Field | Detail |
|-------|--------|
| **Stage Number** | 06 |
| **Arabic Name** | الاختبار النظري |
| **Owner** | Testing authority / Applicant |
| **Goal** | Assess knowledge of traffic rules, signs, and safety regulations |
| **Statuses** | Pending Booking, Scheduled, Attended, Passed, Failed, Absent, Retake Required |
| **On Failure** | Fail/Absent → retake path + retake fee may apply |

#### Stage 07: Practical Test

| Field | Detail |
|-------|--------|
| **Stage Number** | 07 |
| **Arabic Name** | الاختبار العملي |
| **Owner** | Examiner / Applicant |
| **Goal** | Verify actual safe driving ability |
| **Statuses** | Pending Booking, Scheduled, Attended, Passed, Failed, Absent, Additional Training Required |
| **On Failure** | Fail → additional training then reschedule within limited attempts |

#### Stage 08: Final Approval

| Field | Detail |
|-------|--------|
| **Stage Number** | 08 |
| **Arabic Name** | الاعتماد النهائي |
| **Owner** | Approver / System |
| **Goal** | Review completion of all regulatory requirements before allowing issuance |
| **Statuses** | Under Final Review, Pending Requirement Completion, Approved, Finally Rejected |
| **On Failure** | Incomplete → return to related stage / Final rejection → close with reason explanation |

#### Stage 09: Issuance Payment

| Field | Detail |
|-------|--------|
| **Stage Number** | 09 |
| **Arabic Name** | سداد رسوم الإصدار |
| **Owner** | Applicant |
| **Goal** | Collect final fees associated with license issuance (varies by category) |
| **Statuses** | Pending Final Payment, Processing, Paid, Payment Failed |
| **On Failure** | Not paid → license cannot be issued despite approval completion |

#### Stage 10: License Issuance & Delivery

| Field | Detail |
|-------|--------|
| **Stage Number** | 10 |
| **Arabic Name** | إصدار الرخصة والتسليم |
| **Owner** | System / Issuing authority |
| **Goal** | Generate license number, activate it, enable printing or download |
| **Statuses** | Ready to Issue, Issued, Print Pending/Delivery, Complete, Issuance Failed |

### 8.4 Workflow Decision Summary

| Decision | Detail |
|----------|--------|
| **Payment Location** | Two stages: initial payment before operational execution + final payment before license issuance |
| **Training Location** | Regulatory stage in system for tracking, but execution at accredited school |
| **Handling Failure** | Does not close application directly; converts to retry or requirement completion |

---

## 9. Eligibility Rules & Business Logic

### 9.1 Minimum Age by License Category

| Category | Minimum Age | Note |
|----------|-------------|------|
| A — Motorcycle | 16 years | Initial minimum |
| B — Private | 18 years | Default minimum |
| C — Commercial/Taxi | 21 years | Clean traffic record preferred |
| D — Bus | 21 years | With specialized training and broader examination |
| E — Heavy Vehicles | 21 years | May require experience or holding previous category |
| F — Agricultural | 18 years | Specialized training on agricultural equipment |

### 9.2 Core Eligibility Rules

#### Identity & Legal Status

| Rule | Failure Action | Type |
|------|----------------|------|
| Valid ID or residence permit at application and issuance time | Direct prevention from proceeding | Hard Stop |
| ID data matches applicant file | Application suspended until correction | Hard Stop |
| One active application per applicant only | Reject additional application creation | Hard Stop |

#### Medical Fitness & Examination

| Rule | Failure Action | Type |
|------|----------------|------|
| Approved medical exam with "Fit" or "Conditionally Fit" result | Block or suspend | Hard Stop |
| Medical exam result validity (suggested 90 days) | Suspend when expired | Configurable |
| Exam from accredited entity | Refer to manual review | Soft Stop |

#### Training & Exemption

| Rule | Failure Action | Type |
|------|----------------|------|
| Training mandatory by default for new issuance | Prevent test advancement | Hard Stop |
| Exemption is official exception only (reason + document + approval) | Supervisory review | Configurable |
| 100% completion of required hours | Suspend booking | Configurable |

#### Tests & Attempt Limits

| Rule | Failure Action | Type |
|------|----------------|------|
| Theory: maximum 3 attempts | Retrain or close application | Configurable |
| Practical: maximum 3 attempts | Suspend and require additional hours | Configurable |
| Cooling period between attempts | Block booking until period elapsed | Configurable |

#### Violations & Restrictions

| Rule | Failure Action | Type |
|------|----------------|------|
| Security or judicial block exists | Final block until restriction lifted | Hard Stop |
| Pending financial or traffic violations | Stop before final issuance | Soft Stop |
| Re-verification before printing | Suspend issuance and refer to review | Hard Stop |

#### Category Upgrade

| Rule | Failure Action | Type |
|------|----------------|------|
| Holding previous category when required | Reject upgrade | Configurable |
| Duration of holding previous category (suggested 12 months) | Suspend or reject | Configurable |
| Appropriate traffic record | Block or refer to review | Configurable |

#### Fees & Application Validity

| Rule | Failure Action | Type |
|------|----------------|------|
| Fee payment before critical stages | Block booking or issuance | Hard Stop |
| Application validity period (6 or 12 months) | Automatic closure | Configurable |

### 9.3 Stage Gates (4 Gates)

#### Gate 1 — Before Application Creation

```
✓ Valid ID or residence permit at application time
✓ Age meets minimum for requested category (from SystemSettings)
✓ No other active application exists for this applicant
✓ No security/judicial block exists
```

#### Gate 2 — Before Training/Test Booking

```
✓ Application fee paid
✓ All mandatory data fields complete
✓ Training path determined (required OR exemption approved)
```

#### Gate 3 — Before Practical Test / Final Stage

```
✓ Medical exam result = Fit (and not expired)
✓ Training complete OR exemption approved
✓ Attempt count within limit (default: 3)
✓ Cooling period elapsed since last attempt (default: 7 days)
```

#### Gate 4 — Before License Issuance

```
✓ Theory test passed
✓ Practical test passed
✓ Security re-check clean
✓ No outstanding blocking violations
✓ ID still valid
✓ Medical exam still valid
✓ Issuance fee paid
```

---

## 10. Payment Scenarios & Fee Structure

### 10.1 Fee Structure

```
Application Fee (APPLICATION_FEE)
├── Fixed file opening fee → Paid at application submission
├── Non-refundable after processing begins
└── Unified amount for all categories

Operational Service Fees (SERVICE_FEES)
├── Medical exam fee → Paid before exam appointment booking
├── Theory test fee → Paid before test booking
├── Practical test fee → Paid before test booking
└── Retake fee → Paid for each retry

Issuance Fees (ISSUANCE_FEE_[CATEGORY]) — Varies by category
├── Category A (Motorcycle) ← Category B (Private) ← Category C (Commercial)
├── Category D (Bus) ← Category E (Heavy) ← Category F (Agricultural)
```

### 10.2 Payment Points in Workflow

```
[Application Submission] → 💳 File opening fee
[Medical Exam Booking] → 💳 Exam fee
[Theory Test Booking] → 💳 Theory test fee
[Practical Test Booking] → 💳 Practical test fee
[License Issuance] → 💳 Issuance fee by category
```

### 10.3 Configurable Fee Schedule

| Fee Type | Amount | Configurable | When Paid |
|----------|--------|:------------:|-----------|
| File Opening | TBD | ✅ | At submission |
| Medical Exam | TBD | ✅ | Before exam booking |
| Theory Test | TBD | ✅ | Before test booking |
| Practical Test | TBD | ✅ | Before test booking |
| Retake Test | TBD | ✅ | Before rebooking |
| License Issuance A-F | TBD per category | ✅ | Before issuance |

### 10.4 Fee Management Rules

- ALL amounts stored in `FeeStructures` table — NEVER hardcoded in code
- Fees managed via Admin portal → Settings → Fee Management
- Changes audited with old/new values + who changed
- Effective date range support (EffectiveFrom / EffectiveTo)
- Currency: SAR (Saudi Riyal)

### 10.5 Impact on Future Payment Gateway Integration

- ✅ No negative impact — each payment transaction is independent with reference number
- ✅ Each payment linked to specific fee type (FeeType)
- ✅ Model ready for connection with any payment gateway later

---

## 11. Application Data Model

### 11.1 Basic Data (21 Fields)

#### Applicant Data (Entered by Applicant)

| # | Field | Required | Description |
|---|-------|:--------:|-------------|
| 1 | Full Name | ✅ | As shown on official ID document |
| 2 | National ID / Residence No. | ✅ | Primary identifier for linking application |
| 3 | Date of Birth | ✅ | For age verification by category |
| 4 | Nationality | ✅ | For distinguishing regulatory rules |
| 5 | Gender | ✅ | For matching purposes |
| 6 | Mobile Number | ✅ | Primary notification channel |
| 7 | Email | Optional | For secondary notifications |
| 8 | Address / City / Region | ✅ | For determining appropriate center |

#### Application Data (Entered by Applicant)

| # | Field | Required | Description |
|---|-------|:--------:|-------------|
| 9 | Applicant Type (Citizen/Resident) | ✅ | To activate conditional documents |
| 10 | Requested License Category | ✅ | Determines eligibility and requirements |
| 11 | Preferred Execution Center | ✅ | For booking and capacity distribution |
| 12 | Test Language | Optional | For RTL/LTR support and test materials |
| 13 | Appointment Preference | Optional | Time preference for booking |
| 14 | Support/Accommodation Needs | Optional | For preparing examination environment |
| 15 | Data Accuracy Declaration | ✅ | Agreement to terms |

#### Manually Verified Data in MVP

| # | Field | Required | Entry Method |
|---|-------|:--------:|--------------|
| 16 | Blood Type | ✅ | Manual from medical report |
| 17 | Medical Fitness Status | ✅ | Manual from doctor |
| 18 | Training Certificate Reference | ✅ | Manual from certificate |
| 19 | Theory Test Result | ✅ | Manual from examiner |
| 20 | Practical Test Result | ✅ | Manual from examiner |
| 21 | Trial Payment Reference | ✅ | Internal simulation |

### 11.2 Required Documents (8 Documents)

#### Mandatory (4)

| # | Document | Description |
|---|----------|-------------|
| 1 | ID / Residence Copy | Clear copy for identity verification |
| 2 | Personal Photo | Recent photo according to requirements |
| 3 | Medical Report/Certificate | To prove medical fitness |
| 4 | Training Completion Certificate | Training path completion certificate |

#### Conditional (4)

| # | Document | Appearance Condition |
|---|----------|---------------------|
| 5 | Residence/Address Proof | Based on applicant type or authority policies |
| 6 | Guardian Consent | Based on age rules or category type |
| 7 | Previous/Foreign License | If applicant declared having one |
| 8 | Accessibility/Support Documents | When declared support needs exist |

---

## 12. External Integrations

### 12.1 Integration Summary (4 Simulated + 3 Real)

| # | Integration Point | Real? | MVP Handling | Future |
|---|-------------------|:-----:|--------------|--------|
| 1 | Identity Verification | ❌ | Manual entry + formal verification | Link with civil registry |
| 2 | Payment Gateway | ❌ | Simulated success/failure | Activate real payment gateway |
| 3 | Driving Schools | ❌ | Manual employee entry | Direct integration with schools |
| 4 | Medical Centers | ❌ | Manual medical document upload | Electronic link |
| 5 | **Email** | **✅** | **Real link with email provider (SendGrid/SES/Mailgun)** | — |
| 6 | **SMS** | **✅** | **Real link with SMS provider (Twilio/Unifonic/Yamamah)** | — |
| 7 | **Push Notifications** | **✅** | **Real link with Firebase Cloud Messaging (FCM)** | — |

### 12.2 Email Integration (Real ✅)

| Item | Detail |
|------|--------|
| Suggested Provider | SendGrid or Amazon SES or Mailgun |
| Integration Type | Direct API or SMTP |
| Templates | Ready HTML with official government design — supports AR/EN |
| Sender Address | no-reply@traffic-license.gov |
| Protection | SPF + DKIM + DMARC configured on domain |

#### Email Templates (10 Templates)

| # | Template | Event |
|---|----------|-------|
| 1 | Account Confirmation | New account creation via email |
| 2 | Password Recovery | Reset request |
| 3 | Application Receipt Confirmation | New application creation |
| 4 | Missing Documents Request | Incomplete documents |
| 5 | Appointment Confirmation | New appointment booking or modification |
| 6 | Medical Exam Result | Result issued |
| 7 | Test Result | Theory/practical result issued |
| 8 | Application Approval/Rejection | Final decision |
| 9 | License Issuance | License ready for download |
| 10 | Payment Confirmation | Successful payment |

### 12.3 SMS Integration (Real ✅)

| Item | Detail |
|------|--------|
| Suggested Provider | Twilio or Unifonic or Yamamah |
| Integration Type | REST API |
| Sender Name | TrafficLic |
| Message Length | Maximum 160 characters |
| Language | Arabic and English in same message |

#### SMS Templates (6 Templates)

| # | Template | Example Text |
|---|----------|--------------|
| 1 | Verification Code (Registration) | Verification code: 123456 — valid 5 minutes. رمز التحقق: 123456 |
| 2 | Verification Code (Recovery) | Reset code: 123456. رمز إعادة التعيين: 123456 |
| 3 | Appointment Confirmation | Your appointment is booked for XX/XX. تم حجز موعدك |
| 4 | Appointment Reminder | Reminder: You have an appointment tomorrow at XX:XX. تذكير |
| 5 | Test Result | Your test result has been issued. تم صدور نتيجة اختبارك |
| 6 | License Ready | Your license is ready! رخصتك جاهزة! |

### 12.4 Push Notifications Integration (Real ✅)

| Item | Detail |
|------|--------|
| Provider | Firebase Cloud Messaging (FCM) |
| Integration Type | REST API via FCM HTTP v1 |
| Supported Platforms | Web browsers (Web Push) — no mobile app in MVP |
| Token | Automatically registered when user logs in and grants notification permission |
| Language | According to user interface language (AR/EN) |

#### How It Works

```
User logs in
        ↓
Browser requests notification permission (Allow / Block)
        ↓
✅ Allowed ← Device Token registered in database linked to UserId
❌ Blocked ← Depends on internal notifications + email + SMS only
        ↓
When any event occurs (result, appointment, approval...)
        ↓
System sends Push via FCM to all user's registered devices
        ↓
Notification appears in browser even if not currently browsing the system
```

#### Push Notification Events (10 Events)

| # | Event | Example Title | Priority |
|---|-------|---------------|----------|
| 1 | Application Confirmation | "Your application received successfully" | Normal |
| 2 | Missing Documents Request | "Please complete required documents" | High |
| 3 | Payment Success/Failure | "Payment confirmed" or "Payment failed" | High |
| 4 | Appointment Confirmation/Modification | "Your appointment booked successfully" | Normal |
| 5 | Appointment Reminder (24 hours before) | "Reminder: You have an appointment tomorrow" | High |
| 6 | Medical Exam Result | "Medical exam result issued" | High |
| 7 | Test Result | "Your test result issued" | High |
| 8 | Final Approval | "Your application approved!" | High |
| 9 | License Issuance | "Your license is ready for download!" | High |
| 10 | Application Cancellation | "Your application has been cancelled" | Normal |

---

## 13. Authentication System

### 13.1 New Account Creation

#### Method 1: Registration via Email

```
User selects "Create Account" → Selects "Email"
        ↓
Enters: Full name + Email + Password + Confirm password + Terms agreement
        ↓
System sends real verification email with activation link or OTP (6 digits)
Validity: 15 minutes — Resend: 3 attempts/hour
        ↓
User verifies ← Account activated ← Dashboard
```

#### Method 2: Registration via Phone

```
User selects "Create Account" → Selects "Phone Number"
        ↓
Enters: Full name + Phone number with country code + Password + Confirm password + Agreement
        ↓
System sends real SMS with OTP (6 digits)
Validity: 5 minutes — Resend: 3 attempts/hour — Entry attempts: 5
        ↓
User enters code ← Account activated ← Dashboard
```

### 13.2 Login

- **Via Email:** Email + Password
- **Via Phone:** Phone + Password
- **User selects** method via clear tabs

### 13.3 Password Recovery

```
"Forgot Password" → Select method (email or phone)
→ Send real link/OTP → Verify → Enter new password
```

### 13.4 Security Policies

| Policy | Detail | Configurable |
|--------|--------|:------------:|
| Password minimum length | 8+ characters | ✅ |
| Password requirements | Uppercase + lowercase + numbers + special character | ✅ |
| Account lockout | 5 failed attempts → 15 minute lock | ✅ |
| JWT access token expiry | 1 hour | ✅ |
| JWT refresh token expiry | 7 days | ✅ |
| OTP validity (SMS) | 5 minutes | ✅ |
| OTP validity (Email) | 15 minutes | ✅ |
| OTP max attempts | 3 | ✅ |
| OTP resend cooldown | 60 seconds | ✅ |
| OTP resend max per hour | 3 | ✅ |
| Session | 1 hour — auto logout on idle | ✅ |
| Email/Phone confirmation | Mandatory before any service access | — |
| One account per identifier | Same email or phone not allowed to be duplicated | — |
| Failed login attempts logging | In Audit Log with IP and timestamp | — |

---

## 14. Security & Audit

### 14.1 Authentication

| Item | Detail |
|------|--------|
| Login method | Email or phone number |
| Authentication mechanism | JWT Tokens + Refresh Token |
| Registration verification | Real OTP via Email or SMS |

### 14.2 Authorization

| Item | Detail |
|------|--------|
| Permission model | Role-Based Access Control (RBAC) |
| Number of roles | 7 core roles |
| Minimum privilege principle | Each user sees only what concerns their stage |

### 14.3 Audit Log — Mandatory

| Logged Action |
|---------------|
| Application creation |
| Data modification |
| Approval / Rejection |
| Test result recording |
| Medical exam result recording |
| Printing / Downloading |
| Application cancellation |
| Permission changes |
| System setting modifications |
| Failed login attempts |

**Each log entry contains:** Who (UserId), What action (Action), On what (EntityType + EntityId), Old and new values (JSON), Timestamp, IP Address, User Agent.

### 14.4 Data Encryption

| Item | Detail |
|------|--------|
| During transit | HTTPS/TLS mandatory |
| During storage | Password encryption (BCrypt/Argon2) |
| Sensitive data | Encryption of ID numbers and medical data |

---

## 15. Non-Functional Requirements

### 15.1 Performance & Availability

| Requirement | Target |
|-------------|--------|
| Concurrent users | 100-500 (MVP) |
| Response time | Less than 2 seconds |
| Availability | 99.5% |
| Automatic backup | Daily |
| Data recovery | Last 30 days |

### 15.2 User Experience & Compatibility

| Requirement | Detail |
|-------------|--------|
| System type | Web only (no mobile app) |
| Responsive design | Fully responsive |
| Browsers | Chrome, Firefox, Safari, Edge (last 2 versions) |
| Arabic text direction | RTL (Right to Left) — Mandatory |
| English text direction | LTR (Left to Right) |
| Switching | Instant — includes all elements and full Layout |
| Directional icons | Reverse (arrows) when language changes |
| Layout | Fully reverses (Sidebar right in Arabic, left in English) |
| Arabic font | IBM Plex Sans Arabic or Cairo |
| English font | Inter or IBM Plex Sans |
| Accessibility | WCAG 2.1 AA compliance |

### 15.3 Audit & Compliance

| Requirement | Detail |
|-------------|--------|
| Audit log | Mandatory for all sensitive operations |
| Retention period | Minimum 5 years |
| Deletion | Soft Delete only |
| API Versioning | Supported from start |

---

## 16. Notification System

### 16.1 Notification Channels

| Channel | Type | Detail |
|---------|------|--------|
| **In-App Notifications** | Internal | Appear inside system — notification center + counter + bell icon |
| **Push Notifications** | External — Real ✅ | Via FCM — appear in browser even if user not inside system |
| **Email** | External — Real ✅ | Official HTML emails via real email provider |
| **SMS** | External — Real ✅ | Short text messages via real SMS provider |

### 16.2 Events × Channels Matrix

| # | Event | Recipient | In-App | Push | Email | SMS |
|---|-------|-----------|:------:|:----:|:-----:|:---:|
| 1 | New application created | Applicant + Employee | ✅ | ✅ | ✅ | ❌ |
| 2 | Missing documents request | Applicant | ✅ | ✅ | ✅ | ✅ |
| 3 | Preliminary application acceptance | Applicant | ✅ | ✅ | ✅ | ❌ |
| 4 | Application rejection | Applicant | ✅ | ✅ | ✅ | ✅ |
| 5 | Payment success/failure | Applicant | ✅ | ✅ | ✅ | ❌ |
| 6 | Appointment booking/modification | Applicant + Employee | ✅ | ✅ | ✅ | ✅ |
| 7 | Appointment reminder (24 hours before) | Applicant | ✅ | ✅ | ✅ | ✅ |
| 8 | Medical exam result | Applicant | ✅ | ✅ | ✅ | ✅ |
| 9 | Test result | Applicant | ✅ | ✅ | ✅ | ✅ |
| 10 | Final approval | Applicant | ✅ | ✅ | ✅ | ✅ |
| 11 | License issuance | Applicant | ✅ | ✅ | ✅ | ✅ |
| 12 | Application cancellation | Applicant + Employee | ✅ | ✅ | ✅ | ❌ |

### 16.3 User Preferences

User can control notification channels from account settings:
- ✅/❌ Enable/disable email
- ✅/❌ Enable/disable SMS
- ✅/❌ Enable/disable Push Notifications
- ⚠️ In-app notifications cannot be disabled (always enabled)

---

## 17. Reports (MVP — 7)

| # | Report | Description | Beneficiary | Filters |
|---|--------|-------------|-------------|---------|
| 1 | Applications by Status | Application distribution across each status | Manager / Supervisor | Date range, center |
| 2 | Applications by Service Type | Count per service | Manager / Supervisor | Date range |
| 3 | Pass/Fail Rates | Theory + practical test rates | Manager / Supervisor | Date range, examiner |
| 4 | Delayed/Stalled Applications | Applications without progress | Manager / Supervisor | Center, stage |
| 5 | Branch/Center Performance | Application volume and completion rate per branch | Manager / Supervisor | Date range |
| 6 | Examiner/Doctor Performance | Number of completed tasks per examiner/doctor | Manager / Supervisor | Date range |
| 7 | Daily/Monthly Issued Licenses | Actual issuance statistics | Manager / Supervisor | Date range |

---

## 18. Landing Page

### 18.1 General Requirements

- Official and professional government design
- Arabic RTL / English LTR
- Dark / Light Mode
- Fully responsive
- High loading speed

### 18.2 Sections (9 Sections)

| # | Section | Content |
|---|---------|---------|
| 1 | **Header** | Authority logo + System name + Language switch + Dark/Light + Login + Create Account |
| 2 | **Hero** | Attractive headline + Short description + CTA button "Start Your Application Now" + Professional image |
| 3 | **Available Services** | 8 service cards (icon + title + short description for each service) |
| 4 | **How the System Works** | 6 numbered steps in Timeline design (Create account → Submit application → Upload documents → Pay → Test → Receive) |
| 5 | **License Categories** | 6 categories with icon + name + minimum age |
| 6 | **Why Our System** | Features: Fully electronic, Secure, Real-time tracking, Bilingual support, Easy, Official |
| 7 | **Statistics** | Demo numbers: Licenses issued, Users, Branches, Average issuance time |
| 8 | **FAQ** | 6-8 questions in Accordion design |
| 9 | **Footer** | Logo + Quick links + Contact + Privacy + Copyright |

---

## 19. UI Screens by Role

### 19.1 Design Decision

- **Two separate portals:** Applicant Portal + Employee/Admin Portal
- **Design:** Modern, simple, official government style

### 19.2 Applicant Portal — 9 Screens

| # | Screen |
|---|--------|
| 1 | Registration / Login (email or phone with real OTP) |
| 2 | Personal Dashboard |
| 3 | New Application Form (Multi-step Wizard) |
| 4 | Document Upload |
| 5 | Appointment Booking / Management |
| 6 | Payment Page (Simulation) |
| 7 | Application Status Tracking (Timeline) |
| 8 | Results and Notifications View (Internal + Push) |
| 9 | Digital License Download (PDF) |

### 19.3 Employee Portal — 7 Screens

| # | Screen |
|---|--------|
| 1 | Role-based Dashboard |
| 2 | Applications List Referred to Role |
| 3 | Detailed Application Review Screen |
| 4 | Results Recording Screen (Exam/Test) |
| 5 | Appointment and Capacity Management |
| 6 | Approval / Rejection Screen |
| 7 | Reports and Statistics |

### 19.4 System Admin Portal — 4 Screens

| # | Screen |
|---|--------|
| 1 | User and Permission Management |
| 2 | Policy and Fee Management |
| 3 | Audit Logs |
| 4 | General System Settings |

**Total:** Landing Page + 9 + 7 + 4 = **21 Screens/Pages**

---

## 20. Permission Matrix

| Action | Applicant | Receptionist | Doctor | Examiner | Approver | Manager | Admin |
|--------|:---------:|:------------:|:------:|:--------:|:--------:|:-------:|:-----:|
| Create application | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own applications only | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View all applications | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Upload documents | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Review documents | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Record medical result | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Record test result | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Approve / Reject | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Issue license | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Manage appointments | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Process payment | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View reports | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage settings/fees | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Download license PDF | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cancel application | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 21. Database Schema (21 Tables)

### 21.1 Users — المستخدمون

```sql
Id                  UNIQUEIDENTIFIER PK DEFAULT NEWID()
FullName            NVARCHAR(200) NOT NULL
Email               NVARCHAR(200) UNIQUE NULL
Phone               NVARCHAR(20) UNIQUE NULL
PasswordHash        NVARCHAR(500) NOT NULL
Role                NVARCHAR(50) NOT NULL
RegistrationMethod  NVARCHAR(10) NOT NULL    -- Email|Phone
IsEmailVerified     BIT DEFAULT 0
IsPhoneVerified     BIT DEFAULT 0
EmailVerifiedAt     DATETIME2 NULL
PhoneVerifiedAt     DATETIME2 NULL
LastLoginAt         DATETIME2 NULL
FailedLoginAttempts INT DEFAULT 0
LockedUntil         DATETIME2 NULL
IsActive            BIT DEFAULT 1
PreferredLanguage   NVARCHAR(5) DEFAULT 'ar'
CreatedAt           DATETIME2 DEFAULT GETUTCDATE()
UpdatedAt           DATETIME2 NULL
IsDeleted           BIT DEFAULT 0
CONSTRAINT CK_Users_Contact CHECK (Email IS NOT NULL OR Phone IS NOT NULL)
```

### 21.2 Applicants — المتقدمون

```sql
Id              UNIQUEIDENTIFIER PK
UserId          UNIQUEIDENTIFIER FK → Users(Id)
NationalId      NVARCHAR(20) NOT NULL UNIQUE
DateOfBirth     DATE NOT NULL
Gender          NVARCHAR(10) NOT NULL
Nationality     NVARCHAR(100) NOT NULL
BloodType       NVARCHAR(5) NULL
Address         NVARCHAR(500) NULL
City            NVARCHAR(100) NULL
Region          NVARCHAR(100) NULL
ApplicantType   NVARCHAR(20) NOT NULL    -- Citizen|Resident
CreatedAt       DATETIME2 DEFAULT GETUTCDATE()
```

### 21.3 Applications — الطلبات

```sql
Id                      UNIQUEIDENTIFIER PK
ApplicationNumber       NVARCHAR(20) NOT NULL UNIQUE    -- MOJ-2025-XXXXXXXX
ApplicantId             UNIQUEIDENTIFIER FK → Applicants
ServiceType             NVARCHAR(50) NOT NULL
LicenseCategoryId       UNIQUEIDENTIFIER FK → LicenseCategories
BranchId                UNIQUEIDENTIFIER NULL
Status                  NVARCHAR(50) NOT NULL DEFAULT 'Draft'
CurrentStage            NVARCHAR(50) NULL
PreferredLanguage       NVARCHAR(5) NULL
SpecialNeeds            NVARCHAR(500) NULL
DataAccuracyConfirmed   BIT DEFAULT 0
ExpiresAt               DATETIME2 NULL
CancelledAt             DATETIME2 NULL
CancellationReason      NVARCHAR(500) NULL
CreatedAt               DATETIME2 DEFAULT GETUTCDATE()
UpdatedAt               DATETIME2 NULL
IsDeleted               BIT DEFAULT 0
```

### 21.4 LicenseCategories — فئات الرخص

```sql
Id               UNIQUEIDENTIFIER PK
Code             NVARCHAR(5) NOT NULL UNIQUE    -- A|B|C|D|E|F
NameAr           NVARCHAR(100) NOT NULL
NameEn           NVARCHAR(100) NOT NULL
MinimumAge       INT NOT NULL
RequiresTraining BIT DEFAULT 1
IsActive         BIT DEFAULT 1
```

### 21.5 Documents — المستندات

```sql
Id              UNIQUEIDENTIFIER PK
ApplicationId   UNIQUEIDENTIFIER FK → Applications
DocumentType    NVARCHAR(50) NOT NULL
FileName        NVARCHAR(255) NOT NULL
FilePath        NVARCHAR(500) NOT NULL
FileSize        BIGINT NULL
MimeType        NVARCHAR(100) NULL
IsRequired      BIT DEFAULT 1
Status          NVARCHAR(30) DEFAULT 'Uploaded'
ReviewedBy      UNIQUEIDENTIFIER FK → Users NULL
ReviewedAt      DATETIME2 NULL
RejectionReason NVARCHAR(500) NULL
UploadedAt      DATETIME2 DEFAULT GETUTCDATE()
```

### 21.6 Appointments — المواعيد

```sql
Id                  UNIQUEIDENTIFIER PK
ApplicationId       UNIQUEIDENTIFIER FK → Applications
AppointmentType     NVARCHAR(50) NOT NULL    -- Medical|Theory|Practical
ScheduledDate       DATE NOT NULL
TimeSlot            NVARCHAR(20) NOT NULL
BranchId            UNIQUEIDENTIFIER NULL
Status              NVARCHAR(30) DEFAULT 'Scheduled'
CancelledAt         DATETIME2 NULL
CancellationReason  NVARCHAR(500) NULL
CreatedAt           DATETIME2 DEFAULT GETUTCDATE()
UpdatedAt           DATETIME2 NULL
```

### 21.7 MedicalExams — الفحص الطبي

```sql
Id              UNIQUEIDENTIFIER PK
ApplicationId   UNIQUEIDENTIFIER FK → Applications
ExamDate        DATETIME2 NULL
DoctorId        UNIQUEIDENTIFIER FK → Users NULL
FitnessResult   NVARCHAR(30) NULL    -- Fit|Unfit|ConditionalFit|RequiresReexam
BloodType       NVARCHAR(5) NULL
Notes           NVARCHAR(1000) NULL
ReportReference NVARCHAR(100) NULL
ValidUntil      DATE NULL
CreatedAt       DATETIME2 DEFAULT GETUTCDATE()
```

### 21.8 TrainingRecords — سجلات التدريب

```sql
Id                      UNIQUEIDENTIFIER PK
ApplicationId           UNIQUEIDENTIFIER FK → Applications
SchoolName              NVARCHAR(200) NULL
CertificateNumber       NVARCHAR(100) NULL
CompletedHours          INT NULL
RequiredHours           INT NULL
IsExempt                BIT DEFAULT 0
ExemptionReason         NVARCHAR(500) NULL
ExemptionApprovedBy     UNIQUEIDENTIFIER FK → Users NULL
Status                  NVARCHAR(30) NULL
CompletedAt             DATETIME2 NULL
CreatedAt               DATETIME2 DEFAULT GETUTCDATE()
```

### 21.9 TheoryTests — الاختبار النظري

```sql
Id              UNIQUEIDENTIFIER PK
ApplicationId   UNIQUEIDENTIFIER FK → Applications
AttemptNumber   INT NOT NULL
TestDate        DATETIME2 NULL
ExaminerId      UNIQUEIDENTIFIER FK → Users NULL
Score           DECIMAL(5,2) NULL
PassingScore    DECIMAL(5,2) NULL
Result          NVARCHAR(20) NULL    -- Pass|Fail|Absent
Notes           NVARCHAR(1000) NULL
CreatedAt       DATETIME2 DEFAULT GETUTCDATE()
```

### 21.10 PracticalTests — الاختبار العملي

```sql
Id                          UNIQUEIDENTIFIER PK
ApplicationId               UNIQUEIDENTIFIER FK → Applications
AttemptNumber               INT NOT NULL
TestDate                    DATETIME2 NULL
ExaminerId                  UNIQUEIDENTIFIER FK → Users NULL
Result                      NVARCHAR(20) NULL    -- Pass|Fail|Absent
Notes                       NVARCHAR(1000) NULL
RequiresAdditionalTraining  BIT DEFAULT 0
AdditionalHoursRequired     INT NULL
CreatedAt                   DATETIME2 DEFAULT GETUTCDATE()
```

### 21.11 Payments — المدفوعات

```sql
Id                      UNIQUEIDENTIFIER PK
ApplicationId           UNIQUEIDENTIFIER FK → Applications
FeeType                 NVARCHAR(50) NOT NULL
Amount                  DECIMAL(10,2) NOT NULL
Currency                NVARCHAR(5) DEFAULT 'SAR'
Status                  NVARCHAR(30) DEFAULT 'Pending'
PaymentMethod           NVARCHAR(50) NULL
TransactionReference    NVARCHAR(100) NULL
PaidAt                  DATETIME2 NULL
FailedAt                DATETIME2 NULL
FailureReason           NVARCHAR(500) NULL
CreatedAt               DATETIME2 DEFAULT GETUTCDATE()
```

### 21.12 FeeStructures — هيكل الرسوم

```sql
Id                  UNIQUEIDENTIFIER PK
FeeType             NVARCHAR(50) NOT NULL
LicenseCategoryId   UNIQUEIDENTIFIER FK → LicenseCategories NULL
Amount              DECIMAL(10,2) NOT NULL
Currency            NVARCHAR(5) DEFAULT 'SAR'
IsActive            BIT DEFAULT 1
EffectiveFrom       DATE NOT NULL
EffectiveTo         DATE NULL
UpdatedBy           UNIQUEIDENTIFIER FK → Users NULL
UpdatedAt           DATETIME2 NULL
```

### 21.13 Licenses — الرخص المصدرة

```sql
Id              UNIQUEIDENTIFIER PK
LicenseNumber   NVARCHAR(20) NOT NULL UNIQUE    -- MOJ-2025-XXXXXXXX
ApplicationId   UNIQUEIDENTIFIER FK → Applications
ApplicantId     UNIQUEIDENTIFIER FK → Applicants
CategoryId      UNIQUEIDENTIFIER FK → LicenseCategories
IssueDate       DATE NOT NULL
ExpiryDate      DATE NOT NULL
Status          NVARCHAR(30) DEFAULT 'Active'
IssuedBy        UNIQUEIDENTIFIER FK → Users
PrintedAt       DATETIME2 NULL
DownloadedAt    DATETIME2 NULL
CreatedAt       DATETIME2 DEFAULT GETUTCDATE()
```

### 21.14 Notifications — الإشعارات الداخلية

```sql
Id              UNIQUEIDENTIFIER PK
UserId          UNIQUEIDENTIFIER FK → Users
ApplicationId   UNIQUEIDENTIFIER FK → Applications NULL
TitleAr         NVARCHAR(200) NULL
TitleEn         NVARCHAR(200) NULL
MessageAr       NVARCHAR(1000) NULL
MessageEn       NVARCHAR(1000) NULL
EventType       NVARCHAR(50) NULL
IsRead          BIT DEFAULT 0
ReadAt          DATETIME2 NULL
CreatedAt       DATETIME2 DEFAULT GETUTCDATE()
```

### 21.15 PushTokens — توكنات Push

```sql
Id          UNIQUEIDENTIFIER PK
UserId      UNIQUEIDENTIFIER FK → Users
Token       NVARCHAR(500) NOT NULL
DeviceType  NVARCHAR(30) NULL    -- WebChrome|WebFirefox|WebSafari
IsActive    BIT DEFAULT 1
CreatedAt   DATETIME2 DEFAULT GETUTCDATE()
LastUsedAt  DATETIME2 NULL
```

### 21.16 AuditLogs — سجلات التدقيق

```sql
Id          UNIQUEIDENTIFIER PK
UserId      UNIQUEIDENTIFIER NULL
Action      NVARCHAR(100) NOT NULL
EntityType  NVARCHAR(100) NULL
EntityId    NVARCHAR(100) NULL
OldValues   NVARCHAR(MAX) NULL    -- JSON
NewValues   NVARCHAR(MAX) NULL    -- JSON
IpAddress   NVARCHAR(50) NULL
UserAgent   NVARCHAR(500) NULL
Timestamp   DATETIME2 DEFAULT GETUTCDATE()
```

### 21.17 SystemSettings — إعدادات النظام

```sql
Id              UNIQUEIDENTIFIER PK
SettingKey      NVARCHAR(100) NOT NULL UNIQUE
SettingValue    NVARCHAR(1000) NULL
Category        NVARCHAR(50) NULL
Description     NVARCHAR(500) NULL
UpdatedBy       UNIQUEIDENTIFIER FK → Users NULL
UpdatedAt       DATETIME2 NULL
```

### 21.18 OtpCodes — رموز التحقق

```sql
Id                  UNIQUEIDENTIFIER PK
UserId              UNIQUEIDENTIFIER FK → Users NULL
Destination         NVARCHAR(200) NOT NULL
DestinationType     NVARCHAR(10) NOT NULL    -- Email|Phone
CodeHash            NVARCHAR(500) NOT NULL    -- Hashed OTP
Purpose             NVARCHAR(30) NOT NULL    -- Registration|Login|PasswordReset
ExpiresAt           DATETIME2 NOT NULL
IsUsed              BIT DEFAULT 0
UsedAt              DATETIME2 NULL
AttemptCount        INT DEFAULT 0
MaxAttempts         INT DEFAULT 3
CreatedAt           DATETIME2 DEFAULT GETUTCDATE()
IpAddress           NVARCHAR(50) NULL
```

### 21.19 RefreshTokens — توكنات التحديث

```sql
Id                  UNIQUEIDENTIFIER PK
UserId              UNIQUEIDENTIFIER FK → Users
Token               NVARCHAR(500) NOT NULL UNIQUE
ExpiresAt           DATETIME2 NOT NULL
IsRevoked           BIT DEFAULT 0
RevokedAt           DATETIME2 NULL
ReplacedByToken     NVARCHAR(500) NULL
CreatedAt           DATETIME2 DEFAULT GETUTCDATE()
CreatedByIp         NVARCHAR(50) NULL
```

### 21.20 EmailLogs — سجل رسائل البريد

```sql
Id                  UNIQUEIDENTIFIER PK
UserId              UNIQUEIDENTIFIER FK → Users NULL
ToEmail             NVARCHAR(200) NOT NULL
Subject             NVARCHAR(500) NULL
TemplateName        NVARCHAR(100) NULL
Status              NVARCHAR(20) NOT NULL    -- Sent|Failed|Bounced
ProviderMessageId   NVARCHAR(200) NULL
FailureReason       NVARCHAR(500) NULL
SentAt              DATETIME2 NULL
CreatedAt           DATETIME2 DEFAULT GETUTCDATE()
```

### 21.21 SmsLogs — سجل الرسائل النصية

```sql
Id                  UNIQUEIDENTIFIER PK
UserId              UNIQUEIDENTIFIER FK → Users NULL
ToPhone             NVARCHAR(20) NOT NULL
MessageType         NVARCHAR(50) NOT NULL    -- OTP|Notification|Reminder
Status              NVARCHAR(20) NOT NULL
ProviderMessageId   NVARCHAR(200) NULL
FailureReason       NVARCHAR(500) NULL
Cost                DECIMAL(8,4) NULL
SentAt              DATETIME2 NULL
CreatedAt           DATETIME2 DEFAULT GETUTCDATE()
```

### 21.22 Entity Relationships (ERD)

```
Users ──1:1──> Applicants
Users ──1:N──> AuditLogs, Notifications, OtpCodes, PushTokens
Users ──1:N──> EmailLogs, SmsLogs, RefreshTokens

Applicants ──1:N──> Applications, Licenses

Applications ──1:N──> Documents, Appointments, MedicalExams
Applications ──1:N──> TrainingRecords, TheoryTests, PracticalTests
Applications ──1:N──> Payments, Notifications
Applications ──1:1──> Licenses
Applications ──N:1──> LicenseCategories

LicenseCategories ──1:N──> FeeStructures, Licenses
```

---

## 22. API Architecture

### 22.1 Solution Structure (Clean Architecture)

```
Mojaz.sln
├── Mojaz.Domain/           → Entities, Enums, Interfaces (no external deps)
├── Mojaz.Shared/           → ApiResponse<T>, PagedResult<T>, Constants
├── Mojaz.Application/      → Services, DTOs, Validators, AutoMapper profiles
├── Mojaz.Infrastructure/   → EF Core, Repositories, External Services
└── Mojaz.API/              → Controllers, Middleware, Program.cs
```

### 22.2 Adopted Patterns

| Pattern | Description |
|---------|-------------|
| Repository Pattern + Unit of Work | Database access management |
| JWT + Refresh Token | Authentication and token management |
| Role-based Authorization | Permission by role |
| FluentValidation | Data validation |
| Swagger Documentation | Automatic API documentation |
| Pagination / Filtering / Sorting | Support for large lists |
| Audit Log Middleware | Logging all operations |
| Background Queue | For notifications and async tasks |
| Soft Delete | Logical deletion |
| API Versioning | Multiple version support |

### 22.3 Standard Response Contract

```json
// Success (200)
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "errors": null,
  "statusCode": 200
}

// Error (400/401/404/500)
{
  "success": false,
  "message": "Error description",
  "data": null,
  "errors": ["Specific error 1", "Specific error 2"],
  "statusCode": 400
}

// Paginated list
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [...],
    "totalCount": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "errors": null,
  "statusCode": 200
}
```

---

## 23. API Endpoints

### 23.1 Auth — Authentication (8 endpoints)

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/verify-otp
POST   /api/v1/auth/resend-otp
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

### 23.2 Applications — Applications (7 endpoints)

```
POST   /api/v1/applications
GET    /api/v1/applications
GET    /api/v1/applications/{id}
PUT    /api/v1/applications/{id}
PATCH  /api/v1/applications/{id}/status
PATCH  /api/v1/applications/{id}/cancel
GET    /api/v1/applications/{id}/timeline
```

### 23.3 Documents — Documents (3 endpoints)

```
POST   /api/v1/applications/{id}/documents
GET    /api/v1/applications/{id}/documents
DELETE /api/v1/applications/{id}/documents/{docId}
```

### 23.4 Appointments — Appointments (4 endpoints)

```
POST   /api/v1/appointments
GET    /api/v1/appointments/available-slots
PATCH  /api/v1/appointments/{id}/reschedule
PATCH  /api/v1/appointments/{id}/cancel
```

### 23.5 Medical Exams — Medical Exams (3 endpoints)

```
POST   /api/v1/medical-exams
GET    /api/v1/medical-exams/{applicationId}
PATCH  /api/v1/medical-exams/{id}/result
```

### 23.6 Tests — Tests (3 endpoints)

```
POST   /api/v1/theory-tests/{applicationId}/result
POST   /api/v1/practical-tests/{applicationId}/result
GET    /api/v1/tests/{applicationId}/history
```

### 23.7 Payments — Payments (4 endpoints)

```
POST   /api/v1/payments/initiate
POST   /api/v1/payments/{id}/confirm
GET    /api/v1/payments/{applicationId}
GET    /api/v1/payments/{id}/receipt
```

### 23.8 Licenses — Licenses (3 endpoints)

```
POST   /api/v1/licenses/{applicationId}/issue
GET    /api/v1/licenses/{id}
GET    /api/v1/licenses/{id}/download
```

### 23.9 Reports — Reports (6 endpoints)

```
GET    /api/v1/reports/applications-by-status
GET    /api/v1/reports/applications-by-service
GET    /api/v1/reports/test-pass-fail-rates
GET    /api/v1/reports/delayed-applications
GET    /api/v1/reports/branch-performance
GET    /api/v1/reports/daily-monthly-issuance
```

### 23.10 Notifications — Notifications (5 endpoints)

```
GET    /api/v1/notifications
PATCH  /api/v1/notifications/{id}/read
PATCH  /api/v1/notifications/read-all
POST   /api/v1/notifications/push/register-token
DELETE /api/v1/notifications/push/unregister-token
```

### 23.11 Settings — Settings (4 endpoints)

```
GET    /api/v1/settings/fees
PUT    /api/v1/settings/fees
GET    /api/v1/settings/policies
PUT    /api/v1/settings/policies
```

### 23.12 Users — Users (5 endpoints)

```
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
PATCH  /api/v1/users/{id}/role
PATCH  /api/v1/users/{id}/toggle-active
```

### 23.13 Audit Logs — Audit Logs (2 endpoints)

```
GET    /api/v1/audit-logs
GET    /api/v1/audit-logs/{entityType}/{entityId}
```

**Total:** ~52 endpoints

---

## 24. Sprint Plan

### Implementation Plan — 10 Sprints (20 Weeks)

| Sprint | Duration | Deliverables | Git Commits |
|--------|----------|--------------|-------------|
| **0** | — | Planning files + scaffold | 0.1, 0.2 |
| **1-2** | 2 weeks | Infrastructure + Database + JWT Auth + RBAC + **Real SMS + Email + Push integration** + OTP + Swagger + Audit Log | 1.1, 1.2, 2.1, 2.2, 2.3, 2.4 |
| **3-4** | 2 weeks | Application creation (Wizard) + Document upload + Employee review + Application statuses | 3.1, 3.2, 3.3, 3.4 |
| **5-6** | 2 weeks | Medical exam + Training + Tests (theory + practical) + Appointment management + **Agricultural vehicle category** | 4.1, 4.2 |
| **7-8** | 2 weeks | Final approval + Payment simulation (multi-stage) + License issuance + PDF | 5.1, 5.2 |
| **9-10** | 2 weeks | 7 Reports + **Real notifications (internal + Push + Email + SMS)** + Landing Page + Comprehensive testing + Launch | 6.1, 6.2, 7.1, 7.2, 8.1, 8.2 |

---

## 25. Risks & Assumptions

### 25.1 Assumptions

| # | Assumption |
|---|------------|
| 1 | Regulatory requirements are preliminary and can be modified via settings |
| 2 | Integrations with external entities (except SMS/Email/Push) will work via simulation |
| 3 | System is Web only — no mobile app |
| 4 | Financial amounts will be determined later and stored as modifiable policies |
| 5 | Development team available throughout the 20 weeks |
| 6 | SMS/Email/Push providers will be selected and configured in Sprint 1-2 |

### 25.2 Risks

| # | Risk | Impact | Probability | Mitigation |
|---|------|--------|-------------|------------|
| 1 | Requirements change during execution | High | Medium | Lock MVP scope + Sprint Reviews |
| 2 | Eligibility rule complexity | Medium | Medium | Flexible, configurable rule engine |
| 3 | Difficulty simulating some integrations | Low | High | Clear documentation of what is simulated |
| 4 | Time constraints | High | Medium | Priority ordering |
| 5 | SMS/Email provider issues | Medium | Low | Configure backup provider (Fallback) |
| 6 | User rejection of Push notifications | Low | High | Rely on alternative channels (internal + SMS + Email) |

---

## 26. Next Steps

| # | Step | Description |
|---|------|-------------|
| 1 | Start Sprint 1-2 | Project setup and infrastructure + SMS/Email/Push connection |
| 2 | Convert PRD to User Stories | Detail each service into user stories with Acceptance Criteria |
| 3 | Design Wireframes | Draw basic screens for applicant portal and employee portal |
| 4 | Write Actual Code | Starting with API then Frontend |
| 5 | Comprehensive Testing | Unit Tests + Integration Tests + UAT |
| 6 | Launch MVP | Deploy first version for initial testing |

---

## 27. Final Summary

### Final Numbers Summary

| Item | Count |
|------|:-----:|
| User Roles | 7 |
| MVP Services | 8 |
| Deferred Services | 3 |
| MVP License Categories | 6 |
| Deferred Categories | 1 |
| Workflow Stages | 10 |
| Eligibility Rule Categories | 8 |
| Stage Gates | 4 |
| Simulated Integration Points | 4 |
| **Real Integration Points** | **3 (Email + SMS + Push)** |
| Application Form Fields | 21 |
| Required Documents | 8 |
| Database Tables | 21 |
| API Endpoints | ~52 |
| Screens/Pages | 21 |
| Core Reports | 7 |
| Email Templates | 10 |
| SMS Templates | 6 |
| Push Notification Events | 10 |
| Sprints | 10 (20 weeks) |

---

> **Note:** This document is the main and final reference for implementing the first version (MVP) of the driving license issuance system. Any change to scope or requirements must go through review and update of this document first.

---

**END OF PRD — Version 3.0 — Final Merged Edition** ✅
