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
├── Status: [ ]
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
├── Status: [ ]
├── Priority: Critical
├── Assignee: Backend Lead
├── Tasks:
│   ├── [x] Create .NET 8 solution with 5 projects
│   ├── [x] Setup Clean Architecture folder structure
│   ├── [x] Install all NuGet packages
│   ├── [x] Create base entity classes
│   │   ├── BaseEntity (Id, CreatedAt, UpdatedAt)
│   │   ├── AuditableEntity (CreatedBy, UpdatedBy)
│   │   └── SoftDeletableEntity (IsDeleted)
│   ├── [x] Create shared types
│   │   ├── ApiResponse<T>
│   │   ├── PagedResult<T>
│   │   ├── Result<T> (internal operation result)
│   │   └── Custom exceptions
│   ├── [x] Configure Serilog logging
│   ├── [x] Configure Swagger with JWT auth
│   ├── [x] Create global exception handler middleware
│   ├── [x] Create request logging middleware
│   └── [x] Verify solution builds successfully
├── Deliverable: Building .NET solution with all patterns
└── Tag: v0.0.2

TASK 0.3 — Frontend Project Scaffold
├── Status: [ ]
├── Priority: Critical
├── Assignee: Frontend Lead
├── Tasks:
│   ├── [x] Create Next.js 15 project with App Router
│   ├── [x] Install and configure all npm packages
│   ├── [x] Setup Tailwind with Mojaz theme colors
│   ├── [x] Install and configure shadcn/ui
│   ├── [x] Setup next-intl for i18n
│   │   ├── Create locale routing ([locale] folder)
│   │   ├── Create AR translation files structure
│   │   ├── Create EN translation files structure
│   │   └── Create middleware for locale detection
│   ├── [x] Setup next-themes for dark/light mode
│   ├── [x] Create base layout components
│   │   ├── RootLayout (with locale + direction)
│   │   ├── PublicLayout (landing + auth pages)
│   │   ├── ApplicantLayout (sidebar + header)
│   │   ├── EmployeeLayout (sidebar + header)
│   │   └── AdminLayout (sidebar + header)
│   ├── [x] Create Axios API client with interceptors
│   │   ├── Base URL configuration
│   │   ├── JWT token injection
│   │   ├── Refresh token rotation
│   │   ├── Error handling
│   │   └── Language header (Accept-Language)
│   ├── [x] Setup React Query provider
│   ├── [x] Create TypeScript type definitions
│   │   ├── api.types.ts (ApiResponse, PaginatedResult)
│   │   ├── auth.types.ts
│   │   └── common.types.ts
│   └── [x] Verify app runs with placeholder pages
├── Deliverable: Running Next.js app with theming + i18n
└── Tag: v0.0.3

TASK 0.4 — Database Design Finalization
├── Status: [ ]
├── Priority: Critical
├── Assignee: Backend Lead
├── Tasks:
│   ├── [x] Create all 21 entity classes in Domain layer
│   ├── [x] Create EF Core configurations for each entity
│   ├── [x] Create DbContext (MojazDbContext)
│   ├── [x] Create initial migration
│   ├── [x] Create seed data
│   │   ├── Default admin user
│   │   ├── 6 license categories (A-F)
│   │   ├── Default fee structures
│   │   ├── System settings (all configurable values)
│   │   └── Sample branches
│   ├── [x] Run migration against SQL Server
│   └── [x] Verify all tables created correctly
├── Deliverable: Complete database with seed data
└── Tag: v0.0.4

TASK 0.5 — Spec-Kit Setup
├── Status: [ ]
├── Priority: High
├── Assignee: Tech Lead
├── Tasks:
│   ├── [ ] Create specs/ directory structure (17 folders)
│   ├── [ ] Create spec.config.yml
│   ├── [ ] Create spec template file
│   ├── [ ] Create initial spec files for Sprint 1-2
│   ├── [ ] Setup GitHub Actions for spec validation
│   └── [ ] Create STATUS.md dashboard
├── Deliverable: Complete spec management system
└── Tag: v0.0.5

TASK 0.6 — DevOps Setup
├── Status: [ ]
├── Priority: High
├── Assignee: DevOps / Tech Lead
├── Tasks:
│   ├── [x] Create Dockerfile for backend
│   ├── [x] Create Dockerfile for frontend
│   ├── [x] Create docker-compose.yml
│   ├── [x] Create GitHub Actions workflow
│   │   ├── Build + Test on PR
│   │   ├── Spec validation on PR
│   │   └── Deploy on merge to main (placeholder)
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

## 4. Sprint 1-2 — Infrastructure, Auth & Integrations

**Duration:** Week 3-6
**Goal:** Complete authentication system + real notification integrations
**Dependencies:** Sprint 0 complete
**Git Tags:** v0.1.0 → v0.2.0

### 4.1 Week 3 — Core Infrastructure + Auth Backend

