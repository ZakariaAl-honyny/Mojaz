# README.md for Mojaz GitHub Repository

```markdown
<div align="center">

<img src="docs/assets/mojaz-logo.png" alt="Mojaz Logo" width="120" height="120" />

# مُجاز — Mojaz Platform

### Government Driving License Management System
### منصة إدارة رخص القيادة الحكومية

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-api-docs">API Docs</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

![Version](https://img.shields.io/badge/version-1.0.0--mvp-006C35?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-006C35?style=flat-square)
![Build](https://img.shields.io/github/actions/workflow/status/your-org/mojaz/ci.yml?style=flat-square&color=006C35)
![Tests](https://img.shields.io/badge/tests-500%2B-006C35?style=flat-square)
![Coverage](https://img.shields.io/badge/coverage-80%25%2B-006C35?style=flat-square)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?style=flat-square&logo=microsoftsqlserver)

<br/>

> **مُجاز** (*Mojaz*) — Arabic for *"Licensed"* / *"Authorized"*
>
> A comprehensive government digital platform for managing the complete
> driving license lifecycle — from application to issuance — fully online.

<br/>

**[🇸🇦 العربية](#arabic-section) · [🇬🇧 English](#english-section)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Platform Preview](#-platform-preview)
- [Key Numbers](#-key-numbers)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Services](#-services)
- [License Categories](#-license-categories)
- [User Roles](#-user-roles)
- [Workflow](#-workflow)
- [Internationalization](#-internationalization)
- [Notifications](#-notifications)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [AI Development Ecosystem](#-ai-development-ecosystem)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🌟 Overview

Mojaz is a **production-grade government digital platform** that digitizes and automates the complete driving license lifecycle in Saudi Arabia. Inspired by the Absher Design System, it provides a modern, official government experience with full **Arabic RTL** and **English LTR** support.

### What Mojaz Solves

| Current Problem | Mojaz Solution |
|----------------|----------------|
| Manual paper-based applications | Fully digital online process |
| Multiple in-person visits required | Single visit for tests only |
| No real-time status updates | Live tracking + instant notifications |
| Inconsistent rule enforcement | Automated, configurable rules engine |
| Limited to business hours | 24/7 online availability |
| No audit trail | Complete operation history |
| Siloed department workflows | Integrated 10-stage digital workflow |

### Design Philosophy

```
Official  ·  Accessible  ·  Bilingual  ·  Secure  ·  Modern
```

---

## 📸 Platform Preview

<div align="center">

| Landing Page (Arabic RTL) | Dashboard (Dark Mode) |
|:---:|:---:|
| ![Landing AR](docs/screenshots/landing-ar.png) | ![Dashboard Dark](docs/screenshots/dashboard-dark.png) |

| Application Wizard | Status Timeline |
|:---:|:---:|
| ![Wizard](docs/screenshots/wizard.png) | ![Timeline](docs/screenshots/timeline.png) |

| Employee Portal | Reports & Analytics |
|:---:|:---:|
| ![Employee](docs/screenshots/employee.png) | ![Reports](docs/screenshots/reports.png) |

</div>

---

## 📊 Key Numbers

<div align="center">

| Category | Count |
|:---------|:-----:|
| 👥 User Roles | **7** |
| 🛠️ MVP Services | **8** |
| 🪪 License Categories | **6** |
| 🔄 Workflow Stages | **10** |
| 🚧 Stage Gates | **4** |
| 🗄️ Database Tables | **21** |
| 🌐 API Endpoints | **~52** |
| 🖥️ UI Screens | **21** |
| 📊 Core Reports | **7** |
| 📧 Email Templates | **10** |
| 📱 SMS Templates | **6** |
| 🔔 Push Events | **10** |
| 🧪 Tests | **500+** |
| 📅 Sprints | **10 (20 weeks)** |

</div>

---

## ✨ Features

### For Citizens & Residents (Applicants)
- ✅ **Online Application** — Complete 5-step wizard for new license issuance
- ✅ **Document Upload** — Digital submission of all required documents
- ✅ **Appointment Booking** — Schedule medical exams and tests online
- ✅ **Payment Simulation** — Multi-point fee payment with receipts
- ✅ **Real-Time Tracking** — Live 10-stage application timeline
- ✅ **Digital License** — Download license as professional PDF
- ✅ **Multi-Language** — Full Arabic RTL and English LTR support
- ✅ **Dark/Light Mode** — User-selectable themes
- ✅ **Real Notifications** — SMS + Email + Push (Firebase FCM)

### For Government Employees
- ✅ **Role-Based Access** — 7 specialized roles with RBAC
- ✅ **Application Queue** — Prioritized work queues per role
- ✅ **Document Review** — Side-by-side document verification
- ✅ **Result Recording** — Medical, theory, and practical test results
- ✅ **Appointment Management** — Capacity planning and scheduling
- ✅ **Exception Handling** — Escalation and supervisory override

### For Managers & Administrators
- ✅ **7 Operational Reports** — With charts and data export
- ✅ **KPI Dashboard** — Real-time performance metrics
- ✅ **Fee Management** — Dynamic fee schedule configuration
- ✅ **System Settings** — All business rules configurable (no hardcoding)
- ✅ **Audit Trail** — Complete operation history with IP logging
- ✅ **User Management** — Role assignment and account control

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **ASP.NET Core** | 8.0 | Web API framework |
| **Clean Architecture** | — | 5-layer pattern (Domain→API) |
| **Entity Framework Core** | 8.0 | ORM |
| **SQL Server** | 2022 | Primary database |
| **JWT + Refresh Token** | — | Authentication |
| **FluentValidation** | 11.x | Input validation |
| **AutoMapper** | 13.x | Object mapping |
| **Hangfire** | 1.8.x | Background jobs |
| **Serilog** | — | Structured logging |
| **QuestPDF** | 2024.x | License PDF generation |
| **SendGrid SDK** | — | Email delivery |
| **Twilio SDK** | — | SMS delivery |
| **Firebase Admin SDK** | — | Push notifications |
| **Swagger / OpenAPI** | — | API documentation |
| **BCrypt.Net** | — | Password hashing |
| **xUnit + Moq** | — | Testing |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15 | Framework (App Router) |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Styling |
| **shadcn/ui** | — | Component library |
| **React Query** | 5 | Server state |
| **Zustand** | 5 | Client state |
| **React Hook Form** | 7 | Form management |
| **Zod** | 3 | Schema validation |
| **next-intl** | 3 | i18n (AR/EN) |
| **next-themes** | — | Dark/Light mode |
| **Framer Motion** | 11 | Animations |
| **Recharts** | 2 | Data visualization |
| **TanStack Table** | 8 | Advanced tables |
| **Firebase JS SDK** | 10 | Push notification client |
| **Lucide React** | — | Icons |
| **Playwright** | — | E2E testing |

### Infrastructure & DevOps

| Technology | Purpose |
|-----------|---------|
| **Docker + Docker Compose** | Containerization |
| **GitHub Actions** | CI/CD |
| **SQL Server 2022** | Database (containerized) |

---

## 🏗️ Architecture

### Clean Architecture (Backend)

```
┌─────────────────────────────────────────────────────────────┐
│                         Mojaz.API                           │
│              Controllers · Middleware · Program.cs           │
├─────────────────────────────────────────────────────────────┤
│                    Mojaz.Infrastructure                      │
│        EF Core · Repositories · External Services           │
│         SendGrid · Twilio · Firebase · Hangfire              │
├─────────────────────────────────────────────────────────────┤
│                    Mojaz.Application                         │
│          Services · DTOs · Validators · AutoMapper           │
├───────────────────────┬─────────────────────────────────────┤
│      Mojaz.Domain     │         Mojaz.Shared                │
│  Entities · Enums     │   ApiResponse<T> · PagedResult<T>   │
│  Domain Interfaces    │   Exceptions · Constants            │
└───────────────────────┴─────────────────────────────────────┘
        ↑ Zero external dependencies
