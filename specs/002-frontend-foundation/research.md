# Research: Frontend Foundation

## Technical Decisions

### State Management: Zustand vs Context API vs Redux
**Decision**: Zustand for client-side state.
**Rationale**: Zustand provides a lightweight, hooks-based approach to state management that perfectly suits Next.js applications and scaling up the Auth state without the boilerplate of Redux or the performance pitfalls (unnecessary renders) of React Context.
**Alternatives considered**: Redux (too much boilerplate for this scope), React Context (potential for render thrashing when saving tokens).

### Token Storage Strategy
**Decision**: localStorage for `accessToken` and `refreshToken`.
**Rationale**: Per MVP constraints and user configuration, storing tokens in localStorage simplifies the CSR access needed in `zustand` to hydrate the stores. 
**Alternatives considered**: HttpOnly Cookies for the `refreshToken` (More secure, but necessitates a BFF or dedicated API route setup to proxy queries, skipping for MVP to deliver on speed, can upgrade later).

### Theming Strategy
**Decision**: `next-themes` and Tailwind CSS generic color palette variables mapping.
**Rationale**: By defining HSL custom properties inside `globals.css` that map exactly to the Mojaz color definitions (Primary #006C35, Secondary #D4A017), shadcn/ui components will natively support Dark and Light themes.
**Alternatives considered**: Explicit dark mode classes in Tailwind (more verbose, harder to maintain consistency).

### Internationalization
**Decision**: `next-intl`
**Rationale**: Excellent App Router support for React Server Components (RSC). Allows clean locale-based routing and dictionary injections right from the middleware and root layout.

### API Client
**Decision**: Axios with functional interceptors.
**Rationale**: Enables globally intercepting requests to inject headers (Authorization, Accept-Language) and handle 401 retries cleanly instead of the native `fetch` which requires manual boilerplate wrappers for interceptor logic.
**Alternatives considered**: Native `fetch` (requires more reinventing the wheel for interceptors).
