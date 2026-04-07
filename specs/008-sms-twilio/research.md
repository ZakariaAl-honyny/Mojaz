# Phase 0: Outline & Research

## Decision 1: Twilio Integration Approach
**Decision**: Use official `Twilio` NuGet package for C#.
**Rationale**: The official SDK simplifies authentication, request signing, serialization, and handles the Twilio REST API changes over time efficiently. It provides strong typing for Twilio requests.
**Alternatives considered**: Direct `HttpClient` calls, which would require custom implementation of authentication, request formatting, and handling pagination or response parsing.

## Decision 2: Message Template Storage and Formatting
**Decision**: Define message templates in a dedicated Dictionary or Configuration object in the Infrastructure layer, mapping template identifiers (e.g., `reg-otp`) to their bilingual text formats.
**Rationale**: 
1. The message contents don't change dynamically by user input except for specific variables (like OTP or date). 
2. SMS messages need to be strictly within 160 characters. Having them managed closely in configuration ensures we don't accidentally exceed limits via DB updates without testing.
**Alternatives considered**: Storing templates in the database. While flexible, it adds overhead and risks exceeding the 160 character limit if altered improperly by admins in production without technical review.

## Decision 3: Background Processing Strategy
**Decision**: Use `Hangfire` to enqueue SMS sending operations.
**Rationale**: According to the Mojaz Constitution (Principles VII - Async-First Notifications), SMS notifications must be dispatched asynchronously via Hangfire background jobs to avoid blocking main API requests. Twilio API timeouts (even with 2 retries) shouldn't affect user request latency.
**Alternatives considered**: Dedicated `IHostedService` or synchronous execution. Synchronous execution violates the constitution.