```
WEEK 3 — CORE INFRASTRUCTURE + AUTH BACKEND
════════════════════════════════════════════

TASK 1.1 — Repository Pattern + Unit of Work
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
├── Spec: MOJAZ-101, MOJAZ-102
├── Priority: Critical
├── Layer: Application + API
├── Tasks:
│   ├── [x] Create DTOs
│   │   ├── [x] RegisterRequest (FullName, Email?, Phone?,
│   │   │   Password, ConfirmPassword, RegistrationMethod,
│   │   │   PreferredLanguage, TermsAccepted)
│   │   ├── [x] RegisterResponse (UserId, RequiresVerification)
│   │   └── [x] UserDto (Id, FullName, Email, Phone, Role,
│   │       PreferredLanguage, IsActive)
│   ├── [x] Create RegisterValidator (FluentValidation)
│   │   ├── [x] FullName: Required, 2-200 chars
│   │   ├── [x] Email: Required if method=Email, valid format, unique
│   │   ├── [x] Phone: Required if method=Phone, E.164 format, unique
│   │   ├── [x] Password: 8+ chars, upper + lower + number + special
│   │   ├── [x] ConfirmPassword: Must match Password
│   │   ├── [x] RegistrationMethod: Must be "Email" or "Phone"
│   │   └── [x] TermsAccepted: Must be true
│   ├── [x] Create IAuthService interface (Application)
│   │   ├── [x] RegisterAsync(RegisterRequest)
│   │   ├── [x] LoginAsync(LoginRequest)
│   │   ├── [x] VerifyOtpAsync(VerifyOtpRequest)
│   │   ├── [x] ResendOtpAsync(ResendOtpRequest)
│   │   ├── [x] RefreshTokenAsync(RefreshTokenRequest)
│   │   ├── [x] LogoutAsync(LogoutRequest)
│   │   ├── [x] ForgotPasswordAsync(ForgotPasswordRequest)
│   │   └── [x] ResetPasswordAsync(ResetPasswordRequest)
│   ├── [x] Implement AuthService (Application)
│   │   ├── [x] Hash password with BCrypt (cost 12)
│   │   ├── [x] Generate 6-digit OTP
│   │   ├── [x] Hash OTP before storing
│   │   ├── [x] Create User record
│   │   ├── [x] Create OtpCode record
│   │   ├── [x] Trigger notification (email or SMS)
│   │   └── [x] Create audit log entry
│   ├── [x] Create AuthController (API)
│   │   └── [x] POST /api/v1/auth/register
│   ├── [x] Create AutoMapper profile (User ↔ UserDto)
│   └── [x] Write tests
│       ├── Validator tests (all rules)
│       ├── Service tests (success + error cases)
│       └── Controller integration test
├── Deliverable: Working registration endpoint
└── Tests: 20+ tests

TASK 1.3 — OTP Verification System
├── Spec: MOJAZ-104
├── Priority: Critical
├── Layer: Application + API
├── Tasks:
│   ├── [x] Create DTOs
│   │   ├── [x] VerifyOtpRequest (Destination, Code, Purpose)
│   │   ├── [x] ResendOtpRequest (Destination, DestinationType, Purpose)
│   │   └── [x] OtpResponse (Success, Message, RemainingAttempts)
│   ├── [x] Implement OTP verification logic
│   │   ├── [x] Find OTP record by destination + purpose
│   │   ├── [x] Check not expired (SMS: 5min, Email: 15min)
│   │   ├── [x] Check not already used
│   │   ├── [x] Check attempt count < max (3)
│   │   ├── [x] Compare hashed codes
│   │   ├── [x] Mark as used on success
│   │   ├── [x] Increment attempt count on failure
│   │   └── [x] Activate user account on success
│   ├── [x] Implement OTP resend logic
│   │   ├── [x] Check resend cooldown (60 seconds)
│   │   ├── [x] Check max resends per hour (3)
│   │   ├── [x] Generate new OTP
│   │   ├── [x] Invalidate old OTP
│   │   └── [x] Send via appropriate channel
│   ├── [x] Create endpoints
│   │   ├── [x] POST /api/v1/auth/verify-otp
│   │   └── [x] POST /api/v1/auth/resend-otp
│   └── [x] Write tests
├── Deliverable: Complete OTP verification flow
└── Tests: 15+ tests

TASK 1.4 — JWT + Login System
├── Spec: MOJAZ-103, MOJAZ-106
├── Priority: Critical
├── Layer: Application + Infrastructure + API
├── Tasks:
│   ├── [x] Create JWT configuration
│   │   ├── [x] JwtSettings class (Secret, Issuer, Audience, AccessExpiry, RefreshExpiry)
│   │   ├── [x] Configure in appsettings.json
│   │   └── [x] Register in DI
│   ├── [x] Create IJwtService interface
│   │   ├── [x] GenerateAccessToken(User user)
│   │   ├── [x] GenerateRefreshToken()
│   │   ├── [x] ValidateToken(string token)
│   │   └── [ ] GetPrincipalFromExpiredToken(string token)
│   ├── [x] Implement JwtService
│   ├── [x] Create DTOs
│   │   ├── [x] LoginRequest (Identifier, Password, Method)
│   │   ├── [x] LoginResponse (AccessToken, RefreshToken, ExpiresAt, UserDto)
│   │   ├── [x] RefreshTokenRequest (AccessToken, RefreshToken)
│   │   └── [x] LogoutRequest (RefreshToken)
│   ├── [x] Implement Login logic
│   │   ├── [x] Find user by email or phone
│   │   ├── [x] Check account is verified
│   │   ├── [x] Check account is not locked
│   │   ├── [x] Verify password hash
│   │   ├── [x] Reset failed attempts on success
│   │   ├── [x] Increment failed attempts on failure
│   │   ├── [x] Lock account after 5 failures (15 min)
│   │   ├── [x] Generate JWT access token
│   │   ├── [x] Generate and store refresh token
│   │   ├── [x] Update LastLoginAt
│   │   └── [x] Create audit log entry
│   ├── [x] Implement Refresh Token rotation
│   │   ├── [x] Validate refresh token exists and not expired/revoked
│   │   ├── [x] Generate new access token
│   │   ├── [x] Generate new refresh token
│   │   ├── [x] Revoke old refresh token
│   │   └── [x] Store new refresh token
│   ├── [x] Implement Logout
│   │   ├── [x] Revoke refresh token
│   │   └── [x] Create audit log entry
│   ├── [x] Configure JWT middleware in Program.cs
│   ├── [x] Create endpoints
│   │   ├── [x] POST /api/v1/auth/login
│   │   ├── [x] POST /api/v1/auth/refresh-token
│   │   └── [x] POST /api/v1/auth/logout
│   └── [x] Write tests
├── Deliverable: Complete JWT authentication
└── Tests: 25+ tests

TASK 1.5 — Password Recovery
├── Spec: MOJAZ-105
├── Priority: High
├── Layer: Application + API
├── Tasks:
│   ├── [x] Create DTOs
│   │   ├── [x] ForgotPasswordRequest (Identifier, Method)
│   │   └── [x] ResetPasswordRequest (Token/OTP, NewPassword, ConfirmPassword)
│   ├── [x] Implement forgot password (send OTP/link)
│   ├── [x] Implement reset password (verify + update)
│   ├── [x] Create endpoints
│   │   ├── [x] POST /api/v1/auth/forgot-password
│   │   └── [x] POST /api/v1/auth/reset-password
│   └── [x] Write tests
├── Deliverable: Password recovery flow
└── Tests: 10+ tests

TASK 1.6 — RBAC Authorization Setup
├── Spec: MOJAZ-200
├── Priority: Critical
├── Layer: API
├── Tasks:
│   ├── [x] Define role constants (UserRole enum)
│   ├── [x] Configure role-based authorization policies (Default)
│   ├── [x] Create [Authorize(Roles = "...")] on sensitive endpoints
│   ├── [ ] Create ownership check middleware
│   │   └── Applicant can only access own applications
│   └── [x] Write tests for authorization
├── Deliverable: Role-based access control
└── Tests: 15+ tests

TASK 1.7 — Audit Log System
├── Spec: MOJAZ-1501
├── Priority: Critical
├── Layer: Infrastructure + API
├── Tasks:
│   ├── [x] Create IAuditService interface
│   │   └── [x] LogAsync(action, entity, id, old, new)
│   ├── [x] Implement AuditService
│   │   ├── [x] Capture UserId from JWT claims
│   │   ├── [x] Capture IP address
│   │   ├── [x] Capture User-Agent
│   │   ├── [x] Serialize old/new values to JSON
│   │   └── [x] Save to AuditLogs table
│   ├── [ ] Create audit log middleware (automatic)
│   ├── [x] Create audit log endpoints
│   │   ├── [x] GET /api/v1/auditlogs (Admin)
│   │   └── [ ] GET /api/v1/auditlogs/{entityType}/{entityId}
│   └── [x] Write tests
├── Deliverable: Complete audit trail system
└── Tests: 8+ tests
```

### 4.2 Week 4 — Real Integrations + Auth Frontend

