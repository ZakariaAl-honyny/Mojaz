---
description: Master project rules for Mojaz platform
globs: ["**/*"]
alwaysApply: true
---

# Mojaz Project Rules

You are working on Mojaz (مُجاز), a government driving license platform.

## ALWAYS:
- Read AGENTS.md before any task
- Follow Clean Architecture (Domain → Shared → Application → Infrastructure → API)
- Use ApiResponse<T> wrapper for ALL API responses
- Use PagedResult<T> for paginated lists
- Support Arabic RTL and English LTR
- Support Dark and Light themes
- Use translation keys, NEVER hardcode text
- Use SystemSettings table for configurable values
- Use FeeStructures table for fee amounts
- Use DateTime.UtcNow, NEVER DateTime.Now
- Implement Soft Delete (IsDeleted flag)
- Log sensitive operations in AuditLog
- Hash passwords with BCrypt (cost 12)
- Hash OTPs before storing

## NEVER:
- Add dependencies to Domain layer
- Reference Infrastructure from Application layer
- Put business logic in controllers
- Hardcode business values (ages, fees, limits)
- Use physical CSS properties (ml/mr) — use logical (ms/me)
- Hardcode UI text strings
- Return raw entities from API
- Skip input validation
- Log sensitive data (passwords, tokens, national IDs)
- Use DateTime.Now
- Physically delete records