```

### Frontend Architecture (Next.js 15 App Router)

```
src/
├── app/
│   └── [locale]/              ← Locale-based routing
│       ├── (public)/          ← Landing + Auth (unauthenticated)
│       ├── (applicant)/       ← Applicant portal
│       ├── (employee)/        ← Employee portal
│       └── (admin)/           ← Admin portal
├── components/
│   ├── ui/                    ← shadcn/ui base components
│   ├── layout/                ← Header, Sidebar, Footer
│   ├── forms/                 ← Reusable form components
│   └── domain/                ← Business-specific components
├── hooks/                     ← Custom React hooks
├── services/                  ← API service functions
├── stores/                    ← Zustand state stores
└── types/                     ← TypeScript definitions
```

### Notification Architecture

```
Event Occurs (e.g., Test Result Recorded)
         │
         ▼
┌─────────────────────┐
│  NotificationService │
│    (Orchestrator)   │
└──────────┬──────────┘
           │
     ┌─────┴──────────────────────────────┐
     │             │            │          │
     ▼             ▼            ▼          ▼
┌─────────┐ ┌──────────┐ ┌────────┐ ┌────────┐
│ In-App  │ │   Push   │ │ Email  │ │  SMS   │
│ (Sync)  │ │ Firebase │ │SendGrid│ │ Twilio │
│ Always  │ │(Hangfire)│ │(Hangf.)│ │(Hangf.)│
└─────────┘ └──────────┘ └────────┘ └────────┘
```

---

## 📁 Project Structure

```
mojaz/
├── 📄 AGENTS.md                    ← AI coding agent rules
├── 📄 README.md                    ← This file
├── 📄 docker-compose.yml           ← Development environment
├── 📄 docker-compose.prod.yml      ← Production environment
├── 📄 opencode.json                ← OpenCode CLI config
│
├── 📁 src/
│   ├── 📁 backend/                 ← ASP.NET Core 8
│   │   ├── Mojaz.sln
│   │   ├── Mojaz.Domain/
│   │   │   ├── Entities/           ← 21 entity classes
│   │   │   ├── Enums/
│   │   │   └── Interfaces/
│   │   ├── Mojaz.Shared/
│   │   │   ├── ApiResponse.cs
│   │   │   ├── PagedResult.cs
│   │   │   └── Exceptions/
│   │   ├── Mojaz.Application/
│   │   │   ├── Services/
│   │   │   ├── DTOs/
│   │   │   ├── Validators/
│   │   │   └── Profiles/           ← AutoMapper profiles
│   │   ├── Mojaz.Infrastructure/
│   │   │   ├── Persistence/
│   │   │   │   ├── MojazDbContext.cs
│   │   │   │   ├── Configurations/ ← EF Fluent API configs
│   │   │   │   ├── Migrations/
│   │   │   │   └── Seed/
│   │   │   ├── Repositories/
│   │   │   └── Services/           ← Email, SMS, Push
│   │   └── Mojaz.API/
│   │       ├── Controllers/
│   │       ├── Middleware/
│   │       └── Program.cs
│   │
│   └── 📁 frontend/                ← Next.js 15
│       ├── public/
│       │   ├── locales/
│       │   │   ├── ar/             ← Arabic translations
│       │   │   └── en/             ← English translations
│       │   └── firebase-messaging-sw.js
│       └── src/
│           ├── app/
│           │   └── [locale]/
│           ├── components/
│           ├── hooks/
│           ├── services/
│           ├── stores/
│           └── types/
│
├── 📁 tests/
│   ├── Mojaz.Domain.Tests/
│   ├── Mojaz.Application.Tests/
│   ├── Mojaz.Infrastructure.Tests/
│   ├── Mojaz.API.Tests/
│   └── Mojaz.E2E.Tests/            ← Playwright E2E tests
│
├── 📁 specs/                       ← Spec-Kit specifications
│   ├── spec.config.yml
│   └── [17 spec categories]/
│
├── 📁 features/                    ← Spec-Kit feature specs
│   └── [001-032 features]/
│   │   ├── 1-specify.md
│   │   ├── 2-clarify.md
│   │   ├── 3-plan.md
│   │   └── 4-tasks.md
│   │   └── 5-analyze.md
│   │   └── 6-implement.md
│
├── 📁 docs/
│   ├── prd.md                      ← Full Product Requirements
│   ├── api/                        ← API documentation
│   ├── database/                   ← ERD + schema docs
│   └── screenshots/
│
├── 📁 .cursor/
│   ├── rules/                      ← Cursor IDE skill files
│   └── mcp.json                    ← MCP configuration
│
├── 📁 .antigravity/                ← Antigravity IDE config
├── 📁 .claude/                     ← Claude Code config
└── 📁 .github/
    ├── workflows/
    │   ├── ci.yml                  ← Build + Test
    │   ├── spec-check.yml          ← Spec validation
    │   └── deploy.yml              ← Deployment
    └── copilot-instructions.md
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Install |
|------------|---------|---------|
| .NET SDK | 8.0+ | [dotnet.microsoft.com](https://dotnet.microsoft.com) |
| Node.js | 20 LTS+ | [nodejs.org](https://nodejs.org) |
| Docker Desktop | Latest | [docker.com](https://docker.com) |
| Git | 2.40+ | [git-scm.com](https://git-scm.com) |

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/mojaz.git
cd mojaz
```

### 2. Configure Environment Variables

```bash
# Copy the environment template
cp .env.example .env.local

# Edit with your actual values
nano .env.local   # or code .env.local
```

> See [Environment Variables](#-environment-variables) for all required variables.

### 3. Start Infrastructure (Docker)

```bash
# Start SQL Server container
docker-compose up -d sqlserver

# Wait for SQL Server to be ready (~30 seconds)
docker-compose logs -f sqlserver
# Look for: "SQL Server is now ready for client connections."
```

### 4. Setup Backend

```bash
cd src/backend

# Restore NuGet packages
dotnet restore Mojaz.sln

# Run database migrations and seed data
dotnet ef database update \
  --project Mojaz.Infrastructure \
  --startup-project Mojaz.API

# Start the API
cd Mojaz.API
dotnet run
# API available at: https://localhost:7127
# Swagger UI at:    https://localhost:7127/swagger
```

### 5. Setup Frontend

```bash
cd src/frontend

# Install npm packages
npm install

# Start development server
npm run dev
# App available at: http://localhost:3000
```

### 6. Access the Platform

| Portal | URL | Default Credentials |
|--------|-----|---------------------|
| **Landing Page** | http://localhost:3000 | — |
| **Applicant Portal** | http://localhost:3000/ar/dashboard | applicant@test.com / Test@1234 |
| **Employee Portal** | http://localhost:3000/ar/employee | receptionist@mojaz.gov.sa / Test@1234 |
| **Admin Portal** | http://localhost:3000/ar/admin | admin@mojaz.gov.sa / Admin@Mojaz2025 |
| **API Base** | https://localhost:7127/api/v1 | — |
| **Swagger UI** | https://localhost:7127/swagger | — |
| **Hangfire Dashboard** | https://localhost:7127/hangfire | Admin credentials |

> 🎉 **You're ready!** Navigate to the landing page and explore Mojaz.

---

## 🔐 Environment Variables

Create `.env.local` in the project root (never commit this file):

```bash
# ════════════════════════════════════════
# DATABASE
# ════════════════════════════════════════
MSSQL_SA_PASSWORD=
DATABASE_NAME=
CONNECTION_STRING=Server=localhost,1433;Database=MojazDB;User Id=sa;Password=;TrustServerCertificate=True

# ════════════════════════════════════════
# JWT AUTHENTICATION
# ════════════════════════════════════════
JWT_SECRET=
JWT_ISSUER=
JWT_AUDIENCE=
JWT_ACCESS_TOKEN_MINUTES=60
JWT_REFRESH_TOKEN_DAYS=7

# ════════════════════════════════════════
# EMAIL — SendGrid (Real Integration ✅)
# ════════════════════════════════════════
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
SENDGRID_FROM_NAME=مُجاز — Mojaz Platform

# ════════════════════════════════════════
# SMS — Twilio (Real Integration ✅)
# ════════════════════════════════════════
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# ════════════════════════════════════════
# PUSH NOTIFICATIONS — Firebase (Real ✅)
# ════════════════════════════════════════
FIREBASE_PROJECT_ID=
FIREBASE_CREDENTIAL_PATH=

# ════════════════════════════════════════
# FRONTEND (Next.js Public Variables)
# ════════════════════════════════════════
NEXT_PUBLIC_API_URL=https://localhost:7127/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBasslXEjiTU9I6jry1ezlmcp1bzhIIsWc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mojaz-659bb.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mojaz-659bb
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1037227934375
NEXT_PUBLIC_FIREBASE_APP_ID=1:1037227934375:web:071a411b37dad7fee75182

# ════════════════════════════════════════
# FILE STORAGE
# ════════════════════════════════════════
FILE_STORAGE_PATH=./uploads
MAX_FILE_SIZE_MB=5

# ════════════════════════════════════════
# ENVIRONMENT
# ════════════════════════════════════════
ASPNETCORE_ENVIRONMENT=Development
```

> ⚠️ **Security**: Never commit `.env.local` or `firebase-service-account.json`
> They are already in `.gitignore`.

---

## 🗄️ Database Setup

### Schema Overview (21 Tables)

```
Core Entities:
  Users                 ← System accounts (all roles)
  Applicants            ← Extended applicant profiles (1:1 User)
  Applications          ← License applications (core entity)
  LicenseCategories     ← A, B, C, D, E, F categories
  Licenses              ← Issued driving licenses

Workflow Entities:
  Documents             ← Uploaded files per application
  Appointments          ← Medical/Theory/Practical bookings
  MedicalExams          ← Exam records and results
  TrainingRecords       ← Training completion records
  TheoryTests           ← Theory test attempts + results
  PracticalTests        ← Practical test attempts + results

Financial:
  Payments              ← Individual payment transactions
  FeeStructures         ← Admin-managed fee schedule

Notifications:
  Notifications         ← In-app notification records
  PushTokens            ← FCM device tokens

Configuration:
  SystemSettings        ← All configurable system values

Security & Audit:
  AuditLogs             ← Complete operation audit trail
  OtpCodes              ← Verification code records
  RefreshTokens         ← JWT refresh token store

Logging:
  EmailLogs             ← Email delivery history
  SmsLogs               ← SMS delivery history
```

### Migrations

```bash
# Create new migration
cd src/backend
dotnet ef migrations add MigrationName \
  --project Mojaz.Infrastructure \
  --startup-project Mojaz.API

# Apply migrations
dotnet ef database update \
  --project Mojaz.Infrastructure \
  --startup-project Mojaz.API

# Rollback to previous migration
dotnet ef database update PreviousMigrationName \
  --project Mojaz.Infrastructure \
  --startup-project Mojaz.API

# View pending migrations
dotnet ef migrations list \
  --project Mojaz.Infrastructure \
  --startup-project Mojaz.API
```

### Seed Data

The following seed data is automatically applied:

```
✅ Admin user account (admin@mojaz.gov.sa)
✅ Sample users — one per role (7 accounts)
✅ 6 license categories (A, B, C, D, E, F)
✅ 45+ system settings (ages, limits, periods)
✅ Default fee structures (all fee types)
✅ Sample branches (3 branches)
```

---

## ▶️ Running the Application

### Development Mode

```bash
# Start all services at once
docker-compose up -d

# Or start individually:
# 1. Database
docker-compose up -d sqlserver

# 2. Backend API (in new terminal)
cd src/backend/Mojaz.API
dotnet watch run

# 3. Frontend (in new terminal)
cd src/frontend
npm run dev
```

### Docker Compose (Full Stack)

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f sqlserver

# Stop everything
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

### Available Scripts

#### Backend

```bash
cd src/backend

dotnet build Mojaz.sln                  # Build all projects
dotnet test                             # Run all tests
dotnet test --coverage                  # Run tests with coverage
dotnet watch run --project Mojaz.API    # Hot reload development
```

#### Frontend

```bash
cd src/frontend

npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run Jest unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Playwright with interactive UI
```

---

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: [https://localhost:7127/swagger](https://localhost:7127/swagger)
- **OpenAPI JSON**: [https://localhost:7127/swagger/v1/swagger.json](https://localhost:7127/swagger/v1/swagger.json)
- **Base URL (Development)**: `https://localhost:7127/api/v1`
- **Base URL (Production)**: `https://api.mojaz.gov.sa/api/v1`

### API Structure

All endpoints follow RESTful conventions under `/api/v1/`:

```
/api/v1/auth/              ← Authentication (8 endpoints)
/api/v1/applications/      ← Application management (7 endpoints)
/api/v1/applications/{id}/documents/  ← Document management (3 endpoints)
/api/v1/appointments/      ← Appointment booking (4 endpoints)
/api/v1/medical-exams/     ← Medical examinations (3 endpoints)
/api/v1/theory-tests/      ← Theory test results (2 endpoints)
/api/v1/practical-tests/   ← Practical test results (2 endpoints)
/api/v1/tests/             ← Test history (1 endpoint)
/api/v1/payments/          ← Payment processing (4 endpoints)
/api/v1/licenses/          ← License management (3 endpoints)
/api/v1/reports/           ← Operational reports (6 endpoints)
/api/v1/notifications/     ← Notification management (5 endpoints)
/api/v1/settings/          ← System configuration (4 endpoints)
/api/v1/users/             ← User management (6 endpoints)
/api/v1/audit-logs/        ← Audit trail (2 endpoints)
```

### Response Format

Every API response follows the standard contract:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { },
  "errors": null,
  "statusCode": 200
}
```

### Authentication

```bash
# 1. Register a new account
curl -X POST https://localhost:7127/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "أحمد محمد",
    "email": "ahmed@example.com",
    "password": "SecureP@ss123",
    "confirmPassword": "SecureP@ss123",
    "registrationMethod": "Email",
    "preferredLanguage": "ar",
    "termsAccepted": true
  }'

# 2. Login to get JWT token
curl -X POST https://localhost:7127/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "ahmed@example.com",
    "password": "SecureP@ss123",
    "method": "Email"
  }'

# 3. Use token in subsequent requests
curl -X GET https://localhost:7127/api/v1/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🧪 Testing

### Test Strategy

```
Unit Tests       → Business logic, validators, services
Integration Tests → API endpoints with database
E2E Tests        → Complete user flows via browser
```

### Running Tests

```bash
# All backend tests
cd src/backend
dotnet test

# Specific test project
dotnet test tests/Mojaz.Application.Tests/

# With coverage report
dotnet test --collect:"XPlat Code Coverage"
reportgenerator -reports:"**/coverage.cobertura.xml" \
  -targetdir:"coverage-report" -reporttypes:Html

# Frontend unit tests
cd src/frontend
npm test
npm test -- --coverage

# E2E tests (requires running app)
npm run test:e2e

# E2E with UI (interactive)
npm run test:e2e:ui

# E2E for specific flow
npx playwright test tests/e2e/new-license-flow.spec.ts
```

### Test Coverage Targets

| Layer | Target | Focus |
|-------|--------|-------|
| Domain | 90%+ | Business rules |
| Application (Services) | 85%+ | Service methods |
| Application (Validators) | 100% | All validation rules |
| Infrastructure | 60%+ | Repository implementations |
| API (Controllers) | 80%+ | Endpoint integration |
| Frontend (Components) | 70%+ | User interactions |
| E2E | Key flows | Complete user journeys |

---

## 🛠️ Services

The platform offers **8 core services** in MVP v1.0:

| # | Service | Arabic | Description |
|---|---------|--------|-------------|
| 01 | **New License Issuance** | إصدار رخصة جديدة | Full 10-stage workflow for first-time applicants |
| 02 | **License Renewal** | تجديد الرخصة | Renewal for expiring/expired licenses |
| 03 | **Lost/Damaged Replacement** | بدل فاقد/تالف | Replace lost or damaged license |
| 04 | **Category Upgrade** | ترقية الفئة | Transition to higher license category |
| 05 | **Test Retake** | إعادة الاختبار | Reactivate after failed test |
| 06 | **Appointment Booking** | حجز موعد | Book medical exam or test appointments |
| 07 | **Application Cancellation** | إلغاء الطلب | Cancel before completion |
| 08 | **Document Download** | تحميل المستندات | Download receipts, results, and license PDF |

---

## 🪪 License Categories

| Code | Category | Arabic | Min Age | Validity |
|------|----------|--------|---------|---------|
| **A** | Motorcycle | دراجة نارية | 16 years | 10 years |
| **B** | Private Car | سيارة خاصة | 18 years | 10 years |
| **C** | Commercial/Taxi | تجاري/أجرة | 21 years | 5 years |
| **D** | Bus/Transport | حافلة/نقل ركاب | 21 years | 5 years |
| **E** | Heavy Vehicles | مركبات ثقيلة | 21 years | 5 years |
| **F** | Agricultural | مركبات زراعية | 18 years | 10 years |

### Upgrade Paths

```
A (Motorcycle) → No upgrades

B (Private) ──→ C (Commercial) ──→ D (Bus) ──→ E (Heavy)

F (Agricultural) ──→ B (Private)
```

> All minimum ages are configurable via `SystemSettings` table.
> **Zero hardcoded values** in code.

---

## 👥 User Roles

| Role | Arabic | Primary Function |
|------|--------|-----------------|
| **Applicant** | المتقدم | Submit applications, track status, pay fees |
| **Receptionist** | موظف الاستقبال | Review applications, verify documents |
| **Doctor** | الطبيب | Conduct medical exams, record results |
| **Examiner** | الفاحص | Conduct tests, record results |
| **Manager** | المدير | Oversight, exceptions, reports |
| **Security** | الجهة الأمنية | Regulatory compliance verification |
| **Admin** | مسؤول النظام | System configuration, user management |

---

## 🔄 Workflow

The New License Issuance follows a **10-stage workflow** with **4 quality gates**:

```
01 Application Creation
      │
      ▼ ⛩️ Gate 1: Age check, no active app, no blocks
02 Document Upload & Review
      │
      ▼
03 Initial Payment (Application Fee)
      │
      ▼ ⛩️ Gate 2: Payment confirmed, data complete
04 Medical Examination
      │
      ▼
05 Driving School Training
      │
      ▼ ⛩️ Gate 3: Medical fit, training complete, within attempt limits
06 Theory Test
      │
      ▼
07 Practical Test
      │
      ▼
08 Final Approval
      │
      ▼ ⛩️ Gate 4: All tests passed, security clean, ID + medical valid
09 Issuance Payment (License Fee)
      │
      ▼
10 License Issuance & Download ← PDF Generated
```

---

## 🌍 Internationalization

Mojaz supports **full bidirectional layout switching**:

### Languages

| Language | Code | Direction | Font |
|---------|------|-----------|------|
| **Arabic** | `ar` | RTL (Right-to-Left) | IBM Plex Sans Arabic |
| **English** | `en` | LTR (Left-to-Right) | Inter |

### How It Works

```typescript
// Switching language in the app
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const router = useRouter();

// Switch to Arabic (RTL)
router.replace('/ar/dashboard');

// Switch to English (LTR)
router.replace('/en/dashboard');
```

When language switches:
- ✅ Layout direction flips completely (sidebar, text alignment)
- ✅ Directional icons rotate 180° (arrows, chevrons)
- ✅ Font changes (Arabic/English)
- ✅ Date/number formatting adapts
- ✅ Email and SMS templates sent in user's language

---

## 🔔 Notifications

Mojaz sends **real notifications** via 4 channels:

| Channel | Type | Provider |
|---------|------|---------|
| **In-App** | Internal | Database (always enabled) |
| **Push** | Web Browser | Firebase Cloud Messaging ✅ Real |
| **Email** | Electronic | SendGrid ✅ Real |
| **SMS** | Text Message | Twilio ✅ Real |

### Notification Events

| Event | In-App | Push | Email | SMS |
|-------|:------:|:----:|:-----:|:---:|
| Application received | ✅ | ✅ | ✅ | — |
| Documents missing | ✅ | ✅ | ✅ | ✅ |
| Payment confirmed | ✅ | ✅ | ✅ | — |
| Appointment booked | ✅ | ✅ | ✅ | ✅ |
| Appointment reminder | ✅ | ✅ | ✅ | ✅ |
| Medical exam result | ✅ | ✅ | ✅ | ✅ |
| Test result | ✅ | ✅ | ✅ | ✅ |
| Application approved | ✅ | ✅ | ✅ | ✅ |
| License issued | ✅ | ✅ | ✅ | ✅ |
| Application cancelled | ✅ | ✅ | ✅ | — |

> Push/Email/SMS are delivered asynchronously via **Hangfire** background jobs.
> In-App notifications are always enabled and cannot be disabled by users.

---

## 🚢 Deployment

### Production with Docker Compose

```bash
# Build production images
docker build -t mojaz-api:latest -f src/backend/Mojaz.API/Dockerfile .
docker build -t mojaz-frontend:latest -f src/frontend/Dockerfile .

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Run migrations on production database
docker-compose -f docker-compose.prod.yml exec api \
  dotnet ef database update \
  --project Mojaz.Infrastructure \
  --startup-project Mojaz.API

# Verify health
curl https://api.mojaz.gov.sa/health
```

### Health Checks

```
GET /health              → API health status
GET /health/db           → Database connectivity
GET /health/email        → SendGrid connectivity
GET /health/sms          → Twilio connectivity
```

### Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time (P95) | < 2 seconds |
| Page Load Time | < 3 seconds |
| System Uptime | 99.5% |
| Concurrent Users | 100-500 (MVP) |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Read the Rules

Before contributing, read:
- [`AGENTS.md`](AGENTS.md) — All coding conventions and rules
- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) — Sprint plan and roadmap