```
WEEK 4 — REAL INTEGRATIONS + AUTH FRONTEND
═══════════════════════════════════════════

TASK 2.1 — Email Integration (SendGrid) — REAL ✅
├── Spec: MOJAZ-902, MOJAZ-1001
├── Priority: Critical
├── Layer: Infrastructure
├── Tasks:
│   ├── [x] Create IEmailService interface (Application)
│   │   ├── [x] SendAsync(EmailMessage message)
│   │   ├── [x] SendTemplatedAsync(string template, object data, string to)
│   │   └── [x] SendBulkAsync(List<EmailMessage> messages)
│   ├── [x] Implement SendGridEmailService (Infrastructure)
│   │   ├── [x] Configure SendGrid API key from settings
│   │   ├── [x] Build HTML email from templates
│   │   ├── [x] Support bilingual emails (AR/EN)
│   │   ├── [x] Handle send errors with retry
│   │   ├── [x] Log all attempts to EmailLogs table
│   │   └── [x] Support attachments (for license PDF)
│   ├── [x] Create 10 email HTML templates
│   │   ├── [x] Account Confirmation (AR/EN)
│   │   ├── [x] Password Recovery (AR/EN)
│   │   ├── [x] Application Receipt (AR/EN)
│   │   ├── [x] Missing Documents (AR/EN)
│   │   ├── [x] Appointment Confirmation (AR/EN)
│   │   ├── [x] Medical Exam Result (AR/EN)
│   │   ├── [x] Test Result (AR/EN)
│   │   ├── [x] Application Decision (AR/EN)
│   │   ├── [x] License Issuance (AR/EN)
│   │   └── [x] Payment Confirmation (AR/EN)
│   ├── [x] Configure SPF + DKIM + DMARC (document steps)
│   ├── [x] Register in DI container
│   └── [x] Write tests (unit + integration)
├── Deliverable: Working email delivery
└── Tests: 10+ tests

TASK 2.2 — SMS Integration (Twilio) — REAL ✅
├── Spec: MOJAZ-904, MOJAZ-1002
├── Priority: Critical
├── Layer: Infrastructure
├── Tasks:
│   ├── [x] Create ISmsService interface (Application)
│   ├── [x] Implement TwilioSmsService (Infrastructure)
│   │   ├── [x] Configure Account SID + Auth Token from settings
│   │   ├── [x] Configure sender number/name
│   │   ├── [x] Build bilingual SMS (max 160 chars)
│   │   ├── [x] Handle delivery errors
│   │   ├── [x] Log all attempts to SmsLogs table
│   │   └── [ ] Track cost per message
│   ├── [x] Create 6 SMS templates
│   │   ├── [x] Registration OTP
│   │   ├── [x] Recovery OTP
│   │   ├── [x] Appointment Confirmation
│   │   ├── [x] Appointment Reminder
│   │   ├── [x] Test Result
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
│   ├── [x] Create IPushNotificationService interface (Application)
│   │   ├── [x] SendAsync(PushMessage message)
│   │   ├── [x] SendToUserAsync(Guid userId, PushMessage message)
│   │   └── [x] RegisterTokenAsync(Guid userId, string token, string deviceType)
│   ├── [x] Implement FirebasePushService (Infrastructure)
│   │   ├── [x] Configure Firebase Admin SDK
│   │   ├── [x] Send push via FCM HTTP v1 API
│   │   ├── [x] Handle invalid/expired tokens
│   │   ├── [x] Clean up stale tokens
│   │   └── [x] Support bilingual notifications
│   ├── [x] Create push notification endpoints (API)
│   │   ├── [x] POST /api/v1/notifications/push/register-token
│   │   └── [x] DELETE /api/v1/notifications/push/unregister-token
│   ├── [ ] Frontend: Firebase JS SDK setup
│   │   ├── [ ] Create firebase.ts config file
│   │   ├── [ ] Create firebase-messaging-sw.js service worker
│   │   ├── [ ] Create usePushNotifications hook
│   │   ├── [ ] Request permission after login
│   │   ├── [ ] Handle foreground notifications
│   │   └── [ ] Handle notification click (deep links)
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
│   ├── [x] Create auth store (Zustand)
│   │   ├── [x] user state
│   │   ├── [x] tokens state
│   │   ├── [x] login action
│   │   ├── [x] logout action
│   │   ├── [x] refresh token logic
│   │   └── [x] persist to localStorage
│   ├── [x] Create auth service (API calls)
│   │   ├── [x] register()
│   │   ├── [x] login()
│   │   ├── [x] verifyOtp()
│   │   ├── [x] resendOtp()
│   │   ├── [x] refreshToken()
│   │   └── [ ] logout()
│   ├── [x] Create Registration Page
│   │   ├── [x] Email / Phone tabs
│   │   ├── [x] Form with React Hook Form + Zod
│   │   └── [x] Success → redirect to OTP verification
│   ├── [x] Create OTP Verification Page
│   │   ├── [x] 6-digit input
│   │   └── [x] Success → redirect to dashboard
│   ├── [x] Create Login Page
│   │   ├── [x] Email / Phone tabs
│   │   └── [x] Success → redirect to dashboard
│   ├── [x] Create Password Recovery Page
│   │   ├── [x] Step 1: Enter email/phone
│   │   ├── [x] Step 2: Enter OTP
│   │   └── [x] Step 3: Set new password
│   ├── [x] Create Protected Route wrapper (Middleware logic)
│   ├── [ ] Create NotificationBell component
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

## 5. Sprint 3-4 — Applications & Documents

**Duration:** Week 7-10
**Goal:** Complete application lifecycle (create → submit → review)
**Dependencies:** Sprint 1-2 complete (auth + notifications)
**Git Tags:** v0.3.0 → v0.4.0

### 5.1 Week 7-8 — Application Backend + Wizard Frontend

```
WEEK 7-8 — APPLICATIONS
════════════════════════

