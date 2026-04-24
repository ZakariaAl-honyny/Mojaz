# IMPLEMENTATION_PLAN.md — Mojaz (مُجاز) Platform

> Comprehensive implementation plan for building the Mojaz MVP.
> Duration: 20 weeks (10 sprints × 2 weeks each)
> This document breaks down every sprint into detailed, actionable tasks.

---

## Table of Contents

1. [Implementation Overview](#1-implementation-overview)
2. [Prerequisites & Environment Setup](#2-prerequisites--environment-setup)
3. [Sprint 0 — Project Scaffold & Planning](#3-sprint-0--project-scaffold--planning)
4. [Sprint 1-2 — Infrastructure, Auth & Integrations](#4-sprint-1-2--infrastructure-auth--integrations)
5. [Sprint 3-4 — Applications & Documents](#5-sprint-3-4--applications--documents)
6. [Sprint 5-6 — Medical, Training & Tests](#6-sprint-5-6--medical-training--tests)
7. [Sprint 7-8 — Approval, Payment & License Issuance](#7-sprint-7-8--approval-payment--license-issuance)
8. [Sprint 9-10 — Reports, Polish & Launch](#8-sprint-9-10--reports-polish--launch)
9. [Cross-Cutting Concerns](#9-cross-cutting-concerns)
10. [Dependency Graph](#10-dependency-graph)
11. [Risk Mitigation During Implementation](#11-risk-mitigation-during-implementation)
12. [Quality Gates](#12-quality-gates)
13. [Deployment Strategy](#13-deployment-strategy)

---

## 1. Implementation Overview

### 1.1 Sprint Timeline

```
Week  01-02  ─── Sprint 0  ─── Planning & Scaffold
Week  03-06  ─── Sprint 1-2 ── Infrastructure + Auth + Real Integrations
Week  07-10  ─── Sprint 3-4 ── Applications + Documents + Review
Week  11-14  ─── Sprint 5-6 ── Medical + Training + Tests + Appointments
Week  15-18  ─── Sprint 7-8 ── Approval + Payments + License Issuance
Week  19-20  ─── Sprint 9-10 ─ Reports + Notifications + Landing + Launch
```

### 1.2 Implementation Principles

```
1. Backend-first approach: API → then Frontend
2. Vertical slices: Complete one feature end-to-end before moving on
3. Database migrations: Incremental, never destructive
4. Testing alongside: Write tests WITH features, not after
5. Integration early: Connect SMS/Email/Push in Sprint 1-2
6. i18n from day one: Every UI string through translation system
7. Audit from day one: Every sensitive operation logged
8. Configurable from day one: All business values in SystemSettings
```

### 1.3 Definition of Done (Global)

```
Every task is "Done" when:
  ✅ Code written and compiles
  ✅ Unit tests pass (≥80% coverage for business logic)
  ✅ API documented in Swagger
  ✅ Validation rules implemented
  ✅ Error handling in place
  ✅ Audit logging for sensitive operations
  ✅ i18n support (AR + EN)
  ✅ RTL + LTR verified
  ✅ Dark + Light mode verified
  ✅ Responsive design verified
  ✅ Code reviewed (or self-reviewed against AGENTS.md)
  ✅ Spec status updated
  ✅ Committed with proper message format
```

---

## 2. Prerequisites & Environment Setup

### 2.1 Development Environment

```
Required Software:
  ├── .NET SDK 8.0.x
  ├── Node.js 20.x LTS
  ├── SQL Server 2022 (or Docker container)
  ├── Git 2.40+
  ├── VS Code or Visual Studio 2022 or Rider
  ├── Docker Desktop
  ├── Postman or Insomnia (API testing)
  └── Browser: Chrome + Firefox (for RTL testing)

Required Accounts:
  ├── GitHub (repository hosting)
  ├── SendGrid (email service) — Free tier for MVP
  ├── Twilio (SMS service) — Trial account for MVP
  ├── Firebase (push notifications) — Free tier
  └── Docker Hub (optional, for container registry)
```

### 2.2 Project Initialization Commands

```bash
# ═══════════════════════════════════════════════
# STEP 1: Create root project directory
# ═══════════════════════════════════════════════
mkdir mojaz && cd mojaz
git init

# ═══════════════════════════════════════════════
# STEP 2: Create directory structure
# ═══════════════════════════════════════════════
mkdir -p src/backend src/frontend tests docs specs

# ═══════════════════════════════════════════════
# STEP 3: Backend — Create .NET Solution
# ═══════════════════════════════════════════════
cd src/backend

dotnet new sln -n Mojaz

# Create projects following Clean Architecture
dotnet new classlib -n Mojaz.Domain -o Mojaz.Domain
dotnet new classlib -n Mojaz.Shared -o Mojaz.Shared
dotnet new classlib -n Mojaz.Application -o Mojaz.Application
dotnet new classlib -n Mojaz.Infrastructure -o Mojaz.Infrastructure
dotnet new webapi -n Mojaz.API -o Mojaz.API --no-https false

# Add projects to solution
dotnet sln add Mojaz.Domain/Mojaz.Domain.csproj
dotnet sln add Mojaz.Shared/Mojaz.Shared.csproj
dotnet sln add Mojaz.Application/Mojaz.Application.csproj
dotnet sln add Mojaz.Infrastructure/Mojaz.Infrastructure.csproj
dotnet sln add Mojaz.API/Mojaz.API.csproj

# Set project references (Clean Architecture dependency flow)
cd Mojaz.Application
dotnet add reference ../Mojaz.Domain/Mojaz.Domain.csproj
dotnet add reference ../Mojaz.Shared/Mojaz.Shared.csproj

cd ../Mojaz.Infrastructure
dotnet add reference ../Mojaz.Domain/Mojaz.Domain.csproj
dotnet add reference ../Mojaz.Shared/Mojaz.Shared.csproj
dotnet add reference ../Mojaz.Application/Mojaz.Application.csproj

cd ../Mojaz.API
dotnet add reference ../Mojaz.Application/Mojaz.Application.csproj
dotnet add reference ../Mojaz.Infrastructure/Mojaz.Infrastructure.csproj
dotnet add reference ../Mojaz.Shared/Mojaz.Shared.csproj

# ═══════════════════════════════════════════════
# STEP 4: Install Backend NuGet Packages
# ═══════════════════════════════════════════════

# Mojaz.Domain — NO packages (zero dependencies)

# Mojaz.Shared
cd ../Mojaz.Shared
# (no packages needed, pure C# classes)

# Mojaz.Application
cd ../Mojaz.Application
dotnet add package AutoMapper 13.0.1
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package FluentValidation 11.9.0
dotnet add package FluentValidation.DependencyInjectionExtensions

# Mojaz.Infrastructure
cd ../Mojaz.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore 8.0.8
dotnet add package Microsoft.EntityFrameworkCore.SqlServer 8.0.8
dotnet add package Microsoft.EntityFrameworkCore.Tools 8.0.8
dotnet add package BCrypt.Net-Next 4.0.3
dotnet add package SendGrid 9.29.3
dotnet add package Twilio 7.3.1
dotnet add package FirebaseAdmin 3.0.0
dotnet add package Hangfire 1.8.14
dotnet add package Hangfire.SqlServer
dotnet add package QuestPDF 2024.6.5
dotnet add package Serilog.AspNetCore 8.0.1
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File

# Mojaz.API
cd ../Mojaz.API
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer 8.0.8
dotnet add package Swashbuckle.AspNetCore 6.7.0
dotnet add package AspNetCoreRateLimit 5.0.0
dotnet add package Microsoft.AspNetCore.Cors

# ═══════════════════════════════════════════════
# STEP 5: Create Test Projects
# ═══════════════════════════════════════════════
cd ../../..  # Back to root
cd tests

dotnet new xunit -n Mojaz.Domain.Tests
dotnet new xunit -n Mojaz.Application.Tests
dotnet new xunit -n Mojaz.Infrastructure.Tests
dotnet new xunit -n Mojaz.API.Tests

# Add test packages
for proj in Mojaz.Domain.Tests Mojaz.Application.Tests \
            Mojaz.Infrastructure.Tests Mojaz.API.Tests; do
  cd $proj
  dotnet add package Moq 4.20.70
  dotnet add package FluentAssertions 6.12.0
  dotnet add package Microsoft.AspNetCore.Mvc.Testing 8.0.8
  cd ..
done

# Add test project references
cd Mojaz.Domain.Tests
dotnet add reference ../../src/backend/Mojaz.Domain/Mojaz.Domain.csproj
cd ../Mojaz.Application.Tests
dotnet add reference ../../src/backend/Mojaz.Application/Mojaz.Application.csproj
dotnet add reference ../../src/backend/Mojaz.Domain/Mojaz.Domain.csproj
cd ../Mojaz.Infrastructure.Tests
dotnet add reference ../../src/backend/Mojaz.Infrastructure/Mojaz.Infrastructure.csproj
cd ../Mojaz.API.Tests
dotnet add reference ../../src/backend/Mojaz.API/Mojaz.API.csproj

# Add test projects to solution
cd ../../src/backend
dotnet sln add ../../tests/Mojaz.Domain.Tests/Mojaz.Domain.Tests.csproj
dotnet sln add ../../tests/Mojaz.Application.Tests/Mojaz.Application.Tests.csproj
dotnet sln add ../../tests/Mojaz.Infrastructure.Tests/Mojaz.Infrastructure.Tests.csproj
dotnet sln add ../../tests/Mojaz.API.Tests/Mojaz.API.Tests.csproj

# ═══════════════════════════════════════════════
# STEP 6: Frontend — Create Next.js Project
# ═══════════════════════════════════════════════
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --eslint \
    --app --src-dir --import-alias "@/*"

# Install dependencies
npm install axios @tanstack/react-query@5 zustand@5 \
    react-hook-form@7 @hookform/resolvers zod@3 \
    next-intl@3 next-themes framer-motion@11 \
    recharts@2 @tanstack/react-table@8 \
    lucide-react clsx tailwind-merge \
    firebase@10

# Install shadcn/ui
npx shadcn@latest init

# Add commonly used shadcn components
npx shadcn@latest add button card input label select \
    textarea checkbox radio-group switch tabs \
    dialog sheet dropdown-menu popover tooltip \
    table badge avatar separator scroll-area \
    toast sonner alert alert-dialog form \
    calendar date-picker command accordion \
    progress skeleton breadcrumb pagination \
    navigation-menu sidebar

# Install dev dependencies
npm install -D @types/node prettier eslint-config-prettier \
    @playwright/test

# ═══════════════════════════════════════════════
# STEP 7: Create Docker Compose (Development)
# ═══════════════════════════════════════════════
cd ../..  # Back to root
```

### 2.3 Docker Compose

```yaml
# docker-compose.yml (at project root)
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: mojaz-db
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=MojazDev@2025!
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - sqlserver-data:/var/opt/mssql

  api:
    build:
      context: ./src/backend
      dockerfile: Mojaz.API/Dockerfile
    container_name: mojaz-api
    depends_on:
      - sqlserver
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=MojazDB;User Id=sa;Password=MojazDev@2025!;TrustServerCertificate=True
    ports:
      - "5000:8080"

  frontend:
    build:
      context: ./src/frontend
      dockerfile: Dockerfile
    container_name: mojaz-frontend
    depends_on:
      - api
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ports:
      - "3000:3000"

volumes:
  sqlserver-data:
```

---

## 3. Sprint 0 — Project Scaffold & Planning

**Duration:** Week 1-2 (before sprint cycle starts)
**Goal:** Everything ready to start coding in Sprint 1

### 3.1 Tasks

```
SPRINT 0 — PROJECT SCAFFOLD & PLANNING
═══════════════════════════════════════

TASK 0.1 — Repository Setup
├── Status: [x] ✅ COMPLETE
├── Priority: Critical
├── Assignee: Tech Lead
├── Tasks:
│   ├── [x] Create GitHub repository
│   ├── [x] Setup branch protection rules (main, develop)
│   ├── [x] Create .gitignore (dotnet + node + IDE files)
│   ├── [x] Create README.md with project overview
│   ├── [x] Create AGENTS.md
│   ├── [x] Create IMPLEMENTATION_PLAN.md
│   ├── [x] Create LICENSE file
│   └── [x] Setup GitHub Actions CI/CD skeleton
├── Deliverable: Clean repository with branch strategy
└── Tag: v0.0.1

TASK 0.2 — Backend Solution Scaffold
├── Status: [x] ✅ COMPLETE
├── Priority: Critical
├── Assignee: Backend Lead
├── Tasks:
│   ├── [x] Create .NET 8 solution with 5 projects
│   ├── [x] Setup Clean Architecture folder structure
│   ├── [x] Install all NuGet packages
│   ├── [x] Create base entity classes
│   │   ├── [x] BaseEntity (Id, CreatedAt, UpdatedAt)
│   │   ├── [x] AuditableEntity (CreatedBy, UpdatedBy)
│   │   └── [x] SoftDeletableEntity (IsDeleted)
│   ├── [x] Create shared types
│   │   ├── [x] ApiResponse<T>
│   │   ├── [x] PagedResult<T>
│   │   ├── [x] Result<T> (internal operation result)
│   │   └── [x] Custom exceptions
│   ├── [x] Configure Serilog logging
│   ├── [x] Configure Swagger with JWT auth
│   ├── [x] Create global exception handler middleware
│   ├── [x] Create request logging middleware
│   └── [x] Verify solution builds successfully
├── Deliverable: Building .NET solution with all patterns
└── Tag: v0.0.2

TASK 0.3 — Frontend Project Scaffold
├── Status: [x] ✅ COMPLETE
├── Priority: Critical
├── Assignee: Frontend Lead
├── Tasks:
│   ├── [x] Create Next.js 15 project with App Router
│   ├── [x] Install and configure all npm packages
│   ├── [x] Setup Tailwind with Mojaz theme colors
│   ├── [x] Install and configure shadcn/ui
│   ├── [x] Setup next-intl for i18n
│   │   ├── [x] Create locale routing ([locale] folder)
│   │   ├── [x] Create AR translation files structure
│   │   ├── [x] Create EN translation files structure
│   │   └── [x] Create middleware for locale detection
│   ├── [x] Setup next-themes for dark/light mode
│   ├── [x] Create base layout components
│   │   ├── [x] RootLayout (with locale + direction)
│   │   ├── [x] PublicLayout (landing + auth pages)
│   │   ├── [x] ApplicantLayout (sidebar + header)
│   │   ├── [x] EmployeeLayout (sidebar + header)
│   │   └── [x] AdminLayout (sidebar + header)
│   ├── [x] Create Axios API client with interceptors
│   │   ├── [x] Base URL configuration
│   │   ├── [x] JWT token injection
│   │   ├── [x] Refresh token rotation
│   │   ├── [x] Error handling
│   │   └── [x] Language header (Accept-Language)
│   ├── [x] Setup React Query provider
│   ├── [x] Create TypeScript type definitions
│   │   ├── [x] api.types.ts (ApiResponse, PaginatedResult)
│   │   ├── [x] auth.types.ts
│   │   └── [x] common.types.ts
│   └── [x] Verify app runs with placeholder pages
├── Deliverable: Running Next.js app with theming + i18n
└── Tag: v0.0.3

TASK 0.4 — Database Design Finalization
├── Status: [x] ✅ COMPLETE
├── Priority: Critical
├── Assignee: Backend Lead
├── Tasks:
│   ├── [x] Create all 21 entity classes in Domain layer
│   ├── [x] Create EF Core configurations for each entity
│   ├── [x] Create DbContext (MojazDbContext)
│   ├── [x] Create initial migration
│   ├── [x] Create seed data
│   │   ├── [x] Default admin user
│   │   ├── [x] 6 license categories (A-F)
│   │   ├── [x] Default fee structures
│   │   ├── [x] System settings (all configurable values)
│   │   └── [x] Sample branches
│   ├── [x] Run migration against SQL Server
│   └── [x] Verify all tables created correctly
├── Deliverable: Complete database with seed data
└── Tag: v0.0.4

TASK 0.5 — Spec-Kit Setup
├── Status: [x] ✅ COMPLETE
├── Priority: High
├── Assignee: Tech Lead
├── Tasks:
│   ├── [x] Create specs/ directory structure (17 folders)
│   ├── [x] Create spec.config.yml
│   ├── [x] Create spec template file
│   ├── [x] Create initial spec files for Sprint 1-2
│   ├── [x] Setup GitHub Actions for spec validation
│   └── [x] Create STATUS.md dashboard
├── Deliverable: Complete spec management system
└── Tag: v0.0.5

TASK 0.6 — DevOps Setup
├── Status: [x] ✅ COMPLETE
├── Priority: High
├── Assignee: DevOps / Tech Lead
├── Tasks:
│   ├── [x] Create Dockerfile for backend
│   ├── [x] Create Dockerfile for frontend
│   ├── [x] Create docker-compose.yml
│   ├── [x] Create GitHub Actions workflow
│   │   ├── [x] Build + Test on PR
│   │   ├── [x] Spec validation on PR
│   │   └── [x] Deploy on merge to main (placeholder)
│   ├── [x] Configure environment variables template
│   └── [x] Verify full stack runs via Docker Compose
├── Deliverable: Containerized development environment
└── Tag: v0.0.6
```

### 3.2 Sprint 0 Deliverables Checklist

```
□ GitHub repository created with branch protection
□ .NET 8 solution builds with Clean Architecture (5 projects)
□ Next.js 15 app runs with Mojaz theme, i18n, dark/light mode
□ All 21 database tables created with seed data
□ Docker Compose runs full stack (DB + API + Frontend)
□ AGENTS.md finalized
□ IMPLEMENTATION_PLAN.md finalized
□ Spec-Kit initialized with Sprint 1-2 specs
□ CI/CD pipeline skeleton working
□ All team members can clone, build, and run locally
```

---

## 4. Sprint 1-2 — Infrastructure, Auth & Integrations ✅ COMPLETE

**Duration:** Week 3-6
**Goal:** Complete authentication system + real notification integrations
**Dependencies:** Sprint 0 complete
**Status:** ✅ COMPLETE (All 9 tasks done)
**Git Tags:** v0.1.0 → v0.2.0

### 4.1 Week 3 — Core Infrastructure + Auth Backend ✅ COMPLETE

```
WEEK 3 — CORE INFRASTRUCTURE + AUTH BACKEND
══════════════════════════════════════════

TASK 1.1 — Repository Pattern + Unit of Work
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-000
├── Priority: Critical
├── Layer: Infrastructure
├── Tasks:
│   ├── [x] Create IRepository<T> interface (Domain)
│   │   ├── [x] GetByIdAsync(Guid id)
│   │   ├── [x] GetAllAsync()
│   │   ├── [x] FindAsync(Expression<Func<T, bool>> predicate)
│   │   ├── [x] AddAsync(T entity)
│   │   ├── [x] Update(T entity)
│   │   ├── [x] SoftDelete(T entity)
│   │   └── [x] CountAsync(Expression<Func<T, bool>>? predicate)
│   ├── [x] Create IUnitOfWork interface (Domain)
│   │   ├── [x] IRepository<User> Users
│   │   ├── [x] IRepository<Application> Applications
│   │   ├── [x] ... (all 21 repositories)
│   │   ├── [x] SaveChangesAsync()
│   │   └── [x] BeginTransactionAsync()
│   ├── [x] Implement Repository<T> (Infrastructure)
│   ├── [x] Implement UnitOfWork (Infrastructure)
│   ├── [x] Register in DI container
│   └── [x] Write unit tests for repository
├── Deliverable: Working data access layer
└── Tests: 15+ unit tests

TASK 1.2 — User Registration (Backend)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-101, MOJAZ-102
├── Priority: Critical
├── Layer: Application + API
├── Tasks: All implemented
├── Deliverable: Working registration endpoint
└── Tests: 20+ tests

TASK 1.3 — OTP Verification System
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-104
├── Priority: Critical
├── Layer: Application + API
├── Tasks: All implemented
├── Deliverable: Complete OTP verification flow
└── Tests: 15+ tests

TASK 1.4 — JWT + Login System
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-103, MOJAZ-106
├── Priority: Critical
├── Layer: Application + Infrastructure + API
├── Tasks: All implemented
├── Deliverable: Complete JWT authentication
└── Tests: 25+ tests

TASK 1.5 — Password Recovery
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-105
├── Priority: High
├── Layer: Application + API
├── Tasks: All implemented
├── Deliverable: Password recovery flow
└── Tests: 10+ tests

TASK 1.6 — RBAC Authorization Setup
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-200
├── Priority: Critical
├── Layer: API
├── Tasks: All implemented
├── Deliverable: Role-based access control
└── Tests: 15+ tests

TASK 1.7 — Audit Log System
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1501
├── Priority: Critical
├── Layer: Infrastructure + API
├── Tasks: All implemented
├── Deliverable: Complete audit trail system
└── Tests: 8+ tests
```
WEEK 3 — CORE INFRASTRUCTURE + AUTH BACKEND
══════════════════════════════════════════════════

TASK 1.1 — Repository Pattern + Unit of Work
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-000
├── Priority: Critical
├── Layer: Infrastructure
├── Tasks:
│   ├── [x] ✅ COMPLETE Create IRepository<T> interface (Domain)
│   │   ├── [x] ✅ COMPLETE GetByIdAsync(Guid id)
│   │   ├── [x] ✅ COMPLETE GetAllAsync()
│   │   ├── [x] ✅ COMPLETE FindAsync(Expression<Func<T, bool>> predicate)
│   │   ├── [x] ✅ COMPLETE AddAsync(T entity)
│   │   ├── [x] ✅ COMPLETE Update(T entity)
│   │   ├── [x] ✅ COMPLETE SoftDelete(T entity)
│   │   └── [x] ✅ COMPLETE CountAsync(Expression<Func<T, bool>>? predicate)
│   ├── [x] ✅ COMPLETE Create IUnitOfWork interface (Domain)
│   │   ├── [x] ✅ COMPLETE IRepository<User> Users
│   │   ├── [x] ✅ COMPLETE IRepository<Application> Applications
│   │   ├── [x] ✅ COMPLETE ... (all 21 repositories)
│   │   ├── [x] ✅ COMPLETE SaveChangesAsync()
│   │   └── [x] ✅ COMPLETE BeginTransactionAsync()
│   ├── [x] ✅ COMPLETE Implement Repository<T> (Infrastructure)
│   ├── [x] ✅ COMPLETE Implement UnitOfWork (Infrastructure)
│   ├── [x] ✅ COMPLETE Register in DI container
│   └── [x] ✅ COMPLETE Write unit tests for repository
├── Deliverable: Working data access layer
└── Tests: 15+ unit tests

TASK 1.2 — User Registration (Backend)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-101, MOJAZ-102
├── Priority: Critical
├── Layer: Application + API
├── Tasks:
│   ├── [x] ✅ COMPLETE Create DTOs
│   │   ├── [x] ✅ COMPLETE RegisterRequest (FullName, Email?, Phone?,
│   │   │   │   Password, ConfirmPassword, RegistrationMethod,
│   │   │   │   PreferredLanguage, TermsAccepted)
│   │   ├── [x] ✅ COMPLETE RegisterResponse (UserId, RequiresVerification)
│   │   └── [x] ✅ COMPLETE UserDto (Id, FullName, Email, Phone, Role,
│   │   │       PreferredLanguage, IsActive)
│   ├── [x] ✅ COMPLETE Create RegisterValidator (FluentValidation)
│   │   ├── [x] ✅ COMPLETE FullName: Required, 2-200 chars
│   │   ├── [x] ✅ COMPLETE Email: Required if method=Email, valid format, unique
│   │   ├── [x] ✅ COMPLETE Phone: Required if method=Phone, E.164 format, unique
│   │   ├── [x] ✅ COMPLETE Password: 8+ chars, upper + lower + number + special
│   │   ├── [x] ✅ COMPLETE ConfirmPassword: Must match Password
│   │   ├── [x] ✅ COMPLETE RegistrationMethod: Must be "Email" or "Phone"
│   │   └── [x] ✅ COMPLETE TermsAccepted: Must be true
│   ├── [x] ✅ COMPLETE Create IAuthService interface (Application)
│   │   ├── [x] ✅ COMPLETE RegisterAsync(RegisterRequest)
│   │   ├── [x] ✅ COMPLETE LoginAsync(LoginRequest)
│   │   ├── [x] ✅ COMPLETE VerifyOtpAsync(VerifyOtpRequest)
│   │   ├── [x] ✅ COMPLETE ResendOtpAsync(ResendOtpRequest)
│   │   ├── [x] ✅ COMPLETE RefreshTokenAsync(RefreshTokenRequest)
│   │   ├── [x] ✅ COMPLETE LogoutAsync(LogoutRequest)
│   │   ├── [x] ✅ COMPLETE ForgotPasswordAsync(ForgotPasswordRequest)
│   │   └── [x] ✅ COMPLETE ResetPasswordAsync(ResetPasswordRequest)
│   ├── [x] ✅ COMPLETE Implement AuthService (Application)
│   │   ├── [x] ✅ COMPLETE Hash password with BCrypt (cost 12)
│   │   ├── [x] ✅ COMPLETE Generate 6-digit OTP
│   │   ├── [x] ✅ COMPLETE Hash OTP before storing
│   │   ├── [x] ✅ COMPLETE Create User record
│   │   ├── [x] ✅ COMPLETE Create OtpCode record
│   │   ├── [x] ✅ COMPLETE Trigger notification (email or SMS)
│   │   └── [x] ✅ COMPLETE Create audit log entry
│   ├── [x] ✅ COMPLETE Create AuthController (API)
│   │   └── [x] ✅ COMPLETE POST /api/v1/auth/register
│   ├── [x] ✅ COMPLETE Create AutoMapper profile (User ↔ UserDto)
│   └── [x] ✅ COMPLETE Write tests
│       ├── [x] ✅ COMPLETE Validator tests (all rules)
│       ├── [x] ✅ COMPLETE Service tests (success + error cases)
│       └── [x] ✅ COMPLETE Controller integration test
├── Deliverable: Working registration endpoint
└── Tests: 20+ tests

TASK 1.3 — OTP Verification System
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-104
├── Priority: Critical
├── Layer: Application + API
├── Tasks:
│   ├── [x] ✅ COMPLETE Create DTOs
│   │   ├── [x] ✅ COMPLETE VerifyOtpRequest (Destination, Code, Purpose)
│   │   ├── [x] ✅ COMPLETE ResendOtpRequest (Destination, DestinationType, Purpose)
│   │   └── [x] ✅ COMPLETE OtpResponse (Success, Message, RemainingAttempts)
│   ├── [x] ✅ COMPLETE Implement OTP verification logic
│   │   ├── [x] ✅ COMPLETE Find OTP record by destination + purpose
│   │   ├── [x] ✅ COMPLETE Check not expired (SMS: 5min, Email: 15min)
│   │   ├── [x] ✅ COMPLETE Check not already used
│   │   ├── [x] ✅ COMPLETE Check attempt count < max (3)
│   │   ├── [x] ✅ COMPLETE Compare hashed codes
│   │   ├── [x] ✅ COMPLETE Mark as used on success
│   │   ├── [x] ✅ COMPLETE Increment attempt count on failure
│   │   └── [x] ✅ COMPLETE Activate user account on success
│   ├── [x] ✅ COMPLETE Implement OTP resend logic
│   │   ├── [x] ✅ COMPLETE Check resend cooldown (60 seconds)
│   │   ├── [x] ✅ COMPLETE Check max resends per hour (3)
│   │   ├── [x] ✅ COMPLETE Generate new OTP
│   │   ├── [x] ✅ COMPLETE Invalidate old OTP
│   │   └── [x] ✅ COMPLETE Send via appropriate channel
│   ├── [x] ✅ COMPLETE Create endpoints
│   │   ├── [x] ✅ COMPLETE POST /api/v1/auth/verify-otp
│   │   └── [x] ✅ COMPLETE POST /api/v1/auth/resend-otp
│   └── [x] ✅ COMPLETE Write tests
├── Deliverable: Complete OTP verification flow
└── Tests: 15+ tests

TASK 1.4 — JWT + Login System
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-103, MOJAZ-106
├── Priority: Critical
├── Layer: Application + Infrastructure + API
├── Tasks:
│   ├── [x] ✅ COMPLETE Create JWT configuration
│   │   ├── [x] ✅ COMPLETE JwtSettings class (Secret, Issuer, Audience, AccessExpiry, RefreshExpiry)
│   │   ├── [x] ✅ COMPLETE Configure in appsettings.json
│   │   └── [x] ✅ COMPLETE Register in DI
│   ├── [x] ✅ COMPLETE Create IJwtService interface
│   │   ├── [x] ✅ COMPLETE GenerateAccessToken(User user)
│   │   ├── [x] ✅ COMPLETE GenerateRefreshToken()
│   │   ├── [x] ✅ COMPLETE ValidateToken(string token)
│   │   └── [x] ✅ COMPLETE GetPrincipalFromExpiredToken(string token)
│   ├── [x] ✅ COMPLETE Implement JwtService
│   ├── [x] ✅ COMPLETE Create DTOs
│   │   ├── [x] ✅ COMPLETE LoginRequest (Identifier, Password, Method)
│   │   ├── [x] ✅ COMPLETE LoginResponse (AccessToken, RefreshToken, ExpiresAt, UserDto)
│   │   ├── [x] ✅ COMPLETE RefreshTokenRequest (AccessToken, RefreshToken)
│   │   └── [x] ✅ COMPLETE LogoutRequest (RefreshToken)
│   ├── [x] ✅ COMPLETE Implement Login logic
│   │   ├── [x] ✅ COMPLETE Find user by email or phone
│   │   ├── [x] ✅ COMPLETE Check account is verified
│   │   ├── [x] ✅ COMPLETE Check account is not locked
│   │   ├── [x] ✅ COMPLETE Verify password hash
│   │   ├── [x] ✅ COMPLETE Reset failed attempts on success
│   │   ├── [x] ✅ COMPLETE Increment failed attempts on failure
│   │   ├── [x] ✅ COMPLETE Lock account after 5 failures (15 min)
│   │   ├── [x] ✅ COMPLETE Generate JWT access token
│   │   ├── [x] ✅ COMPLETE Generate and store refresh token
│   │   ├── [x] ✅ COMPLETE Update LastLoginAt
│   │   └── [x] ✅ COMPLETE Create audit log entry
│   ├── [x] ✅ COMPLETE Implement Refresh Token rotation
│   │   ├── [x] ✅ COMPLETE Validate refresh token exists and not expired/revoked
│   │   ├── [x] ✅ COMPLETE Generate new access token
│   │   ├── [x] ✅ COMPLETE Generate new refresh token
│   │   ├── [x] ✅ COMPLETE Revoke old refresh token
│   │   └── [x] ✅ COMPLETE Store new refresh token
│   ├── [x] ✅ COMPLETE Implement Logout
│   │   ├── [x] ✅ COMPLETE Revoke refresh token
│   │   └── [x] ✅ COMPLETE Create audit log entry
│   ├── [x] ✅ COMPLETE Configure JWT middleware in Program.cs
│   ├── [x] ✅ COMPLETE Create endpoints
│   │   ├── [x] ✅ COMPLETE POST /api/v1/auth/login
│   │   ├── [x] ✅ COMPLETE POST /api/v1/auth/refresh-token
│   │   └── [x] ✅ COMPLETE POST /api/v1/auth/logout
│   └── [x] ✅ COMPLETE Write tests
├── Deliverable: Complete JWT authentication
└── Tests: 25+ tests

TASK 1.5 — Password Recovery
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-105
├── Priority: High
├── Layer: Application + API
├── Tasks:
│   ├── [x] ✅ COMPLETE Create DTOs
│   │   ├── [x] ✅ COMPLETE ForgotPasswordRequest (Identifier, Method)
│   │   └── [x] ✅ COMPLETE ResetPasswordRequest (Token/OTP, NewPassword, ConfirmPassword)
│   ├── [x] ✅ COMPLETE Implement forgot password (send OTP/link)
│   ├── [x] ✅ COMPLETE Implement reset password (verify + update)
│   ├── [x] ✅ COMPLETE Create endpoints
│   │   ├── [x] ✅ COMPLETE POST /api/v1/auth/forgot-password
│   │   └── [x] ✅ COMPLETE POST /api/v1/auth/reset-password
│   └── [x] ✅ COMPLETE Write tests
├── Deliverable: Password recovery flow
└── Tests: 10+ tests

TASK 1.6 — RBAC Authorization Setup
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-200
├── Priority: Critical
├── Layer: API
├── Tasks:
│   ├── [x] ✅ COMPLETE Define role constants
│   │   ├── [x] ✅ COMPLETE Roles.Applicant = "Applicant"
│   │   ├── [x] ✅ COMPLETE Roles.Receptionist = "Receptionist"
│   │   ├── [x] ✅ COMPLETE Roles.Doctor = "Doctor"
│   │   ├── [x] ✅ COMPLETE Roles.Examiner = "Examiner"
│   │   ├── [x] ✅ COMPLETE Roles.Manager = "Manager"
│   │   ├── [x] ✅ COMPLETE Roles.Security = "Security"
│   │   └── [x] ✅ COMPLETE Roles.Admin = "Admin"
│   ├── [x] ✅ COMPLETE Configure role-based authorization policies
│   ├── [x] ✅ COMPLETE Create [Authorize(Roles = "...")] on all endpoints
│   ├── [x] ✅ COMPLETE Create ownership check middleware
│   │   └── [x] ✅ COMPLETE Applicant can only access own applications
│   └── [x] ✅ COMPLETE Write tests for authorization
├── Deliverable: Role-based access control
└── Tests: 15+ tests

TASK 1.7 — Audit Log System
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1501
├── Priority: Critical
├── Layer: Infrastructure + API
├── Tasks:
│   ├── [x] ✅ COMPLETE Create IAuditService interface
│   │   └── [x] ✅ COMPLETE LogAsync(AuditEntry entry)
│   ├── [x] ✅ COMPLETE Implement AuditService
│   │   ├── [x] ✅ COMPLETE Capture UserId from JWT claims
│   │   ├── [x] ✅ COMPLETE Capture IP address
│   │   ├── [x] ✅ COMPLETE Capture User-Agent
│   │   ├── [x] ✅ COMPLETE Serialize old/new values to JSON
│   │   └── [x] ✅ COMPLETE Save to AuditLogs table
│   ├── [x] ✅ COMPLETE Create audit log middleware (automatic)
│   ├── [x] ✅ COMPLETE Create audit log endpoints
│   │   ├── [x] ✅ COMPLETE GET /api/v1/audit-logs (Admin + Manager)
│   │   └── [x] ✅ COMPLETE GET /api/v1/audit-logs/{entityType}/{entityId}
│   └── [x] ✅ COMPLETE Write tests
├── Deliverable: Complete audit trail system
└── Tests: 8+ tests
```

### 4.2 Week 4 — Real Integrations + Auth Frontend

```
WEEK 4 — REAL INTEGRATIONS + AUTH FRONTEND
═══════════════════════════════════════════

TASK 2.1 — Email Integration (SendGrid) — REAL ✅
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-902, MOJAZ-1001
├── Priority: Critical
├── Layer: Infrastructure
├── Tasks: All implemented
├── Deliverable: Working email delivery
└── Tests: 10+ tests

TASK 2.2 — SMS Integration (Twilio) — REAL ✅
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-904, MOJAZ-1002
├── Priority: Critical
├── Layer: Infrastructure
├── Tasks: All implemented
├── Deliverable: Working SMS delivery
└── Tests: 8+ tests

TASK 2.3 — Push Notifications (Firebase FCM) — REAL ✅
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-903, MOJAZ-1003
├── Priority: High
├── Layer: Infrastructure + Frontend
├── Tasks: All implemented
├── Deliverable: Working push notifications
└── Tests: 8+ tests

TASK 2.4 — Unified Notification Service
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-900
├── Priority: High
├── Layer: Application
├── Tasks: All implemented
├── Deliverable: Unified notification system
└── Tests: 12+ tests

TASK 2.5 — Frontend: Auth Pages
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1302
├── Priority: Critical
├── Layer: Frontend
├── Tasks: All implemented
├── Deliverable: Complete auth UI with all flows
└── Tests: 20+ tests

TASK 2.6 — Frontend: Layout & Navigation
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1300
├── Priority: High
├── Layer: Frontend
├── Tasks: All implemented
├── Deliverable: Complete layout system
└── Tests: 10+ tests

TASK 2.7 — User Management (Admin)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1212
├── Priority: High
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete user management
└── Tests: 15+ tests

TASK 2.8 — System Settings Management (Admin)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1211
├── Priority: High
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete settings management
└── Tests: 10+ tests

TASK 2.2 — SMS Integration (Twilio) — REAL ✅
├── Spec: MOJAZ-904, MOJAZ-1002
├── Priority: Critical
├── Layer: Infrastructure
├── Tasks:
│   ├── [ ] Create ISmsService interface (Application)
│   │   ├── SendAsync(SmsMessage message)
│   │   └── SendOtpAsync(string phone, string otp, string language)
│   ├── [ ] Implement TwilioSmsService (Infrastructure)
│   │   ├── Configure Account SID + Auth Token from settings
│   │   ├── Configure sender number/name
│   │   ├── Build bilingual SMS (max 160 chars)
│   │   ├── Handle delivery errors
│   │   ├── Log all attempts to SmsLogs table
│   │   └── Track cost per message
│   ├── [ ] Create 6 SMS templates
│   │   ├── Registration OTP
│   │   ├── Recovery OTP
│   │   ├── Appointment Confirmation
│   │   ├── Appointment Reminder
│   │   ├── Test Result
│   │   └── License Ready
│   ├── [ ] Register in DI container
│   └── [ ] Write tests
├── Deliverable: Working SMS delivery
└── Tests: 8+ tests

TASK 2.3 — Push Notifications (Firebase FCM) — REAL ✅
├── Spec: MOJAZ-903, MOJAZ-1003
├── Priority: High
├── Layer: Infrastructure + Frontend
├── Tasks:
│   ├── [ ] Create IPushNotificationService interface (Application)
│   │   ├── SendAsync(PushMessage message)
│   │   ├── SendToUserAsync(Guid userId, PushMessage message)
│   │   └── RegisterTokenAsync(Guid userId, string token, string deviceType)
│   ├── [ ] Implement FirebasePushService (Infrastructure)
│   │   ├── Configure Firebase Admin SDK
│   │   ├── Send push via FCM HTTP v1 API
│   │   ├── Handle invalid/expired tokens
│   │   ├── Clean up stale tokens
│   │   └── Support bilingual notifications
│   ├── [ ] Create push notification endpoints (API)
│   │   ├── POST /api/v1/notifications/push/register-token
│   │   └── DELETE /api/v1/notifications/push/unregister-token
│   ├── [ ] Frontend: Firebase JS SDK setup
│   │   ├── Create firebase.ts config file
│   │   ├── Create firebase-messaging-sw.js service worker
│   │   ├── Create usePushNotifications hook
│   │   ├── Request permission after login
│   │   ├── Handle foreground notifications
│   │   └── Handle notification click (deep links)
│   └── [ ] Write tests
├── Deliverable: Working push notifications
└── Tests: 8+ tests

TASK 2.4 — Unified Notification Service
├── Spec: MOJAZ-900
├── Priority: High
├── Layer: Application
├── Tasks:
│   ├── [ ] Create INotificationService interface
│   │   └── SendAsync(NotificationRequest request)
│   │       Dispatches to: InApp + Push + Email + SMS
│   ├── [ ] Implement NotificationService
│   │   ├── Save In-App notification (synchronous)
│   │   ├── Enqueue Push via Hangfire (async)
│   │   ├── Enqueue Email via Hangfire (async)
│   │   ├── Enqueue SMS via Hangfire (async)
│   │   ├── Respect user notification preferences
│   │   └── Support bilingual messages
│   ├── [ ] Configure Hangfire for background jobs
│   ├── [ ] Create notification endpoints
│   │   ├── GET /api/v1/notifications (user's notifications)
│   │   ├── PATCH /api/v1/notifications/{id}/read
│   │   └── PATCH /api/v1/notifications/read-all
│   └── [ ] Write tests
├── Deliverable: Unified notification system
└── Tests: 12+ tests

TASK 2.5 — Frontend: Auth Pages
├── Spec: MOJAZ-1302
├── Priority: Critical
├── Layer: Frontend
├── Tasks:
│   ├── [ ] Create auth store (Zustand)
│   │   ├── user state
│   │   ├── tokens state
│   │   ├── login action
│   │   ├── logout action
│   │   ├── refresh token action
│   │   └── persist to localStorage
│   ├── [ ] Create auth service (API calls)
│   │   ├── register()
│   │   ├── login()
│   │   ├── verifyOtp()
│   │   ├── resendOtp()
│   │   ├── refreshToken()
│   │   ├── logout()
│   │   ├── forgotPassword()
│   │   └── resetPassword()
│   ├── [ ] Create Registration Page
│   │   ├── Email / Phone tabs
│   │   ├── Form with React Hook Form + Zod
│   │   ├── Password strength indicator
│   │   ├── Terms acceptance checkbox
│   │   ├── Loading state
│   │   ├── Error display
│   │   ├── Success → redirect to OTP verification
│   │   ├── Full AR/EN translations
│   │   ├── RTL/LTR layout
│   │   └── Dark/Light mode
│   ├── [ ] Create OTP Verification Page
│   │   ├── 6-digit input with auto-focus
│   │   ├── Countdown timer
│   │   ├── Resend button (with cooldown)
│   │   ├── Success → redirect to dashboard
│   │   └── Error handling
│   ├── [ ] Create Login Page
│   │   ├── Email / Phone tabs
│   │   ├── Form with validation
│   │   ├── "Forgot Password" link
│   │   ├── "Create Account" link
│   │   └── Success → redirect to appropriate dashboard
│   ├── [ ] Create Password Recovery Page
│   │   ├── Step 1: Enter email/phone
│   │   ├── Step 2: Enter OTP
│   │   └── Step 3: Set new password
│   ├── [ ] Create Protected Route wrapper
│   │   ├── Check authentication
│   │   ├── Check role authorization
│   │   ├── Redirect to login if not auth'd
│   │   └── Redirect to unauthorized if wrong role
│   ├── [ ] Create NotificationBell component
│   │   ├── Bell icon with unread count badge
│   │   ├── Dropdown with notification list
│   │   ├── Mark as read on click
│   │   └── "View all" link
│   └── [ ] Write component tests
├── Deliverable: Complete auth UI with all flows
└── Tests: 20+ tests

TASK 2.6 — Frontend: Layout & Navigation
├── Spec: MOJAZ-1300
├── Priority: High
├── Layer: Frontend
├── Tasks:
│   ├── [ ] Create responsive Sidebar component
│   │   ├── Role-based menu items
│   │   ├── Collapsible on mobile
│   │   ├── Active item highlight
│   │   ├── User profile section
│   │   └── Sidebar on RIGHT for Arabic, LEFT for English
│   ├── [ ] Create Header component
│   │   ├── System logo + name
│   │   ├── Language switcher (AR ↔ EN)
│   │   ├── Theme switcher (Dark ↔ Light)
│   │   ├── Notification bell
│   │   ├── User avatar + dropdown menu
│   │   └── Mobile menu toggle
│   ├── [ ] Create Footer component
│   ├── [ ] Create Breadcrumb component
│   ├── [ ] Create page loading skeleton
│   └── [ ] Test all layouts in AR/EN + Dark/Light
├── Deliverable: Complete layout system
└── Tests: 10+ tests
```

### 4.3 Week 5-6 — User Management + Integration Testing

```
WEEK 5-6 — USER MANAGEMENT + INTEGRATION TESTING
═════════════════════════════════════════════════

TASK 2.7 — User Management (Admin)
├── Spec: MOJAZ-1212
├── Priority: High
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: User CRUD endpoints
│   │   ├── GET /api/v1/users (paginated, filterable)
│   │   ├── POST /api/v1/users (admin creates user)
│   │   ├── GET /api/v1/users/{id}
│   │   ├── PUT /api/v1/users/{id}
│   │   ├── PATCH /api/v1/users/{id}/role
│   │   └── PATCH /api/v1/users/{id}/toggle-active
│   ├── [ ] Frontend: User Management page (Admin portal)
│   │   ├── Users table with pagination/search/filter
│   │   ├── Create user modal
│   │   ├── Edit user modal
│   │   ├── Change role dropdown
│   │   ├── Activate/deactivate toggle
│   │   └── Role badges with colors
│   └── [ ] Write tests
├── Deliverable: Complete user management
└── Tests: 15+ tests

TASK 2.8 — System Settings Management (Admin)
├── Spec: MOJAZ-1211
├── Priority: High
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Settings endpoints
│   │   ├── GET /api/v1/settings/policies
│   │   ├── PUT /api/v1/settings/policies
│   │   ├── GET /api/v1/settings/fees
│   │   └── PUT /api/v1/settings/fees
│   ├── [ ] Frontend: Settings pages (Admin portal)
│   │   ├── System policies page (age limits, attempt limits, etc.)
│   │   ├── Fee management page (all fee types + amounts)
│   │   ├── Edit with old/new value comparison
│   │   └── Audit trail for changes
│   └── [ ] Write tests
├── Deliverable: Complete settings management
└── Tests: 10+ tests

TASK 2.9 — Sprint 1-2 Integration Testing
├── Priority: Critical
├── Tasks:
│   ├── [ ] End-to-end registration flow (email)
│   ├── [ ] End-to-end registration flow (phone)
│   ├── [ ] Login → access protected endpoint → refresh token
│   ├── [ ] Password recovery full flow
│   ├── [ ] Role-based access verification
│   ├── [ ] Real email delivery test
│   ├── [ ] Real SMS delivery test
│   ├── [ ] Real push notification test
│   ├── [ ] Audit log verification
│   ├── [ ] RTL/LTR visual testing
│   └── [ ] Dark/Light mode visual testing
├── Deliverable: All Sprint 1-2 features verified
└── Tag: v0.2.0
```

### 4.4 Sprint 1-2 Completion Criteria

```
□ 8 auth endpoints working and documented in Swagger
□ Registration with real OTP (email + SMS)
□ JWT authentication with refresh token rotation
□ Account lockout after failed attempts
□ RBAC authorization on all endpoints
□ Real email sending via SendGrid
□ Real SMS sending via Twilio
□ Real push notifications via Firebase FCM
□ Unified notification service (4 channels)
□ Hangfire background job processing
□ Complete audit logging
□ User management (Admin)
□ System settings management (Admin)
□ Frontend: Auth pages (register/login/verify/reset)
□ Frontend: Layout system (sidebar/header/footer)
□ Frontend: RTL + LTR verified
□ Frontend: Dark + Light mode verified
□ 150+ unit/integration tests passing
□ All code follows AGENTS.md conventions
```

---

## 5. Sprint 3-4 — Applications & Documents ✅ COMPLETE

**Duration:** Week 7-10
**Goal:** Complete application lifecycle (create → submit → review)
**Dependencies:** Sprint 1-2 complete (auth + notifications)
**Status:** ✅ COMPLETE (All 6 tasks done)
**Git Tags:** v0.3.0 → v0.4.0

### 5.1 Week 7-8 — Application Backend + Wizard Frontend ✅ COMPLETE

```
WEEK 7-8 — APPLICATIONS
════════════════════════════════

TASK 3.1 — Application Service (Backend)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-301, MOJAZ-302
├── Priority: Critical
├── Layer: Application + Infrastructure + API
├── Tasks: All implemented
├── Deliverable: Complete application CRUD API
└── Tests: 30+ tests

TASK 3.2 — Application Wizard (Frontend)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1303
├── Priority: Critical
├── Layer: Frontend
├── Tasks: All implemented (5 steps: Service, Category, Personal, Details, Review)
├── Deliverable: Complete 5-step application wizard
└── Tests: 20+ tests

TASK 3.3 — Document Upload & Review
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-303, MOJAZ-304
├── Priority: Critical
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete document management
└── Tests: 15+ tests
```

### 5.2 Week 9-10 — Status Tracking + Employee Queue ✅ COMPLETE

```
WEEK 9-10 — STATUS TRACKING + EMPLOYEE PORTAL
════════════════════════════════════════════

TASK 3.4 — Application Status Tracking (Applicant)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-305, MOJAZ-306
├── Priority: High
├── Layer: Frontend
├── Tasks: All implemented
├── Deliverable: Complete status tracking UI
└── Tests: 10+ tests

TASK 3.5 — Applicant Dashboard
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1302
├── Priority: High
├── Layer: Frontend
├── Tasks: All implemented
├── Deliverable: Applicant dashboard
└── Tests: 8+ tests

TASK 3.6 — Employee Dashboard + Application Queue
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1310, MOJAZ-1311
├── Priority: High
├── Layer: Frontend
├── Tasks: All implemented
├── Deliverable: Employee dashboard + queue
└── Tests: 10+ tests

TASK 3.7 — Sprint 3-4 Integration Testing
├── Status: [x] ✅ COMPLETE
├── Priority: Critical
├── Tasks: All implemented
├── Deliverable: All Sprint 3-4 features verified
└── Tag: v0.4.0
```

---

## 6. Sprint 5-6 — Medical, Training & Tests ✅ COMPLETE

**Duration:** Week 11-14
**Goal:** Complete medical exam, training, and test stages
**Dependencies:** Sprint 3-4 complete (applications + documents)
**Status:** ✅ COMPLETE (All 6 tasks done)
**Git Tags:** v0.5.0 → v0.6.0

### 6.1 Week 11-12 — Medical + Training + Appointments

```
WEEK 11-12 — MEDICAL + TRAINING + APPOINTMENTS
═══════════════════════════════════════════════

TASK 4.1 — Appointment System
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-606, MOJAZ-1204
├── Priority: Critical
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete appointment system
└── Tests: 20+ tests

TASK 4.2 — Medical Examination
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-404, MOJAZ-1205
├── Priority: Critical
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete medical examination flow
└── Tests: 15+ tests

TASK 4.3 — Training Records
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-405, MOJAZ-504
├── Priority: High
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete training tracking
└── Tests: 10+ tests

TASK 4.4 — Theory Test
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-406, MOJAZ-1206
├── Priority: Critical
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete theory test flow
└── Tests: 15+ tests

TASK 4.5 — Practical Test
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-407, MOJAZ-1206
├── Priority: Critical
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete practical test flow
└── Tests: 15+ tests

TASK 4.6 — Test Retake Service
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-605
├── Priority: High
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete test retake flow
└── Tests: 8+ tests

TASK 4.7 — Category F (Agricultural) Specifics
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-706
├── Priority: High
├── Layer: Backend + Frontend
├── Tasks: All implemented
├── Deliverable: Agricultural category fully supported
└── Tests: 5+ tests

TASK 4.8 — Sprint 5-6 Integration Testing
├── Status: [x] ✅ COMPLETE
├── Priority: Critical
├── Tasks: All implemented
├── Deliverable: All Sprint 5-6 features verified
└── Tag: v0.6.0
```

---

## 7. Sprint 7-8 — Approval, Payment & License Issuance ✅ COMPLETE

**Duration:** Week 15-18
**Goal:** Complete final approval, payment simulation, and license issuance
**Dependencies:** Sprint 5-6 complete
**Status:** ✅ COMPLETE (All 6 tasks done)
**Git Tags:** v0.7.0 → v0.8.0

### 7.1 Week 15-16 — Final Approval + Payment

```
WEEK 15-16 — APPROVAL + PAYMENT
════════════════════════════════

TASK 5.1 — Final Approval Stage
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-408
├── Priority: Critical
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete approval workflow
└── Tests: 15+ tests

TASK 5.2 — Payment System (Simulated)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-800, MOJAZ-1207
├── Priority: Critical
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete payment simulation
└── Tests: 20+ tests

TASK 5.3 — License Issuance
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-410, MOJAZ-1208
├── Priority: Critical
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Complete license issuance + PDF
└── Tests: 12+ tests

TASK 5.4 — License Renewal Service
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-602
├── Priority: High
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: License renewal service
└── Tests: 10+ tests

TASK 5.5 — Lost/Damaged Replacement Service
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-603
├── Priority: High
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: License replacement service
└── Tests: 8+ tests

TASK 5.6 — Category Upgrade Service
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-604
├── Priority: High
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Category upgrade service
└── Tests: 10+ tests

TASK 5.7 — Application Cancellation Service
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-607
├── Priority: Medium
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: Application cancellation
└── Tests: 6+ tests

TASK 5.8 — Sprint 7-8 Integration Testing
├── Status: [x] ✅ COMPLETE
├── Priority: Critical
├── Tasks: All implemented
├── Deliverable: All Sprint 7-8 features verified
└── Tag: v0.8.0
```

---

## 8. Sprint 9-10 — Reports, Polish & Launch ✅ COMPLETE

**Duration:** Week 19-20
**Goal:** Reports, landing page, comprehensive testing, launch
**Dependencies:** Sprint 7-8 complete
**Status:** ✅ COMPLETE (All 6 tasks done)
**Git Tags:** v0.9.0 → v1.0.0

### 8.1 Week 19 — Reports + Landing Page

```
WEEK 19 — REPORTS + LANDING PAGE
═════════════════════════════════

TASK 6.1 — Reports System (7 Reports)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1400
├── Priority: High
├── Layer: Full Stack
├── Tasks: All implemented
├── Deliverable: 7 operational reports
└── Tests: 15+ tests

TASK 6.2 — Landing Page
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1301
├── Priority: High
├── Layer: Frontend
├── Tasks: All implemented
├── Deliverable: Complete landing page
└── Tests: 5+ tests

TASK 6.3 — Audit Logs UI (Admin)
├── Status: [x] ✅ COMPLETE
├── Spec: MOJAZ-1320
├── Priority: Medium
├── Layer: Frontend
├── Tasks: All implemented
├── Deliverable: Audit log viewing UI
└── Tests: 5+ tests

TASK 7.1 — Comprehensive E2E Testing
├── Status: [x] ✅ COMPLETE
├── Priority: Critical
├── Tasks: All implemented
├── Deliverable: Complete test report
└── Tests: 50+ E2E tests

TASK 7.2 — Bug Fixing & Polish
├── Status: [x] ✅ COMPLETE
├── Priority: Critical
├── Tasks: All implemented
├── Deliverable: Production-ready application
└── Estimated: 30+ fixes

TASK 7.3 — Documentation & Deployment
├── Status: [x] ✅ COMPLETE
├── Priority: High
├── Tasks: All implemented
├── Deliverable: Deployed MVP
└── Tag: v1.0.0
```

---

## 9. Cross-Cutting Concerns

### 9.1 Throughout ALL Sprints

```
These concerns apply to EVERY sprint and EVERY task:

INTERNATIONALIZATION (i18n)
├── Every new UI text → add AR + EN translations
├── Every new page → test RTL + LTR
├── Every new component → test Dark + Light
└── Every email/SMS → bilingual templates

AUDIT LOGGING
├── Every data creation → audit log
├── Every data modification → audit log (old + new values)
├── Every approval/rejection → audit log
├── Every login/logout → audit log
└── Every setting change → audit log

NOTIFICATIONS
├── Every stage transition → In-App notification
├── Every result recording → Push + Email + SMS
├── Every payment event → Push + Email
├── Every appointment → Email + SMS
└── Respect user notification preferences

TESTING
├── Every service method → unit test
├── Every validator → validation tests
├── Every endpoint → integration test
├── Every page → component test
└── Every flow → E2E test (by sprint end)

SECURITY
├── Every endpoint → [Authorize] with roles
├── Every input → server-side validation
├── Every file upload → type + size validation
├── Every query → parameterized (EF Core)
└── Every error → safe error message (no stack traces)
```

---

## 10. Dependency Graph

```
SPRINT 0 (Scaffold)
    │
    └──► SPRINT 1-2 (Auth + Integrations)
            │
            ├──► SPRINT 3-4 (Applications + Documents)
            │       │
            │       └──► SPRINT 5-6 (Medical + Tests)
            │               │
            │               └──► SPRINT 7-8 (Approval + Payment + License)
            │                       │
            │                       └──► SPRINT 9-10 (Reports + Launch)
            │
            └──► (Notifications used across all subsequent sprints)

CRITICAL PATH:
Auth → Applications → Medical/Tests → Approval → License Issuance

PARALLEL WORK POSSIBLE:
├── Frontend auth pages ║ Backend auth endpoints (Sprint 1-2)
├── Document upload UI ║ Application backend (Sprint 3-4)
├── Examiner UI ║ Test backend logic (Sprint 5-6)
├── Payment UI ║ Approval backend (Sprint 7-8)
└── Landing page ║ Reports backend (Sprint 9-10)
```

---

## 11. Risk Mitigation During Implementation

```
RISK 1: Scope Creep
├── Mitigation: Strict adherence to PRD scope
├── Rule: Any new feature → deferred to Phase 2
└── Process: Change request → PRD review → approval

RISK 2: Integration Failures (SendGrid/Twilio/Firebase)
├── Mitigation: Setup accounts in Sprint 0
├── Fallback: Alternative providers ready
│   ├── Email: SendGrid → Mailgun → Amazon SES
│   ├── SMS: Twilio → Unifonic → Yamamah
│   └── Push: Firebase → OneSignal
└── Testing: Verify in Sprint 1-2, before dependency

RISK 3: Performance Issues
├── Mitigation: Database indexing from day one
├── Monitoring: Response time tracking per endpoint
├── Rule: Any endpoint > 2s → optimize immediately
└── Tools: SQL query profiler, Application Insights

RISK 4: Security Vulnerabilities
├── Mitigation: Follow AGENTS.md security rules
├── Review: Security checkpoint each sprint
├── Testing: OWASP check before launch
└── Tools: SonarQube or similar static analysis

RISK 5: Timeline Pressure
├── Mitigation: Priority ordering within each sprint
├── Rule: Critical tasks first, Low priority can defer
├── Buffer: Week 20 has testing + polish (buffer)
└── Escalation: Flag blockers immediately
```

---

## 12. Quality Gates

```
GATE 1: Sprint 0 Complete
├── [ ] All team members can build and run locally
├── [ ] Database schema verified
├── [ ] CI pipeline running
└── [ ] AGENTS.md reviewed by all team members

GATE 2: Sprint 1-2 Complete (Auth + Integrations)
├── [ ] User can register and login
├── [ ] Real OTP delivered via email and SMS
├── [ ] Push notifications working in browser
├── [ ] JWT auth protecting all endpoints
├── [ ] 150+ tests passing
└── [ ] Swagger documentation complete for auth

GATE 3: Sprint 3-4 Complete (Applications)
├── [ ] Application wizard creates application successfully
├── [ ] Documents uploaded and reviewed
├── [ ] Status timeline displays correctly
├── [ ] Employee can view and manage applications
├── [ ] 250+ tests passing
└── [ ] Demo: complete application creation

GATE 4: Sprint 5-6 Complete (Tests)
├── [ ] Medical exam recorded by doctor
├── [ ] Theory + practical tests recorded by examiner
├── [ ] Appointment system working
├── [ ] Retry logic enforced correctly
├── [ ] 350+ tests passing
└── [ ] Demo: complete exam/test flow

GATE 5: Sprint 7-8 Complete (License)
├── [ ] Full 10-stage workflow completes
├── [ ] Payment simulation working
├── [ ] License PDF generated and downloadable
├── [ ] All 8 services functional
├── [ ] 450+ tests passing
└── [ ] Demo: complete license issuance

GATE 6: Sprint 9-10 Complete (Launch)
├── [ ] 7 reports working with charts
├── [ ] Landing page complete and responsive
├── [ ] All E2E tests passing
├── [ ] Cross-browser verified
├── [ ] RTL/LTR verified on all pages
├── [ ] Dark/Light mode on all pages
├── [ ] Performance targets met
├── [ ] Security review passed
├── [ ] 500+ tests passing
├── [ ] Deployed to production
└── [ ] Demo: full system walkthrough
```

---

## 13. Deployment Strategy

### 13.1 Environments

```
Development (Local)
├── Docker Compose
├── SQL Server container
├── Hot reload enabled
└── Debug logging

Staging (Pre-Production)
├── Docker containers
├── Real SQL Server instance
├── Real SendGrid/Twilio/Firebase
├── Reduced logging
└── Same config as production

Production
├── Docker containers (or cloud service)
├── SQL Server with backups
├── Real integrations
├── Structured logging (Serilog → file/service)
├── HTTPS enforced
├── Rate limiting active
└── Health check monitoring
```

### 13.2 Deployment Commands

```bash
# Build and tag images
docker build -t mojaz-api:v1.0.0 -f src/backend/Mojaz.API/Dockerfile .
docker build -t mojaz-frontend:v1.0.0 -f src/frontend/Dockerfile .

# Run database migrations
dotnet ef database update --project src/backend/Mojaz.Infrastructure \
    --startup-project src/backend/Mojaz.API

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Verify deployment
curl https://api.mojaz.gov/health
curl https://mojaz.gov
```

### 13.3 Post-Launch Checklist

```
□ All health checks passing
□ Database backups configured (daily)
□ Monitoring alerts configured
□ Error tracking active
□ SSL certificates valid
□ DNS configured correctly
□ SendGrid domain verified
□ Twilio number active
□ Firebase project configured
□ Demo accounts created (one per role)
□ Admin account credentials secured
□ Documentation accessible to team
□ Runbook created for common operations
□ Incident response plan documented
```

---

## Summary — Total Deliverables

```
┌──────────────────────────────────────────────────────────┐
│                  MOJAZ MVP — FINAL NUMBERS               │
├──────────────────────────────────────────────────────────┤
│  Duration:        20 weeks (10 sprints)                  │
│  Backend:         ~52 API endpoints                      │
│  Frontend:        21 screens/pages                       │
│  Database:        21 tables                              │
│  Services:        8 MVP services                         │
│  Workflow:        10 stages with 4 gates                 │
│  Roles:           7 user roles with RBAC                 │
│  Categories:      6 license categories (A-F)             │
│  Reports:         7 operational reports                  │
│  Integrations:    3 real + 4 simulated                   │
│  Notifications:   4 channels × 12 events                │
│  Templates:       10 email + 6 SMS                       │
│  Tests:           500+ (unit + integration + E2E)        │
│  Languages:       Arabic (RTL)          │
│  Themes:          Dark + Light                           │
│  Git Tags:        v0.0.1 → v1.0.0                       │
└──────────────────────────────────────────────────────────┘
```

---

> **This implementation plan is a living document.**
> **Update task statuses as work progresses.**
> **Flag blockers immediately.**
> **Celebrate milestones. 🎉**