### 2. Branch Strategy

```bash
# Feature branches
git checkout -b feature/MOJAZ-XXX-description

# Bug fixes
git checkout -b bugfix/MOJAZ-XXX-description

# Hotfixes (production)
git checkout -b hotfix/description

# Release branches
git checkout -b release/v1.1.0
```

### 3. Commit Message Format

```
type(scope): description

Types: feat, fix, docs, refactor, test, chore, style, perf, ci
Scope: auth, applications, workflow, payments, notifications, ui, api, db

Examples:
feat(applications): implement Gate 1 eligibility validation
fix(auth): correct OTP expiry calculation for SMS
docs(api): add Swagger examples for license endpoints
test(applications): add unit tests for ApplicationService
```

### 4. Pull Request Checklist

Before opening a PR, verify:

```
□ Code follows AGENTS.md conventions
□ All tests pass (dotnet test + npm test)
□ New code has tests (≥80% coverage for business logic)
□ API endpoints documented in Swagger
□ DTOs used (no raw entities in responses)
□ No hardcoded business values
□ i18n translations added (AR + EN)
□ RTL/LTR layout tested
□ Dark/Light mode tested
□ Responsive design verified
□ Audit logging for sensitive operations
□ Commit message follows format
□ Branch is up to date with develop
```

### 5. Code Review