TASK 3.1 — Application Service (Backend)
├── Spec: MOJAZ-301, MOJAZ-302
├── Priority: Critical
├── Layer: Application + Infrastructure + API
├── Tasks:
│   ├── [x] Create Application DTOs
│   │   ├── [x] CreateApplicationRequest
│   │   ├── [x] UpdateApplicationRequest
│   │   ├── [x] ApplicationDto
│   │   ├── [x] ApplicationListDto (summary for tables)
│   │   ├── [x] ApplicationTimelineDto
│   │   └── [x] ApplicationStatusUpdateRequest
│   ├── [x] Create ApplicationValidator
│   │   ├── [x] Validate all 21 fields
│   │   ├── [x] Cross-field validation (age vs category)
│   │   └── [x] Gate 1 validation
│   ├── [x] Create IApplicationService interface
│   │   ├── [x] CreateAsync(CreateApplicationRequest, Guid userId)
│   │   ├── [x] GetByIdAsync(Guid id, Guid userId)
│   │   ├── [x] GetListAsync(ApplicationFilter, PaginationParams)
│   │   ├── [x] UpdateAsync(Guid id, UpdateApplicationRequest)
│   │   ├── [x] UpdateStatusAsync(Guid id, string status)
│   │   ├── [x] CancelAsync(Guid id, string reason)
│   │   ├── [x] GetTimelineAsync(Guid id)
│   │   └── [x] CheckEligibilityAsync(Guid applicantId, string categoryCode)
│   ├── [x] Implement ApplicationService
│   │   ├── [x] Gate 1 checks (age, active app, blocks)
│   │   ├── [x] Generate application number (MOJ-YYYY-XXXXXXXX)
│   │   ├── [x] Set initial status = Draft
│   │   ├── [x] Set expiry date from SystemSettings
│   │   ├── [x] Create audit log entry
│   │   ├── [x] Send notifications on submission
│   │   └── [x] Ownership check (applicant sees only own)
│   ├── [x] Create ApplicationsController
│   │   ├── [x] POST /api/v1/applications
│   │   ├── [x] GET /api/v1/applications (with filters)
│   │   ├── [x] GET /api/v1/applications/{id}
│   │   ├── [x] PUT /api/v1/applications/{id}
│   │   ├── [x] PATCH /api/v1/applications/{id}/status
│   │   ├── [x] PATCH /api/v1/applications/{id}/cancel
│   │   └── [x] GET /api/v1/applications/{id}/timeline
│   └── [x] Write tests (30+)
├── Deliverable: Complete application CRUD API
└── Tests: 30+ tests

TASK 3.2 — Application Wizard (Frontend)
├── Spec: MOJAZ-1303
├── Priority: Critical
├── Layer: Frontend
├── Tasks:
│   ├── [x] Create application Zustand store
│   │   ├── [x] Wizard step state
│   │   ├── [x] Form data state
│   │   ├── [x] Draft auto-save
│   │   └── [x] Reset on completion
│   ├── [x] Create application service (API calls)
│   ├── [x] Create Zod schemas for each wizard step
│   ├── [x] Create WizardProgress component
│   │   ├── [x] 5 steps with labels
│   │   ├── [x] Completion percentage
│   │   └── [x] Clickable steps (back navigation)
│   ├── [x] Create Step 1: Service Selection
│   │   ├── [x] 8 service cards in grid
│   │   ├── [x] Card: icon + title + description
│   │   └── [x] Selected state visual feedback
│   ├── [x] Create Step 2: Category Selection
│   │   ├── [x] 6 category cards (A-F)
│   │   ├── [x] Min age badge
│   │   ├── [x] Age validation on selection
│   │   └── [x] Requirements summary panel
│   ├── [x] Create Step 3: Personal Information Form
│   │   ├── [x] National ID field
│   │   ├── [x] Date of Birth (with age calc)
│   │   ├── [x] Nationality select
│   │   ├── [x] Gender radio
│   │   ├── [x] Phone (pre-filled)
│   │   ├── [x] Email (pre-filled)
│   │   └── [x] Address / City / Region
│   ├── [x] Create Step 4: Application Details
│   │   ├── [x] Applicant Type radio
│   │   ├── [x] Preferred Center select
│   │   ├── [x] Test Language select
│   │   └── [x] Special Needs textarea
│   ├── [x] Create Step 5: Review & Submit
│   │   ├── [x] Summary cards for all data
│   │   ├── [x] Edit buttons per section
│   │   ├── [x] Accuracy declaration checkbox
│   │   ├── [x] Submit with confirmation dialog
│   │   └── [x] Success page with app number
│   ├── [x] Implement auto-save (draft every 30s)
│   └── [ ] Write component tests
├── Deliverable: Complete 5-step application wizard
└── Tests: 20+ tests
 
TASK 3.3 — Document Upload & Review
├── Spec: MOJAZ-303, MOJAZ-304
├── Priority: Critical
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Document endpoints
│   │   ├── POST /api/v1/applications/{id}/documents
│   │   │   ├── Accept multipart/form-data
│   │   │   ├── Validate file type (PDF, JPG, PNG)
│   │   │   ├── Validate file size (max 5MB)
│   │   │   ├── Check MIME type headers
│   │   │   ├── Save to file system (configurable path)
│   │   │   └── Record in Documents table
│   │   ├── GET /api/v1/applications/{id}/documents
│   │   └── DELETE /api/v1/applications/{id}/documents/{docId}
│   ├── [ ] Backend: Document review (Receptionist)
│   │   ├── PATCH /api/v1/documents/{id}/review
│   │   ├── Accept/Reject with reason
│   │   └── Trigger notification on rejection
│   ├── [ ] Frontend: Document Upload page
│   │   ├── Document type cards (8 types)
│   │   ├── Required vs conditional indicators
│   │   ├── Drag & drop upload zone
│   │   ├── File preview (image/PDF)
│   │   ├── Upload progress bar
│   │   ├── Delete uploaded file
│   │   └── Status badges (Uploaded/Approved/Rejected)
│   ├── [ ] Frontend: Document Review (Employee portal)
│   │   ├── Document viewer
│   │   ├── Approve/Reject buttons
│   │   ├── Rejection reason input
│   │   └── Side-by-side comparison
│   └── [ ] Write tests
├── Deliverable: Complete document management
└── Tests: 15+ tests
```

### 5.2 Week 9-10 — Status Tracking + Employee Queue

```
WEEK 9-10 — STATUS TRACKING + EMPLOYEE PORTAL
═════════════════════════════════════════════

TASK 3.4 — Application Status Tracking (Applicant)
├── Spec: MOJAZ-305, MOJAZ-306
├── Priority: High
├── Layer: Frontend
├── Tasks:
│   ├── [x] Create ApplicationTimeline component
│   │   ├── [x] 10 stages as vertical timeline
│   │   ├── [x] Completed stages: green checkmark
│   │   ├── [x] Current stage: highlighted + animated
│   │   ├── [x] Future stages: grayed out
│   │   ├── [x] Stage details expandable
│   │   ├── [x] Timestamps for each stage
│   │   └── [x] Failure indicators (red) with reason
│   ├── [x] Create StatusBadge component
│   │   ├── [x] Color-coded by status
│   │   ├── [x] AR/EN labels
│   │   └── [x] Tooltip with description
│   ├── [x] Create Application Detail page
│   │   ├── [x] Application header (number, status, dates)
│   │   ├── [x] Timeline section
│   │   ├── [x] Documents section
│   │   ├── [x] Payments section
│   │   ├── [x] Test results section
│   │   └── [x] Action buttons (cancel, pay, etc.)
│   └── [ ] Write tests
├── Deliverable: Complete status tracking UI
└── Tests: 10+ tests

