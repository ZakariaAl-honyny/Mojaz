# Research & Decisions: Firebase Cloud Messaging Integration

## 1. Firebase Admin SDK vs Generic HTTP Client (FCM HTTP v1 API)

**Decision**: Use official Firebase Admin SDK for .NET (`FirebaseAdmin`) in the Infrastructure layer instead of constructing raw HTTP clients.
**Rationale**: The Firebase Admin .NET library handles OAuth2 token cycling and lifecycle management for the FCM HTTP v1 API natively. Building a compliant generic HTTP wrapper would require complex signing mechanisms using the Google IAM credentials which `FirebaseAdmin` does out of the box seamlessly.
**Alternatives Considered**: Creating an `HttpClient` wrapper manually pointing to `https://fcm.googleapis.com/v1/projects/...`. Rejected because handling the dynamic Bearer token rotation securely is prone to bugs and maintenance overhead compared to using the official SDK.

## 2. Notification Dispatch Mechanism (Hangfire Async)

**Decision**: Enqueue `IPushNotificationService.SendToUserAsync` operations via Hangfire.
**Rationale**: Directly aligns with Constitution Principle VII: "Push (Firebase), Email (SendGrid), and SMS (Twilio) notifications MUST be dispatched asynchronously via Hangfire background jobs." Offloading FCM tasks avoids delaying frontend HTTP responses and automatically provides retry resiliency in the event FCM APIs are temporarily down.
**Alternatives Considered**: Using .NET Hosted Services (`BackgroundService`) or ThreadPool. Rejected because Hangfire provides necessary visibility, automatic retries, and durable background storage out of the box, conforming to project patterns.

## 3. Web Push Client & Service Worker Strategy

**Decision**: Utilize Next.js `public/firebase-messaging-sw.js` alongside the `firebase` npm package for frontend integration.
**Rationale**: Next.js automatically serves files placed in the `public/` directory ensuring the service worker correctly registers at the site root level. This fulfills the `ServiceWorkerRegistration` dependency required by Web Push natively.
**Alternatives Considered**: Creating an inline service worker or leveraging next-pwa. Rejected because standard Google-supplied JS setup is simpler, fully supported, and requires zero complex bundler setups for MVP.

## 4. Internationalization Support in Push Playloads

**Decision**: Construct localized push payloads immediately before dispatching in the Application layer, injecting the correct Arabic/English translations based on the queried User's stored `PreferredLanguage` column.
**Rationale**: FCM does not interpret client keys natively across all platforms for arbitrary dynamic messages easily without relying on client-side dict mapping which requires shipping translations to the service worker. Translating server-side ensures the title/body sent exactly matches the desired text and reduces Service Worker complexity.
**Alternatives Considered**: Sending locale keys inside FCM `data` and translating in the `firebase-messaging-sw.js` via a localization dictionary. Rejected due to the high likelihood of out-of-sync translations, and the fact that pure data messages don't always trigger default OS background notifications smoothly without complex Web Push hacks.