All PRs require:
- ✅ Passing CI checks (build + tests)
- ✅ Code review approval
- ✅ No merge conflicts

---

## 🤖 AI Development Ecosystem

This project uses a comprehensive AI-powered development workflow:

### Agents

| Agent | Role | Best For |
|-------|------|---------|
| **Cursor IDE** | Primary coding | Multi-file editing, codebase navigation |
| **Antigravity IDE** | Visual development | Live preview, RTL/LTR verification |
| **Claude Code** | Architecture | Complex logic, design decisions |
| **OpenCode CLI** | Quick tasks | Terminal tasks, DB queries, fast fixes |
| **Codex CLI** | Automation | Batch generation, spec-kit commands |

### MCP Servers

| MCP | Purpose |
|-----|---------|
| Filesystem | File operations |
| GitHub | Repository management |
| Database (MSSQL) | SQL Server queries |
| Browser (Puppeteer) | Visual + E2E testing |
| Docker | Container management |
| Memory | Persistent AI context |
| Fetch | HTTP API testing |
| Brave Search | Documentation lookup |

### Spec-Kit Workflow

```bash
# Install spec-kit
npm install -g spec-kit

# Initialize in project
npx specify init

# Per-feature workflow
/speckit.specify     # Define requirements
/speckit.clarify     # Resolve ambiguities
/speckit.plan        # Create technical plan
/speckit.tasks       # Generate task list
/speckit.analyze     # Verify consistency
/speckit.implement   # Execute all tasks
```