TASK 3.5 — Applicant Dashboard
├── Spec: MOJAZ-1302
├── Priority: High
├── Layer: Frontend
├── Tasks:
│   ├── [x] Create dashboard layout
│   │   ├── [x] Welcome message with user name
│   │   ├── [x] Quick action cards (New Application, etc.)
│   │   ├── [x] Active applications summary
│   │   ├── [x] Upcoming appointments
│   │   ├── [x] Recent notifications
│   │   └── [x] Quick stats (applications count, etc.)
│   ├── [x] Create ApplicationCard component
│   │   ├── [x] Application number
│   │   ├── [x] License category badge
│   │   ├── [x] Status badge
│   │   ├── [x] Current stage
│   │   ├── [x] Last updated
│   │   └── [x] Click → navigate to detail
│   └── [ ] Write tests
├── Deliverable: Applicant dashboard
└── Tests: 8+ tests

TASK 3.6 — Employee Dashboard + Application Queue
├── Spec: MOJAZ-1310, MOJAZ-1311
├── Priority: High
├── Layer: Frontend
├── Tasks:
│   ├── [x] Create employee dashboard
│   │   ├── [x] Role-based content
│   │   ├── [x] Pending items count
│   │   ├── [x] Today's appointments
│   │   ├── [x] Quick stats
│   │   └── [x] Action items list
│   ├── [x] Create Applications List page (Employee)
│   │   ├── [x] TanStack Table with columns:
│   │   │   ├── [x] Application Number
│   │   │   ├── [x] Applicant Name
│   │   │   ├── [x] Category
│   │   │   ├── [x] Status
│   │   │   ├── [x] Stage
│   │   │   ├── [x] Submitted Date
│   │   │   └── [x] Actions
│   │   ├── [x] Filters: status, stage, category, date range
│   │   ├── [x] Search by app number or name
│   │   ├── [x] Sortable columns
│   │   ├── [x] Pagination
│   │   └── [x] Row click → detail view
│   ├── [x] Create Application Review page (Employee)
│   │   ├── [x] Full application data display
│   │   ├── [x] Document viewer
│   │   ├── [x] Action buttons based on role + stage
│   │   └── [x] Notes/comments section
│   └── [x] Write tests
├── Deliverable: Employee portal core pages
└── Tests: 12+ tests

TASK 3.7 — Sprint 3-4 Integration Testing
├── Priority: Critical
├── Tasks:
│   ├── [x] E2E: Create application through wizard
│   ├── [x] E2E: Upload all 8 document types
│   ├── [x] E2E: Employee reviews and approves documents
│   ├── [x] E2E: Status timeline updates correctly
│   ├── [x] E2E: Notifications sent at each stage
│   ├── [x] E2E: Application cancellation
│   ├── [x] E2E: Draft saving and resuming
│   ├── [x] E2E: Gate 1 validation (underage, active app)
│   ├── [ ] Visual: RTL/LTR all new pages
│   └── [ ] Visual: Dark/Light all new pages
├── Deliverable: All Sprint 3-4 features verified
└── Tag: v0.4.0
```

---

## 6. Sprint 5-6 — Medical, Training & Tests

**Duration:** Week 11-14
**Goal:** Complete medical exam, training, and test stages
**Dependencies:** Sprint 3-4 complete (applications + documents)
**Git Tags:** v0.5.0 → v0.6.0

### 6.1 Week 11-12 — Medical + Training + Appointments

```
WEEK 11-12 — MEDICAL + TRAINING + APPOINTMENTS
═══════════════════════════════════════════════

TASK 4.1 — Appointment System
├── Spec: MOJAZ-606, MOJAZ-1204
├── Priority: Critical
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Appointment service
│   │   ├── Available slots generation (configurable)
│   │   ├── Booking logic (check conflicts)
│   │   ├── Reschedule logic (within limits)
│   │   ├── Cancel logic (with reason)
│   │   └── Gate 2 validation before booking
│   ├── [ ] Backend: Appointment endpoints
│   │   ├── POST /api/v1/appointments
│   │   ├── GET /api/v1/appointments/available-slots
│   │   ├── PATCH /api/v1/appointments/{id}/reschedule
│   │   └── PATCH /api/v1/appointments/{id}/cancel
│   ├── [ ] Backend: Appointment reminder job
│   │   └── Hangfire job: 24h before → send reminder
│   ├── [ ] Frontend: Appointment booking page
│   │   ├── Appointment type selection (Medical/Theory/Practical)
│   │   ├── Calendar view (available dates)
│   │   ├── Time slot picker
│   │   ├── Branch/center selection
│   │   ├── Confirmation modal
│   │   └── Booked appointments list with actions
│   └── [ ] Write tests
├── Deliverable: Complete appointment system
└── Tests: 20+ tests

TASK 4.2 — Medical Examination
├── Spec: MOJAZ-404, MOJAZ-1205
├── Priority: Critical
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: MedicalExam service
│   │   ├── Create exam record on appointment
│   │   ├── Record exam result (Doctor role)
│   │   ├── Fitness result: Fit/Unfit/ConditionalFit/RequiresReexam
│   │   ├── Set validity period (from SystemSettings)
│   │   ├── Trigger notification on result
│   │   └── Audit log entry
│   ├── [ ] Backend: Medical endpoints
│   │   ├── POST /api/v1/medical-exams
│   │   ├── GET /api/v1/medical-exams/{applicationId}
│   │   └── PATCH /api/v1/medical-exams/{id}/result
│   ├── [ ] Frontend: Medical Exam Results (Doctor portal)
│   │   ├── List of pending medical exams
│   │   ├── Exam result form
│   │   │   ├── Fitness result dropdown
│   │   │   ├── Blood type select
│   │   │   ├── Notes textarea
│   │   │   └── Report reference input
│   │   ├── Submit with confirmation
│   │   └── View exam history
│   ├── [ ] Frontend: Medical result view (Applicant)
│   │   └── Result card with status + details
│   └── [ ] Write tests
├── Deliverable: Complete medical examination flow
└── Tests: 15+ tests

TASK 4.3 — Training Records
├── Spec: MOJAZ-405, MOJAZ-504
├── Priority: High
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: TrainingRecord service
│   │   ├── Create training record
│   │   ├── Record completion (manual entry by employee)
│   │   ├── Handle training exemption (with approval)
│   │   ├── Validate required hours by category
│   │   └── Gate check: training complete before tests
│   ├── [ ] Frontend: Training recording (Employee)
│   │   ├── School name input
│   │   ├── Certificate number
│   │   ├── Hours completed / required
│   │   ├── Status update
│   │   └── Exemption request (with reason + document)
│   ├── [ ] Frontend: Training status (Applicant)
│   │   └── Training progress card
│   └── [ ] Write tests
├── Deliverable: Complete training tracking
└── Tests: 10+ tests
```

### 6.2 Week 13-14 — Theory + Practical Tests

```
WEEK 13-14 — THEORY + PRACTICAL TESTS
══════════════════════════════════════

