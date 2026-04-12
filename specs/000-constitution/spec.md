# Feature Specification: 000-constitution

**Feature Branch**: `000-constitution`
**Created**: 2026-04-02
**Status**: Complete

## Summary

Establishes the project governing principles and development guidelines for the Mojaz platform.

## Project Identity

- **Name:** Mojaz (مُجاز) — "Licensed/Authorized" in Arabic
- **Type:** Full-Stack Web Application
- **Domain:** Government / GovTech / Driving License Management
- **Primary Color:** #006C35 (Royal Green)
- **Design System:** Absher-Inspired, government official style

## Tech Stack

### Backend
- ASP.NET Core 8 Web API
- Clean Architecture (5 layers: Domain → Shared → Application → Infrastructure → API)
- Entity Framework Core 8 + SQL Server 2022
- JWT + Refresh Token authentication
- FluentValidation, AutoMapper, Hangfire, Serilog, QuestPDF
- SendGrid (email), Twilio (SMS), Firebase Admin SDK (push notifications)

### Frontend
- Next.js 15 (App Router) + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (Mojaz-themed)
- React Query 5 + Zustand 5
- React Hook Form 7 + Zod 3
- next-intl 3 + next-themes
- Recharts 2 + TanStack Table 8
- Firebase JS SDK 10

## Architecture Rules

1. Domain layer has ZERO external dependencies
2. Application layer NEVER references Infrastructure
3. Controllers are THIN — all logic in Application services
4. Repository Pattern + Unit of Work for data access
5. ALL business values stored in SystemSettings — NEVER hardcoded
6. ALL fee amounts in FeeStructures — NEVER hardcoded
7. Soft Delete only — NEVER physical delete
8. DateTime.UtcNow always — NEVER DateTime.Now
9. ALL API responses use ApiResponse<T> wrapper
10. ALL paginated lists use PagedResult<T>

## Success Criteria

- [ ] Constitution document published and version-controlled
- [ ] All team members/agents have read and acknowledged rules
- [ ] Tech stack decisions recorded
- [ ] Architecture rules enforced via project structure