See [`AGENTS.md`](AGENTS.md) for the complete AI development guide.

---

## 🗺️ Roadmap

### MVP v1.0 (Current) — 20 Weeks

- [x] Sprint 0: Project scaffold and foundation
- [ ] Sprint 1-2: Authentication + Real integrations (Email/SMS/Push)
- [ ] Sprint 3-4: Applications + Documents
- [ ] Sprint 5-6: Medical, Training, and Tests
- [ ] Sprint 7-8: Approval, Payment, and License Issuance
- [ ] Sprint 9-10: Reports, Landing Page, and Launch

### Phase 2 (Post-MVP)

| Feature | Priority |
|---------|---------|
| Foreign License Conversion | High |
| License Suspension/Revocation | High |
| Real Payment Gateway (Mada, STC Pay) | Critical |
| Real Identity Verification (NIC) | Critical |
| Category P (Professional/Specialized) | Medium |
| Two-Factor Authentication (2FA) | High |
| International Driving License | Medium |

### Phase 3 (Future)

| Feature | Priority |
|---------|---------|
| Native Mobile App (iOS + Android) | High |
| Biometric Authentication | Medium |
| Additional Languages (Urdu, Bengali, etc.) | Low |
| Advanced Analytics & ML | Medium |

---

## 📄 License

```
MIT License

Copyright (c) 2025 Mojaz Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact & Support

| Channel | Link |
|---------|------|
| 🐛 **Bug Reports** | [GitHub Issues](https://github.com/your-org/mojaz/issues) |
| 💡 **Feature Requests** | [GitHub Discussions](https://github.com/your-org/mojaz/discussions) |
| 📖 **Documentation** | [docs/](./docs/) |
| 📧 **Security Issues** | security@mojaz.gov.sa |

---

<div align="center">

---

### Built with ❤️ for Saudi Arabia 🇸🇦

**مُجاز — تجربة حكومية رقمية من الجيل القادم**

*Mojaz — A Next-Generation Government Digital Experience*

---

![Made with ASP.NET Core](https://img.shields.io/badge/Made%20with-ASP.NET%20Core%208-512BD4?style=flat-square&logo=dotnet)
![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js%2015-000000?style=flat-square&logo=nextdotjs)
![Powered by AI](https://img.shields.io/badge/Powered%20by-AI%20Agents-006C35?style=flat-square)

</div>
```