TASK 4.4 — Theory Test
├── Spec: MOJAZ-406, MOJAZ-1206
├── Priority: Critical
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: TheoryTest service
│   │   ├── Record test result (Examiner role)
│   │   ├── Score + passing score validation
│   │   ├── Result: Pass/Fail/Absent
│   │   ├── Track attempt number
│   │   ├── Max attempts check (from SystemSettings)
│   │   ├── Cooling period check (from SystemSettings)
│   │   ├── Gate 3 validation
│   │   ├── Trigger notifications
│   │   └── Audit logging
│   ├── [ ] Backend: Theory test endpoint
│   │   └── POST /api/v1/theory-tests/{applicationId}/result
│   ├── [ ] Frontend: Test Result Recording (Examiner)
│   │   ├── Applicant search/select
│   │   ├── Attendance confirmation
│   │   ├── Score input
│   │   ├── Result selection (Pass/Fail/Absent)
│   │   ├── Notes field
│   │   ├── Attempt number display
│   │   └── Submit with confirmation
│   ├── [ ] Frontend: Test result view (Applicant)
│   │   ├── Result card with score
│   │   ├── Attempt history
│   │   └── Remaining attempts indicator
│   └── [ ] Write tests
├── Deliverable: Complete theory test flow
└── Tests: 15+ tests

TASK 4.5 — Practical Test
├── Spec: MOJAZ-407, MOJAZ-1206
├── Priority: Critical
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: PracticalTest service
│   │   ├── Record test result (Examiner role)
│   │   ├── Result: Pass/Fail/Absent
│   │   ├── Additional training flag
│   │   ├── Additional hours required
│   │   ├── Same attempt/cooling logic as theory
│   │   ├── Gate 3 validation
│   │   └── Notifications + audit
│   ├── [ ] Backend: Practical test endpoint
│   │   └── POST /api/v1/practical-tests/{applicationId}/result
│   ├── [ ] Backend: Test history endpoint
│   │   └── GET /api/v1/tests/{applicationId}/history
│   ├── [ ] Frontend: Practical test recording (Examiner)
│   │   ├── Similar to theory but with driving-specific fields
│   │   ├── Additional training toggle
│   │   └── Hours required input
│   └── [ ] Write tests
├── Deliverable: Complete practical test flow
└── Tests: 15+ tests

TASK 4.6 — Test Retake Service
├── Spec: MOJAZ-605
├── Priority: High
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Retake logic
│   │   ├── Check attempt count < max
│   │   ├── Check cooling period elapsed
│   │   ├── Create retake fee payment
│   │   ├── Reset test status for rebooking
│   │   └── Update application stage
│   ├── [ ] Frontend: Retake flow
│   │   ├── Show remaining attempts
│   │   ├── Show next available date
│   │   ├── Pay retake fee
│   │   └── Book new appointment
│   └── [ ] Write tests
├── Deliverable: Complete test retake flow
└── Tests: 8+ tests

TASK 4.7 — Category F (Agricultural) Specifics
├── Spec: MOJAZ-706
├── Priority: High
├── Layer: Backend + Frontend
├── Tasks:
│   ├── [ ] Verify category F rules in SystemSettings
│   │   ├── MIN_AGE_CATEGORY_F = 18
│   │   ├── Training hours = 20
│   │   ├── Theory questions = 20
│   │   └── Practical duration = 30 min
│   ├── [ ] Category F in wizard (frontend)
│   │   ├── Special description for agricultural vehicles
│   │   └── Appropriate icon
│   ├── [ ] Category F upgrade path (F → B)
│   └── [ ] Write tests
├── Deliverable: Agricultural category fully supported
└── Tests: 5+ tests

TASK 4.8 — Sprint 5-6 Integration Testing
├── Priority: Critical
├── Tasks:
│   ├── [ ] E2E: Book medical appointment → exam result recorded
│   ├── [ ] E2E: Training completion recorded
│   ├── [ ] E2E: Theory test pass → practical test unlock
│   ├── [ ] E2E: Theory test fail → retake flow
│   ├── [ ] E2E: Max attempts exceeded → application blocked
│   ├── [ ] E2E: Cooling period enforcement
│   ├── [ ] E2E: Gate 2 + Gate 3 validation
│   ├── [ ] E2E: Appointment reminder notification (24h)
│   ├── [ ] E2E: All test results trigger notifications
│   └── [ ] E2E: Category F complete flow
├── Deliverable: All Sprint 5-6 features verified
└── Tag: v0.6.0
```

---

## 7. Sprint 7-8 — Approval, Payment & License Issuance

**Duration:** Week 15-18
**Goal:** Complete final approval, payment simulation, and license issuance
**Dependencies:** Sprint 5-6 complete
**Git Tags:** v0.7.0 → v0.8.0

### 7.1 Week 15-16 — Final Approval + Payment

```
WEEK 15-16 — APPROVAL + PAYMENT
════════════════════════════════

TASK 5.1 — Final Approval Stage
├── Spec: MOJAZ-408
├── Priority: Critical
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Approval service
│   │   ├── Gate 4 validation (comprehensive check)
│   │   │   ├── Theory test passed
│   │   │   ├── Practical test passed
│   │   │   ├── Security re-check clean
│   │   │   ├── No outstanding blocks
│   │   │   ├── ID still valid
│   │   │   ├── Medical exam still valid (not expired)
│   │   │   └── All payments up to date
│   │   ├── Approve action (Manager/Approver)
│   │   ├── Reject action (with reason)
│   │   ├── Return to previous stage (with reason)
│   │   ├── Trigger approval notification
│   │   └── Audit logging
│   ├── [ ] Frontend: Approval page (Manager/Approver)
│   │   ├── Application summary review
│   │   ├── All stage results summary
│   │   ├── Document review status
│   │   ├── Payment status
│   │   ├── Gate 4 checklist (auto-validated)
│   │   ├── Approve button (with confirmation)
│   │   ├── Reject button (with reason modal)
│   │   └── Return to stage button (with reason)
│   └── [ ] Write tests
├── Deliverable: Complete approval workflow
└── Tests: 15+ tests

TASK 5.2 — Payment System (Simulated)
├── Spec: MOJAZ-800, MOJAZ-1207
├── Priority: Critical
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Payment service
│   │   ├── Get fee amount from FeeStructures table
│   │   ├── Initiate payment (create Payment record)
│   │   ├── Simulate payment processing
│   │   │   ├── Auto-succeed after 2 seconds
│   │   │   ├── Configurable failure rate (for testing)
│   │   │   └── Generate transaction reference
│   │   ├── Confirm payment
│   │   ├── Handle payment failure
│   │   ├── Receipt generation
│   │   ├── Trigger payment notification
│   │   └── Audit logging
│   ├── [ ] Backend: Payment endpoints
│   │   ├── POST /api/v1/payments/initiate
│   │   ├── POST /api/v1/payments/{id}/confirm
│   │   ├── GET /api/v1/payments/{applicationId}
│   │   └── GET /api/v1/payments/{id}/receipt
│   ├── [ ] Frontend: Payment page
│   │   ├── Fee breakdown display
│   │   │   ├── Fee type
│   │   │   ├── Amount
│   │   │   └── Category-specific label
│   │   ├── Simulated payment form
│   │   │   ├── Card number (placeholder)
│   │   │   ├── "Pay Now" button
│   │   │   └── Processing animation
│   │   ├── Success state with reference number
│   │   ├── Failure state with retry option
│   │   ├── Payment history for application
│   │   └── Receipt download (PDF)
│   ├── [ ] Handle multi-point payments
│   │   ├── Application fee (Stage 3)
│   │   ├── Medical exam fee (before booking)
│   │   ├── Theory test fee (before booking)
│   │   ├── Practical test fee (before booking)
│   │   ├── Retake fee (when applicable)
│   │   └── License issuance fee (Stage 9)
│   └── [ ] Write tests
├── Deliverable: Complete payment simulation
└── Tests: 20+ tests
```

### 7.2 Week 17-18 — License Issuance + Services

```
WEEK 17-18 — LICENSE ISSUANCE + REMAINING SERVICES
═══════════════════════════════════════════════════

TASK 5.3 — License Issuance
├── Spec: MOJAZ-410, MOJAZ-1208
├── Priority: Critical
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: License service
│   │   ├── Generate license number (MOJ-YYYY-XXXXXXXX)
│   │   ├── Calculate expiry date by category
│   │   │   ├── A, B, F: 10 years
│   │   │   └── C, D, E: 5 years
│   │   ├── Create License record
│   │   ├── Update Application status to Complete
│   │   ├── Generate license PDF (QuestPDF)
│   │   │   ├── Official government design
│   │   │   ├── License number
│   │   │   ├── Applicant photo
│   │   │   ├── Personal info
│   │   │   ├── Category + validity
│   │   │   ├── QR code (license verification)
│   │   │   └── Bilingual (AR/EN)
│   │   ├── Trigger license notification (all channels)
│   │   └── Audit logging
│   ├── [ ] Backend: License endpoints
│   │   ├── POST /api/v1/licenses/{applicationId}/issue
│   │   ├── GET /api/v1/licenses/{id}
│   │   └── GET /api/v1/licenses/{id}/download
│   ├── [ ] Frontend: License download page
│   │   ├── License preview (visual card)
│   │   ├── Download PDF button
│   │   ├── License details display
│   │   ├── Validity period
│   │   └── QR code display
│   └── [ ] Write tests
├── Deliverable: Complete license issuance + PDF
└── Tests: 12+ tests

TASK 5.4 — License Renewal Service
├── Spec: MOJAZ-602
├── Priority: High
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Renewal workflow
│   │   ├── Check existing license (valid or recently expired)
│   │   ├── Simplified workflow (fewer stages)
│   │   ├── Medical exam may be required (based on expiry)
│   │   ├── Renewal fee from FeeStructures
│   │   ├── Generate new license with updated dates
│   │   └── Deactivate old license
│   ├── [ ] Frontend: Renewal flow (simplified wizard)
│   └── [ ] Write tests
├── Deliverable: License renewal service
└── Tests: 10+ tests

TASK 5.5 — Lost/Damaged Replacement Service
├── Spec: MOJAZ-603
├── Priority: High
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Replacement workflow
│   │   ├── Verify existing active license
│   │   ├── Reason documentation (Lost vs Damaged)
│   │   ├── Replacement fee
│   │   ├── Generate new license (same details, new number)
│   │   └── Deactivate old license
│   ├── [ ] Frontend: Replacement flow
│   └── [ ] Write tests
├── Deliverable: License replacement service
└── Tests: 8+ tests

TASK 5.6 — Category Upgrade Service
├── Spec: MOJAZ-604
├── Priority: High
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Upgrade workflow
│   │   ├── Validate upgrade path (B→C→D→E, F→B)
│   │   ├── Check holding period (12 months)
│   │   ├── Full workflow for new category
│   │   ├── Upgrade-specific fees
│   │   └── Previous license reference
│   ├── [ ] Frontend: Upgrade flow
│   └── [ ] Write tests
├── Deliverable: Category upgrade service
└── Tests: 10+ tests

TASK 5.7 — Application Cancellation Service
├── Spec: MOJAZ-607
├── Priority: Medium
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Cancellation rules
│   │   ├── Cancellable stages (before final approval)
│   │   ├── Cancellation by applicant
│   │   ├── Cancellation by employee (with reason)
│   │   ├── Refund eligibility check
│   │   ├── Update status + reason
│   │   └── Trigger notification
│   ├── [ ] Frontend: Cancel action + confirmation
│   └── [ ] Write tests
├── Deliverable: Application cancellation
└── Tests: 6+ tests

TASK 5.8 — Sprint 7-8 Integration Testing
├── Priority: Critical
├── Tasks:
│   ├── [ ] E2E: Complete new license flow (all 10 stages)
│   ├── [ ] E2E: Payment at all 5 payment points
│   ├── [ ] E2E: License PDF generation + download
│   ├── [ ] E2E: License renewal flow
│   ├── [ ] E2E: License replacement flow
│   ├── [ ] E2E: Category upgrade flow
│   ├── [ ] E2E: Application cancellation
│   ├── [ ] E2E: Gate 4 validation
│   └── [ ] E2E: Notifications at all stages
├── Deliverable: All Sprint 7-8 features verified
└── Tag: v0.8.0
```

---

## 8. Sprint 9-10 — Reports, Polish & Launch

**Duration:** Week 19-20
**Goal:** Reports, landing page, comprehensive testing, launch
**Dependencies:** Sprint 7-8 complete
**Git Tags:** v0.9.0 → v1.0.0

### 8.1 Week 19 — Reports + Landing Page

```
WEEK 19 — REPORTS + LANDING PAGE
═════════════════════════════════

TASK 6.1 — Reports System (7 Reports)
├── Spec: MOJAZ-1400
├── Priority: High
├── Layer: Full Stack
├── Tasks:
│   ├── [ ] Backend: Report service
│   │   ├── Applications by Status
│   │   ├── Applications by Service Type
│   │   ├── Test Pass/Fail Rates
│   │   ├── Delayed/Stalled Applications
│   │   ├── Branch/Center Performance
│   │   ├── Examiner/Doctor Performance
│   │   └── Daily/Monthly Issued Licenses
│   ├── [ ] Backend: Report endpoints (6)
│   │   ├── GET /api/v1/reports/applications-by-status
│   │   ├── GET /api/v1/reports/applications-by-service
│   │   ├── GET /api/v1/reports/test-pass-fail-rates
│   │   ├── GET /api/v1/reports/delayed-applications
│   │   ├── GET /api/v1/reports/branch-performance
│   │   └── GET /api/v1/reports/daily-monthly-issuance
│   ├── [ ] Frontend: Reports dashboard (Manager/Admin)
│   │   ├── Report selector
│   │   ├── Date range filter
│   │   ├── Branch/Category/Examiner filters
│   │   ├── Charts (Recharts)
│   │   │   ├── Pie/Donut charts
│   │   │   ├── Bar charts
│   │   │   ├── Line charts (trends)
│   │   │   └── Summary KPI cards
│   │   ├── Data tables (TanStack Table)
│   │   └── Export capability (CSV/PDF)
│   └── [ ] Write tests
├── Deliverable: 7 operational reports
└── Tests: 15+ tests

TASK 6.2 — Landing Page
├── Spec: MOJAZ-1301
├── Priority: High
├── Layer: Frontend
├── Tasks:
│   ├── [ ] Section 1: Header
│   │   ├── Logo + System name "مُجاز"
│   │   ├── Language switcher
│   │   ├── Theme switcher
│   │   ├── Login button
│   │   └── Register button
│   ├── [ ] Section 2: Hero
│   │   ├── Headline (AR/EN)
│   │   ├── Description text
│   │   ├── CTA button "Start Your Application"
│   │   ├── Hero image/illustration
│   │   └── Animated entrance (Framer Motion)
│   ├── [ ] Section 3: Services
│   │   ├── 8 service cards in grid
│   │   ├── Icon + Title + Description per card
│   │   └── Hover animation
│   ├── [ ] Section 4: How It Works
│   │   ├── 6 steps timeline
│   │   ├── Step numbers with icons
│   │   └── Scroll animation
│   ├── [ ] Section 5: License Categories
│   │   ├── 6 category cards (A-F)
│   │   ├── Icon + Name + Min Age
│   │   └── Category details on hover/click
│   ├── [ ] Section 6: Why Mojaz
│   │   ├── Feature cards (6 features)
│   │   └── Icons + descriptions
│   ├── [ ] Section 7: Statistics
│   │   ├── Counter animations
│   │   ├── Licenses issued
│   │   ├── Users registered
│   │   ├── Branches
│   │   └── Average processing time
│   ├── [ ] Section 8: FAQ
│   │   ├── 6-8 questions
│   │   └── Accordion component
│   ├── [ ] Section 9: Footer
│   │   ├── Logo + Quick links
│   │   ├── Contact info
│   │   ├── Privacy + Terms links
│   │   └── Copyright
│   ├── [ ] Full responsive design
│   ├── [ ] Full RTL/LTR support
│   ├── [ ] Full Dark/Light support
│   ├── [ ] Page load performance optimization
│   └── [ ] SEO meta tags
├── Deliverable: Complete landing page
└── Tests: 5+ tests

TASK 6.3 — Audit Logs UI (Admin)
├── Spec: MOJAZ-1320
├── Priority: Medium
├── Layer: Frontend
├── Tasks:
│   ├── [ ] Audit logs table with filters
│   │   ├── User filter
│   │   ├── Action type filter
│   │   ├── Entity type filter
│   │   ├── Date range
│   │   └── Search
│   ├── [ ] Log detail modal
│   │   ├── Old vs New values comparison
│   │   ├── User info
│   │   ├── IP address
│   │   └── Timestamp
│   └── [ ] Write tests
├── Deliverable: Audit log viewing UI
└── Tests: 5+ tests
```

### 8.2 Week 20 — Testing + Polish + Launch

```
WEEK 20 — TESTING + POLISH + LAUNCH
════════════════════════════════════

TASK 7.1 — Comprehensive E2E Testing
├── Priority: Critical
├── Tasks:
│   ├── [ ] Playwright E2E test suite
│   │   ├── Complete new license flow (all 10 stages)
│   │   ├── License renewal flow
│   │   ├── License replacement flow
│   │   ├── Category upgrade flow
│   │   ├── Test retake flow
│   │   ├── Application cancellation
│   │   ├── User management (admin)
│   │   ├── Settings management (admin)
│   │   ├── Reports viewing (manager)
│   │   └── Notification delivery verification
│   ├── [ ] Cross-browser testing
│   │   ├── Chrome (latest)
│   │   ├── Firefox (latest)
│   │   ├── Safari (latest)
│   │   └── Edge (latest)
│   ├── [ ] RTL/LTR visual regression testing
│   ├── [ ] Dark/Light mode visual testing
│   ├── [ ] Mobile responsive testing
│   │   ├── iPhone 12/13/14 viewport
│   │   ├── iPad viewport
│   │   └── Android common viewports
│   └── [ ] Performance testing
│       ├── Page load times < 3s
│       ├── API response times < 2s (P95)
│       └── Concurrent users simulation (100)
├── Deliverable: Complete test report
└── Tests: 50+ E2E tests

TASK 7.2 — Bug Fixing & Polish
├── Priority: Critical
├── Tasks:
│   ├── [ ] Fix all critical/high bugs from testing
│   ├── [ ] UI polish and consistency check
│   │   ├── Consistent spacing
│   │   ├── Consistent typography
│   │   ├── Consistent color usage
│   │   ├── Loading states for all actions
│   │   ├── Empty states for all lists
│   │   ├── Error states for all pages
│   │   └── 404 page
│   ├── [ ] Accessibility check (WCAG 2.1 AA)
│   │   ├── Keyboard navigation
│   │   ├── Screen reader support
│   │   ├── Color contrast
│   │   ├── Focus indicators
│   │   └── Alt text for images
│   ├── [ ] Performance optimization
│   │   ├── Image optimization
│   │   ├── Code splitting
│   │   ├── Lazy loading
│   │   └── Database query optimization
│   └── [ ] Security review
│       ├── OWASP top 10 check
│       ├── Input sanitization verification
│       ├── Auth flow security review
│       └── API rate limiting verification
├── Deliverable: Production-ready application
└── Estimated: 30+ fixes

TASK 7.3 — Documentation & Deployment
├── Priority: High
├── Tasks:
│   ├── [ ] Update README.md with:
│   │   ├── Project overview
│   │   ├── Setup instructions
│   │   ├── Environment variables list
│   │   ├── Docker setup
│   │   └── Contributing guidelines
│   ├── [ ] API documentation review (Swagger)
│   │   ├── All endpoints documented
│   │   ├── Request/Response examples
│   │   ├── Authentication info
│   │   └── Error codes
│   ├── [ ] Database documentation
│   │   ├── ERD diagram
│   │   ├── Table descriptions
│   │   └── Seed data documentation
│   ├── [ ] Deployment setup
│   │   ├── Production Docker Compose
│   │   ├── Environment variable configuration
│   │   ├── Database migration scripts
│   │   ├── Backup configuration
│   │   └── Health check endpoints
│   ├── [ ] Create demo data
│   │   ├── Sample users (one per role)
│   │   ├── Sample applications (various stages)
│   │   ├── Sample test results
│   │   └── Sample licenses
│   └── [ ] Final deployment
│       ├── Deploy database
│       ├── Deploy backend API
│       ├── Deploy frontend
│       ├── Configure DNS
│       ├── Configure SSL
│       ├── Verify all integrations
│       └── Smoke test in production
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
│  Languages:       Arabic (RTL) + English (LTR)           │
│  Themes:          Dark + Light                           │
│  Git Tags:        v0.0.1 → v1.0.0                       │
└──────────────────────────────────────────────────────────┘
```

---

> **This implementation plan is a living document.**
> **Update task statuses as work progresses.**
> **Flag blockers immediately.**
> **Celebrate milestones. 🎉**